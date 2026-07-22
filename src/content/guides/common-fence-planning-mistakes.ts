import type { Guide } from "./types";

export const commonFencePlanningMistakes: Guide = {
  slug: "common-fence-planning-mistakes",
  title: "Common Fence-Planning Mistakes",
  description:
    "A short diagnostic hub: route each expensive mistake to the audit, the right guide, or the Scenario Studio — without repeating full articles.",
  updated: "2026-07-21",
  relatedTool: "/build-readiness",
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
      text: "Most avoidable fence mistakes happen before the first hole. Use this hub to jump to the checklist, guide, or worked scenario that matches the problem.",
    },
    {
      type: "h2",
      text: "Start with the field kit",
    },
    {
      type: "p",
      text: "If boundary, rules, locates, gates, or product checks are still fuzzy, run the Build Readiness Audit and print the result before you buy.",
    },
    { type: "readiness_audit_cta" },
    {
      type: "h2",
      text: "Diagnostic routes",
    },
    {
      type: "ul",
      items: [
        "One perimeter total instead of separate runs → How to Measure for a New Fence",
        "Unclear last bay / cut panel → How to Calculate Fence Panels and Posts + Scenario Studio straight 80 ft run",
        "Double-counted corners → Plan Fence Corners and End Posts + U-shaped yard scenario",
        "Gate leftover confusion → Measure and Plan a Fence Gate + gate-position scenario",
        "Unverified boundary or permit notes → Fence Permit and Property-Line Checklist",
        "Digging without locates → Mark Underground Utilities Before Digging",
        "Slope undecided → Plan a Fence on Sloped Ground (lab; not a planner fixture)",
      ],
    },
    {
      type: "h2",
      text: "Open a tested scenario",
    },
    {
      type: "p",
      text: "Scenario Studio pages show calculator outputs from the same fixtures the planner can load after confirmation.",
    },
    {
      type: "p",
      text: "Browse /examples for straight panel, U-yard, gate position, concrete yield, and chain-link layouts.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Paper mistakes are cheap; concrete mistakes are not",
      text: "Do not order materials from a single total length, an unverified boundary, or a layout that still has an unexplained short section.",
    },
  ],
};
