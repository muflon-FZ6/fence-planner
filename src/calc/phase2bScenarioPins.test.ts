import { describe, expect, it } from "vitest";
import { calculateMaterials } from "./engine";
import { calculatePanels } from "./panel";
import { calculateConcreteBags } from "./concrete";
import {
  buildFpRs02,
  buildFpRs03,
  fpRs05ConcreteInputs,
} from "./fixtures/referenceScenarios";
import {
  createEmptyProject,
  cryptoRandomId,
  defaultSettings,
} from "@/domain/defaults";
import {
  classifyPosts,
  fillSegments,
  rebuildJoints,
  syncRunLengths,
} from "@/domain/geometry";
import { feetToInches, DEFAULT_BAG_YIELD_CU_IN } from "@/domain/units";
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

describe("Phase 2B pinned scenario outputs", () => {
  it("FP-RS-02 fill segments, roles, and concreted points", () => {
    const project = buildFpRs02();
    const segs = project.runs.flatMap((r) =>
      fillSegments(project, r).map((s) => s.length),
    );
    expect(segs).toEqual([96, 432, 720, 576]);

    const mats = calculateMaterials(project);
    expect(mats.posts.corner).toBe(2);
    expect(mats.posts.structure).toBe(2);
    expect(mats.posts.gate).toBe(2);
    expect(mats.posts.line).toBe(16);

    const posts = classifyPosts(project);
    expect(posts).toHaveLength(22);
    const concreted = mats.posts.total - mats.posts.structure;
    expect(concreted).toBe(20);
  });

  it("FP-RS-03 gate starts 10/20/28 ft: segments, partials, eight panels", () => {
    const cases = [
      {
        ft: 10,
        segs: [120, 552],
        partials: [
          { pitch: 20, clear: 16 },
          { pitch: 52, clear: 48 },
        ],
      },
      {
        ft: 20,
        segs: [240, 432],
        partials: [
          { pitch: 40, clear: 36 },
          { pitch: 32, clear: 28 },
        ],
      },
      {
        ft: 28,
        segs: [336, 336],
        partials: [
          { pitch: 36, clear: 32 },
          { pitch: 36, clear: 32 },
        ],
      },
    ] as const;

    for (const c of cases) {
      const project = buildFpRs03(c.ft);
      const segs = fillSegments(project, project.runs[0]).map((s) => s.length);
      expect(segs, `${c.ft} ft segments`).toEqual([...c.segs]);
      const panels = calculatePanels(project);
      expect(panels.totalPanelsToBuy).toBe(8);
      const cuts = [...panels.cutPanels].sort(
        (a, b) => a.segmentStartOffset - b.segmentStartOffset,
      );
      expect(cuts).toHaveLength(2);
      expect(cuts[0].pitchRemainder).toBeCloseTo(c.partials[0].pitch);
      expect(cuts[0].clearPanelSpace).toBeCloseTo(c.partials[0].clear);
      expect(cuts[1].pitchRemainder).toBeCloseTo(c.partials[1].pitch);
      expect(cuts[1].clearPanelSpace).toBeCloseTo(c.partials[1].clear);
    }
  });

  it("96 ft site-built wood: 13 posts at 8 ft, 17 at 6 ft", () => {
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

  it("FP-RS-05 volumes, 25 bags, naïve 28, contingency 26", () => {
    const { postCount, settings } = fpRs05ConcreteInputs();
    const r = calculateConcreteBags(postCount, settings);
    expect(r.perPostCuIn).toBeCloseTo(3495.5, 1);
    expect(r.volumeCuIn).toBeCloseTo(13982.02, 1);
    expect(settings.concreteBagYield).toBe(DEFAULT_BAG_YIELD_CU_IN);
    expect(r.bags).toBe(25);
    const naivePerPost =
      Math.ceil(r.perPostCuIn / settings.concreteBagYield) * 4;
    expect(naivePerPost).toBe(28);
    const withContingency = calculateConcreteBags(postCount, {
      ...settings,
      applyWasteToConcrete: true,
      wastePercent: 5,
    });
    expect(withContingency.bags).toBe(26);
  });
});
