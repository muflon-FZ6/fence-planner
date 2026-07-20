import type { Guide } from "./types";

export const markUndergroundUtilitiesBeforeDigging: Guide = {
  slug: "mark-underground-utilities-before-digging",
  title: "How to Mark Underground Utilities Before Digging",
  description:
    "Request utility locates before every post hole, read the paperwork, and treat every mark as a safety boundary—not a hint.",
  updated: "2026-07-19",
  relatedTool: "/fence-planner",
  relatedGuides: [
    "fence-permit-and-property-line-checklist",
    "fence-installation-order",
    "how-to-measure-for-a-new-fence",
    "common-fence-planning-mistakes",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "Do not dig from a planner diagram alone. Request the required utility locate, wait for every response, and follow the locating authority’s instructions.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "Gas, electric, communications, and water lines do not care that your post spacing looked perfect on screen. Hitting a buried line can injure people and stop the project immediately.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Contact the locate service that covers your area before any digging.",
        "Provide the dig location and timing accurately.",
        "Wait for every utility response and read the paperwork.",
        "Walk the marks on site and treat each one as a safety boundary.",
        "Move any conflicting post, gate, or bay before you dig.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Adjust the proposed layout when a confirmed utility or required clearance affects a post location. Never assume a small shift makes digging safe.",
    },
    {
      type: "h2",
      text: "Check before digging",
    },
    {
      type: "callout",
      tone: "warn",
      title: "A planner is not digging permission",
      text: "Fence Planner can suggest post locations. It cannot see buried utilities. Always request a current locate, wait for marks, and follow the locating authority’s instructions. Private lines such as irrigation or yard lighting may not be marked.",
    },
  ],
};
