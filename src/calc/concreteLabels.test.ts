import { describe, expect, it } from "vitest";
import { concreteProjectVolumeLabel } from "./concreteLabels";
import { DEFAULT_BAG_YIELD_CU_IN, inchesToMm, mmToInches } from "@/domain/units";

const CU_IN_PER_CU_FT = 1728;
const LITERS_PER_CU_IN = 0.0163871;

describe("concrete / unit interface truth helpers", () => {
  it("labels net vs contingency volumes", () => {
    expect(concreteProjectVolumeLabel(false, 5)).toBe(
      "Net calculated project volume",
    );
    expect(concreteProjectVolumeLabel(true, 5)).toBe(
      "Estimated project volume including contingency (5%)",
    );
  });

  it("illustrative default yield is about 9.34 L", () => {
    const liters = DEFAULT_BAG_YIELD_CU_IN * LITERS_PER_CU_IN;
    expect(liters).toBeCloseTo(9.34, 1);
    expect(DEFAULT_BAG_YIELD_CU_IN / CU_IN_PER_CU_FT).toBeCloseTo(0.33, 2);
  });

  it("metric mm ↔ inch round-trip for plan post face", () => {
    expect(inchesToMm(4)).toBeCloseTo(101.6, 5);
    expect(mmToInches(101.6)).toBeCloseTo(4, 5);
  });
});
