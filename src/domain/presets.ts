import { createEmptyProject, cryptoRandomId } from "./defaults";
import { rebuildJoints, syncRunLengths } from "./geometry";
import { feetToInches } from "./units";
import type { FenceProject, FenceRun, FenceType, ProjectIntent } from "./types";

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
