import { calculatePanels } from "@/calc/panel";
import { formatLength, formatSmallLength } from "@/domain/units";
import type { FenceProject, ProjectWarning } from "@/domain/types";

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
          message:
            "A gate is wider than the fence line it sits on. Make the gate smaller or the line longer.",
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
    const panels = calculatePanels(project);
    const impossible = panels.cutPanels.filter(
      (c) => c.status === "no_usable_clear_opening",
    );
    const short = panels.cutPanels.filter((c) => c.status === "short");
    const leftover = panels.cutPanels.filter((c) => c.status === "valid");

    if (impossible.length > 0) {
      warnings.push({
        id: "panel_no_usable_opening",
        severity: "warning",
        message:
          "A partial bay has little or no clear panel space after the post faces. Move an endpoint or gate, or revise the panel module — do not trim a panel into that opening.",
        actions: [{ id: "dismiss", label: "Got it", kind: "dismiss" }],
      });
    } else if (short.length > 0) {
      const clearHint = formatSmallLength(
        short[0].clearPanelSpace,
        project.unitSystem,
      );
      warnings.push({
        id: "panel_leftovers",
        severity: "warning",
        message: `A final bay leaves only about ${clearHint} of clear panel space (below the 24 in planning threshold). Confirm product fit or move a boundary. The shopping list still counts a whole stock panel for that bay.`,
        actions: [{ id: "dismiss", label: "Got it", kind: "dismiss" }],
      });
    } else if (leftover.length > 0) {
      const panelSize = formatLength(
        project.settings.panelWidth,
        project.unitSystem,
      );
      warnings.push({
        id: "panel_leftovers",
        severity: "info",
        message:
          project.settings.moduleWidthMode === "includes_post"
            ? `Your fence won’t land on exact full pitches (repeating pitch about ${panelSize}). You’ll verify clear space and fit on the last bay of some sides. The shopping list already includes that stock panel.`
            : `Your fence won’t land on exact full panels (standard size about ${panelSize}). You’ll verify clear space and fit on the last bay of some sides. The shopping list already includes that panel.`,
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
