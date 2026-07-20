import type { Guide } from "./types";

const FIGURE_CREDIT = "Original Fence Planner diagram";

export const fencePostSpacingExplained: Guide = {
  slug: "fence-post-spacing-explained",
  title: "Fence Post Spacing Explained",
  description:
    "See what “six-foot” and “eight-foot” spacing really mean, and why the number includes the posts at both ends.",
  updated: "2026-07-19",
  relatedTool: "/fence-post-calculator",
  image: "/guides/fence-post-spacing-explained-v2.webp",
  relatedGuides: [
    "how-to-calculate-fence-panels-and-posts",
    "plan-fence-corners-and-end-posts",
    "wood-panels-vs-individual-pickets",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "Post spacing is the distance from the middle of one post to the middle of the next. Smaller spacing means more posts, more holes, and usually more support—but follow the chosen fence system’s instructions.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "On a simple 96-foot straight fence, eight-foot spacing uses 13 posts; six-foot spacing uses 17. That is four extra posts and four extra holes before gates or corners are added.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Find the spacing required by the panel, picket, or chain-link system you want.",
        "Mark only the first and last post position on the ground.",
        "Use the planner to compare spacing choices on the same line.",
        "Treat gates, corners, and ends as special locations, not ordinary middle posts.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Compare a few plausible layouts before buying materials. The planner can show the difference in post count and a likely short final section.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Check before buying",
      text: "Fence height, wind exposure, soil, and the specific product can change what is suitable. A common spacing is not a structural rule.",
    },
    {
      type: "h2",
      text: "How the estimate works",
    },
    {
      type: "p",
      text: "Spacing is usually measured on-center: middle of one post to middle of the next. The clear opening between post faces is a little smaller because each post has thickness. Count both end posts, then add a post for each full spacing along the line.",
    },
    {
      type: "figure",
      src: "/guides/diagrams/post-spacing-96-foot-comparison.svg",
      alt: "Two matching 96-foot straight fence lines: one with eight-foot spacing and thirteen posts, the other with six-foot spacing and seventeen posts.",
      caption:
        "Compare spacing choices on the same fence line so you can see how many extra posts and holes the closer spacing adds before you buy.",
      credit: FIGURE_CREDIT,
    },
  ],
};
