import { describe, expect, it } from "vitest";
import { calculateMaterials } from "./engine";
import { calculatePanels } from "./panel";
import { calculateConcreteBags } from "./concrete";
import { calculateChainLink } from "./chainLink";
import { packageCount } from "./fasteners";
import {
  buildFpRs01,
  buildFpRs02,
  buildFpRs03,
  buildFpRs04,
  buildFpRs06,
  fpRs05ConcreteInputs,
  REFERENCE_SCENARIO_SERIALIZATION,
} from "./fixtures/referenceScenarios";
import {
  classifyPosts,
  fillSegments,
  moduleWidth,
} from "@/domain/geometry";
import { defaultSettings } from "@/domain/defaults";
import { DEFAULT_BAG_YIELD_CU_IN, feetToInches } from "@/domain/units";
import { validateProject } from "@/warnings/validate";
import { createEmptyProject, cryptoRandomId } from "@/domain/defaults";
import { rebuildJoints, syncRunLengths } from "@/domain/geometry";
import type { FenceRun } from "@/domain/types";

function makeRun(x1: number, y1: number, x2: number, y2: number): FenceRun {
  return {
    id: cryptoRandomId(),
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    length: Math.hypot(x2 - x1, y2 - y1),
    gateIds: [],
  };
}

describe("FP-RS-01 straight panel run (validated panel math)", () => {
  it("uses panel_only module 100 in and buys 10 panels for 80 ft", () => {
    const project = buildFpRs01();
    expect(moduleWidth(project)).toBe(100);
    const panels = calculatePanels(project);
    expect(panels.fullPanels).toBe(9);
    expect(panels.cutPanels).toHaveLength(1);
    expect(panels.cutPanels[0].pitchRemainder).toBeCloseTo(60);
    expect(panels.cutPanels[0].clearPanelSpace).toBeCloseTo(56);
    expect(panels.totalPanelsToBuy).toBe(10);
  });

  it("places 11 posts including the last full-module boundary at 900 in", () => {
    const project = buildFpRs01();
    const mats = calculateMaterials(project);
    expect(mats.posts.end).toBe(2);
    expect(mats.posts.line).toBe(9);
    expect(mats.posts.total).toBe(11);
    expect(mats.concreteBags).toBe(68);
    const lineXs = classifyPosts(project)
      .filter((p) => p.type === "line")
      .map((p) => p.point.x)
      .sort((a, b) => a - b);
    expect(lineXs[lineXs.length - 1]).toBeCloseTo(900);
  });
});

describe("FP-RS-02 U-shaped yard", () => {
  it("subtracts gate from fill and shares two corners; structure posts are not concreted", () => {
    const project = buildFpRs02();
    const mats = calculateMaterials(project);
    // 48+60+48 - 4 = 152 ft fill
    expect(mats.fillLength).toBeCloseTo(feetToInches(152));
    expect(mats.posts.corner).toBe(2);
    expect(mats.posts.structure).toBe(2);
    expect(mats.posts.gate).toBe(2);
    // Concreted posts exclude structure
    const concreted = mats.posts.total - mats.posts.structure;
    const bags = calculateConcreteBags(concreted, project.settings).bags;
    expect(mats.concreteBags).toBe(bags);
    expect(concreted).toBe(mats.posts.total - 2);
  });
});

describe("FP-RS-03 gate position remainders", () => {
  it("keeps total fill constant while per-segment lengths change", () => {
    const a = buildFpRs03(10);
    const b = buildFpRs03(28);
    const segsA = fillSegments(a, a.runs[0]).map((s) => s.length);
    const segsB = fillSegments(b, b.runs[0]).map((s) => s.length);
    expect(calculateMaterials(a).fillLength).toBeCloseTo(feetToInches(56));
    expect(calculateMaterials(b).fillLength).toBeCloseTo(feetToInches(56));
    expect(segsA).not.toEqual(segsB);
    expect(calculatePanels(a).totalPanelsToBuy).toBe(
      calculatePanels(b).totalPanelsToBuy,
    );
  });
});

describe("FP-RS-04 stepped vs racked slope", () => {
  it("cannot be represented — no slope model in domain", () => {
    expect(buildFpRs04()).toBeNull();
    expect(Object.keys(defaultSettings("panel"))).not.toContain("slopeRise");
  });
});

describe("FP-RS-05 concrete bag yield", () => {
  it("uses cylinder minus square post and project-level ceil", () => {
    const { postCount, settings } = fpRs05ConcreteInputs();
    const r = calculateConcreteBags(postCount, settings);
    const radius = settings.holeDiameter / 2;
    const hole = Math.PI * radius * radius * settings.holeDepth;
    const post =
      settings.postCrossSection * settings.postCrossSection * settings.holeDepth;
    expect(r.perPostCuIn).toBeCloseTo(hole - post);
    expect(settings.concreteBagYield).toBe(DEFAULT_BAG_YIELD_CU_IN);
    expect(r.bags).toBe(25);
    const naivePerPost = Math.ceil(r.perPostCuIn / settings.concreteBagYield) * 4;
    expect(naivePerPost).toBe(28);
    expect(r.bags).toBeLessThan(naivePerPost);
  });
});

describe("FP-RS-06 chain-link system", () => {
  it("calculates fabric after gate fill, terminals, rolls, top rail, ties", () => {
    const project = buildFpRs06();
    const mats = calculateMaterials(project);
    const cl = calculateChainLink(project);
    expect(mats.fillLength).toBeCloseTo(feetToInches(146));
    expect(cl.fabricRolls).toBe(3);
    expect(cl.topRailSections).toBe(
      Math.ceil(feetToInches(150) / feetToInches(21)),
    );
    expect(mats.posts.terminal).toBeGreaterThanOrEqual(5);
    expect(mats.hingeSets).toBe(1);
    expect(mats.latchSets).toBe(1);
    // Unsupported in calc (article may imply): bottom rail SKU, loop caps count, brace rail stock
    const labels = mats.lines.map((l) => l.label.toLowerCase());
    expect(labels.some((l) => l.includes("fabric"))).toBe(true);
  });
});

describe("Validated unit / waste / warning rules", () => {
  it("converts feet to inches as ×12", () => {
    expect(feetToInches(8)).toBe(96);
  });

  it("L-shape shares one corner", () => {
    const a = makeRun(0, 0, feetToInches(40), 0);
    const b = makeRun(feetToInches(40), 0, feetToInches(40), feetToInches(30));
    const project = createEmptyProject({
      fenceType: "panel",
      runs: syncRunLengths([a, b]),
    });
    project.joints = rebuildJoints(project);
    const mats = calculateMaterials(project);
    expect(mats.posts.corner).toBe(1);
    expect(mats.posts.end).toBe(2);
  });

  it("6 ft vs 8 ft wood spacing on 96 ft increases posts", () => {
    const run8 = makeRun(0, 0, feetToInches(96), 0);
    const p8 = createEmptyProject({
      fenceType: "wood_privacy",
      runs: syncRunLengths([run8]),
      settings: defaultSettings("wood_privacy"),
    });
    p8.joints = rebuildJoints(p8);

    const run6 = makeRun(0, 0, feetToInches(96), 0);
    const p6 = createEmptyProject({
      fenceType: "wood_privacy",
      runs: syncRunLengths([run6]),
      settings: {
        ...defaultSettings("wood_privacy"),
        postSpacing: feetToInches(6),
      },
    });
    p6.joints = rebuildJoints(p6);

    expect(calculateMaterials(p8).posts.total).toBe(13);
    expect(calculateMaterials(p6).posts.total).toBe(17);
  });

  it("waste applies selectively; fastener pack rounding uses waste then pack", () => {
    expect(defaultSettings("panel").wastePercent).toBe(5);
    expect(defaultSettings("panel").applyWasteToPanels).toBe(false);
    expect(defaultSettings("panel").applyWasteToPickets).toBe(true);
    expect(defaultSettings("panel").applyWasteToRails).toBe(true);
    expect(defaultSettings("panel").applyWasteToConcrete).toBe(false);
    expect(packageCount(40, 5)).toBe(50);
    expect(packageCount(95, 5)).toBe(100);
  });

  it("gate near end warns at 12 in; short panel leftover warns below 24 in", () => {
    const near = buildFpRs03(0.5); // 6 in offset
    expect(
      validateProject(near).some((w) => w.id.startsWith("gate_corner")),
    ).toBe(true);

    const short = createEmptyProject({
      fenceType: "panel",
      runs: syncRunLengths([makeRun(0, 0, feetToInches(84), 0)]),
    });
    short.joints = rebuildJoints(short);
    const leftover = validateProject(short).find((w) => w.id === "panel_leftovers");
    expect(leftover?.severity).toBe("warning");
  });

  it("does not support shareable reference-scenario URLs", () => {
    expect(REFERENCE_SCENARIO_SERIALIZATION.supported).toBe(false);
    expect(REFERENCE_SCENARIO_SERIALIZATION.shareUrl).toBe(false);
  });
});

describe("Unresolved decisions (not frozen as correct)", () => {
  it("documents construction-correct 11 posts for FP-RS-01 after H2 fix", () => {
    const posts = classifyPosts(buildFpRs01());
    expect(posts).toHaveLength(11);
  });
});
