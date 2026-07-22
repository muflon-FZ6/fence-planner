import { calculateMaterials } from "@/calc/engine";
import { fillSegments } from "@/domain/geometry";
import {
  buildReferenceScenario,
  type ReferenceScenarioId,
} from "@/domain/referenceScenarios";
import type { FenceProject, MaterialLine, PostCount } from "@/domain/types";
import { formatLength } from "@/domain/units";

export type ScenarioStudioSummary = {
  id: ReferenceScenarioId;
  project: FenceProject;
  totalFenceLength: number;
  fillLength: number;
  totalFenceLengthLabel: string;
  fillLengthLabel: string;
  posts: PostCount;
  concreteBags: number;
  materialLines: MaterialLine[];
  assumptions: string[];
  panelCutSummary: string | null;
  gateSegmentSummary: string | null;
  highlights: string[];
};

/**
 * Build the planner fixture and derive a display-safe summary from the shared
 * calculation engine. Never hard-code material counts in content registries.
 */
export function buildScenarioStudioSummary(
  id: ReferenceScenarioId,
): ScenarioStudioSummary {
  const project = buildReferenceScenario(id);
  if (!project) {
    throw new Error(`Reference scenario has no planner state: ${id}`);
  }

  const materials = calculateMaterials(project);
  const units = project.unitSystem;

  let panelCutSummary: string | null = null;
  if (materials.panels) {
    const cuts = materials.panels.cutPanels;
    const cutNote =
      cuts.length === 0
        ? "no cut bays"
        : cuts
            .map(
              (c, i) =>
                `cut bay ${i + 1}: pitch remainder ${formatLength(c.pitchRemainder, units)}, clear space ${formatLength(c.clearPanelSpace, units)} (${c.status})`,
            )
            .join("; ");
    panelCutSummary = `${materials.panels.fullPanels} full panels, ${materials.panels.totalPanelsToBuy} panels to buy (${cutNote})`;
  }

  let gateSegmentSummary: string | null = null;
  if (project.gates.length > 0 && project.runs[0]) {
    const segs = fillSegments(project, project.runs[0]).map((s) =>
      formatLength(s.length, units),
    );
    if (segs.length > 0) {
      gateSegmentSummary = `Fill segments on the gated run: ${segs.join(" + ")}`;
    }
  }

  const highlights: string[] = [
    `Total fence length: ${formatLength(materials.totalFenceLength, units)}`,
    `Fill length (excludes gate openings): ${formatLength(materials.fillLength, units)}`,
    `Posts: ${materials.posts.total} total (end ${materials.posts.end}, line ${materials.posts.line}, corner ${materials.posts.corner}, gate ${materials.posts.gate}, terminal ${materials.posts.terminal}, structure ${materials.posts.structure})`,
    `Concrete bags (project rounding): ${materials.concreteBags}`,
  ];
  if (panelCutSummary) highlights.push(panelCutSummary);
  if (materials.fabricRolls != null) {
    highlights.push(
      `Fabric rolls: ${materials.fabricRolls}${
        materials.topRailSections != null
          ? `; top-rail sections: ${materials.topRailSections}`
          : ""
      }`,
    );
  }
  if (gateSegmentSummary) highlights.push(gateSegmentSummary);

  return {
    id,
    project,
    totalFenceLength: materials.totalFenceLength,
    fillLength: materials.fillLength,
    totalFenceLengthLabel: formatLength(materials.totalFenceLength, units),
    fillLengthLabel: formatLength(materials.fillLength, units),
    posts: materials.posts,
    concreteBags: materials.concreteBags,
    materialLines: materials.lines,
    assumptions: materials.assumptions,
    panelCutSummary,
    gateSegmentSummary,
    highlights,
  };
}
