import { describe, expect, it } from "vitest";
import { calculateMaterials } from "@/calc/engine";
import {
  getScenarioStudioEntry,
  scenarioStudioEntries,
} from "@/content/scenarioStudio";
import { buildScenarioStudioSummary } from "@/domain/scenarioStudio";
import {
  REFERENCE_SCENARIOS,
  buildReferenceScenario,
} from "@/domain/referenceScenarios";
import { feetToInches } from "@/domain/units";

describe("scenario studio registry", () => {
  it("has unique slugs and covers every supported reference scenario", () => {
    const slugs = scenarioStudioEntries.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(scenarioStudioEntries).toHaveLength(5);

    const ids = new Set(scenarioStudioEntries.map((e) => e.id));
    for (const meta of REFERENCE_SCENARIOS) {
      expect(meta.hasPlannerState).toBe(true);
      expect(ids.has(meta.id)).toBe(true);
    }
  });

  it("resolves every slug and builds a planner project", () => {
    for (const entry of scenarioStudioEntries) {
      expect(getScenarioStudioEntry(entry.slug)?.id).toBe(entry.id);
      const project = buildReferenceScenario(entry.id);
      expect(project).not.toBeNull();
    }
  });
});

describe("scenario studio derived summaries", () => {
  it("pins FP-RS-01 panel and post outputs to the shared engine", () => {
    const summary = buildScenarioStudioSummary("fp-rs-01-straight-panel-run");
    const mats = calculateMaterials(summary.project);
    expect(summary.posts.total).toBe(mats.posts.total);
    expect(summary.posts.total).toBe(11);
    expect(summary.posts.end).toBe(2);
    expect(summary.posts.line).toBe(9);
    expect(summary.concreteBags).toBe(68);
    expect(summary.panelCutSummary).toMatch(/10 panels to buy/);
    expect(summary.totalFenceLength).toBeCloseTo(feetToInches(80));
  });

  it("pins FP-RS-02 fill and shared corners", () => {
    const summary = buildScenarioStudioSummary("fp-rs-02-u-shaped-yard");
    expect(summary.fillLength).toBeCloseTo(feetToInches(152));
    expect(summary.posts.corner).toBe(2);
    expect(summary.posts.structure).toBe(2);
    expect(summary.posts.gate).toBe(2);
  });

  it("pins FP-RS-03 fill constant with gate segments", () => {
    const summary = buildScenarioStudioSummary(
      "fp-rs-03-gate-position-remainders",
    );
    expect(summary.fillLength).toBeCloseTo(feetToInches(56));
    expect(summary.gateSegmentSummary).toBeTruthy();
  });

  it("pins FP-RS-05 concrete bags from the engine", () => {
    const summary = buildScenarioStudioSummary("fp-rs-05-concrete-bag-yield");
    const mats = calculateMaterials(summary.project);
    expect(summary.concreteBags).toBe(mats.concreteBags);
    expect(summary.concreteBags).toBeGreaterThan(0);
  });

  it("pins FP-RS-06 chain-link fabric lines", () => {
    const summary = buildScenarioStudioSummary("fp-rs-06-chain-link-system");
    const mats = calculateMaterials(summary.project);
    expect(summary.materialLines).toEqual(mats.lines);
    expect(mats.fabricRolls).toBeGreaterThan(0);
    expect(
      summary.highlights.some((h) => h.toLowerCase().includes("fabric")),
    ).toBe(true);
  });
});
