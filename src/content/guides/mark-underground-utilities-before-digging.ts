import type { Guide } from "./types";

export const markUndergroundUtilitiesBeforeDigging: Guide = {
  slug: "mark-underground-utilities-before-digging",
  title: "How to Mark Underground Utilities Before Digging",
  description:
    "Request utility locates before every post hole, wait for responses, and remember private lines may not be marked.",
  updated: "2026-07-21",
  relatedTool: "/build-readiness",
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
      text: "Do not dig from a planner diagram alone. Request the locate service that covers your area, wait for every response, and follow that authority’s instructions. Public marks are not a complete picture of private lines on your property.",
    },
    {
      type: "h2",
      text: "Public locate vs private lines",
    },
    {
      type: "p",
      text: "A public locate notifies member utilities so they can mark their facilities. Irrigation, landscape lighting, private water lines, and other owner-installed services are often outside that ticket. Walk the dig line for private risks separately — this guide does not invent a universal tolerance distance.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Contact the locate service that covers your dig site (US: 811 / call811.com; Canada: your provincial one-call via Click Before You Dig).",
        "Provide the dig location and timing accurately.",
        "Wait for every utility response and read the paperwork.",
        "Walk the marks on site and treat each one as a safety boundary.",
        "Check for private-line risks the ticket may not cover.",
        "Move any conflicting post, gate, or bay before you dig.",
      ],
    },
    {
      type: "h2",
      text: "Build Readiness Audit",
    },
    {
      type: "p",
      text: "Mark locate status and private-line checks on the printable field kit before you buy concrete or dig.",
    },
    { type: "readiness_audit_cta" },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Adjust the proposed layout when a confirmed utility or required clearance affects a post location. Never assume a small on-screen shift makes digging safe.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "A planner is not digging permission",
      text: "Fence Planner can suggest post locations. It cannot see buried utilities. Always request a current locate, wait for marks, and follow the locating authority’s instructions.",
    },
    {
      type: "sources",
      title: "Official locate portals",
      sources: [
        {
          title: "Call 811 — Know what’s below",
          organization: "Common Ground Alliance / 811",
          href: "https://call811.com/",
          checked: "2026-07-21",
          note: "US entry point for calling or clicking before you dig; local one-call centers vary by state.",
        },
        {
          title: "Click Before You Dig",
          organization: "Canadian one-window locate portal",
          href: "https://www.clickbeforeyoudig.com/",
          checked: "2026-07-21",
          note: "Canada does not use a single national 811 number everywhere — use the provincial/territorial service linked from this portal.",
        },
      ],
    },
  ],
};
