"use client";

import { useId, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  READINESS_QUESTIONS,
  READINESS_STORAGE_KEY,
  evaluateReadinessAudit,
  type ReadinessAnswer,
  type ReadinessAnswers,
  type ReadinessNotes,
  type ReadinessQuestionId,
  type ReadinessStatus,
} from "@/domain/buildReadiness";
import { track } from "@/lib/analytics";

const STATUS_LABEL: Record<ReadinessStatus, string> = {
  ready: "Ready",
  verify: "Verify",
  stop: "Stop before digging/buying",
};

const STATUS_CLASS: Record<ReadinessStatus, string> = {
  ready: "border-accent-teal/40 bg-[#eef7f3] text-primary",
  verify: "border-amber-500/40 bg-amber-50 text-amber-950",
  stop: "border-red-500/40 bg-red-50 text-red-950",
};

type StoredReadiness = {
  answers: ReadinessAnswers;
  notes: ReadinessNotes;
};

const EMPTY: StoredReadiness = { answers: {}, notes: {} };

let memoryStore: StoredReadiness = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function readFromLocalStorage(): StoredReadiness {
  try {
    const raw = localStorage.getItem(READINESS_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as {
      answers?: ReadinessAnswers;
      notes?: ReadinessNotes;
    };
    return {
      answers: parsed.answers ?? {},
      notes: parsed.notes ?? {},
    };
  } catch {
    return EMPTY;
  }
}

function writeStore(next: StoredReadiness) {
  memoryStore = next;
  try {
    localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / private mode
  }
  emit();
}

function subscribe(onStoreChange: () => void) {
  if (typeof window !== "undefined") {
    const fromDisk = readFromLocalStorage();
    if (
      JSON.stringify(fromDisk) !== JSON.stringify(memoryStore)
    ) {
      memoryStore = fromDisk;
    }
  }
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot(): StoredReadiness {
  return memoryStore;
}

function getServerSnapshot(): StoredReadiness {
  return EMPTY;
}

function patchStore(patch: Partial<StoredReadiness>) {
  const current = memoryStore;
  writeStore({
    answers: patch.answers ?? current.answers,
    notes: patch.notes ?? current.notes,
  });
}

export function BuildReadinessAudit() {
  const formId = useId();
  const stored = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const { answers, notes } = stored;
  const result = evaluateReadinessAudit(answers, notes);

  function setAnswer(id: ReadinessQuestionId, value: ReadinessAnswer) {
    patchStore({
      answers: { ...getSnapshot().answers, [id]: value },
    });
  }

  function setNote(id: ReadinessQuestionId, value: string) {
    patchStore({
      notes: { ...getSnapshot().notes, [id]: value },
    });
  }

  function printFieldKit() {
    track("print_project");
    document.body.classList.add("print-build-readiness");
    const cleanup = () => {
      document.body.classList.remove("print-build-readiness");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  return (
    <div className="build-readiness-audit">
      <div className="no-print mb-6 rounded-lg border border-border bg-[#f6f3ec] px-4 py-3 text-sm text-foreground/75">
        Answers stay in this browser only (local storage). Nothing is uploaded.
        Clear site data to erase them.
      </div>

      <div className="space-y-6">
        {READINESS_QUESTIONS.map((q, index) => {
          const name = `${formId}-${q.id}`;
          const item = result.items.find((i) => i.id === q.id)!;
          return (
            <fieldset
              key={q.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <legend className="px-1 font-semibold text-foreground">
                {index + 1}. {q.prompt}
              </legend>
              <p className="mt-2 text-sm text-foreground/65">{q.help}</p>
              <div
                className="mt-3 flex flex-wrap gap-3"
                role="radiogroup"
                aria-label={q.prompt}
              >
                {(
                  [
                    ["yes", "Yes"],
                    ["no", "No"],
                    ["unsure", "Unsure"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
                  >
                    <input
                      type="radio"
                      name={name}
                      value={value}
                      checked={answers[q.id] === value}
                      onChange={() => setAnswer(q.id, value)}
                      className="accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <label className="mt-3 block text-sm">
                <span className="font-medium text-foreground/80">
                  Note / source link / date
                </span>
                <textarea
                  value={notes[q.id] ?? ""}
                  onChange={(e) => setNote(q.id, e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="Optional — e.g. survey PDF name, ordinance URL + date checked"
                />
              </label>
              <p
                className={`mt-3 rounded-md border px-3 py-2 text-xs font-semibold ${STATUS_CLASS[item.status]}`}
                aria-live="polite"
              >
                {STATUS_LABEL[item.status]} — {item.nextAction}
              </p>
            </fieldset>
          );
        })}
      </div>

      <section
        className="mt-8 rounded-xl border border-border bg-surface p-5"
        aria-labelledby="readiness-summary-heading"
      >
        <h2
          id="readiness-summary-heading"
          className="font-display text-2xl text-primary"
        >
          Field kit summary
        </h2>
        <p
          className={`mt-3 inline-block rounded-md border px-3 py-2 text-sm font-semibold ${STATUS_CLASS[result.overall]}`}
          aria-live="polite"
        >
          Overall: {STATUS_LABEL[result.overall]}
        </p>
        <p className="mt-2 text-xs text-foreground/55">
          Generated {new Date(result.generatedAt).toLocaleString()}
        </p>

        <div className="print-build-readiness-only mt-6 space-y-4">
          {result.items.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid border-b border-border pb-3"
            >
              <p className="font-semibold">{item.prompt}</p>
              <p className="mt-1 text-sm">
                Answer: {item.answer ?? "—"} · {STATUS_LABEL[item.status]}
              </p>
              {item.note ? (
                <p className="mt-1 text-sm text-foreground/75">Note: {item.note}</p>
              ) : null}
              <p className="mt-1 text-sm">{item.nextAction}</p>
            </div>
          ))}
        </div>

        <ul className="mt-4 space-y-3 text-sm no-print">
          {result.items.map((item) => (
            <li key={item.id}>
              <span className="font-semibold">{STATUS_LABEL[item.status]}:</span>{" "}
              {item.nextAction}
              {item.relatedGuides[0] ? (
                <>
                  {" "}
                  <Link
                    href={`/guides/${item.relatedGuides[0]}`}
                    className="font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    Related guide
                  </Link>
                </>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2 no-print">
          <button
            type="button"
            onClick={printFieldKit}
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Print field kit
          </button>
          <Link
            href="/examples"
            className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:bg-surface-muted"
          >
            Browse scenarios
          </Link>
        </div>
      </section>
    </div>
  );
}
