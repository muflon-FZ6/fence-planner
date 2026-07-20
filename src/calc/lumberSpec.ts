import { inchesToFeet } from "@/domain/units";
import type { FenceSettings, UnitSystem } from "@/domain/types";
import { formatLength, formatSmallLength } from "@/domain/units";

/** Round up to a common retail post length (ft). */
export function stockLengthFeet(inches: number): number {
  const ft = inchesToFeet(inches);
  const common = [6, 8, 10, 12, 14, 16];
  for (const c of common) {
    if (ft <= c + 0.05) return c;
  }
  return Math.ceil(ft);
}

/** Nominal square post face from stored post width (inches). */
export function postNominal(postWidthIn: number): "4x4" | "6x6" {
  return postWidthIn >= 5 ? "6x6" : "4x4";
}

/**
 * Suggested post stock length: finished fence height + hole depth (embedment),
 * rounded up to a common retail length.
 */
export function postStockFeet(settings: FenceSettings): number {
  return stockLengthFeet(settings.fenceHeight + settings.holeDepth);
}

/** Nominal board face from picket width (actual inches). */
export function boardNominal(picketWidthIn: number): string {
  if (picketWidthIn <= 4) return "1x4";
  if (picketWidthIn <= 6.25) return "1x6";
  if (picketWidthIn <= 8) return "1x8";
  return `${picketWidthIn}" wide`;
}

/** Board / picket stock length from solid infill height. */
export function boardStockFeet(settings: FenceSettings): number {
  let solid = settings.fenceHeight;
  if (settings.latticeTop !== "none") {
    solid = Math.max(24, settings.fenceHeight - (settings.latticeHeight || 18));
  }
  if (settings.hasKickboard) {
    solid = Math.max(24, solid - 6); // ~2x6 kickboard reveal
  }
  return stockLengthFeet(solid);
}

export function boardFaceLabel(
  picketWidthIn: number,
  unitSystem: UnitSystem,
): string {
  const nominal = boardNominal(picketWidthIn);
  const actual = formatSmallLength(picketWidthIn, unitSystem, 1);
  return `${nominal} (about ${actual} face)`;
}

export function postSpecLabel(settings: FenceSettings): string {
  const face = postNominal(settings.postWidth);
  const len = postStockFeet(settings);
  return `${face} x ${len} ft ground-contact`;
}

export function railSpecLabel(): string {
  return "2x4 x 8 ft";
}

export function capRailSpecLabel(): string {
  return "2x6 x 8 ft";
}

export function trimSpecLabel(): string {
  return "1x4 x 8 ft";
}

export function kickboardSpecLabel(): string {
  return "2x6 x 8 ft ground-contact";
}

export function battenSpecLabel(boardLenFt: number): string {
  return `1x2 or 1x3 x ${boardLenFt} ft`;
}

export function latticeSpecLabel(
  settings: FenceSettings,
  unitSystem: UnitSystem,
): string {
  const kind =
    settings.latticeTop === "privacy"
      ? "privacy"
      : settings.latticeTop === "dense"
        ? "dense"
        : "open";
  const h = formatSmallLength(settings.latticeHeight || 18, unitSystem, 0);
  return `4x8 ${kind} lattice sheet, cut to ${h} strips`;
}

export function panelSpecLabel(
  settings: FenceSettings,
  unitSystem: UnitSystem,
): string {
  if (settings.moduleWidthMode === "includes_post") {
    const pitch = formatSmallLength(settings.panelWidth, unitSystem);
    return `Panel system for a ${pitch} repeating pitch — verify actual panel width from the product.`;
  }
  const h = formatLength(settings.fenceHeight, unitSystem);
  const w = formatLength(settings.panelWidth, unitSystem);
  return `${h} H × ${w} W wood fence panel`;
}

export function boardTopLabel(top: FenceSettings["boardTop"]): string {
  if (top === "dog_ear") return "dog-ear tops";
  if (top === "pointed") return "pointed / stockade tops";
  return "flat tops";
}
