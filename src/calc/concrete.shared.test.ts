import { describe, expect, it } from "vitest";
import { calculateConcreteBags } from "./concrete";
import { calculateMaterials } from "./engine";
import { buildFpRs01, buildFpRs05, fpRs05ConcreteInputs } from "./fixtures/referenceScenarios";
import { DEFAULT_BAG_YIELD_CU_IN, mmToInches } from "@/domain/units";
import { defaultSettings } from "@/domain/defaults";

describe("concrete calculator shared function", () => {
  it("FP-RS-05: 4 posts → 25 bags project-level", () => {
    const { postCount, settings } = fpRs05ConcreteInputs();
    const r = calculateConcreteBags(postCount, settings);
    expect(r.bags).toBe(25);
    expect(settings.concreteBagYield).toBe(DEFAULT_BAG_YIELD_CU_IN);
  });

  it("planner FP-RS-05 project uses same function for 4 posts", () => {
    const project = buildFpRs05();
    const mats = calculateMaterials(project);
    expect(mats.posts.total).toBe(4);
    const direct = calculateConcreteBags(4, project.settings);
    expect(mats.concreteBags).toBe(direct.bags);
  });

  it("metric hole inputs still compute via inches storage", () => {
    const settings = {
      ...defaultSettings("panel"),
      holeDiameter: mmToInches(300),
      holeDepth: mmToInches(900),
    };
    const r = calculateConcreteBags(2, settings);
    expect(r.bags).toBeGreaterThan(0);
    expect(r.perPostCuIn).toBeGreaterThan(0);
  });

  it("waste applies only when enabled", () => {
    const base = defaultSettings("panel");
    const off = calculateConcreteBags(4, {
      ...base,
      applyWasteToConcrete: false,
    });
    const on = calculateConcreteBags(4, {
      ...base,
      applyWasteToConcrete: true,
      wastePercent: 10,
    });
    expect(on.volumeCuIn).toBeGreaterThan(off.volumeCuIn);
    expect(on.bags).toBeGreaterThanOrEqual(off.bags);
  });

  it("invalid inputs return zero bags", () => {
    const s = defaultSettings("panel");
    expect(calculateConcreteBags(0, s).bags).toBe(0);
    expect(calculateConcreteBags(4, { ...s, holeDiameter: 0 }).bags).toBe(0);
    expect(calculateConcreteBags(4, { ...s, holeDepth: -1 }).bags).toBe(0);
    expect(calculateConcreteBags(4, { ...s, concreteBagYield: 0 }).bags).toBe(0);
  });

  it("FP-RS-01 concrete rises after cut-bay post correction (11 posts)", () => {
    const project = buildFpRs01();
    const mats = calculateMaterials(project);
    expect(mats.posts.total).toBe(11);
    expect(mats.concreteBags).toBe(
      calculateConcreteBags(11, project.settings).bags,
    );
  });
});
