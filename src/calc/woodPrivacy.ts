import { fillSegments } from "@/domain/geometry";
import type { FenceProject } from "@/domain/types";

export type WoodPrivacyResult = {
  spans: number;
  rails: number;
  pickets: number;
  /** Narrow battens for board-and-batten (0 otherwise). */
  battens: number;
  /** Welded-wire panels for wood-frame wire (0 otherwise). */
  wirePanels: number;
  /** Bays that need a board ripped narrower to keep end gaps even. */
  cutBoards: number;
  linePostsAlongRuns: number;
};

/** Nominal 1x2 / 1x3 batten face used for board-and-batten estimates. */
export const BATTEN_WIDTH_IN = 1.5;

export type BayBoardLayout = {
  /** Full-width boards that fit with equal gaps. */
  fullCount: number;
  /** Ripped board width in inches (0 if bay fits full boards only). */
  cutWidth: number;
};

/**
 * Full boards in a clear bay when end gaps match the between-board gap.
 * Layout without cut: [gap][board][gap][board]…[gap][board][gap]
 */
export function countBoardsInBay(
  bayInches: number,
  boardWidth: number,
  gap: number,
): number {
  return layoutBayBoards(bayInches, boardWidth, gap).fullCount;
}

/**
 * Place as many full boards as will fit with equal end/between gaps, then a
 * cut-to-width board if leftover space would otherwise widen the last gap.
 * Final layout: [gap][full]…[full][gap][cut?][gap]
 */
export function layoutBayBoards(
  bayInches: number,
  boardWidth: number,
  gap: number,
): BayBoardLayout {
  if (bayInches <= 0 || boardWidth <= 0) {
    return { fullCount: 0, cutWidth: 0 };
  }
  const g = Math.max(0, gap);
  const fullCount =
    g <= 0
      ? Math.max(0, Math.floor(bayInches / boardWidth + 1e-9))
      : Math.max(0, Math.floor((bayInches - g) / (boardWidth + g) + 1e-9));

  // Room for a ripped board after n full boards: [G][W]…[W][G][cut][G]
  const cutWidth = bayInches - fullCount * boardWidth - (fullCount + 2) * g;
  if (cutWidth >= 0.25 && cutWidth < boardWidth - 0.05) {
    return { fullCount, cutWidth };
  }
  return { fullCount, cutWidth: 0 };
}

export function calculateWoodPrivacy(project: FenceProject): WoodPrivacyResult {
  const spacing = project.settings.postSpacing;
  const {
    railsPerSpan,
    picketWidth,
    picketGap,
    wastePercent,
    boardPattern,
    postWidth,
  } = project.settings;
  let spans = 0;
  let linePostsAlongRuns = 0;

  for (const run of project.runs) {
    for (const seg of fillSegments(project, run)) {
      if (seg.length <= 0 || spacing <= 0) continue;
      const segSpans = Math.max(1, Math.ceil(seg.length / spacing));
      spans += segSpans;
      linePostsAlongRuns += Math.max(0, segSpans - 1);
    }
  }

  let rails = spans * railsPerSpan;
  let pickets = 0;
  let battens = 0;
  let wirePanels = 0;
  let cutBoards = 0;

  if (boardPattern === "wire_mesh") {
    wirePanels = spans;
  } else if (picketWidth > 0) {
    for (const run of project.runs) {
      for (const seg of fillSegments(project, run)) {
        if (seg.length <= 0 || spacing <= 0) continue;
        const segSpans = Math.max(1, Math.ceil(seg.length / spacing));
        const clearBay = Math.max(0, spacing - postWidth);
        for (let i = 0; i < segSpans; i++) {
          const layout = layoutBayBoards(clearBay, picketWidth, picketGap);
          pickets += layout.fullCount;
          if (layout.cutWidth > 0) {
            pickets += 1; // still buy a full board, then rip to width
            cutBoards += 1;
          }
          if (boardPattern === "board_and_batten") {
            const pieces = layout.fullCount + (layout.cutWidth > 0 ? 1 : 0);
            battens += Math.max(0, pieces - 1);
          }
        }
      }
    }

    if (boardPattern === "board_on_board") {
      pickets = Math.ceil(pickets * 1.95);
      cutBoards = Math.ceil(cutBoards * 1.95);
    } else if (boardPattern === "shadowbox") {
      pickets = Math.ceil(pickets * 1.55);
      cutBoards = Math.ceil(cutBoards * 1.55);
    }
  }

  if (project.settings.applyWasteToRails && wastePercent > 0) {
    rails = Math.ceil(rails * (1 + wastePercent / 100));
  }
  if (project.settings.applyWasteToPickets && wastePercent > 0) {
    if (pickets > 0) {
      pickets = Math.ceil(pickets * (1 + wastePercent / 100));
    }
    if (battens > 0) {
      battens = Math.ceil(battens * (1 + wastePercent / 100));
    }
    if (wirePanels > 0) {
      wirePanels = Math.ceil(wirePanels * (1 + wastePercent / 100));
    }
    if (cutBoards > 0) {
      cutBoards = Math.ceil(cutBoards * (1 + wastePercent / 100));
    }
  }

  return {
    spans,
    rails,
    pickets,
    battens,
    wirePanels,
    cutBoards,
    linePostsAlongRuns,
  };
}
