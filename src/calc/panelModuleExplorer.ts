/**
 * Pure helpers for the guide panel-module explorer.
 * Uses the same panel math as the planner for one isolated uninterrupted run.
 */
import {
  calculatePanels,
  clearPanelSpaceFromPitch,
  classifyPartialBayStatus,
  CUT_REMAINDER_EPSILON_IN,
} from "@/calc/panel";
import {
  createEmptyProject,
  cryptoRandomId,
  defaultSettings,
} from "@/domain/defaults";
import {
  classifyPosts,
  moduleWidth,
  rebuildJoints,
  syncRunLengths,
} from "@/domain/geometry";
import type { ModuleWidthMode, PanelCutStatus } from "@/domain/types";

export type PanelModuleExplorerInput = {
  runLengthIn: number;
  enteredWidthIn: number;
  postFaceIn: number;
  mode: ModuleWidthMode;
};

export type PanelModuleExplorerResult = {
  repeatingPitch: number;
  fullPanels: number;
  partialBay: {
    pitchRemainder: number;
    clearPanelSpace: number;
    status: PanelCutStatus;
  } | null;
  panelsToBuy: number;
  /** Posts for one isolated uninterrupted run only. */
  postsIsolatedRun: number;
};

export function computePanelModuleExplorer(
  input: PanelModuleExplorerInput,
): PanelModuleExplorerResult {
  const run = {
    id: cryptoRandomId(),
    start: { x: 0, y: 0 },
    end: { x: Math.max(0, input.runLengthIn), y: 0 },
    length: Math.max(0, input.runLengthIn),
    gateIds: [] as string[],
  };
  const project = createEmptyProject({
    fenceType: "panel",
    runs: syncRunLengths([run]),
    settings: {
      ...defaultSettings("panel"),
      panelWidth: input.enteredWidthIn,
      postWidth: input.postFaceIn,
      postCrossSection: input.postFaceIn,
      moduleWidthMode: input.mode,
      applyWasteToPanels: false,
    },
  });
  project.joints = rebuildJoints(project);

  const panels = calculatePanels(project);
  const pitch = moduleWidth(project);
  const cut = panels.cutPanels[0] ?? null;

  return {
    repeatingPitch: pitch,
    fullPanels: panels.fullPanels,
    partialBay: cut
      ? {
          pitchRemainder: cut.pitchRemainder,
          clearPanelSpace: cut.clearPanelSpace,
          status: cut.status,
        }
      : null,
    panelsToBuy: panels.totalPanelsToBuy,
    postsIsolatedRun: classifyPosts(project).length,
  };
}

/** Direct remainder math without project — for impossible-opening unit checks. */
export function partialBayFromLengths(
  runLength: number,
  pitch: number,
  postFace: number,
): PanelModuleExplorerResult["partialBay"] {
  if (pitch <= 0 || runLength <= 0) return null;
  const full = Math.floor(runLength / pitch);
  const rem = runLength - full * pitch;
  if (rem <= CUT_REMAINDER_EPSILON_IN) return null;
  const clear = clearPanelSpaceFromPitch(rem, postFace);
  return {
    pitchRemainder: rem,
    clearPanelSpace: clear,
    status: classifyPartialBayStatus(clear),
  };
}
