import { describe, expect, it } from "vitest";
import { calculateMaterials } from "./engine";
import {
  calculatePanels,
  classifyPartialBayStatus,
  CLEAR_SPACE_USABLE_EPSILON_IN,
  CUT_REMAINDER_EPSILON_IN,
  SHORT_CLEAR_OPENING_IN,
} from "./panel";
import { panelSpecLabel } from "./lumberSpec";
import { buildFpRs01 } from "./fixtures/referenceScenarios";
import {
  classifyPosts,
  moduleWidth,
  rebuildJoints,
  syncRunLengths,
} from "@/domain/geometry";
import {
  createEmptyProject,
  cryptoRandomId,
  defaultSettings,
} from "@/domain/defaults";
import { feetToInches } from "@/domain/units";
import { validateProject } from "@/warnings/validate";
import type { FenceRun, FenceSettings, Gate } from "@/domain/types";

function makeRun(x1: number, y1: number, x2: number, y2: number): FenceRun {
  return {
    id: cryptoRandomId(),
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    length: Math.hypot(x2 - x1, y2 - y1),
    gateIds: [],
  };
}

function panelProject(
  lengthIn: number,
  settingsPatch: Partial<FenceSettings> = {},
) {
  const project = createEmptyProject({
    fenceType: "panel",
    runs: syncRunLengths([makeRun(0, 0, lengthIn, 0)]),
    settings: {
      ...defaultSettings("panel"),
      ...settingsPatch,
    },
  });
  project.joints = rebuildJoints(project);
  return project;
}

describe("panelSpecLabel by module mode", () => {
  it("panel_only uses height × physical panel width (imperial)", () => {
    const s = {
      ...defaultSettings("panel"),
      fenceHeight: 72,
      panelWidth: 96,
      moduleWidthMode: "panel_only" as const,
    };
    expect(panelSpecLabel(s, "imperial")).toBe(
      "6 ft H × 8 ft W wood fence panel",
    );
  });

  it("panel_only uses height × physical panel width (metric)", () => {
    const s = {
      ...defaultSettings("panel"),
      fenceHeight: 72,
      panelWidth: 96,
      moduleWidthMode: "panel_only" as const,
    };
    expect(panelSpecLabel(s, "metric")).toMatch(/wood fence panel/);
    expect(panelSpecLabel(s, "metric")).not.toMatch(/repeating pitch/);
  });

  it("includes_post never claims entered value is physical panel width", () => {
    const s = {
      ...defaultSettings("panel"),
      panelWidth: 96,
      moduleWidthMode: "includes_post" as const,
    };
    const label = panelSpecLabel(s, "imperial");
    expect(label).toMatch(/repeating pitch/i);
    expect(label).toMatch(/verify actual panel width/i);
    expect(label).not.toMatch(/H ×/);
  });

  it("includes_post metric wording still describes pitch", () => {
    const s = {
      ...defaultSettings("panel"),
      panelWidth: 96,
      moduleWidthMode: "includes_post" as const,
    };
    expect(panelSpecLabel(s, "metric")).toMatch(/repeating pitch/i);
  });
});

describe("partial bay status from clear space", () => {
  it("FP-RS-01: 60 in pitch, 56 in clear, valid", () => {
    const panels = calculatePanels(buildFpRs01());
    expect(panels.cutPanels).toHaveLength(1);
    expect(panels.cutPanels[0].pitchRemainder).toBeCloseTo(60);
    expect(panels.cutPanels[0].clearPanelSpace).toBeCloseTo(56);
    expect(panels.cutPanels[0].status).toBe("valid");
    expect(panels.cutPanels[0].segmentStartOffset).toBe(0);
  });

  it("exact full multiple: no partial bay", () => {
    const panels = calculatePanels(panelProject(1000));
    expect(panels.fullPanels).toBe(10);
    expect(panels.cutPanels).toHaveLength(0);
  });

  it("remainder above epsilon but clear space unusable", () => {
    // pitch rem 4.1 in > 0.5, clear = 4.1 - 4 = 0.1 ≤ usable epsilon
    const project = panelProject(904.1);
    const panels = calculatePanels(project);
    expect(panels.cutPanels).toHaveLength(1);
    expect(panels.cutPanels[0].pitchRemainder).toBeGreaterThan(
      CUT_REMAINDER_EPSILON_IN,
    );
    expect(panels.cutPanels[0].clearPanelSpace).toBeLessThanOrEqual(
      CLEAR_SPACE_USABLE_EPSILON_IN,
    );
    expect(panels.cutPanels[0].status).toBe("no_usable_clear_opening");

    const mats = calculateMaterials(project);
    const line = mats.lines.find((l) =>
      l.label.toLowerCase().includes("no usable"),
    );
    expect(line?.note).toMatch(/do not trim/i);

    const warnings = validateProject(project);
    expect(warnings.some((w) => w.id === "panel_no_usable_opening")).toBe(true);
    expect(warnings.find((w) => w.id === "panel_no_usable_opening")?.message).not.toMatch(
      /cutting/i,
    );
  });

  it("clear opening just below 24 in is short", () => {
    // clear = 23 → pitch = 27
    expect(classifyPartialBayStatus(23)).toBe("short");
    expect(23).toBeLessThan(SHORT_CLEAR_OPENING_IN);
    const project = panelProject(927); // 9*100 + 27
    const cut = calculatePanels(project).cutPanels[0];
    expect(cut.clearPanelSpace).toBeCloseTo(23);
    expect(cut.status).toBe("short");
    const warn = validateProject(project).find((w) => w.id === "panel_leftovers");
    expect(warn?.severity).toBe("warning");
    expect(warn?.message).toMatch(/24 in/i);
  });

  it("clear opening at/above 24 in is valid", () => {
    expect(classifyPartialBayStatus(24)).toBe("valid");
    const project = panelProject(928); // rem 28, clear 24
    const cut = calculatePanels(project).cutPanels[0];
    expect(cut.clearPanelSpace).toBeCloseTo(24);
    expect(cut.status).toBe("valid");
  });

  it("both module modes compute clear space from pitch", () => {
    const panelOnly = panelProject(960);
    expect(moduleWidth(panelOnly)).toBe(100);
    expect(calculatePanels(panelOnly).cutPanels[0].clearPanelSpace).toBeCloseTo(
      56,
    );

    const includes = panelProject(960, {
      moduleWidthMode: "includes_post",
      panelWidth: 100,
    });
    expect(moduleWidth(includes)).toBe(100);
    expect(calculatePanels(includes).cutPanels[0].clearPanelSpace).toBeCloseTo(
      56,
    );
    expect(
      calculateMaterials(includes).lines.find((l) => l.id === "panels_buy")
        ?.spec,
    ).toMatch(/repeating pitch/i);
  });

  it("gate-separated segments classify independently", () => {
    const run = makeRun(0, 0, feetToInches(60), 0);
    const gate: Gate = {
      id: "g1",
      runId: run.id,
      offsetFromRunStart: feetToInches(10),
      width: feetToInches(4),
      gateType: "single",
      swingDirection: "out",
    };
    const project = createEmptyProject({
      fenceType: "panel",
      runs: syncRunLengths([run]),
      gates: [gate],
      settings: defaultSettings("panel"),
    });
    project.runs[0].gateIds = [gate.id];
    project.joints = rebuildJoints(project);

    const cuts = calculatePanels(project).cutPanels;
    expect(cuts).toHaveLength(2);
    // 120 → rem 20 clear 16 short; 552 → rem 52 clear 48 valid
    const byClear = [...cuts].sort(
      (a, b) => a.clearPanelSpace - b.clearPanelSpace,
    );
    expect(byClear[0].clearPanelSpace).toBeCloseTo(16);
    expect(byClear[0].status).toBe("short");
    expect(byClear[1].clearPanelSpace).toBeCloseTo(48);
    expect(byClear[1].status).toBe("valid");
  });

  it("shopping list / warning wording for valid leftover mentions clear space verification", () => {
    const project = buildFpRs01();
    const mats = calculateMaterials(project);
    const cutLine = mats.lines.find((l) => l.id.startsWith("panels_cut_"));
    expect(cutLine?.note).toMatch(/fitting allowance/i);
    expect(cutLine?.note).not.toMatch(/do not trim/i);
    expect(classifyPosts(project)).toHaveLength(11);
  });
});
