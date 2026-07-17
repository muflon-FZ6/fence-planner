import {
  createEmptyProject,
  cryptoRandomId,
  defaultScene,
  defaultSettings,
  intentDefaults,
} from "./defaults";
import { rebuildJoints, syncRunLengths } from "./geometry";
import { feetToInches } from "./units";
import type {
  FenceProject,
  FenceRun,
  FenceType,
  Gate,
  ProjectIntent,
  SceneContext,
} from "./types";

function run(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): FenceRun {
  const start = { x: x1, y: y1 };
  const end = { x: x2, y: y2 };
  return {
    id: cryptoRandomId(),
    start,
    end,
    length: Math.hypot(x2 - x1, y2 - y1),
    gateIds: [],
  };
}

export type YardShape =
  | "straight"
  | "l_shape"
  | "u_shape"
  | "rectangle"
  | "side_yard"
  | "custom";

export function projectFromYardShape(
  shape: YardShape,
  options?: {
    fenceType?: FenceType;
    intent?: ProjectIntent;
    unitSystem?: FenceProject["unitSystem"];
    name?: string;
  },
): FenceProject {
  const ft = feetToInches;
  let runs: FenceRun[] = [];

  switch (shape) {
    case "straight":
      runs = [run(0, 0, ft(50), 0)];
      break;
    case "l_shape":
      runs = [run(0, 0, ft(40), 0), run(ft(40), 0, ft(40), ft(30))];
      break;
    case "u_shape":
      runs = [
        run(0, 0, 0, ft(40)),
        run(0, ft(40), ft(50), ft(40)),
        run(ft(50), ft(40), ft(50), 0),
      ];
      break;
    case "rectangle":
      runs = [
        run(0, 0, ft(60), 0),
        run(ft(60), 0, ft(60), ft(40)),
        run(ft(60), ft(40), 0, ft(40)),
        run(0, ft(40), 0, 0),
      ];
      break;
    case "side_yard":
      runs = [run(0, 0, ft(30), 0), run(ft(30), 0, ft(30), ft(12))];
      break;
    default:
      runs = [];
  }

  runs = syncRunLengths(runs);
  const project = createEmptyProject({
    fenceType: options?.fenceType ?? "panel",
    intent: options?.intent,
    unitSystem: options?.unitSystem ?? "imperial",
    name: options?.name ?? "My Fence Plan",
    runs,
  });
  project.joints = rebuildJoints(project);
  return project;
}

/** Map a planning intent to a ready-to-edit backyard scenario template. */
export function projectFromIntent(
  intent: ProjectIntent,
  options?: {
    unitSystem?: FenceProject["unitSystem"];
    name?: string;
  },
): FenceProject {
  const shapeForIntent: Record<Exclude<ProjectIntent, "calculate">, YardShape> =
    {
      privacy: "u_shape",
      pets: "rectangle",
      replace: "l_shape",
      boundary: "straight",
      gate_area: "u_shape",
      pool_garden: "rectangle",
      modern: "u_shape",
    };

  const shape =
    intent === "calculate" ? "straight" : shapeForIntent[intent];
  const defaults = intentDefaults(intent);
  const fenceType = defaults.fenceType ?? "panel";

  const project = projectFromYardShape(shape, {
    fenceType,
    intent,
    unitSystem: options?.unitSystem ?? "imperial",
    name: options?.name ?? defaultNameForIntent(intent),
  });

  project.settings = {
    ...defaultSettings(fenceType),
    ...defaults.settings,
  };
  project.stylePresetId = "custom";
  project.scene = sceneForIntent(intent);

  if (intent === "pets" || intent === "gate_area" || intent === "pool_garden") {
    const hostRun =
      project.runs.find((r) => r.length === Math.max(...project.runs.map((x) => x.length))) ??
      project.runs[0];
    if (hostRun) {
      const gate: Gate = {
        id: cryptoRandomId(),
        runId: hostRun.id,
        offsetFromRunStart: Math.max(feetToInches(8), hostRun.length * 0.35),
        width: feetToInches(intent === "gate_area" ? 10 : 4),
        gateType: intent === "gate_area" ? "double" : "single",
        swingDirection: "out",
      };
      project.gates = [gate];
      hostRun.gateIds = [gate.id];
    }
  }

  project.joints = rebuildJoints(project);
  return project;
}

function defaultNameForIntent(intent: ProjectIntent): string {
  switch (intent) {
    case "privacy":
      return "Backyard privacy fence";
    case "pets":
      return "Pet-safe yard fence";
    case "replace":
      return "Fence replacement";
    case "boundary":
      return "Property boundary fence";
    case "gate_area":
      return "Yard with gate";
    case "pool_garden":
      return "Pool & garden enclosure";
    case "modern":
      return "Modern outdoor fence";
    case "calculate":
      return "Material estimate";
  }
}

function sceneForIntent(intent: ProjectIntent): SceneContext {
  const base = defaultScene();
  switch (intent) {
    case "privacy":
      return { ...base, housePosition: "center", ground: "grass", daylight: "evening" };
    case "pets":
      return { ...base, housePosition: "center", showSilhouette: true, ground: "grass" };
    case "replace":
      return { ...base, housePosition: "left", daylight: "midday" };
    case "boundary":
      return { ...base, housePosition: "none", ground: "mixed", yardSize: "wide" };
    case "gate_area":
      return { ...base, housePosition: "center", ground: "grass" };
    case "pool_garden":
      return { ...base, housePosition: "right", ground: "patio", daylight: "morning" };
    case "modern":
      return { ...base, housePosition: "center", houseTone: "dark", ground: "patio" };
    default:
      return base;
  }
}

export function quickEstimateToProject(input: {
  totalLengthInches: number;
  corners: number;
  fenceType: FenceType;
  unitSystem: FenceProject["unitSystem"];
  name?: string;
}): FenceProject {
  // Represent quick estimate as connected runs approximating corners
  const { totalLengthInches, corners, fenceType, unitSystem, name } = input;
  const runs: FenceRun[] = [];

  if (corners <= 0) {
    runs.push(run(0, 0, totalLengthInches, 0));
  } else if (corners === 1) {
    const a = totalLengthInches * 0.55;
    const b = totalLengthInches - a;
    runs.push(run(0, 0, a, 0), run(a, 0, a, b));
  } else {
    // U-ish: 3 sides
    const side = totalLengthInches / 3;
    runs.push(
      run(0, 0, 0, side),
      run(0, side, side, side),
      run(side, side, side, 0),
    );
  }

  const project = createEmptyProject({
    fenceType,
    unitSystem,
    name: name ?? "Quick Estimate",
    intent: "calculate",
    runs: syncRunLengths(runs),
  });
  project.joints = rebuildJoints(project);
  return project;
}
