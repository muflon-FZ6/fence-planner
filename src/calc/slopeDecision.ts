export type SlopeDecisionInput = {
  /** Horizontal run length in inches */
  horizontalRunIn: number;
  /** Rise over that run in inches */
  riseIn: number;
  /** Nominal bay / module size along the run in inches (for rise-per-bay) */
  nominalBayIn: number;
};

export type SlopeDecisionResult = {
  horizontalRunIn: number;
  riseIn: number;
  nominalBayIn: number;
  /** Slope length along the grade (inches) */
  slopeLengthIn: number;
  /** Percent grade = rise / run × 100 */
  gradePercent: number;
  /** Angle in degrees */
  angleDeg: number;
  /** Approximate rise across one nominal bay if grade is constant */
  risePerBayIn: number;
  bayCountHint: number;
};

/**
 * Pure slope geometry helper for the guide Slope Decision Lab.
 * Does not claim a product can rack — that requires manufacturer limits.
 */
export function computeSlopeDecision(
  input: SlopeDecisionInput,
): SlopeDecisionResult {
  const horizontalRunIn = Math.max(0, input.horizontalRunIn);
  const riseIn = Math.max(0, input.riseIn);
  const nominalBayIn = Math.max(1, input.nominalBayIn);

  const slopeLengthIn = Math.hypot(horizontalRunIn, riseIn);
  const gradePercent =
    horizontalRunIn > 0 ? (riseIn / horizontalRunIn) * 100 : 0;
  const angleDeg =
    horizontalRunIn > 0
      ? (Math.atan2(riseIn, horizontalRunIn) * 180) / Math.PI
      : riseIn > 0
        ? 90
        : 0;
  const bayCountHint =
    horizontalRunIn > 0 ? horizontalRunIn / nominalBayIn : 0;
  const risePerBayIn =
    bayCountHint > 0 ? riseIn / Math.max(bayCountHint, 1e-9) : 0;

  return {
    horizontalRunIn,
    riseIn,
    nominalBayIn,
    slopeLengthIn,
    gradePercent,
    angleDeg,
    risePerBayIn,
    bayCountHint,
  };
}
