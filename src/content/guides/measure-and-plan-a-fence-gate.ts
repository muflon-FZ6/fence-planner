import type { Guide } from "./types";

const FIGURE_CREDIT = "Original Fence Planner diagram";

export const measureAndPlanAFenceGate: Guide = {
  slug: "measure-and-plan-a-fence-gate",
  title: "How to Measure and Plan a Fence Gate",
  description:
    "Plan the clear passage first, then choose a gate product, its post opening, and a swing path that does not hit the yard.",
  updated: "2026-07-19",
  relatedTool: "/fence-gate-planner",
  image: "/guides/measure-and-plan-a-fence-gate.webp",
  relatedGuides: [
    "how-to-measure-for-a-new-fence",
    "how-to-calculate-fence-panels-and-posts",
    "plan-fence-corners-and-end-posts",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "Start with what must pass through the gate. Then choose a gate system and set the posts using that product’s required opening—not simply the width you hope the gate leaf will be.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "A gate that clears a person may not clear bins, a mower, or a vehicle. A gate that fits on paper may still swing into steps, a slope, or landscaping.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Measure the widest thing that needs to pass through the opening.",
        "Choose the gate product before setting posts; its instructions define the post opening and hardware clearance.",
        "Mark both posts and walk the swing path with string or a board.",
        "Check the remaining fence sections on both sides of the gate.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Place the gate on its real fence line and compare a few positions. Moving it can make the remaining sections more balanced, even when the total panel count stays the same.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Check before building",
      text: "Follow the gate manufacturer’s instructions for post, hinge, latch, clearance, and support requirements. Make sure the swing does not block a path, stairs, vehicle, or required access.",
    },
    {
      type: "h2",
      text: "How the estimate works",
    },
    {
      type: "p",
      text: "The planner removes the planned gate opening from the fence fill and splits that side into the sections on the left and right. Moving the gate changes those leftover lengths, so you can compare a few positions before you dig the posts.",
    },
    {
      type: "figure",
      src: "/guides/diagrams/gate-opening-and-swing.svg",
      alt: "Plan view of a fence gate showing the clear passage, the opening between gate posts, the swing arc, and the fence sections on both sides.",
      caption:
        "Decide what must pass through, set the post opening from the gate product, then walk the swing path and check the leftover fence on both sides.",
      credit: FIGURE_CREDIT,
    },
    {
      type: "scenario",
      exampleId: "fp-rs-03-gate-position-remainders",
      label: "Open this gate-position example",
    },
  ],
};
