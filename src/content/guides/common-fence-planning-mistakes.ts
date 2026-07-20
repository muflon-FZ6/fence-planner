import type { Guide } from "./types";

export const commonFencePlanningMistakes: Guide = {
  slug: "common-fence-planning-mistakes",
  title: "Common Fence-Planning Mistakes",
  description:
    "Catch the expensive planning mistakes before buying: one total measurement, forgotten gates, duplicate corner posts, and unverified local rules.",
  updated: "2026-07-19",
  relatedTool: "/fence-planner",
  relatedGuides: [
    "how-to-measure-for-a-new-fence",
    "how-to-calculate-fence-panels-and-posts",
    "plan-fence-corners-and-end-posts",
    "fence-permit-and-property-line-checklist",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "Most avoidable fence mistakes happen before the first hole. Walk through this short check before you order materials.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "One total measurement, a forgotten gate, a double-counted corner, or an unverified local rule can send you back to the store—or force you to move posts after concrete is set.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Confirm the fence line against the property boundary and local rules.",
        "Locate utilities before any digging plan feels final.",
        "Sketch each straight section separately instead of one perimeter total.",
        "Choose the gate product and place it on the real fence line.",
        "Check the last short section on each run and decide how you will handle it.",
        "Compare the plan with your yard one more time before you buy.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Enter the same separate runs and gate openings you sketched. If the layout does not look like the yard, fix the plan before trusting the material estimate.",
    },
    {
      type: "h2",
      text: "Check before buying",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Paper mistakes are cheap; concrete mistakes are not",
      text: "Do not order materials from a single total length, an unverified boundary, or a layout that still has an unexplained short section. Confirm the line, utilities, gates, and corners first.",
    },
  ],
};
