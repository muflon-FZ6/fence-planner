"use client";

import { useMemo, useState } from "react";
import { calculateConcreteBags } from "@/calc/concrete";
import { concreteProjectVolumeLabel } from "@/calc/concreteLabels";
import {
  DEFAULT_BAG_YIELD_CU_IN,
  inchesToMm,
  mmToInches,
} from "@/domain/units";
import type { UnitSystem } from "@/domain/types";

const CU_IN_PER_CU_FT = 1728;
const LITERS_PER_CU_IN = 0.0163871;
const LITERS_PER_CU_FT = CU_IN_PER_CU_FT * LITERS_PER_CU_IN;

function formatVolume(cuIn: number, unitSystem: UnitSystem): string {
  if (unitSystem === "metric") {
    return `${(cuIn * LITERS_PER_CU_IN).toFixed(1)} L`;
  }
  return `${(cuIn / CU_IN_PER_CU_FT).toFixed(2)} cu ft`;
}

/**
 * Standalone concrete calculator using the same pure function as the planner.
 * Length inputs convert to inches internally; metric mode uses mm / liters.
 */
export function ConcreteCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const [postCount, setPostCount] = useState(4);
  // Stored as inches / cu ft regardless of display mode
  const [holeDiameterIn, setHoleDiameterIn] = useState(12);
  const [holeDepthIn, setHoleDepthIn] = useState(36);
  const [postFaceIn, setPostFaceIn] = useState(4);
  const [bagYieldCuFt, setBagYieldCuFt] = useState(0.33);
  const [applyWaste, setApplyWaste] = useState(false);
  const [wastePercent, setWastePercent] = useState(5);

  const lengthLabel = unitSystem === "metric" ? "mm" : "in";
  const yieldLabel = unitSystem === "metric" ? "L per bag" : "cu ft per bag";

  const displayLength = (inches: number) =>
    unitSystem === "metric"
      ? Number(inchesToMm(inches).toFixed(0))
      : inches;

  const fromDisplayLength = (value: number) =>
    unitSystem === "metric" ? mmToInches(value) : value;

  const displayYield = () =>
    unitSystem === "metric"
      ? Number((bagYieldCuFt * LITERS_PER_CU_FT).toFixed(1))
      : bagYieldCuFt;

  const fromDisplayYield = (value: number) =>
    unitSystem === "metric" ? value / LITERS_PER_CU_FT : value;

  const result = useMemo(() => {
    const count = Number.isFinite(postCount) ? Math.floor(postCount) : 0;
    const settings = {
      holeDiameter: Number(holeDiameterIn) || 0,
      holeDepth: Number(holeDepthIn) || 0,
      postCrossSection: Number(postFaceIn) || 0,
      concreteBagYield: (Number(bagYieldCuFt) || 0) * CU_IN_PER_CU_FT,
      wastePercent: Number(wastePercent) || 0,
      applyWasteToConcrete: applyWaste,
    };
    return calculateConcreteBags(Math.max(0, count), settings);
  }, [
    postCount,
    holeDiameterIn,
    holeDepthIn,
    postFaceIn,
    bagYieldCuFt,
    applyWaste,
    wastePercent,
  ]);

  const radius = (Number(holeDiameterIn) || 0) / 2;
  const holeVolume =
    Math.PI * radius * radius * (Number(holeDepthIn) || 0);
  const postVolume =
    (Number(postFaceIn) || 0) *
    (Number(postFaceIn) || 0) *
    (Number(holeDepthIn) || 0);
  const exactBagsBeforeCeil =
    result.volumeCuIn > 0 && bagYieldCuFt > 0
      ? result.volumeCuIn / ((Number(bagYieldCuFt) || 1) * CU_IN_PER_CU_FT)
      : 0;

  const invalid =
    postCount <= 0 ||
    holeDiameterIn <= 0 ||
    holeDepthIn <= 0 ||
    postFaceIn < 0 ||
    bagYieldCuFt <= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          Units
          <select
            className="ml-2 rounded-md border border-border bg-surface px-2 py-1.5"
            value={unitSystem}
            onChange={(e) =>
              setUnitSystem(e.target.value as UnitSystem)
            }
          >
            <option value="imperial">Inches / cu ft</option>
            <option value="metric">Millimetres / liters</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Number of concreted posts"
          value={postCount}
          min={0}
          step={1}
          onChange={setPostCount}
        />
        <Field
          label={`Hole diameter (${lengthLabel})`}
          value={displayLength(holeDiameterIn)}
          min={0}
          step={unitSystem === "metric" ? 1 : 0.5}
          onChange={(v) => setHoleDiameterIn(fromDisplayLength(v))}
        />
        <Field
          label={`Hole depth (${lengthLabel})`}
          value={displayLength(holeDepthIn)}
          min={0}
          step={unitSystem === "metric" ? 1 : 1}
          onChange={(v) => setHoleDepthIn(fromDisplayLength(v))}
        />
        <Field
          label={`Post face used by this plan (${lengthLabel})`}
          value={displayLength(postFaceIn)}
          min={0}
          step={unitSystem === "metric" ? 1 : 0.5}
          onChange={(v) => setPostFaceIn(fromDisplayLength(v))}
          hint="Enter the measured or manufacturer face — not a guaranteed nominal size."
        />
        <Field
          label={`Concrete yield (${yieldLabel})`}
          value={displayYield()}
          min={0}
          step={unitSystem === "metric" ? 0.1 : 0.01}
          onChange={(v) => setBagYieldCuFt(fromDisplayYield(v))}
          hint={
            unitSystem === "metric"
              ? `Planning default is about ${(DEFAULT_BAG_YIELD_CU_IN * LITERS_PER_CU_IN).toFixed(2)} L (${(DEFAULT_BAG_YIELD_CU_IN / CU_IN_PER_CU_FT).toFixed(2)} cu ft) — enter the yield on your product label.`
              : `Planning default is ${(DEFAULT_BAG_YIELD_CU_IN / CU_IN_PER_CU_FT).toFixed(2)} cu ft — enter the yield on your product label.`
          }
        />
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={applyWaste}
              onChange={(e) => setApplyWaste(e.target.checked)}
            />
            Apply contingency / waste %
          </label>
          <Field
            label="Waste %"
            value={wastePercent}
            min={0}
            max={50}
            step={1}
            onChange={setWastePercent}
            disabled={!applyWaste}
          />
        </div>
      </div>

      {invalid ? (
        <p
          className="rounded-md border border-amber-500/40 bg-amber-50 px-3 py-2 text-sm text-foreground/80"
          role="alert"
        >
          Enter positive post count, hole size, and bag yield. Zero or negative
          values produce no bags.
        </p>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-xl text-primary">Results</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row
              label="Cylindrical hole volume (each)"
              value={formatVolume(holeVolume, unitSystem)}
            />
            <Row
              label="Displaced buried-post volume (each)"
              value={formatVolume(postVolume, unitSystem)}
            />
            <Row
              label="Net concrete per post"
              value={formatVolume(result.perPostCuIn, unitSystem)}
            />
            <Row
              label={concreteProjectVolumeLabel(applyWaste, wastePercent)}
              value={formatVolume(result.volumeCuIn, unitSystem)}
            />
            <Row
              label="Exact bags before rounding"
              value={exactBagsBeforeCeil.toFixed(2)}
            />
            <Row
              label="Whole bags to purchase"
              value={String(result.bags)}
              emphasize
            />
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-foreground/60">
            Rounding is one project-level ceiling on total volume ÷ bag yield.
            Hole size, post face, and bag yield are editable assumptions — not
            frost, soil, or code requirements.
          </p>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  hint,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <label className={`block text-sm ${disabled ? "opacity-50" : ""}`}>
      {label}
      <input
        type="number"
        className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint ? (
        <span className="mt-1 block text-[11px] text-foreground/55">{hint}</span>
      ) : null}
    </label>
  );
}

function Row({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 last:border-0">
      <dt className="text-foreground/70">{label}</dt>
      <dd
        className={
          emphasize
            ? "font-semibold text-primary"
            : "font-medium text-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}
