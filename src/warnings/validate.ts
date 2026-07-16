import { fillSegments, moduleWidth } from "@/domain/geometry";
import { formatSmallLength } from "@/domain/units";
import type { FenceProject, ProjectWarning } from "@/domain/types";

const SHORT_SECTION_IN = 24;
const GATE_NEAR_CORNER_IN = 12;

export function validateProject(project: FenceProject): ProjectWarning[] {
  const warnings: ProjectWarning[] = [];
  const units = project.unitSystem;

  if (project.runs.length === 0) {
    warnings.push({
      id: "no_runs",
      severity: "info",
      message: "Add a fence run or choose a yard shape to begin.",
    });
    return warnings;
  }

  for (const run of project.runs) {
    if (run.length <= 0) {
      warnings.push({
        id: `zero_${run.id}`,
        severity: "error",
        message: "A fence run has zero or negative length.",
        runId: run.id,
      });
    }

    if (project.fenceType === "panel") {
      const mod = moduleWidth(project);
      for (const seg of fillSegments(project, run)) {
        if (seg.length <= 0 || mod <= 0) continue;
        const remainder = seg.length % mod;
        if (remainder > 0.5 && remainder < SHORT_SECTION_IN) {
          warnings.push({
            id: `short_${run.id}_${Math.round(seg.startOffset)}`,
            severity: "warning",
            message: `Final section is only ${formatSmallLength(remainder, units)} — very short cut panel.`,
            runId: run.id,
            actions: [
              { id: "accept", label: "Allow cut panel", kind: "accept_cut" },
              {
                id: "width",
                label: "Adjust panel width",
                kind: "change_panel_width",
              },
              { id: "dismiss", label: "Dismiss", kind: "dismiss" },
            ],
          });
        } else if (remainder > 0.5) {
          warnings.push({
            id: `uneven_${run.id}_${Math.round(seg.startOffset)}`,
            severity: "info",
            message: `Uneven final section of ${formatSmallLength(remainder, units)} — one cut panel required.`,
            runId: run.id,
            actions: [
              { id: "accept", label: "Allow cut panel", kind: "accept_cut" },
              { id: "dismiss", label: "Dismiss", kind: "dismiss" },
            ],
          });
        }
      }
    }

    for (const gate of project.gates.filter((g) => g.runId === run.id)) {
      if (gate.width > run.length) {
        warnings.push({
          id: `gate_wide_${gate.id}`,
          severity: "error",
          message: "Gate is wider than the fence run.",
          runId: run.id,
          gateId: gate.id,
          actions: [{ id: "move", label: "Adjust gate", kind: "move_gate" }],
        });
      }
      if (
        gate.offsetFromRunStart < GATE_NEAR_CORNER_IN ||
        gate.offsetFromRunStart + gate.width > run.length - GATE_NEAR_CORNER_IN
      ) {
        warnings.push({
          id: `gate_corner_${gate.id}`,
          severity: "warning",
          message: "Gate is very close to a corner or end — check post clearance.",
          runId: run.id,
          gateId: gate.id,
          actions: [
            { id: "move", label: "Move gate", kind: "move_gate" },
            { id: "dismiss", label: "Dismiss", kind: "dismiss" },
          ],
        });
      }
    }
  }

  if (project.settings.holeDepth < 24) {
    warnings.push({
      id: "shallow_hole",
      severity: "warning",
      message:
        "Post-hole depth is under 24 in — verify local frost depth and soil conditions.",
    });
  }

  if (project.settings.holeDiameter <= 0 || project.settings.holeDepth <= 0) {
    warnings.push({
      id: "invalid_hole",
      severity: "error",
      message: "Post-hole diameter and depth must be greater than zero.",
    });
  }

  const spacing =
    project.fenceType === "panel"
      ? moduleWidth(project)
      : project.settings.postSpacing;
  if (spacing > 120) {
    warnings.push({
      id: "wide_spacing",
      severity: "warning",
      message: "Post spacing is unusually wide — confirm your fence system supports it.",
    });
  }

  if (project.settings.wastePercent > 20) {
    warnings.push({
      id: "high_waste",
      severity: "info",
      message: "Waste allowance is high — layout may be driving extra material.",
    });
  }

  return warnings;
}
