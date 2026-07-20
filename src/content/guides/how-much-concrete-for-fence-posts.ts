import type { Guide } from "./types";

const FIGURE_CREDIT = "Original Fence Planner diagram";

export const howMuchConcreteForFencePosts: Guide = {
  slug: "how-much-concrete-for-fence-posts",
  title: "How Much Concrete Does Each Fence Post Need?",
  description:
    "Estimate concrete from the hole size, the actual post size, and the bag yield printed on the product—not a generic “bags per post” rule.",
  updated: "2026-07-19",
  relatedTool: "/concrete-for-fence-posts-calculator",
  image: "/guides/how-much-concrete-for-fence-posts-v2.webp",
  relatedGuides: [
    "fence-post-spacing-explained",
    "how-to-estimate-fence-waste",
    "fence-permit-and-property-line-checklist",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "Start with the hole size your local requirements and fence system call for, then let the planner estimate the concrete for all matching posts together.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "A deeper or wider hole uses much more concrete. Gate and corner posts may need a different detail from ordinary line posts, and bag yields vary by product.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Separate the posts that will use different hole sizes or footing details.",
        "Measure the actual post cross-section or use the manufacturer’s listed size.",
        "Enter the chosen hole diameter, depth, and the concrete yield printed on the bag.",
        "Add a modest contingency if your holes are likely to vary, then round the project total up to whole bags.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "It gives a transparent starting total for a cylindrical hole. It rounds the entire group rather than needlessly rounding every post into extra bags.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Check before digging",
      text: "The app does not know your frost depth, soil, wind exposure, drainage, gate loads, or local code. Verify those details first; do not use a shallow hole just because rock is encountered.",
    },
    {
      type: "h2",
      text: "How the estimate works",
    },
    {
      type: "p",
      text: "The calculator starts with a round hole volume, subtracts the part of the post that sits in the hole, multiplies by how many posts share that hole size, then divides by the bag yield printed on the product. Whole bags are rounded once for the whole group.",
    },
    {
      type: "figure",
      src: "/guides/diagrams/concrete-hole-volume.png",
      alt: "Cutaway of a square fence post set in a round concrete-filled hole, showing hole width, hole depth, and the concrete around the buried post.",
      caption:
        "Enter the hole size and the real post size, then use the bag yield on the product package to estimate how many bags the matching posts need.",
      credit: FIGURE_CREDIT,
    },
    {
      type: "scenario",
      exampleId: "fp-rs-05-concrete-bag-yield",
      label: "Open this concrete bag-yield example",
    },
  ],
};
