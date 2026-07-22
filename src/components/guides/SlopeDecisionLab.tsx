"use client";

import { useId, useMemo, useState } from "react";
import { computeSlopeDecision } from "@/calc/slopeDecision";
import { formatSmallLength, feetToInches } from "@/domain/units";

export type SlopeDecisionLabProps = {
  defaultHorizontalFeet: number;
  defaultRiseInches: number;
  defaultBayFeet: number;
};

/**
 * Guide-only slope geometry lab. Does not read/write the planner and does not
 * certify that any product can rack the computed grade.
 */
export function SlopeDecisionLab({
  defaultHorizontalFeet,
  defaultRiseInches,
  defaultBayFeet,
}: SlopeDecisionLabProps) {
  const summaryId = useId();
  const [horizontalFeet, setHorizontalFeet] = useState(defaultHorizontalFeet);
  const [riseInches, setRiseInches] = useState(defaultRiseInches);
  const [bayFeet, setBayFeet] = useState(defaultBayFeet);

  const result = useMemo(
    () =>
      computeSlopeDecision({
        horizontalRunIn: feetToInches(horizontalFeet),
        riseIn: riseInches,
        nominalBayIn: feetToInches(bayFeet),
      }),
    [horizontalFeet, riseInches, bayFeet],
  );

  return (
    <div className="not-prose rounded-xl border border-border bg-[#f6f3ec]/40 p-4 shadow-[var(--shadow-soft)]">
      <h3 className="font-display text-lg text-primary">Slope decision lab</h3>
      <p className="mt-1 text-xs text-foreground/60">
        Pure geometry for a constant grade. The flat planner is not slope-aware —
        verify your product’s rack or step limits separately.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          Horizontal run (ft)
          <input
            type="number"
            min={1}
            step={1}
            className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
            value={horizontalFeet}
            onChange={(e) => setHorizontalFeet(Number(e.target.value) || 0)}
          />
        </label>
        <label className="block text-sm">
          Rise (in)
          <input
            type="number"
            min={0}
            step={1}
            className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
            value={riseInches}
            onChange={(e) => setRiseInches(Number(e.target.value) || 0)}
          />
        </label>
        <label className="block text-sm">
          Nominal bay (ft)
          <input
            type="number"
            min={1}
            step={0.5}
            className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
            value={bayFeet}
            onChange={(e) => setBayFeet(Number(e.target.value) || 1)}
          />
        </label>
      </div>

      <div
        id={summaryId}
        className="mt-4 space-y-2 rounded-md border border-border bg-surface px-3 py-3 text-sm"
        aria-live="polite"
      >
        <p>
          <span className="font-semibold">Slope length:</span>{" "}
          {formatSmallLength(result.slopeLengthIn, "imperial")}
        </p>
        <p>
          <span className="font-semibold">Grade:</span>{" "}
          {result.gradePercent.toFixed(1)}%
        </p>
        <p>
          <span className="font-semibold">Angle:</span>{" "}
          {result.angleDeg.toFixed(1)}°
        </p>
        <p>
          <span className="font-semibold">Approx. rise per nominal bay:</span>{" "}
          {formatSmallLength(result.risePerBayIn, "imperial")}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <aside className="rounded-md border border-border bg-surface px-3 py-3 text-sm">
          <p className="font-semibold text-primary">Stepped system</p>
          <p className="mt-1 text-foreground/75">
            Level bays with visible drops between posts. Rise concentrates at the
            steps — useful when panels cannot rack.
          </p>
        </aside>
        <aside className="rounded-md border border-border bg-surface px-3 py-3 text-sm">
          <p className="font-semibold text-primary">Racked system</p>
          <p className="mt-1 text-foreground/75">
            Follows the grade. Compare rise-per-bay to the manufacturer’s published
            rack limit before you buy.
          </p>
        </aside>
      </div>

      <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-50 px-3 py-2 text-xs text-foreground/80">
        Status: <strong>verify product limit</strong> — this lab does not certify
        that any named panel can rack {result.gradePercent.toFixed(1)}% or{" "}
        {formatSmallLength(result.risePerBayIn, "imperial")} per bay.
      </p>

      <aside className="mt-4 rounded-md border border-dashed border-border px-3 py-3 text-xs text-foreground/70">
        <p className="font-semibold text-foreground">FP-RS-04 (not loadable)</p>
        <p className="mt-1">
          Stepped vs racked slope has no planner fixture — FenceProject has no
          slope fields. Use this lab and product instructions; do not expect the
          visual planner to model grade.
        </p>
      </aside>
    </div>
  );
}
