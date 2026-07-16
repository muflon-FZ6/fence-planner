import { feetToInches } from "@/domain/units";
import type { FenceType } from "@/domain/types";

export type WorkedExample = {
  slug: string;
  title: string;
  summary: string;
  fenceType: FenceType;
  assumptions: string[];
  highlights: string[];
  plannerQuery: string;
};

export const examples: WorkedExample[] = [
  {
    slug: "50-foot-straight-privacy-fence",
    title: "50-foot straight privacy fence",
    summary: "A simple backyard run with 8-foot panels and two end posts.",
    fenceType: "panel",
    assumptions: [
      "50 ft straight run",
      "8 ft panel width, panel-only module + 4 in post",
      "6 ft height",
      "No gates",
    ],
    highlights: [
      "Full panels plus any remainder as a cut panel",
      "Two end posts plus line posts on module spacing",
      "Concrete for all freestanding posts",
    ],
    plannerQuery: `shape=straight&type=panel&length=${feetToInches(50)}`,
  },
  {
    slug: "100-foot-backyard-fence-one-gate",
    title: "100-foot backyard fence with one gate",
    summary: "Long run with a 4-foot walk gate excluded from fill materials.",
    fenceType: "panel",
    assumptions: [
      "100 ft total run",
      "One 4 ft single gate",
      "8 ft panels",
    ],
    highlights: [
      "Gate posts and hinge/latch sets",
      "Fill length 96 ft for panels",
      "Watch gate clearance from ends",
    ],
    plannerQuery: "shape=straight&type=panel&gates=1",
  },
  {
    slug: "l-shaped-fence-two-corners",
    title: "L-shaped fence with corners",
    summary: "Two runs sharing a corner post — no double counting.",
    fenceType: "panel",
    assumptions: ["L-shape preset", "Shared corner post", "Panel system"],
    highlights: [
      "One corner post, two end posts",
      "Independent panel math per run",
    ],
    plannerQuery: "shape=l_shape&type=panel",
  },
  {
    slug: "u-shaped-yard-double-gate",
    title: "U-shaped yard fence with a double gate",
    summary: "Three-sided backyard with a wide vehicle opening.",
    fenceType: "wood_privacy",
    assumptions: [
      "U-shape preset",
      "Site-built wood privacy",
      "Double gate hardware includes drop rod",
    ],
    highlights: [
      "Two corner posts",
      "Rails and pickets on fill segments",
      "Drop rod for double gate",
    ],
    plannerQuery: "shape=u_shape&type=wood_privacy&gates=1&double=1",
  },
  {
    slug: "150-foot-chain-link-fence",
    title: "150-foot chain-link fence",
    summary: "Fabric rolls, top rail, and terminal posts.",
    fenceType: "chain_link",
    assumptions: [
      "150 ft straight run",
      "50 ft fabric rolls",
      "21 ft top rail sections",
    ],
    highlights: [
      "Fabric rolls round up",
      "Terminal posts at ends",
      "Ties and brace hardware allowance",
    ],
    plannerQuery: "shape=straight&type=chain_link&length=1800",
  },
  {
    slug: "panel-fence-uneven-last-section",
    title: "Panel fence with an uneven last section",
    summary: "See how a non-multiple length creates a cut panel warning.",
    fenceType: "panel",
    assumptions: ["84 ft run", "8 ft panel module", "Expect remainder"],
    highlights: [
      "Uneven final section warning",
      "One cut panel to purchase",
      "Assumptions remain editable",
    ],
    plannerQuery: "shape=straight&type=panel&length=1008",
  },
];
