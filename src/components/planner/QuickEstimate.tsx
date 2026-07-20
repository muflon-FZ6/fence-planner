"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateQuickEstimate } from "@/calc/engine";
import { estimateProjectMaterialsCost } from "@/calc/pricing";
import { createEmptyProject, defaultSettings } from "@/domain/defaults";
import {
  defaultPricingCountry,
  formatMoney,
} from "@/domain/pricingPrefs";
import { quickEstimateToProject } from "@/domain/presets";
import { feetToInches, formatLength, toInches } from "@/domain/units";
import type { FenceType, PricingCountry, UnitSystem } from "@/domain/types";
import { track } from "@/lib/analytics";
import { AdSlot } from "@/components/ads/AdSlot";
import { saveCurrentProject } from "@/persistence/local";

export function QuickEstimate({
  onOpenPlanner,
}: {
  onOpenPlanner?: (projectId: string) => void;
}) {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const [pricingCountry, setPricingCountry] = useState<PricingCountry>("US");
  const [fenceType, setFenceType] = useState<FenceType>("panel");
  const [length, setLength] = useState(80);
  const [corners, setCorners] = useState(0);
  const [endpoints, setEndpoints] = useState(2);
  const [gates, setGates] = useState(1);
  const [gateWidth, setGateWidth] = useState(4);
  const [panelWidth, setPanelWidth] = useState(8);
  const [postSpacing, setPostSpacing] = useState(8);
  const [waste, setWaste] = useState(5);

  const project = useMemo(() => {
    const p = createEmptyProject({ fenceType, unitSystem });
    p.settings = {
      ...defaultSettings(fenceType),
      panelWidth: toInches(panelWidth, unitSystem),
      postSpacing: toInches(postSpacing, unitSystem),
      wastePercent: waste,
    };
    return p;
  }, [fenceType, unitSystem, panelWidth, postSpacing, waste]);

  const result = useMemo(() => {
    const totalLength = toInches(length, unitSystem);
    const gWidth = toInches(gateWidth, unitSystem);
    return calculateQuickEstimate({
      project,
      totalLength,
      corners,
      endpoints,
      gates: Array.from({ length: gates }, () => ({
        width: gWidth,
        gateType: "single" as const,
      })),
    });
  }, [project, length, unitSystem, corners, endpoints, gates, gateWidth]);

  const priceEstimate = useMemo(
    () =>
      estimateProjectMaterialsCost({
        lines: result.lines,
        country: pricingCountry,
      }),
    [result.lines, pricingCountry],
  );

  function onUnitSystem(next: UnitSystem) {
    setUnitSystem(next);
    setPricingCountry(defaultPricingCountry(next));
  }

  function openInPlanner() {
    track("choose_visual_mode", { from: "quick" });
    const visual = quickEstimateToProject({
      totalLengthInches: toInches(length, unitSystem),
      corners,
      fenceType,
      unitSystem,
      name: "Quick Estimate Plan",
    });
    visual.settings = project.settings;
    visual.pricingCountry = pricingCountry;
    // Place gates on first run
    if (gates > 0 && visual.runs[0]) {
      const run = visual.runs[0];
      const gWidth = toInches(gateWidth, unitSystem);
      visual.gates = Array.from({ length: gates }, (_, i) => ({
        id: crypto.randomUUID(),
        runId: run.id,
        offsetFromRunStart: Math.min(
          feetToInches(10) + i * (gWidth + feetToInches(8)),
          Math.max(0, run.length - gWidth),
        ),
        width: gWidth,
        gateType: "single" as const,
        swingDirection: "out" as const,
      }));
      run.gateIds = visual.gates.map((g) => g.id);
    }
    saveCurrentProject(visual);
    onOpenPlanner?.(visual.id);
  }

  function startBlankPlan() {
    track("choose_visual_mode", { from: "quick_blank" });
    saveCurrentProject(
      createEmptyProject({
        name: "My Fence Plan",
        fenceType,
        unitSystem,
        settings: project.settings,
      }),
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-primary md:text-4xl">
          Fence material calculator
        </h1>
        <p className="mt-2 text-foreground/70">
          Fast estimate from length, corners, and gates. Every assumption is
          editable — open the visual planner anytime to refine.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <form
          className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-[var(--shadow-soft)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              Units
              <select
                className="mt-1 w-full rounded-md border border-border px-2 py-2"
                value={unitSystem}
                onChange={(e) =>
                  onUnitSystem(e.target.value as UnitSystem)
                }
              >
                <option value="imperial">Imperial</option>
                <option value="metric">Metric</option>
              </select>
            </label>
            <label className="text-sm">
              Fence type
              <select
                className="mt-1 w-full rounded-md border border-border px-2 py-2"
                value={fenceType}
                onChange={(e) => setFenceType(e.target.value as FenceType)}
              >
                <option value="panel">Panel</option>
                <option value="wood_privacy">Wood privacy</option>
                <option value="chain_link">Chain link</option>
              </select>
            </label>
          </div>
          <label className="block text-sm">
            Total fence length ({unitSystem === "imperial" ? "ft" : "m"})
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-md border border-border px-2 py-2"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm">
              Corners
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-md border border-border px-2 py-2"
                value={corners}
                onChange={(e) => setCorners(Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              Endpoints
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-md border border-border px-2 py-2"
                value={endpoints}
                onChange={(e) => setEndpoints(Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              Gates
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-md border border-border px-2 py-2"
                value={gates}
                onChange={(e) => setGates(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="block text-sm">
            Gate width ({unitSystem === "imperial" ? "ft" : "m"})
            <input
              type="number"
              min={0.5}
              step={0.5}
              className="mt-1 w-full rounded-md border border-border px-2 py-2"
              value={gateWidth}
              onChange={(e) => setGateWidth(Number(e.target.value))}
            />
          </label>
          {fenceType === "panel" ? (
            <label className="block text-sm">
              Panel width ({unitSystem === "imperial" ? "ft" : "m"})
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-md border border-border px-2 py-2"
                value={panelWidth}
                onChange={(e) => setPanelWidth(Number(e.target.value))}
              />
            </label>
          ) : (
            <label className="block text-sm">
              Post spacing ({unitSystem === "imperial" ? "ft" : "m"})
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-md border border-border px-2 py-2"
                value={postSpacing}
                onChange={(e) => setPostSpacing(Number(e.target.value))}
              />
            </label>
          )}
          <label className="block text-sm">
            Waste %
            <input
              type="number"
              min={0}
              max={30}
              className="mt-1 w-full rounded-md border border-border px-2 py-2"
              value={waste}
              onChange={(e) => setWaste(Number(e.target.value))}
            />
          </label>
        </form>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-4 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-xl text-primary">Results</h2>
            <p className="text-sm text-foreground/60">
              Updates instantly as you change inputs
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {result.lines.slice(0, 12).map((line) => (
                <li
                  key={line.id}
                  className="flex justify-between gap-3 border-b border-border/60 py-1.5"
                >
                  <span>
                    <span className="block">{line.label}</span>
                    {line.spec && (
                      <span className="block text-xs text-foreground/55">
                        {line.spec}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {line.quantity} {line.unit}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-foreground/55">
              Fill length{" "}
              {formatLength(result.fillLength, unitSystem)} after gates
            </p>

            <div className="mt-4 rounded-md border border-primary/25 bg-primary-soft/50 px-3 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Estimated materials
                </p>
                <div
                  className="inline-flex rounded-md border border-border bg-surface p-0.5"
                  role="group"
                  aria-label="Estimate country"
                >
                  {(
                    [
                      ["US", "US"],
                      ["CA", "Canada"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={pricingCountry === id}
                      onClick={() => setPricingCountry(id)}
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
                        pricingCountry === id
                          ? "bg-primary text-white"
                          : "text-foreground/70 hover:bg-surface-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-1 font-display text-xl leading-snug text-primary">
                {formatMoney(priceEstimate.materialsLow, priceEstimate.currency, {
                  compact: true,
                })}
                {" – "}
                {formatMoney(
                  priceEstimate.materialsHigh,
                  priceEstimate.currency,
                  { compact: true },
                )}
              </p>
              <p className="mt-0.5 text-xs text-foreground/65">
                Typical{" "}
                {formatMoney(
                  priceEstimate.materialsTypical,
                  priceEstimate.currency,
                  { compact: true },
                )}{" "}
                · {priceEstimate.currency} · as of {priceEstimate.asOf}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-foreground/55">
                {priceEstimate.disclaimer}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openInPlanner}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Open in Visual Planner
              </button>
              <Link
                href="/fence-planner?blank=1"
                onClick={startBlankPlan}
                className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
              >
                Start blank plan
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface-muted/50 p-3 text-xs">
            <p className="font-semibold">Assumptions</p>
            <ul className="mt-1 list-disc pl-4 text-foreground/70">
              {result.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <AdSlot slot="below-results" />
        </div>
      </div>
    </div>
  );
}
