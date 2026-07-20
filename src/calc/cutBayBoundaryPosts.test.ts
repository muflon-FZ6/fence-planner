import { describe, expect, it } from "vitest";
import { calculateMaterials } from "./engine";
import { calculatePanels } from "./panel";
import { calculateConcreteBags } from "./concrete";
import {
  buildFpRs01,
  buildFpRs03,
} from "./fixtures/referenceScenarios";
import {
  classifyPosts,
  moduleWidth,
  pointAlongRun,
} from "@/domain/geometry";
import { createEmptyProject, cryptoRandomId, defaultSettings } from "@/domain/defaults";
import { rebuildJoints, syncRunLengths } from "@/domain/geometry";
import { feetToInches } from "@/domain/units";
import type { FenceRun, Gate } from "@/domain/types";

function makeRun(x1: number, y1: number, x2: number, y2: number): FenceRun {
  return {
    id: cryptoRandomId(),
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    length: Math.hypot(x2 - x1, y2 - y1),
    gateIds: [],
  };
}

function projectWith(
  fenceType: "panel" | "wood_privacy" | "chain_link",
  runs: FenceRun[],
  gates: Gate[] = [],
) {
  const project = createEmptyProject({
    fenceType,
    runs: syncRunLengths(runs),
    gates: gates.map((g) => ({
      ...g,
      runId: runs.find((r) => r.id === g.runId)?.id ?? runs[0].id,
    })),
    settings: defaultSettings(fenceType),
  });
  for (const g of project.gates) {
    const run = project.runs.find((r) => r.id === g.runId);
    if (run && !run.gateIds.includes(g.id)) run.gateIds.push(g.id);
  }
  project.joints = rebuildJoints(project);
  return project;
}

describe("cut-bay boundary posts (Phase 2A H2)", () => {
  it("FP-RS-01: 960 in / 100 in → 10 panels and 11 posts with line at 900 in", () => {
    const project = buildFpRs01();
    expect(moduleWidth(project)).toBe(100);
    const panels = calculatePanels(project);
    expect(panels.fullPanels).toBe(9);
    expect(panels.cutPanels).toHaveLength(1);
    expect(panels.cutPanels[0].pitchRemainder).toBeCloseTo(60);
    expect(panels.cutPanels[0].clearPanelSpace).toBeCloseTo(56);
    expect(panels.totalPanelsToBuy).toBe(10);

    const mats = calculateMaterials(project);
    expect(mats.posts.end).toBe(2);
    expect(mats.posts.line).toBe(9);
    expect(mats.posts.total).toBe(11);

    const posts = classifyPosts(project);
    const lineXs = posts
      .filter((p) => p.type === "line")
      .map((p) => p.point.x)
      .sort((a, b) => a - b);
    expect(lineXs).toHaveLength(9);
    expect(lineXs[8]).toBeCloseTo(900);
  });

  it("exact multiple has no phantom boundary after final full panel", () => {
    // 1000 in = 10 × 100 — 10 full, 0 cut; line posts at 100..900 only (9)
    const project = projectWith("panel", [makeRun(0, 0, 1000, 0)]);
    const panels = calculatePanels(project);
    expect(panels.fullPanels).toBe(10);
    expect(panels.cutPanels).toHaveLength(0);
    const mats = calculateMaterials(project);
    expect(mats.posts.line).toBe(9);
    expect(mats.posts.total).toBe(11);
  });

  it("remainder at or below epsilon → no cut bay and no extra boundary", () => {
    // 1000.3 in → floor full=10, rem=0.3 ≤ 0.5 → no cut purchase
    const project = projectWith("panel", [makeRun(0, 0, 1000.3, 0)]);
    const panels = calculatePanels(project);
    expect(panels.cutPanels).toHaveLength(0);
    expect(panels.fullPanels).toBe(10);
    const mats = calculateMaterials(project);
    expect(mats.posts.line).toBe(9);
    expect(mats.posts.total).toBe(11);
  });

  it("fill segment shorter than one module → ends only, one cut panel", () => {
    const project = projectWith("panel", [makeRun(0, 0, 60, 0)]);
    const panels = calculatePanels(project);
    expect(panels.fullPanels).toBe(0);
    expect(panels.cutPanels).toHaveLength(1);
    const mats = calculateMaterials(project);
    expect(mats.posts.line).toBe(0);
    expect(mats.posts.end).toBe(2);
    expect(mats.posts.total).toBe(2);
  });

  it("gate split: remainder side gets last full-module boundary", () => {
    // 60 ft run, 4 ft gate at 20 ft → fill segments [0,240] and [288,720]
    // lengths 240 and 432; module 100 → cut rem 40 and 32.
    const run = makeRun(0, 0, feetToInches(60), 0);
    const gate: Gate = {
      id: "g1",
      runId: run.id,
      offsetFromRunStart: feetToInches(20),
      width: feetToInches(4),
      gateType: "single",
      swingDirection: "out",
    };
    const project = projectWith("panel", [run], [gate]);
    expect(moduleWidth(project)).toBe(100);

    const panels = calculatePanels(project);
    expect(panels.totalPanelsToBuy).toBeGreaterThan(0);
    // Left: 2 full + cut; right: 4 full + cut → 8 panels
    expect(panels.fullPanels).toBe(6);
    expect(panels.cutPanels).toHaveLength(2);

    const posts = classifyPosts(project);
    const gatePosts = posts.filter((p) => p.type === "gate");
    expect(gatePosts).toHaveLength(2);
    expect(
      gatePosts.map((p) => p.point.x).sort((a, b) => a - b),
    ).toEqual([240, 288]);

    const lineXs = posts
      .filter((p) => p.type === "line")
      .map((p) => p.point.x)
      .sort((a, b) => a - b);
    // Left segment cut bay → boundaries at 100, 200
    // Right segment cut bay → boundaries at 388, 488, 588, 688
    expect(lineXs).toEqual([100, 200, 388, 488, 588, 688]);

    const mats = calculateMaterials(project);
    expect(mats.posts.gate).toBe(2);
    expect(mats.posts.line).toBe(6);
    expect(mats.posts.end).toBe(2);
    expect(mats.posts.total).toBe(10);
  });

  it("dedupes when a module boundary coincides with a gate post", () => {
    // Place gate so its start sits on a module boundary (100 in)
    const run = makeRun(0, 0, feetToInches(40), 0);
    const gate: Gate = {
      id: "g1",
      runId: run.id,
      offsetFromRunStart: 100,
      width: feetToInches(4),
      gateType: "single",
      swingDirection: "out",
    };
    const project = projectWith("panel", [run], [gate]);
    const posts = classifyPosts(project);
    const at100 = posts.filter(
      (p) => Math.abs(p.point.x - 100) < 1 && Math.abs(p.point.y) < 1,
    );
    expect(at100).toHaveLength(1);
    expect(at100[0].type).toBe("gate"); // gate rank wins
  });

  it("downstream concrete rises with corrected FP-RS-01 post total", () => {
    const project = buildFpRs01();
    const mats = calculateMaterials(project);
    expect(mats.posts.total).toBe(11);
    const bags = calculateConcreteBags(mats.posts.total, project.settings).bags;
    expect(mats.concreteBags).toBe(bags);
    expect(bags).toBe(68);
    const bags10 = calculateConcreteBags(10, project.settings).bags;
    expect(bags).toBeGreaterThan(bags10);
  });

  it("buildFpRs03 still loads and classifies after correction", () => {
    const project = buildFpRs03(10);
    expect(classifyPosts(project).length).toBeGreaterThan(2);
    expect(pointAlongRun(project.runs[0], 900).x).toBeDefined();
  });
});
