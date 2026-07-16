"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlanView } from "@/canvas/plan/PlanView";
import { AdSlot } from "@/components/ads/AdSlot";
import { BuildPanel } from "@/components/planner/BuildPanel";
import { GeometryList } from "@/components/planner/GeometryList";
import { Onboarding } from "@/components/planner/Onboarding";
import { PrintSheet } from "@/components/planner/PrintSheet";
import { SceneControls } from "@/components/planner/SceneControls";
import { SettingsPanel } from "@/components/planner/SettingsPanel";
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

const DreamView = dynamic(
  () =>
    import("@/canvas/dream/DreamView").then((m) => m.DreamView),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-border bg-sky/30 text-sm text-foreground/60">
        Loading Dream View…
      </div>
    ),
  },
);

type ViewMode = "plan" | "dream" | "split";
type DesktopStep = "space" | "layout" | "style" | "gates" | "finish" | "review";
type MobileStage =
  | "onboarding"
  | "layout"
  | "style"
  | "dream"
  | "materials"
  | "print";

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
  } = useProject();
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [step, setStep] = useState<DesktopStep>("space");
  const [mobileStage, setMobileStage] = useState<MobileStage>("layout");
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
      <div className="no-print mx-auto max-w-[1600px] px-3 py-4 md:px-4">
        {/* Top bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2 shadow-[var(--shadow-soft)]">
          <div>
            <p className="font-display text-lg text-primary">
              {project.name || "Untitled fence plan"}
            </p>
            <p className="text-xs text-foreground/55">
              Saved locally · {materials.posts.total} posts ·{" "}
              {warnings.length} warning{warnings.length === 1 ? "" : "s"}
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
              onClick={reset}
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
              setStep("layout");
              setMobileStage("layout");
              setViewMode("split");
            }}
            onQuick={() => router.push("/fence-calculator")}
          />
        ) : (
          <>
            {/* Mobile stages */}
            <div className="mb-3 flex gap-1 overflow-x-auto md:hidden">
              {(
                [
                  ["layout", "Layout"],
                  ["style", "Style"],
                  ["dream", "Dream"],
                  ["materials", "Materials"],
                  ["print", "Print"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMobileStage(id)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    mobileStage === id
                      ? "bg-primary text-white"
                      : "bg-surface-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
              {/* Left rail */}
              <aside className="no-print hidden space-y-4 lg:block">
                <nav className="rounded-lg border border-border bg-surface p-2">
                  {(
                    [
                      ["space", "Space"],
                      ["layout", "Layout"],
                      ["style", "Fence style"],
                      ["gates", "Gates"],
                      ["finish", "Finish"],
                      ["review", "Review"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setStep(id)}
                      className={`mb-1 block w-full rounded px-2 py-2 text-left text-sm ${
                        step === id
                          ? "bg-primary-soft font-semibold text-primary"
                          : "hover:bg-surface-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
                <div className="rounded-lg border border-border bg-surface p-3">
                  {step === "layout" || step === "gates" ? (
                    <GeometryList />
                  ) : step === "finish" ? (
                    <SceneControls />
                  ) : (
                    <SettingsPanel />
                  )}
                </div>
              </aside>

              {/* Main canvas */}
              <section className="min-w-0 space-y-3">
                <div className="no-print hidden items-center gap-2 md:flex">
                  {(
                    [
                      ["plan", "Plan"],
                      ["dream", "Dream"],
                      ["split", "Split"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setViewMode(id)}
                      className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                        viewMode === id
                          ? "bg-primary text-white"
                          : "bg-surface border border-border"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Desktop views */}
                <div className="hidden md:block">
                  {viewMode === "plan" && <PlanView />}
                  {viewMode === "dream" && <DreamView />}
                  {viewMode === "split" && (
                    <div className="grid gap-3 xl:grid-cols-2">
                      <PlanView />
                      <DreamView />
                    </div>
                  )}
                </div>

                {/* Mobile views */}
                <div className="md:hidden">
                  {(mobileStage === "layout" || mobileStage === "style") && (
                    <>
                      <PlanView />
                      <div className="mt-3 rounded-lg border border-border bg-surface p-3">
                        {mobileStage === "layout" ? (
                          <GeometryList />
                        ) : (
                          <SettingsPanel />
                        )}
                      </div>
                    </>
                  )}
                  {mobileStage === "dream" && <DreamView />}
                  {mobileStage === "materials" && <BuildPanel />}
                  {mobileStage === "print" && (
                    <div className="rounded-lg border border-border bg-surface p-4">
                      <p className="text-sm">
                        Print a clean project sheet with materials and assumptions.
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
              </section>

              {/* Right inspector */}
              <aside className="no-print hidden lg:block">
                <BuildPanel />
                <AdSlot slot="sidebar" className="mt-4 min-h-[120px]" />
              </aside>
            </div>
          </>
        )}
      </div>
      <PrintSheet />
    </>
  );
}
