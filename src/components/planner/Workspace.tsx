"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ClipboardList,
  Copy,
  Pencil,
  Printer,
  Redo2,
  RotateCcw,
  Undo2,
} from "lucide-react";
import { PlanView } from "@/canvas/plan/PlanView";
import { AdSlot } from "@/components/ads/AdSlot";
import { GeometryList } from "@/components/planner/GeometryList";
import { Onboarding } from "@/components/planner/Onboarding";
import { ExampleLoader } from "@/components/planner/ExampleLoader";
import { PrintSheet } from "@/components/planner/PrintSheet";
import { ShoppingListPrint } from "@/components/planner/ShoppingListPrint";
import { ShoppingListSheet } from "@/components/planner/ShoppingListSheet";
import { StyleStudio } from "@/components/planner/StyleBuilder";
import {
  createEmptyProject,
  cryptoRandomId,
  defaultSettings,
} from "@/domain/defaults";
import { rebuildJoints, syncRunLengths } from "@/domain/geometry";
import {
  projectFromYardShape,
  type YardShape,
} from "@/domain/presets";
import { formatMoney } from "@/domain/pricingPrefs";
import { feetToInches } from "@/domain/units";
import type { FenceType } from "@/domain/types";
import { track } from "@/lib/analytics";
import { useProject } from "@/state/projectStore";

/** Work stages only — shopping list and print are Tools actions. */
type Stage = "layout" | "style";

export function Workspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    project,
    materials,
    priceEstimate,
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
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const queryApplied = useRef(false);
  const shapeParam = searchParams.get("shape");

  const showOnboarding =
    hydrated &&
    !onboardingDismissed &&
    project.runs.length === 0 &&
    !shapeParam;

  useEffect(() => {
    if (!hydrated || queryApplied.current) return;
    // Predefined examples use ExampleLoader confirmation — do not auto-replace here
    if (searchParams.get("example")) return;
    queryApplied.current = true;

    if (searchParams.get("blank") === "1") {
      replaceWith(createEmptyProject({ name: "My Fence Plan" }));
      router.replace("/fence-planner", { scroll: false });
      return;
    }

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
  }, [hydrated, shapeParam, searchParams, replaceWith, router]);

  function print() {
    track("print_project");
    window.print();
  }

  function openShoppingList() {
    track("open_shopping_list");
    setShoppingOpen(true);
  }

  const fillSummary = materials.panels
    ? `${materials.panels.totalPanelsToBuy} panels`
    : materials.pickets != null
      ? `${materials.pickets} boards`
      : `${materials.lines.length} items`;

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-foreground/60">
        Restoring your local project…
      </div>
    );
  }

  return (
    <>
      <ExampleLoader />
      <ShoppingListSheet
        open={shoppingOpen}
        onClose={() => setShoppingOpen(false)}
      />
      <div className="no-print mx-auto w-full max-w-[1600px] px-3 py-4 md:px-4">
        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-border bg-surface px-3 py-2 shadow-[var(--shadow-soft)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <label className="block max-w-md">
              <span className="text-xs font-semibold text-foreground/65">
                Project name
              </span>
              <span className="mt-1 flex items-center gap-2 rounded-md border border-border bg-surface-muted/40 px-2.5 py-1.5 shadow-sm transition focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/30">
                <Pencil
                  className="size-3.5 shrink-0 text-foreground/45"
                  aria-hidden
                />
                <input
                  type="text"
                  value={project.name ?? ""}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Untitled fence plan"
                  autoComplete="off"
                  className="min-w-0 flex-1 border-0 bg-transparent font-display text-base text-primary outline-none placeholder:text-foreground/40"
                />
              </span>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!canUndo}
              onClick={undo}
              className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1 text-xs font-semibold transition hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <Undo2 className="size-3.5 shrink-0" aria-hidden />
              Undo
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onClick={redo}
              className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1 text-xs font-semibold transition hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <Redo2 className="size-3.5 shrink-0" aria-hidden />
              Redo
            </button>
            <button
              type="button"
              onClick={duplicate}
              className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1 text-xs font-semibold transition hover:bg-surface-muted"
            >
              <Copy className="size-3.5 shrink-0" aria-hidden />
              Duplicate
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setOnboardingDismissed(false);
              }}
              className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1 text-xs font-semibold transition hover:bg-surface-muted"
            >
              <RotateCcw className="size-3.5 shrink-0" aria-hidden />
              Reset
            </button>
            <button
              type="button"
              onClick={openShoppingList}
              className="inline-flex items-center gap-1.5 rounded border border-primary/40 bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary transition hover:border-primary/60 hover:bg-primary-soft/80"
              title="Open shopping list and materials estimate"
            >
              <ClipboardList className="size-3.5 shrink-0" aria-hidden />
              Shopping list
              <span className="font-normal text-foreground/60">
                {fillSummary} · {materials.posts.total} posts
                {priceEstimate.materialsTypical > 0
                  ? ` · Est. ${formatMoney(priceEstimate.materialsLow, priceEstimate.currency, { compact: true })}–${formatMoney(priceEstimate.materialsHigh, priceEstimate.currency, { compact: true })}`
                  : ` · ${materials.concreteBags} bags`}
              </span>
            </button>
            <button
              type="button"
              onClick={print}
              className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
            >
              <Printer className="size-3.5 shrink-0" aria-hidden />
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
            <div
              className="mb-3 flex flex-wrap gap-1.5"
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
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:rounded-md sm:px-3 sm:text-sm ${
                    stage === id
                      ? "bg-primary text-white hover:bg-primary-hover"
                      : "border border-border bg-surface text-foreground/80 hover:border-primary/40 hover:bg-surface-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {stage === "layout" ? (
              <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="order-2 min-w-0 space-y-4 lg:order-1">
                  <div className="rounded-lg border border-border bg-surface p-3">
                    <GeometryList />
                  </div>
                  <AdSlot slot="sidebar" className="hidden min-h-[120px] lg:block" />
                </aside>
                <section className="order-1 min-w-0 lg:order-2">
                  <PlanView />
                </section>
              </div>
            ) : (
              <div className="min-w-0">
                <StyleStudio />
                <AdSlot slot="sidebar" className="mt-4 min-h-[120px]" />
              </div>
            )}
          </>
        )}
      </div>
      <PrintSheet />
      <ShoppingListPrint />
    </>
  );
}
