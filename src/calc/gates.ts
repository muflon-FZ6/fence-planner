import type { FenceProject } from "@/domain/types";

export type GateHardware = {
  hingeSets: number;
  latchSets: number;
  dropRods: number;
  gateCount: number;
};

export function calculateGateHardware(project: FenceProject): GateHardware {
  let hingeSets = 0;
  let latchSets = 0;
  let dropRods = 0;

  for (const gate of project.gates) {
    if (gate.gateType === "double") {
      hingeSets += 2;
      latchSets += 1;
      dropRods += 1;
    } else {
      hingeSets += 1;
      latchSets += 1;
    }
  }

  return {
    hingeSets,
    latchSets,
    dropRods,
    gateCount: project.gates.length,
  };
}
