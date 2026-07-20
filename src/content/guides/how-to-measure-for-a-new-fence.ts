import type { Guide } from "./types";

const FIGURE_CREDIT = "Original Fence Planner diagram";

export const howToMeasureForANewFence: Guide = {
  slug: "how-to-measure-for-a-new-fence",
  title: "How to Measure for a New Fence",
  description:
    "Make a simple yard sketch, mark the corners and gate, then measure one straight fence section at a time.",
  updated: "2026-07-19",
  relatedTool: "/fence-planner",
  image: "/guides/how-to-measure-for-a-new-fence-v2.webp",
  relatedGuides: [
    "how-to-calculate-fence-panels-and-posts",
    "measure-and-plan-a-fence-gate",
    "fence-permit-and-property-line-checklist",
    "mark-underground-utilities-before-digging",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "You do not need a perfect drawing. You need a simple sketch that shows every straight section, every turn, and every place a gate or obstacle changes the fence line.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "One total distance cannot tell you where corners, posts, gates, or cut panels will land. A few separate measurements can.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Sketch your house, patio, driveway, and the part of the yard you want to enclose.",
        "Put a temporary flag or stake at each start, corner, gate, and end.",
        "Pull string between two marks and measure that one straight side. Write its length beside the line on your sketch.",
        "Start a new measurement every time the fence turns. Mark the gate width and what needs to fit through it.",
        "Note anything that could force a post to move: steps, trees, downspouts, paving, equipment, or a slope.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Draw the same straight sides and gate in the planner. If its shape does not look like your sketch, fix the plan before trusting the material estimate.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Check before digging",
      text: "This is a planning measurement, not a property survey. Confirm the property line, local fence rules, and utilities before any hole is dug.",
    },
    {
      type: "h2",
      text: "How the estimate works",
    },
    {
      type: "p",
      text: "Fence Planner treats each straight stretch of fence (a run) as a separate line measured along the middle of the posts, from one end or corner to the next. Measuring those stretches one at a time keeps corners, gates, and short leftover sections in the right places.",
    },
    {
      type: "figure",
      src: "/guides/diagrams/measure-u-shaped-centerlines.png",
      alt: "Simple overhead sketch of a U-shaped yard fence with three separately measured straight sides, a gate on one side, and markers at the corners and ends.",
      caption:
        "Measure each straight side on its own, then mark the gate and every turn on your sketch before you add the lengths together.",
      credit: FIGURE_CREDIT,
    },
    {
      type: "scenario",
      exampleId: "fp-rs-02-u-shaped-yard",
      label: "Open this U-shaped yard example",
    },
  ],
};
