import { describe, expect, it } from "vitest";
import {
  evaluateReadinessAudit,
  type ReadinessAnswers,
} from "./buildReadiness";

const allYes: ReadinessAnswers = {
  boundary_source: "yes",
  official_rules: "yes",
  utility_locate: "yes",
  private_lines: "yes",
  gate_clearance: "yes",
  product_instructions: "yes",
  site_constraints: "no",
  estimate_check: "yes",
};

describe("evaluateReadinessAudit", () => {
  it("returns Ready when prerequisites are yes and constraints are resolved/absent", () => {
    const result = evaluateReadinessAudit(allYes, {}, "2026-07-21T12:00:00.000Z");
    expect(result.overall).toBe("ready");
    expect(result.items.every((i) => i.status === "ready")).toBe(true);
    expect(result.generatedAt).toBe("2026-07-21T12:00:00.000Z");
  });

  it("returns Verify when a non-stop item is missing or unsure", () => {
    const result = evaluateReadinessAudit({
      ...allYes,
      estimate_check: "unsure",
    });
    expect(result.overall).toBe("verify");
    expect(result.items.find((i) => i.id === "estimate_check")?.status).toBe(
      "verify",
    );
  });

  it("returns Stop when a dig/buy prerequisite is missing", () => {
    const result = evaluateReadinessAudit({
      ...allYes,
      utility_locate: "no",
    });
    expect(result.overall).toBe("stop");
    expect(result.items.find((i) => i.id === "utility_locate")?.status).toBe(
      "stop",
    );
  });

  it("treats unresolved site constraints (yes) as Verify", () => {
    const result = evaluateReadinessAudit({
      ...allYes,
      site_constraints: "yes",
    });
    expect(result.overall).toBe("verify");
    expect(result.items.find((i) => i.id === "site_constraints")?.status).toBe(
      "verify",
    );
  });
});
