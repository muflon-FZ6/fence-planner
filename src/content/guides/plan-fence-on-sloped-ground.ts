import type { Guide } from "./types";

export const planFenceOnSlopedGround: Guide = {
  slug: "plan-fence-on-sloped-ground",
  title: "How to Plan a Fence on Sloped Ground",
  description:
    "Estimate slope length and rise per bay, then choose stepped vs racked only after you verify your product’s limits — the flat planner is not slope-aware.",
  updated: "2026-07-21",
  relatedTool: "/fence-planner",
  relatedGuides: [
    "how-to-measure-for-a-new-fence",
    "wood-panels-vs-individual-pickets",
    "measure-and-plan-a-fence-gate",
    "how-to-calculate-fence-panels-and-posts",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "A stepped fence uses level sections with drops between them. A racked fence follows the grade. Measure horizontal run and rise, compare rise-per-bay to product instructions, then buy. Fence Planner’s canvas remains a flat plan model.",
    },
    {
      type: "h2",
      text: "Slope decision lab",
    },
    {
      type: "p",
      text: "Enter a horizontal run, rise, and nominal bay size. The lab reports slope length, grade, angle, and approximate rise per bay. It does not certify that any panel can rack that far.",
    },
    {
      type: "slope_decision_lab",
      defaultHorizontalFeet: 40,
      defaultRiseInches: 24,
      defaultBayFeet: 8,
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "Buying panels before you decide how the fence handles the hill can leave you with a product that cannot rack, a silhouette you did not expect, or posts that are too short on the downhill side.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Walk the fence line and note where the grade changes.",
        "Measure horizontal run and rise for the steepest stretch that matters.",
        "Choose stepped or racked only after reading the product’s slope guidance.",
        "Keep gates off the steepest stretch when the yard allows.",
        "Remember FP-RS-04 (stepped vs racked) is not a loadable planner example — no slope fields exist in the project model.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Use the plan to map the horizontal route and mark grade changes in your notes. Keep product rack/step limits outside the canvas.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Not every panel can rack",
      text: "Not every panel can rack, and a steep yard may need short sections, custom work, or an approved alternative. Follow current product instructions before you buy a full load of materials.",
    },
  ],
};
