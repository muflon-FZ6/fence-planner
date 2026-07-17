"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlanView } from "@/canvas/plan/PlanView";
import { AdSlot } from "@/components/ads/AdSlot";
import { BuildPanel } from "@/components/planner/BuildPanel";
import { GeometryList } from "@/components/planner/GeometryList";
import { Onboarding } from "@/components/planner/Onboarding";
import { PrintSheet } from "@/components/planner/PrintSheet";
import { ShoppingListPrint } from "@/components/planner/ShoppingListPrint";
import { StyleStudio } from "@/components/planner/StyleBuilder";
import { cryptoRandomId, defaultSettings } from "@/domain/defaults";
import { rebuildJoints, syncRunLengths } from "@/domain/geometry";
import {
  projectFromYardShape,
  type YardShape,
} from "@/domain/presets";
import { feetToInches } from "@/domain/units";
import type { FenceType } from "@/domain/types";
import { track } from "@/lib/analytics";
import { useProject } from "@/state/projectStore";

/** Shared stages. Desktop only uses layout + style (materials live in the sidebar). */
type Stage = "layout" | "style" | "materials" | "print";

export function Workspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    project,
    materials,
    warnings,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    duplicate,
    hydrated,
    replaceWith,
    setName,
  } = useProject();
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [stage, setStage] = useState<Stage>("layout");
  const queryApplied = useRef(false);
  const shapeParam = searchParams.get("shape");

  const showOnboarding =
    hydrated &&
    !onboardingDismissed &&
    project.runs.length === 0 &&
    !shapeParam;

  useEffect(() => {
    if (!hydrated || queryApplied.current) return;
    queryApplied.current = true;
    const shape = shapeParam as YardShape | null;
    const type = searchParams.get("type") as FenceType | null;
    if (!shape) return;

    const next = projectFromYardShape(shape, {
      fenceType: type ?? "panel",
      name: "Example fence plan",
    });
    if (type) {
      next.fenceType = type;
      next.settings = defaultSettings(type);
    }
    const lengthParam = searchParams.get("length");
    if (lengthParam && next.runs[0]) {
      const length = Number(lengthParam);
      if (Number.isFinite(length) && length > 0) {
        next.runs = [
          {
            ...next.runs[0],
            start: { x: 0, y: 0 },
            end: { x: length, y: 0 },
            length,
            gateIds: [],
          },
        ];
        next.gates = [];
      }
    }
    if (searchParams.get("gates") === "1" && next.runs[0]) {
      const run = next.runs[0];
      const double = searchParams.get("double") === "1";
      const gate = {
        id: cryptoRandomId(),
        runId: run.id,
        offsetFromRunStart: Math.max(24, run.length * 0.35),
        width: feetToInches(double ? 10 : 4),
        gateType: (double ? "double" : "single") as "single" | "double",
        swingDirection: "out" as const,
      };
      next.gates = [gate];
      run.gateIds = [gate.id];
    }
    next.runs = syncRunLengths(next.runs);
    next.joints = rebuildJoints(next);
    replaceWith(next);
  }, [hydrated, shapeParam, searchParams, replaceWith]);

  function print() {
    track("print_project");
    window.print();
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-foreground/60">
        Restoring your local project…
      </div>
    );
  }

  return (
    <>
      <div className="no-print mx-auto w-full max-w-[1600px] px-3 py-4 md:px-4">
        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-border bg-surface px-3 py-2 shadow-[var(--shadow-soft)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <label className="block">
              <span className="sr-only">Project name</span>
              <input
                type="text"
                value={project.name ?? ""}
                onChange={(e) => setName(e.target.value)}
                placeholder="Untitled fence plan"
                className="w-full max-w-md rounded-md border border-transparent bg-transparent px-1 py-0.5 font-display text-lg text-primary outline-none ring-primary hover:border-border focus:border-border focus:ring-2"
              />
            </label>
            <p className="text-xs text-foreground/55">
              Saved locally · {materials.posts.total} posts ·{" "}
              {warnings.length} tip{warnings.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!canUndo}
              onClick={undo}
              className="rounded border border-border px-2 py-1 text-xs font-semibold disabled:opacity-40"
            >
              Undo
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onClick={redo}
              className="rounded border border-border px-2 py-1 text-xs font-semibold disabled:opacity-40"
            >
              Redo
            </button>
            <button
              type="button"
              onClick={duplicate}
              className="rounded border border-border px-2 py-1 text-xs font-semibold"
            >
              Duplicate
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setOnboardingDismissed(false);
              }}
              className="rounded border border-border px-2 py-1 text-xs font-semibold"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={print}
              className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white"
            >
              Print plan
            </button>
          </div>
        </div>

        {showOnboarding ? (
          <Onboarding
            onDone={() => {
              setOnboardingDismissed(true);
              setStage("layout");
            }}
            onQuick={() => router.push("/fence-calculator")}
          />
        ) : (
          <>
            {/* Phone + tablet: Layout / Style / Materials / Print */}
            <div
              className="mb-3 flex gap-1 overflow-x-auto pb-0.5 lg:hidden"
              role="tablist"
              aria-label="Planner sections"
            >
              {(
                [
                  ["layout", "Layout"],
                  ["style", "Style"],
                  ["materials", "Materials"],
                  ["print", "Print"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={stage === id}
                  onClick={() => setStage(id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    stage === id
                      ? "bg-primary text-white"
                      : "bg-surface-muted text-foreground/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Desktop: Layout / Fence style (shopping list stays in sidebar) */}
            <div
              className="mb-3 hidden gap-2 lg:flex"
              role="tablist"
              aria-label="Planner sections"
            >
              {(
                [
                  ["layout", "Layout"],
                  ["style", "Fence style"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={stage === id}
                  onClick={() => setStage(id)}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                    stage === id
                      ? "bg-primary text-white"
                      : "border border-border bg-surface"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ——— Mobile / tablet stages ——— */}
            <div className="min-w-0 space-y-3 lg:hidden">
              {stage === "layout" && (
                <>
                  <PlanView />
                  <div className="rounded-lg border border-border bg-surface p-3">
                    <GeometryList />
                  </div>
                </>
              )}
              {stage === "style" && <StyleStudio />}
              {stage === "materials" && <BuildPanel />}
              {stage === "print" && (
                <div className="rounded-lg border border-border bg-surface p-4">
                  <h2 className="font-display text-lg text-primary">Print</h2>
                  <p className="mt-1 text-sm text-foreground/70">
                    Print your plan and shopping list, or save as PDF from the
                    browser print dialog.
                  </p>
                  <button
                    type="button"
                    onClick={print}
                    className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    Print / Save PDF
                  </button>
                </div>
              )}
            </div>

            {/* ——— Desktop stages ——— */}
            <div className="hidden lg:block">
              {stage === "style" ? (
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                  <StyleStudio />
                  <aside className="no-print min-w-0">
                    <BuildPanel />
                    <AdSlot slot="sidebar" className="mt-4 min-h-[120px]" />
                  </aside>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
                  <aside className="no-print min-w-0 space-y-4">
                    <div className="rounded-lg border border-border bg-surface p-3">
                      <GeometryList />
                    </div>
                  </aside>

                  <section className="min-w-0">
                    <PlanView />
                  </section>

                  <aside className="no-print min-w-0">
                    <BuildPanel />
                    <AdSlot slot="sidebar" className="mt-4 min-h-[120px]" />
                  </aside>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <PrintSheet />
      <ShoppingListPrint />
    </>
  );
}
