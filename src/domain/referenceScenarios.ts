/**
 * Predefined reference scenarios for reproducible planner examples.
 * Hypothetical planning examples — not customer projects.
 *
 * IDs match docs/FENCE_PLANNER_EDITORIAL_FOUNDATION.md / Phase 1 handoff.
 */
import {
  createEmptyProject,
  cryptoRandomId,
  defaultSettings,
} from "@/domain/defaults";
import { rebuildJoints, syncRunLengths } from "@/domain/geometry";
import { feetToInches } from "@/domain/units";
import type {
  FenceProject,
  FenceRun,
  FenceSettings,
  Gate,
  Joint,
} from "@/domain/types";

export type ReferenceScenarioId =
  | "fp-rs-01-straight-panel-run"
  | "fp-rs-02-u-shaped-yard"
  | "fp-rs-03-gate-position-remainders"
  | "fp-rs-05-concrete-bag-yield"
  | "fp-rs-06-chain-link-system";

export const REFERENCE_EXAMPLE_NOTICE =
  "Hypothetical planning example. These inputs and results explain and test Fence Planner. They do not describe a customer project or completed installation.";

export type ReferenceScenarioMeta = {
  id: ReferenceScenarioId;
  name: string;
  description: string;
  /** Whether a planner project state can be loaded. */
  hasPlannerState: boolean;
};

export const REFERENCE_SCENARIOS: ReferenceScenarioMeta[] = [
  {
    id: "fp-rs-01-straight-panel-run",
    name: "Straight 80 ft panel run",
    description: "Panel module, cut bay, and boundary posts on one run.",
    hasPlannerState: true,
  },
  {
    id: "fp-rs-02-u-shaped-yard",
    name: "U-shaped yard with gate",
    description: "Shared corners, structure endpoints, and gate fill split.",
    hasPlannerState: true,
  },
  {
    id: "fp-rs-03-gate-position-remainders",
    name: "Gate position remainders",
    description: "Same 60 ft run with a 4 ft gate (default offset 10 ft).",
    hasPlannerState: true,
  },
  {
    id: "fp-rs-05-concrete-bag-yield",
    name: "Concrete bag yield (4 posts)",
    description: "Uses default hole and yield settings on a short post run.",
    hasPlannerState: true,
  },
  {
    id: "fp-rs-06-chain-link-system",
    name: "Chain-link system layout",
    description: "150 ft connected runs with one gate.",
    hasPlannerState: true,
  },
];

function makeRun(x1: number, y1: number, x2: number, y2: number): FenceRun {
  return {
    id: cryptoRandomId(),
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    length: Math.hypot(x2 - x1, y2 - y1),
    gateIds: [],
  };
}

function assemble(
  fenceType: FenceProject["fenceType"],
  runs: FenceRun[],
  gates: Gate[] = [],
  settingsPatch: Partial<FenceSettings> = {},
  jointPatch?: (joints: Joint[]) => Joint[],
  name?: string,
): FenceProject {
  const project = createEmptyProject({
    fenceType,
    name,
    runs: syncRunLengths(runs),
    gates: [],
    settings: { ...defaultSettings(fenceType), ...settingsPatch },
  });

  const boundGates = gates.map((g) => ({
    ...g,
    runId: runs.find((r) => r.id === g.runId)?.id ?? runs[0].id,
  }));
  for (const g of boundGates) {
    const run = project.runs.find((r) => r.id === g.runId);
    if (run && !run.gateIds.includes(g.id)) run.gateIds.push(g.id);
  }
  project.gates = boundGates;
  project.joints = rebuildJoints(project);
  if (jointPatch) project.joints = jointPatch(project.joints);
  // Fresh identity for loaded examples — never reuse a saved id
  project.id = cryptoRandomId();
  project.createdAt = new Date().toISOString();
  project.updatedAt = project.createdAt;
  return project;
}

export function buildFpRs01(): FenceProject {
  return assemble(
    "panel",
    [makeRun(0, 0, feetToInches(80), 0)],
    [],
    {},
    undefined,
    "Example: Straight 80 ft panel run",
  );
}

export function buildFpRs02(): FenceProject {
  const left = makeRun(0, 0, 0, feetToInches(48));
  const rear = makeRun(0, feetToInches(48), feetToInches(60), feetToInches(48));
  const right = makeRun(feetToInches(60), feetToInches(48), feetToInches(60), 0);
  const gate: Gate = {
    id: "fp-rs-02-gate",
    runId: left.id,
    offsetFromRunStart: feetToInches(8),
    width: feetToInches(4),
    gateType: "single",
    swingDirection: "in",
  };

  return assemble(
    "panel",
    [left, rear, right],
    [gate],
    {},
    (joints) =>
      joints.map((j) => {
        const atHouseLeft =
          Math.abs(j.point.x) < 0.5 && Math.abs(j.point.y) < 0.5;
        const atHouseRight =
          Math.abs(j.point.x - feetToInches(60)) < 0.5 &&
          Math.abs(j.point.y) < 0.5;
        if (atHouseLeft || atHouseRight) {
          return { ...j, type: "structure_connection" };
        }
        return j;
      }),
    "Example: U-shaped yard with gate",
  );
}

export function buildFpRs03(gateOffsetFeet = 10): FenceProject {
  const run = makeRun(0, 0, feetToInches(60), 0);
  const gate: Gate = {
    id: "fp-rs-03-gate",
    runId: run.id,
    offsetFromRunStart: feetToInches(gateOffsetFeet),
    width: feetToInches(4),
    gateType: "single",
    swingDirection: "out",
  };
  return assemble(
    "panel",
    [run],
    [gate],
    {},
    undefined,
    "Example: Gate position remainders",
  );
}

/** Slope scenario cannot be represented — no rise/slope fields. */
export function buildFpRs04(): null {
  return null;
}

export function fpRs05ConcreteInputs() {
  return {
    postCount: 4,
    settings: defaultSettings("panel"),
  };
}

/** Short four-post panel run so planner concrete matches FP-RS-05 post count. */
export function buildFpRs05(): FenceProject {
  // Exact 3 × 100 in modules → 4 posts (2 ends + 2 line) with no cut bay
  return assemble(
    "panel",
    [makeRun(0, 0, 300, 0)],
    [],
    {},
    undefined,
    "Example: Concrete bag yield (4 posts)",
  );
}

export function buildFpRs06(): FenceProject {
  const a = makeRun(0, 0, feetToInches(50), 0);
  const b = makeRun(feetToInches(50), 0, feetToInches(50), feetToInches(50));
  const c = makeRun(feetToInches(50), feetToInches(50), 0, feetToInches(50));
  const gate: Gate = {
    id: "fp-rs-06-gate",
    runId: a.id,
    offsetFromRunStart: feetToInches(20),
    width: feetToInches(4),
    gateType: "single",
    swingDirection: "out",
  };
  return assemble(
    "chain_link",
    [a, b, c],
    [gate],
    {},
    undefined,
    "Example: Chain-link system layout",
  );
}

export function buildReferenceScenario(
  id: string,
): FenceProject | null {
  switch (id) {
    case "fp-rs-01-straight-panel-run":
      return buildFpRs01();
    case "fp-rs-02-u-shaped-yard":
      return buildFpRs02();
    case "fp-rs-03-gate-position-remainders":
      return buildFpRs03(10);
    case "fp-rs-05-concrete-bag-yield":
      return buildFpRs05();
    case "fp-rs-06-chain-link-system":
      return buildFpRs06();
    case "fp-rs-04-stepped-vs-racked-slope":
      return null;
    default:
      return null;
  }
}

export function getReferenceScenarioMeta(
  id: string,
): ReferenceScenarioMeta | undefined {
  return REFERENCE_SCENARIOS.find((s) => s.id === id);
}

export function examplePlannerHref(id: ReferenceScenarioId): string {
  return `/fence-planner?example=${id}`;
}

export const REFERENCE_SCENARIO_SERIALIZATION = {
  supported: false,
  persistence: "localStorage keys fence-planner:current / fence-planner:projects",
  shareUrl: false,
  predefinedExampleLoader: true,
} as const;
