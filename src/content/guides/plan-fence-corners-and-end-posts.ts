import type { Guide } from "./types";

const FIGURE_CREDIT = "Original Fence Planner diagram";

export const planFenceCornersAndEndPosts: Guide = {
  slug: "plan-fence-corners-and-end-posts",
  title: "How to Plan Fence Corners, Ends, and Terminal Posts",
  description:
    "Mark each turn, end, and gate before counting posts, so one shared corner does not become two accidental posts.",
  updated: "2026-07-20",
  relatedTool: "/fence-planner",
  image: "/guides/plan-fence-corners-and-end-posts-v2.webp",
  relatedGuides: [
    "how-to-measure-for-a-new-fence",
    "measure-and-plan-a-fence-gate",
    "plan-fence-around-house-or-structure",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "When the fence turns a corner, both directions usually share one post at that turn. Start by marking the unique places where the fence begins, ends, turns, or opens for a gate.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "Counting every line separately can make you buy and dig for duplicate posts. It also hides the places that may need a stronger product-specific assembly.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Draw every fence line until it touches the next one.",
        "Circle each open end, corner, and side of a gate once.",
        "Check whether the fence ends near a house, shed, driveway, or another obstacle.",
        "Choose the fence system before deciding what hardware or bracing a corner needs.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "The planner uses the connected layout to avoid counting one corner twice. Review the marked points before treating the material list as final.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Check before building",
      text: "Wood, vinyl, and chain-link corners are built differently. A wall connection is not automatically a safe substitute for a freestanding end post; use a verified detail for the product and structure.",
    },
    {
      type: "h2",
      text: "How the estimate works",
    },
    {
      type: "p",
      text: "The planner looks at the whole connected layout and counts each unique post location once. A corner shared by two sides is one post. Gate openings, open ends, and places near a house or structure are marked as their own kinds of points so the shopping list does not invent extras.",
    },
    {
      type: "figure",
      src: "/guides/diagrams/fence-joint-topology.png",
      alt: "Simple plan view of fence joints labeled as a middle post, a shared corner, an open end, gate posts, and a place where the fence meets a structure.",
      caption:
        "Mark every unique turn, end, and gate once on your sketch so a shared corner is not counted as two posts.",
      credit: FIGURE_CREDIT,
    },
    {
      type: "scenario",
      exampleId: "fp-rs-02-u-shaped-yard",
      label: "Open this U-shaped yard example",
    },
  ],
};
