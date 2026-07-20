import type { Guide } from "./types";

export const fenceInstallationOrder: Guide = {
  slug: "fence-installation-order",
  title: "Fence Installation Order",
  description:
    "Use a safe planning sequence before you start digging, but follow the installation order supplied for your specific fence system.",
  updated: "2026-07-19",
  relatedTool: "/fence-planner",
  relatedGuides: [
    "fence-permit-and-property-line-checklist",
    "mark-underground-utilities-before-digging",
    "fence-project-shopping-list",
    "common-fence-planning-mistakes",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "First confirm the line and utilities. Then set out the posts, install the system as its manufacturer directs, and leave finishing details until the structure is stable.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "Digging before the line is confirmed, or hanging gates on posts that are still moving, is how a weekend project turns into rework.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Confirm the property line, local rules, and any HOA requirements.",
        "Request utility locates and wait for every response.",
        "Walk the printed layout against the real yard and adjust for obstacles.",
        "Mark corners, ends, and gate posts before filling in every line post.",
        "Install the fence system in the order its manufacturer directs, then finish hardware and details.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Treat the final layout and shopping list as a pre-build check, not as installation instructions.",
    },
    {
      type: "h2",
      text: "Check before digging",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Follow the product sequence",
      text: "The planner helps you plan materials and layout. It does not replace manufacturer install order, concrete cure time, or local digging rules. Do not dig until the line and utilities are confirmed.",
    },
  ],
};
