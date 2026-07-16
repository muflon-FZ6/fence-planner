import { totalFillLength, totalRunLength } from "@/domain/geometry";
import type { FenceProject } from "@/domain/types";

export type ChainLinkResult = {
  fabricLength: number;
  fabricRolls: number;
  topRailSections: number;
  ties: number;
  tensionBars: number;
  braceBands: number;
};

export function calculateChainLink(project: FenceProject): ChainLinkResult {
  const fill = totalFillLength(project);
  const runLen = totalRunLength(project);
  const { fabricRollLength, topRailSectionLength, tiesPerFoot, tensionWire } =
    project.settings;

  const fabricLength = fill;
  const fabricRolls =
    fabricRollLength > 0 ? Math.ceil(fabricLength / fabricRollLength) : 0;
  const topRailSections =
    topRailSectionLength > 0 ? Math.ceil(runLen / topRailSectionLength) : 0;

  const ties = Math.ceil((fill / 12) * tiesPerFoot);

  // One tension bar per terminal end roughly; brace bands ~2 per terminal
  const terminals = project.runs.length * 2; // refined by post classifier in engine
  const tensionBars = Math.max(2, terminals);
  const braceBands = tensionBars * 2 + (tensionWire ? project.runs.length : 0);

  return {
    fabricLength,
    fabricRolls,
    topRailSections,
    ties,
    tensionBars,
    braceBands,
  };
}
