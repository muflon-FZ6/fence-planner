import { fillSegments, moduleWidth } from "@/domain/geometry";
import { formatLength } from "@/domain/units";
import type { FenceProject, ProjectWarning } from "@/domain/types";

const SHORT_SECTION_IN = 24;
const GATE_NEAR_CORNER_IN = 12;

/**
 * Keep tips plain-language and few in number — this is an illustrative planner.
 */
export function validateProject(project: FenceProject): ProjectWarning[] {
  const warnings: ProjectWarning[] = [];

  if (project.runs.length === 0) {
    warnings.push({
      id: "no_runs",
      severity: "info",
      message: "Draw a fence line or pick a yard starter to begin.",
    });
    return warnings;
  }

  for (const run of project.runs) {
    if (run.length <= 0) {
      warnings.push({
        id: `zero_${run.id}`,
        severity: "error",
        message: "One fence line has no length. Delete it or stretch it out.",
        runId: run.id,
        actions: [{ id: "dismiss", label: "Got it", kind: "dismiss" }],
      });
    }

    for (const gate of project.gates.filter((g) => g.runId === run.id)) {
      if (gate.width > run.length) {
        warnings.push({
          id: `gate_wide_${gate.id}`,
          severity: "error",
          message: "A gate is wider than the fence line it sits on. Make the gate smaller or the line longer.",
          runId: run.id,
          gateId: gate.id,
          actions: [{ id: "dismiss", label: "Got it", kind: "dismiss" }],
        });
      } else if (
        gate.offsetFromRunStart < GATE_NEAR_CORNER_IN ||
        gate.offsetFromRunStart + gate.width > run.length - GATE_NEAR_CORNER_IN
      ) {
        warnings.push({
          id: `gate_corner_${gate.id}`,
          severity: "info",
          message:
            "A gate is right next to a corner. That can work — just leave a little room when you build.",
          runId: run.id,
          gateId: gate.id,
          actions: [{ id: "dismiss", label: "Got it", kind: "dismiss" }],
        });
      }
    }
  }

  if (project.fenceType === "panel") {
    const mod = moduleWidth(project);
    let leftoverCount = 0;
    let shortCount = 0;

    for (const run of project.runs) {
      for (const seg of fillSegments(project, run)) {
        if (seg.length <= 0 || mod <= 0) continue;
        const remainder = seg.length % mod;
        if (remainder <= 0.5) continue;
        leftoverCount += 1;
        if (remainder < SHORT_SECTION_IN) shortCount += 1;
      }
    }

    if (leftoverCount > 0) {
      const panelSize = formatLength(project.settings.panelWidth, project.unitSystem);
      warnings.push({
        id: "panel_leftovers",
        severity: shortCount > 0 ? "warning" : "info",
        message:
          shortCount > 0
            ? `Your yard isn’t an exact multiple of ${panelSize} panels, so a few short leftover pieces will need cutting. That’s common — the shopping list already counts those panels.`
            : `Your fence won’t land on exact full panels (standard size about ${panelSize}). You’ll trim the last panel on some sides. The shopping list already includes that.`,
        actions: [{ id: "dismiss", label: "Got it", kind: "dismiss" }],
      });
    }
  }

  if (project.settings.holeDepth > 0 && project.settings.holeDepth < 24) {
    warnings.push({
      id: "shallow_hole",
      severity: "info",
      message:
        "Post holes look shallow in the settings. Check what your area usually needs before you dig.",
      actions: [{ id: "dismiss", label: "Got it", kind: "dismiss" }],
    });
  }

  if (project.settings.holeDiameter <= 0 || project.settings.holeDepth <= 0) {
    warnings.push({
      id: "invalid_hole",
      severity: "error",
      message: "Post-hole size in settings needs a real number greater than zero.",
      actions: [{ id: "dismiss", label: "Got it", kind: "dismiss" }],
    });
  }

  return warnings;
}
