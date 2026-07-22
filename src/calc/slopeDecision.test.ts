import { describe, expect, it } from "vitest";
import { computeSlopeDecision } from "./slopeDecision";
import { feetToInches } from "@/domain/units";

describe("computeSlopeDecision", () => {
  it("computes 3-4-5 slope length and grade", () => {
    const result = computeSlopeDecision({
      horizontalRunIn: 48,
      riseIn: 36,
      nominalBayIn: 96,
    });
    expect(result.slopeLengthIn).toBeCloseTo(60);
    expect(result.gradePercent).toBeCloseTo(75);
    expect(result.angleDeg).toBeCloseTo(36.87, 1);
  });

  it("reports rise per nominal bay on a gentle grade", () => {
    const result = computeSlopeDecision({
      horizontalRunIn: feetToInches(80),
      riseIn: feetToInches(4),
      nominalBayIn: feetToInches(8),
    });
    expect(result.bayCountHint).toBeCloseTo(10);
    expect(result.risePerBayIn).toBeCloseTo(feetToInches(0.4));
    expect(result.gradePercent).toBeCloseTo(5);
  });

  it("handles zero run without NaN", () => {
    const result = computeSlopeDecision({
      horizontalRunIn: 0,
      riseIn: 12,
      nominalBayIn: 96,
    });
    expect(result.slopeLengthIn).toBe(12);
    expect(result.gradePercent).toBe(0);
    expect(Number.isFinite(result.angleDeg)).toBe(true);
  });
});
