import type { FenceSettings } from "@/domain/types";

/**
 * Concrete volume for posts:
 * 1. cylindrical hole volume
 * 2. subtract buried post volume (square cross-section × depth)
 * 3. multiply by post count
 * 4. divide by bag yield, round up
 */
export function calculateConcreteBags(
  postCount: number,
  settings: Pick<
    FenceSettings,
    | "holeDiameter"
    | "holeDepth"
    | "postCrossSection"
    | "concreteBagYield"
    | "wastePercent"
    | "applyWasteToConcrete"
  >,
): { bags: number; volumeCuIn: number; perPostCuIn: number } {
  if (
    postCount <= 0 ||
    settings.holeDiameter <= 0 ||
    settings.holeDepth <= 0 ||
    settings.concreteBagYield <= 0
  ) {
    return { bags: 0, volumeCuIn: 0, perPostCuIn: 0 };
  }

  const radius = settings.holeDiameter / 2;
  const holeVolume = Math.PI * radius * radius * settings.holeDepth;
  const postVolume =
    settings.postCrossSection * settings.postCrossSection * settings.holeDepth;
  const perPost = Math.max(0, holeVolume - postVolume);
  let total = perPost * postCount;

  if (settings.applyWasteToConcrete && settings.wastePercent > 0) {
    total *= 1 + settings.wastePercent / 100;
  }

  const bags = Math.ceil(total / settings.concreteBagYield);
  return { bags, volumeCuIn: total, perPostCuIn: perPost };
}
