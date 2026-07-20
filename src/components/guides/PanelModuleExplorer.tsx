"use client";

import { useId, useMemo, useState } from "react";
import { computePanelModuleExplorer } from "@/calc/panelModuleExplorer";
import type { ModuleWidthMode } from "@/domain/types";
import { formatSmallLength } from "@/domain/units";

export type PanelModuleExplorerProps = {
  defaultRunLength: number;
  defaultEnteredWidth: number;
  defaultPostFace: number;
  defaultMode: ModuleWidthMode;
};

/**
 * Guide-only interactive explorer. Does not read or write the planner project.
 */
export function PanelModuleExplorer({
  defaultRunLength,
  defaultEnteredWidth,
  defaultPostFace,
  defaultMode,
}: PanelModuleExplorerProps) {
  const summaryId = useId();
  const svgTitleId = useId();
  const svgDescId = useId();

  const [runLength, setRunLength] = useState(defaultRunLength);
  const [enteredWidth, setEnteredWidth] = useState(defaultEnteredWidth);
  const [postFace, setPostFace] = useState(defaultPostFace);
  const [mode, setMode] = useState<ModuleWidthMode>(defaultMode);
  const [unitDisplay, setUnitDisplay] = useState<"imperial" | "metric">(
    "imperial",
  );

  const result = useMemo(
    () =>
      computePanelModuleExplorer({
        runLengthIn: runLength,
        enteredWidthIn: enteredWidth,
        postFaceIn: postFace,
        mode,
      }),
    [runLength, enteredWidth, postFace, mode],
  );

  const units = unitDisplay;
  const enteredLabel =
    mode === "includes_post"
      ? "Complete repeating pitch"
      : "Physical panel width";
  const impossible =
    result.partialBay?.status === "no_usable_clear_opening";

  const fullBayCount = result.fullPanels;
  const hasPartial = Boolean(result.partialBay);
  const totalBays = fullBayCount + (hasPartial ? 1 : 0);
  const svgWidth = 640;
  const svgHeight = 120;
  const pad = 24;
  const usable = svgWidth - pad * 2;
  const pitch = result.repeatingPitch || 1;
  const scale = usable / Math.max(runLength, pitch);

  return (
    <div className="not-prose rounded-xl border border-border bg-[#f6f3ec]/40 p-4 shadow-[var(--shadow-soft)]">
      <h3 className="font-display text-lg text-primary">
        Panel module explorer
      </h3>
      <p className="mt-1 text-xs text-foreground/60">
        Isolated uninterrupted run only — posts use the panels+1 identity for a
        single straight run. Field cut width remains product-specific.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Units (display)
          <select
            className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
            value={unitDisplay}
            onChange={(e) =>
              setUnitDisplay(e.target.value as "imperial" | "metric")
            }
          >
            <option value="imperial">Inches</option>
            <option value="metric">Millimetres (display)</option>
          </select>
        </label>
        <label className="block text-sm">
          Module mode
          <select
            className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
            value={mode}
            onChange={(e) => setMode(e.target.value as ModuleWidthMode)}
          >
            <option value="panel_only">Panel itself</option>
            <option value="includes_post">Complete repeating pitch</option>
          </select>
        </label>
        <NumberField
          label={`Run length (${units === "metric" ? "mm" : "in"})`}
          value={displayLen(runLength, units)}
          onChange={(v) => setRunLength(fromDisplay(v, units))}
        />
        <NumberField
          label={`${enteredLabel} (${units === "metric" ? "mm" : "in"})`}
          value={displayLen(enteredWidth, units)}
          onChange={(v) => setEnteredWidth(fromDisplay(v, units))}
        />
        <NumberField
          label={`Post face (${units === "metric" ? "mm" : "in"})`}
          value={displayLen(postFace, units)}
          onChange={(v) => setPostFace(fromDisplay(v, units))}
        />
      </div>

      <div
        id={summaryId}
        className="mt-4 rounded-md border border-border bg-surface px-3 py-3 text-sm"
        aria-live="polite"
        role="status"
      >
        {impossible ? (
          <p className="font-medium text-amber-900" role="alert">
            No usable clear opening. Calculated clear space is about{" "}
            {formatSmallLength(
              result.partialBay!.clearPanelSpace,
              units,
            )}{" "}
            after the post faces. Move an endpoint or revise the module — do not
            trim a panel into this opening.
          </p>
        ) : (
          <dl className="grid gap-1 sm:grid-cols-2">
            <Row
              label="Repeating pitch"
              value={formatSmallLength(result.repeatingPitch, units)}
            />
            <Row label="Full panels" value={String(result.fullPanels)} />
            <Row
              label="Final pitch"
              value={
                result.partialBay
                  ? `${formatSmallLength(result.partialBay.pitchRemainder, units)} O.C.`
                  : "None (exact multiple)"
              }
            />
            <Row
              label="Calculated clear space"
              value={
                result.partialBay
                  ? `≈ ${formatSmallLength(result.partialBay.clearPanelSpace, units)}`
                  : "—"
              }
            />
            <Row
              label="Panels to purchase"
              value={String(result.panelsToBuy)}
            />
            <Row
              label="Posts (isolated run)"
              value={String(result.postsIsolatedRun)}
            />
          </dl>
        )}
        {mode === "includes_post" ? (
          <p className="mt-2 text-xs text-foreground/60">
            Entered value is the repeating pitch. Physical panel width is not
            inferred — verify it from the product.
          </p>
        ) : null}
      </div>

      <svg
        className="mt-4 w-full"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        role="img"
        aria-labelledby={`${svgTitleId} ${svgDescId}`}
      >
        <title id={svgTitleId}>Scaled panel bay diagram</title>
        <desc id={svgDescId}>
          {impossible
            ? "Diagram shows an unusable final bay."
            : `${fullBayCount} full bays${hasPartial ? " and one partial bay" : ""} along the run.`}
        </desc>
        <rect
          x={0}
          y={0}
          width={svgWidth}
          height={svgHeight}
          fill="#faf8f4"
          stroke="#c9c2b4"
        />
        {Array.from({ length: totalBays }).map((_, i) => {
          const isPartial = hasPartial && i === totalBays - 1;
          const bayLen = isPartial
            ? result.partialBay!.pitchRemainder
            : pitch;
          const x =
            pad +
            (isPartial
              ? fullBayCount * pitch * scale
              : i * pitch * scale);
          const w = Math.max(2, bayLen * scale);
          return (
            <g key={i}>
              <rect
                x={x}
                y={40}
                width={w}
                height={36}
                fill={
                  impossible && isPartial
                    ? "#fde8e8"
                    : isPartial
                      ? "#e8f0ea"
                      : "#dce8df"
                }
                stroke="#2f5d50"
                strokeWidth={1.5}
                strokeDasharray={isPartial ? "4 3" : undefined}
              />
              <text
                x={x + w / 2}
                y={62}
                textAnchor="middle"
                fontSize={11}
                fill="#1f3d34"
              >
                {isPartial ? "partial" : "full"}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-[11px] text-foreground/55">
        Final pitch is never labeled as a cut width. Clear space is before
        product fitting allowance.
      </p>
    </div>
  );
}

function displayLen(inches: number, units: "imperial" | "metric") {
  return units === "metric" ? Number((inches * 25.4).toFixed(0)) : inches;
}

function fromDisplay(value: number, units: "imperial" | "metric") {
  return units === "metric" ? value / 25.4 : value;
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        type="number"
        className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
        value={Number.isFinite(value) ? value : 0}
        min={0}
        step={1}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-border/50 py-1 last:border-0">
      <dt className="text-foreground/65">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
