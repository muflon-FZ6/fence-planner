import { describe, expect, it } from "vitest";
import { calculateMaterials, calculateQuickEstimate } from "./engine";
import { calculateConcreteBags } from "./concrete";
import { calculatePanels } from "./panel";
import { calculateWoodPrivacy } from "./woodPrivacy";
import { calculateChainLink } from "./chainLink";
import { createEmptyProject, cryptoRandomId, defaultSettings } from "@/domain/defaults";
import { rebuildJoints, syncRunLengths } from "@/domain/geometry";
import { projectFromYardShape } from "@/domain/presets";
import { DEFAULT_BAG_YIELD_CU_IN, feetToInches, mmToInches } from "@/domain/units";
import type { FenceProject, FenceRun, Gate } from "@/domain/types";
import { validateProject } from "@/warnings/validate";

function makeRun(x1: number, y1: number, x2: number, y2: number): FenceRun {
  return {
    id: cryptoRandomId(),
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    length: Math.hypot(x2 - x1, y2 - y1),
    gateIds: [],
  };
}

function withRuns(
  fenceType: FenceProject["fenceType"],
  runs: FenceRun[],
  gates: Gate[] = [],
): FenceProject {
  const project = createEmptyProject({ fenceType, runs: syncRunLengths(runs), gates });
  project.joints = rebuildJoints(project);
  project.gates = gates.map((g) => ({
    ...g,
    runId: g.runId || runs[0]?.id,
  }));
  // Fix gate run ids
  return {
    ...project,
    gates: gates.map((g) => ({
      ...g,
      runId: runs.find((r) => r.id === g.runId)?.id ?? runs[0].id,
    })),
  };
}

describe("panel fence", () => {
  it("80-foot straight run with 8-foot panels", () => {
    const run = makeRun(0, 0, feetToInches(80), 0);
    const project = withRuns("panel", [run]);
    const panels = calculatePanels(project);
    // module = 8ft panel + 4in post = 100in; 80ft = 960in
    // full panels = floor(960/100) = 9, remainder 60 → cut
    expect(panels.fullPanels).toBe(9);
    expect(panels.cutPanels).toHaveLength(1);
    expect(panels.totalPanelsToBuy).toBe(10);

    const result = calculateMaterials(project);
    expect(result.posts.end).toBeGreaterThanOrEqual(2);
    expect(result.totalFenceLength).toBeCloseTo(feetToInches(80));
  });

  it("84-foot run creates a partial final panel", () => {
    const run = makeRun(0, 0, feetToInches(84), 0);
    const project = withRuns("panel", [run]);
    const panels = calculatePanels(project);
    expect(panels.cutPanels.length).toBeGreaterThanOrEqual(1);
    const warnings = validateProject(project);
    expect(warnings.some((w) => w.message.includes("section"))).toBe(true);
  });

  it("L-shaped fence shares one corner post", () => {
    const a = makeRun(0, 0, feetToInches(40), 0);
    const b = makeRun(feetToInches(40), 0, feetToInches(40), feetToInches(30));
    const project = withRuns("panel", [a, b]);
    const result = calculateMaterials(project);
    expect(result.posts.corner).toBe(1);
    // Two free ends + one corner = 3 endpoint-ish, not 4 ends
    expect(result.posts.end).toBe(2);
    expect(result.posts.total).toBeLessThan(result.posts.line + 5);
  });

  it("U-shaped fence has two shared corner posts", () => {
    const project = projectFromYardShape("u_shape", { fenceType: "panel" });
    const result = calculateMaterials(project);
    expect(result.posts.corner).toBe(2);
  });

  it("one 4-foot gate excludes gate from panels", () => {
    const run = makeRun(0, 0, feetToInches(80), 0);
    const gate: Gate = {
      id: "g1",
      runId: run.id,
      offsetFromRunStart: feetToInches(20),
      width: feetToInches(4),
      gateType: "single",
      swingDirection: "out",
    };
    const project = withRuns("panel", [run], [gate]);
    const result = calculateMaterials(project);
    expect(result.fillLength).toBeCloseTo(feetToInches(76));
    expect(result.posts.gate).toBe(2);
    expect(result.hingeSets).toBe(1);
    expect(result.latchSets).toBe(1);
  });

  it("10-foot double gate adds drop rod", () => {
    const run = makeRun(0, 0, feetToInches(80), 0);
    const gate: Gate = {
      id: "g1",
      runId: run.id,
      offsetFromRunStart: feetToInches(30),
      width: feetToInches(10),
      gateType: "double",
      swingDirection: "out",
    };
    const project = withRuns("panel", [run], [gate]);
    const result = calculateMaterials(project);
    expect(result.dropRods).toBe(1);
    expect(result.hingeSets).toBe(2);
  });

  it("gate near corner produces warning", () => {
    const run = makeRun(0, 0, feetToInches(40), 0);
    const gate: Gate = {
      id: "g1",
      runId: run.id,
      offsetFromRunStart: 2,
      width: feetToInches(4),
      gateType: "single",
      swingDirection: "out",
    };
    const project = withRuns("panel", [run], [gate]);
    const warnings = validateProject(project);
    expect(warnings.some((w) => w.id.startsWith("gate_corner"))).toBe(true);
  });

  it("two gates in one run", () => {
    const run = makeRun(0, 0, feetToInches(100), 0);
    const gates: Gate[] = [
      {
        id: "g1",
        runId: run.id,
        offsetFromRunStart: feetToInches(20),
        width: feetToInches(4),
        gateType: "single",
        swingDirection: "out",
      },
      {
        id: "g2",
        runId: run.id,
        offsetFromRunStart: feetToInches(60),
        width: feetToInches(4),
        gateType: "single",
        swingDirection: "in",
      },
    ];
    const project = withRuns("panel", [run], gates);
    const result = calculateMaterials(project);
    expect(result.posts.gate).toBe(4);
    expect(result.fillLength).toBeCloseTo(feetToInches(92));
  });
});

describe("site-built wood fence", () => {
  it("100 feet at 8-foot post spacing", () => {
    const run = makeRun(0, 0, feetToInches(100), 0);
    const project = withRuns("wood_privacy", [run]);
    project.settings.postSpacing = feetToInches(8);
    project.settings.applyWasteToRails = false;
    const wood = calculateWoodPrivacy(project);
    expect(wood.spans).toBe(Math.ceil(feetToInches(100) / feetToInches(8)));
    const result = calculateMaterials(project);
    expect(result.rails).toBe(wood.spans * 3);
    expect(result.pickets).toBeGreaterThan(0);
  });

  it("100 feet at 6-foot post spacing", () => {
    const run = makeRun(0, 0, feetToInches(100), 0);
    const project = withRuns("wood_privacy", [run]);
    project.settings.postSpacing = feetToInches(6);
    const wood = calculateWoodPrivacy(project);
    expect(wood.spans).toBeGreaterThan(
      Math.ceil(feetToInches(100) / feetToInches(8)),
    );
  });

  it("three rails per span", () => {
    const run = makeRun(0, 0, feetToInches(48), 0);
    const project = withRuns("wood_privacy", [run]);
    project.settings.railsPerSpan = 3;
    project.settings.applyWasteToRails = false;
    const wood = calculateWoodPrivacy(project);
    expect(wood.rails).toBe(wood.spans * 3);
  });

  it("pickets with no gap", () => {
    const run = makeRun(0, 0, feetToInches(10), 0);
    const project = withRuns("wood_privacy", [run]);
    project.settings.picketWidth = 5.5;
    project.settings.picketGap = 0;
    project.settings.applyWasteToPickets = false;
    const wood = calculateWoodPrivacy(project);
    expect(wood.pickets).toBe(Math.ceil(feetToInches(10) / 5.5));
  });

  it("pickets with configured gap", () => {
    const run = makeRun(0, 0, feetToInches(10), 0);
    const project = withRuns("wood_privacy", [run]);
    project.settings.picketWidth = 5.5;
    project.settings.picketGap = 1.5;
    project.settings.applyWasteToPickets = false;
    const wood = calculateWoodPrivacy(project);
    expect(wood.pickets).toBe(Math.ceil(feetToInches(10) / 7));
  });

  it("waste percentage change increases pickets", () => {
    const run = makeRun(0, 0, feetToInches(50), 0);
    const project = withRuns("wood_privacy", [run]);
    project.settings.applyWasteToPickets = true;
    project.settings.wastePercent = 0;
    const a = calculateWoodPrivacy(project).pickets;
    project.settings.wastePercent = 10;
    const b = calculateWoodPrivacy(project).pickets;
    expect(b).toBeGreaterThanOrEqual(a);
  });
});

describe("chain link", () => {
  it("straight run with terminal posts", () => {
    const run = makeRun(0, 0, feetToInches(50), 0);
    const project = withRuns("chain_link", [run]);
    const result = calculateMaterials(project);
    expect(result.posts.terminal).toBeGreaterThanOrEqual(2);
    expect(result.fabricRolls).toBeGreaterThanOrEqual(1);
  });

  it("L-shaped run with corner terminal", () => {
    const project = projectFromYardShape("l_shape", { fenceType: "chain_link" });
    const result = calculateMaterials(project);
    expect(result.posts.terminal).toBeGreaterThanOrEqual(3);
  });

  it("walk gate and double drive gate", () => {
    const run = makeRun(0, 0, feetToInches(100), 0);
    const gates: Gate[] = [
      {
        id: "w",
        runId: run.id,
        offsetFromRunStart: feetToInches(20),
        width: feetToInches(4),
        gateType: "single",
        swingDirection: "out",
      },
      {
        id: "d",
        runId: run.id,
        offsetFromRunStart: feetToInches(50),
        width: feetToInches(12),
        gateType: "double",
        swingDirection: "out",
      },
    ];
    const project = withRuns("chain_link", [run], gates);
    const result = calculateMaterials(project);
    expect(result.dropRods).toBe(1);
    expect(result.fabricLength).toBeCloseTo(feetToInches(84));
  });

  it("fabric and top rail round up", () => {
    const run = makeRun(0, 0, feetToInches(60), 0);
    const project = withRuns("chain_link", [run]);
    project.settings.fabricRollLength = feetToInches(50);
    project.settings.topRailSectionLength = feetToInches(21);
    const cl = calculateChainLink(project);
    expect(cl.fabricRolls).toBe(2);
    expect(cl.topRailSections).toBe(Math.ceil(60 / 21));
  });
});

describe("concrete", () => {
  it("subtracts post volume and rounds up bags", () => {
    const settings = defaultSettings("panel");
    const result = calculateConcreteBags(4, settings);
    expect(result.perPostCuIn).toBeGreaterThan(0);
    expect(result.bags).toBeGreaterThan(0);
    expect(Number.isInteger(result.bags)).toBe(true);
  });

  it("handles metric-scale hole dimensions", () => {
    const settings = defaultSettings("panel");
    settings.holeDiameter = mmToInches(300);
    settings.holeDepth = mmToInches(900);
    const result = calculateConcreteBags(2, settings);
    expect(result.bags).toBeGreaterThan(0);
  });

  it("supports multiple bag yields", () => {
    const settings = defaultSettings("panel");
    const a = calculateConcreteBags(6, {
      ...settings,
      concreteBagYield: DEFAULT_BAG_YIELD_CU_IN,
    });
    const b = calculateConcreteBags(6, {
      ...settings,
      concreteBagYield: DEFAULT_BAG_YIELD_CU_IN * 2,
    });
    expect(b.bags).toBeLessThanOrEqual(a.bags);
  });

  it("returns zero for invalid hole dimensions", () => {
    const settings = defaultSettings("panel");
    settings.holeDiameter = 0;
    expect(calculateConcreteBags(4, settings).bags).toBe(0);
  });
});

describe("quick estimate", () => {
  it("produces materials from abstract inputs", () => {
    const project = createEmptyProject({ fenceType: "panel" });
    const result = calculateQuickEstimate({
      project,
      totalLength: feetToInches(80),
      corners: 0,
      endpoints: 2,
      gates: [{ width: feetToInches(4), gateType: "single" }],
    });
    expect(result.posts.end).toBe(2);
    expect(result.posts.gate).toBe(2);
    expect(result.panels?.totalPanelsToBuy).toBeGreaterThan(0);
  });
});
