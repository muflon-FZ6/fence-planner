import type { Point, UnitSystem } from "./types";
import { mmToInches } from "./units";

/** Illustrative planning grid: 1 ft imperial, 0.5 m metric. */
export function planGridInches(unitSystem: UnitSystem): number {
  return unitSystem === "imperial" ? 12 : mmToInches(500);
}

export function snapToGrid(value: number, grid: number): number {
  if (grid <= 0) return value;
  return Math.round(value / grid) * grid;
}

export function snapPointToGrid(point: Point, grid: number): Point {
  return {
    x: snapToGrid(point.x, grid),
    y: snapToGrid(point.y, grid),
  };
}

/** Snap length to whole grid steps; minimum one grid unit. */
export function snapLength(length: number, grid: number): number {
  if (grid <= 0) return length;
  return Math.max(grid, Math.round(length / grid) * grid);
}

/**
 * Snap a segment to 15° angles (15, 30, 45, 60, 75, 90, …) and whole-grid length.
 * Keeps the start fixed; adjusts the end.
 */
export function snapSegment(
  start: Point,
  rawEnd: Point,
  grid: number,
): { end: Point; length: number } {
  const dx = rawEnd.x - start.x;
  const dy = rawEnd.y - start.y;
  const dist = Math.hypot(dx, dy);
  if (dist < grid * 0.25) {
    return { end: { ...start }, length: 0 };
  }

  const angle = Math.atan2(dy, dx);
  const step = Math.PI / 12; // 15°
  const snappedAngle = Math.round(angle / step) * step;
  const length = snapLength(dist, grid);

  const end = {
    x: start.x + Math.cos(snappedAngle) * length,
    y: start.y + Math.sin(snappedAngle) * length,
  };

  // Final grid clean-up so corners land on the same lattice
  const gridEnd = snapPointToGrid(end, grid);
  return {
    end: gridEnd,
    length: Math.hypot(gridEnd.x - start.x, gridEnd.y - start.y),
  };
}

/** Pull a point onto a nearby existing endpoint for easy connections. */
export function snapToNearbyPoint(
  point: Point,
  candidates: Point[],
  threshold: number,
): Point {
  let best: Point | null = null;
  let bestDist = threshold;
  for (const c of candidates) {
    const d = Math.hypot(c.x - point.x, c.y - point.y);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best ?? point;
}
