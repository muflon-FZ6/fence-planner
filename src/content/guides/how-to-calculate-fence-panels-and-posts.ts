import type { Guide } from "./types";

const FIGURE_CREDIT = "Original Fence Planner diagram";

export const howToCalculateFencePanelsAndPosts: Guide = {
  slug: "how-to-calculate-fence-panels-and-posts",
  title: "How to Calculate Fence Panels and Posts",
  description:
    "Turn your yard measurements into a sensible first count of panels and posts—then spot the awkward short section before you shop.",
  updated: "2026-07-19",
  relatedTool: "/fence-panel-calculator",
  image: "/guides/how-to-calculate-fence-panels-and-posts-v2.webp",
  relatedGuides: [
    "how-to-measure-for-a-new-fence",
    "fence-post-spacing-explained",
    "measure-and-plan-a-fence-gate",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "Count each straight stretch separately. The planner can estimate the panels and posts, but the last section may need a cut panel or a small layout change.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "An 80-foot fence is rarely just “ten eight-foot panels.” Posts take space, gates split a line in two, and corners are shared by both directions.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Choose the fence system you are actually considering and find its installation sheet.",
        "Add each straight side of your plan separately; place the gate where it will really go.",
        "Enter the panel or post-to-post measurement exactly as the product instructions describe it.",
        "Look for the final short section. It is normal; it is where a panel may need trimming or the gate position may be worth moving.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "It estimates whole panels to buy and shows where the partial section lands. It is a shopping estimate, not a cut list.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Check before buying",
      text: "Confirm actual panel width, post width, bracket clearance, and cut instructions with the product you choose. Do not cut a panel based only on an estimate.",
    },
    {
      type: "h2",
      text: "How the estimate works",
    },
    {
      type: "p",
      text: "The planner divides each stretch of fence between posts into repeating modules. A module is usually the panel width plus the post thickness, or the full post-to-post spacing your product lists. The leftover short section at the end still needs a whole stock panel for shopping, then a field cut after you confirm the real opening.",
    },
    {
      type: "figure",
      src: "/guides/diagrams/panel-pitch-vs-clear-space.svg",
      alt: "Side-by-side fence bays showing the distance from the middle of one post to the next compared with the clear space left for a panel between the post faces.",
      caption:
        "Use the post-to-post spacing to place posts, then check the clear space between post faces before you decide how to cut a short final panel.",
      credit: FIGURE_CREDIT,
    },
    {
      type: "formula",
      title: "Panel count for one gate-free segment",
      inputs: [
        "Length of the fence stretch with no gate in it",
        "Module size (panel width plus post, or the product’s post-to-post spacing)",
      ],
      steps: [
        "Divide the segment length by the module size.",
        "Round up to the next whole number whenever there is any leftover length.",
      ],
      rounding:
        "Buy whole stock panels. A short leftover still counts as one panel to purchase.",
      result: "Panels to buy = ceil(segment length ÷ module size)",
    },
    {
      type: "scenario",
      exampleId: "fp-rs-01-straight-panel-run",
      label: "Open this straight panel-run example",
    },
    {
      type: "scenario",
      exampleId: "fp-rs-03-gate-position-remainders",
      label: "Open this gate-position example",
    },
    {
      type: "panel_module_explorer",
      defaultRunLength: 960,
      defaultEnteredWidth: 96,
      defaultPostFace: 4,
      defaultMode: "panel_only",
    },
  ],
};
