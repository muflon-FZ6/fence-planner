import type { Guide } from "./types";

export const fencePermitAndPropertyLineChecklist: Guide = {
  slug: "fence-permit-and-property-line-checklist",
  title: "Fence Permit and Property-Line Checklist",
  description:
    "Record a trusted boundary source and the official rule pages you used — with links and dates — before the layout becomes a purchase.",
  updated: "2026-07-21",
  relatedTool: "/build-readiness",
  relatedGuides: [
    "mark-underground-utilities-before-digging",
    "how-to-measure-for-a-new-fence",
    "common-fence-planning-mistakes",
    "plan-fence-around-house-or-structure",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "Do this before you shop. Write down the boundary source you trust and the official municipal or HOA pages you checked, including the date. A well-calculated fence can still be wrong if it is in the wrong place or the wrong height.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "Boundary and permit mistakes create neighbor disputes, forced moves, and wasted concrete. This site does not state setback distances or height limits for your city — those come from the authorities that govern your property.",
    },
    {
      type: "h2",
      text: "Record an official research note",
    },
    {
      type: "ol",
      items: [
        "Name the boundary source (survey, pins, or other authoritative record) and where you keep it.",
        "Open the official municipal / HOA rule source for each frontage that matters.",
        "Copy the URL (or document title) and write the date you checked it.",
        "Note height, setback, permit, easement, and covenant questions still unanswered.",
        "Save that note with your printed layout and shopping list.",
      ],
    },
    {
      type: "h2",
      text: "Build Readiness Audit",
    },
    {
      type: "p",
      text: "Use the printable audit to mark whether boundary and official-rule items are Ready, still need Verify, or should Stop before digging or buying. Answers stay in your browser.",
    },
    { type: "readiness_audit_cta", label: "Open Build Readiness Audit" },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Use the planner after you know the limits of the buildable area. It estimates a layout; it cannot approve a property line or permit.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "This site does not approve your fence line",
      text: "Fence Planner helps you design and estimate. It does not replace a survey, municipal research, or HOA review. Confirm requirements with the authorities that govern your property before you buy or dig.",
    },
    {
      type: "sources",
      title: "Process guidance (not local legal rules)",
      sources: [
        {
          title: "About Fence Planner — what we are not",
          organization: "Fence Planner / DoubleM",
          href: "https://fenceblueprint.com/about",
          checked: "2026-07-21",
          note: "Publisher page stating we are not a permit authority or surveyor.",
        },
        {
          title: "Methodology",
          organization: "Fence Planner / DoubleM",
          href: "https://fenceblueprint.com/methodology",
          checked: "2026-07-21",
          note: "How estimates and guides are prepared; corrections path.",
        },
      ],
    },
  ],
};
