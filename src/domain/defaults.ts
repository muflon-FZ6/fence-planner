import { DEFAULT_BAG_YIELD_CU_IN, feetToInches } from "./units";
import type {
  FenceProject,
  FenceSettings,
  FenceType,
  ProjectIntent,
  SceneContext,
} from "./types";

export function defaultSettings(fenceType: FenceType = "panel"): FenceSettings {
  const base: FenceSettings = {
    panelWidth: feetToInches(8),
    moduleWidthMode: "panel_only",
    postSpacing: feetToInches(8),
    postWidth: 4,
    postCrossSection: 4,
    fenceHeight: feetToInches(6),
    railsPerSpan: 3,
    picketWidth: 5.5,
    picketGap: 0,
    holeDiameter: 12,
    holeDepth: 36,
    concreteBagYield: DEFAULT_BAG_YIELD_CU_IN,
    wastePercent: 5,
    applyWasteToPanels: false,
    applyWasteToPickets: true,
    applyWasteToRails: true,
    applyWasteToConcrete: false,
    fabricRollLength: feetToInches(50),
    topRailSectionLength: feetToInches(21),
    tensionWire: true,
    tiesPerFoot: 1,
    finish:
      fenceType === "chain_link"
        ? "galvanized"
        : fenceType === "panel"
          ? "natural_cedar"
          : "natural_cedar",
    boardOrientation: "vertical",
  };

  if (fenceType === "wood_privacy") {
    base.postSpacing = feetToInches(8);
    base.applyWasteToPickets = true;
  }
  if (fenceType === "chain_link") {
    base.postSpacing = feetToInches(10);
    base.fenceHeight = feetToInches(4);
    base.finish = "galvanized";
  }
  return base;
}

export function defaultScene(): SceneContext {
  return {
    housePosition: "center",
    houseTone: "neutral",
    ground: "grass",
    yardSize: "average",
    daylight: "midday",
    viewpoint: "yard",
    showSilhouette: true,
  };
}

export function createEmptyProject(
  partial?: Partial<FenceProject>,
): FenceProject {
  const now = new Date().toISOString();
  const fenceType = partial?.fenceType ?? "panel";
  return {
    id: partial?.id ?? cryptoRandomId(),
    name: partial?.name,
    unitSystem: partial?.unitSystem ?? "imperial",
    fenceType,
    intent: partial?.intent,
    runs: partial?.runs ?? [],
    gates: partial?.gates ?? [],
    joints: partial?.joints ?? [],
    settings: partial?.settings ?? defaultSettings(fenceType),
    scene: partial?.scene ?? defaultScene(),
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,
  };
}

export function intentDefaults(intent: ProjectIntent): Partial<{
  fenceType: FenceType;
  settings: Partial<FenceSettings>;
}> {
  switch (intent) {
    case "privacy":
      return {
        fenceType: "panel",
        settings: { fenceHeight: feetToInches(6), boardOrientation: "vertical" },
      };
    case "pets":
      return {
        fenceType: "wood_privacy",
        settings: { fenceHeight: feetToInches(5), picketGap: 0 },
      };
    case "modern":
      return {
        fenceType: "wood_privacy",
        settings: {
          boardOrientation: "horizontal",
          finish: "charcoal",
          fenceHeight: feetToInches(6),
        },
      };
    case "boundary":
      return {
        fenceType: "chain_link",
        settings: { fenceHeight: feetToInches(4) },
      };
    case "pool_garden":
      return {
        fenceType: "panel",
        settings: { fenceHeight: feetToInches(5) },
      };
    default:
      return { fenceType: "panel" };
  }
}

export function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Math.random().toString(36).slice(2, 11)}`;
}
