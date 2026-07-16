import { fillSegments, moduleWidth } from "@/domain/geometry";
import type { FenceProject, PanelBreakdown } from "@/domain/types";

export function calculatePanels(project: FenceProject): PanelBreakdown {
  const bayWidth = moduleWidth(project);
  let fullPanels = 0;
  const cutPanels: PanelBreakdown["cutPanels"] = [];

  for (const run of project.runs) {
    for (const seg of fillSegments(project, run)) {
      if (seg.length <= 0 || bayWidth <= 0) continue;
      const full = Math.floor(seg.length / bayWidth);
      const remainder = seg.length - full * bayWidth;
      fullPanels += full;
      if (remainder > 0.5) {
        // Partial section needs a cut panel (purchase one panel)
        cutPanels.push({ length: remainder, runId: run.id });
      }
    }
  }

  let totalPanelsToBuy = fullPanels + cutPanels.length;
  if (project.settings.applyWasteToPanels && project.settings.wastePercent > 0) {
    totalPanelsToBuy = Math.ceil(
      totalPanelsToBuy * (1 + project.settings.wastePercent / 100),
    );
  }

  return { fullPanels, cutPanels, totalPanelsToBuy };
}
