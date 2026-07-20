import { fillSegments, moduleWidth } from "@/domain/geometry";
import type {
  FenceProject,
  PanelBreakdown,
  PanelCut,
  PanelCutStatus,
} from "@/domain/types";

/** Numeric pitch-remainder epsilon — below this, no partial bay is purchased. */
export const CUT_REMAINDER_EPSILON_IN = 0.5;

/**
 * Clear-space constructability epsilon. At or below this, the opening is not
 * a usable panel bay (do not instruct a trim).
 */
export const CLEAR_SPACE_USABLE_EPSILON_IN = 0.5;

/** Planning threshold: clear openings below this are “short.” */
export const SHORT_CLEAR_OPENING_IN = 24;

/**
 * Clear panel space between two equal square post faces for a given pitch.
 * pitchRemainder is center-to-center; subtract one full post face (half + half).
 */
export function clearPanelSpaceFromPitch(
  pitchRemainder: number,
  postWidth: number,
): number {
  return Math.max(0, pitchRemainder - postWidth);
}

export function classifyPartialBayStatus(
  clearPanelSpace: number,
): PanelCutStatus {
  if (clearPanelSpace <= CLEAR_SPACE_USABLE_EPSILON_IN) {
    return "no_usable_clear_opening";
  }
  if (clearPanelSpace < SHORT_CLEAR_OPENING_IN) {
    return "short";
  }
  return "valid";
}

export function calculatePanels(project: FenceProject): PanelBreakdown {
  const bayWidth = moduleWidth(project);
  const postWidth = project.settings.postWidth;
  let fullPanels = 0;
  const cutPanels: PanelCut[] = [];

  for (const run of project.runs) {
    for (const seg of fillSegments(project, run)) {
      if (seg.length <= 0 || bayWidth <= 0) continue;
      const full = Math.floor(seg.length / bayWidth);
      const pitchRemainder = seg.length - full * bayWidth;
      fullPanels += full;
      if (pitchRemainder > CUT_REMAINDER_EPSILON_IN) {
        const clearPanelSpace = clearPanelSpaceFromPitch(
          pitchRemainder,
          postWidth,
        );
        cutPanels.push({
          pitchRemainder,
          clearPanelSpace,
          status: classifyPartialBayStatus(clearPanelSpace),
          runId: run.id,
          segmentStartOffset: seg.startOffset,
        });
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
