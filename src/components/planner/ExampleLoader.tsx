"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import {
  REFERENCE_EXAMPLE_NOTICE,
  REFERENCE_SCENARIOS,
  buildReferenceScenario,
  getReferenceScenarioMeta,
  type ReferenceScenarioId,
} from "@/domain/referenceScenarios";
import { useProject } from "@/state/projectStore";

type InertSnapshot = {
  el: HTMLElement;
  inert: boolean;
  ariaHidden: string | null;
};

/**
 * Non-destructive predefined example loader.
 * Visiting ?example=… only shows a confirmation — never overwrites the plan silently.
 */
export function ExampleLoader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { replaceWith, hydrated } = useProject();
  const exampleId = searchParams.get("example");
  const meta = exampleId ? getReferenceScenarioMeta(exampleId) : undefined;
  const open = Boolean(hydrated && exampleId && meta?.hasPlannerState);

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  function clearExampleParam() {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    params.delete("example");
    const qs = params.toString();
    router.replace(qs ? `/fence-planner?${qs}` : "/fence-planner");
  }

  function loadExample() {
    if (!exampleId) return;
    const project = buildReferenceScenario(exampleId);
    if (!project) return;
    replaceWith(project);
    clearExampleParam();
  }

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inerted: InertSnapshot[] = [];
    for (const child of Array.from(document.body.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.dataset.exampleModalRoot === "true") continue;
      inerted.push({
        el: child,
        inert: child.inert,
        ariaHidden: child.getAttribute("aria-hidden"),
      });
      child.inert = true;
      child.setAttribute("aria-hidden", "true");
    }

    const dialog = dialogRef.current;
    const focusables = () =>
      dialog
        ? Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1)
        : [];

    const focusTimer = window.setTimeout(() => {
      focusables()[0]?.focus();
    }, 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        clearExampleParam();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const items = focusables();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = priorOverflow;
      for (const snap of inerted) {
        snap.el.inert = snap.inert;
        if (snap.ariaHidden === null) {
          snap.el.removeAttribute("aria-hidden");
        } else {
          snap.el.setAttribute("aria-hidden", snap.ariaHidden);
        }
      }
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open gate; clear uses refs
  }, [open, router]);

  if (!open || !meta || !exampleId) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      data-example-modal-root="true"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-lg">
        <h2 id={titleId} className="font-display text-xl text-primary">
          Load example: {meta.name}
        </h2>
        <p className="mt-2 text-sm text-foreground/75">{meta.description}</p>
        <p className="mt-3 rounded-md bg-[#f6f3ec] px-3 py-2 text-xs leading-relaxed text-foreground/70">
          {REFERENCE_EXAMPLE_NOTICE}
        </p>
        <p className="mt-3 text-xs text-foreground/60">
          This replaces your current plan in this browser with a fresh copy of the
          predefined example. Your previous plan stays in local history only if you
          saved/duplicated it separately. This is not a shareable custom project
          link.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
            onClick={loadExample}
          >
            Load example
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
            onClick={clearExampleParam}
          >
            Keep my plan
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Guide CTA — link to a predefined example without hard-coding URLs in prose. */
export function GuideExampleCta({
  exampleId,
  label,
}: {
  exampleId: ReferenceScenarioId;
  label?: string;
}) {
  const meta = getReferenceScenarioMeta(exampleId);
  if (!meta?.hasPlannerState) return null;
  return (
    <p className="not-prose mt-4">
      <a
        href={`/fence-planner?example=${exampleId}`}
        className="inline-flex rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        {label ?? `Open example: ${meta.name}`}
      </a>
      <span className="mt-2 block text-xs text-foreground/55">
        You will be asked to confirm before anything replaces your current plan.
      </span>
    </p>
  );
}

export function listSupportedExampleIds(): ReferenceScenarioId[] {
  return REFERENCE_SCENARIOS.filter((s) => s.hasPlannerState).map((s) => s.id);
}
