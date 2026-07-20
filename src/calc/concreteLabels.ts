/** Shared labeling for concrete volume results (planner + standalone tool). */
export function concreteProjectVolumeLabel(
  applyWaste: boolean,
  wastePercent: number,
): string {
  return applyWaste
    ? `Estimated project volume including contingency (${wastePercent}%)`
    : "Net calculated project volume";
}
