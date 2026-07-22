import type { Guide } from "./types";

export const fenceInstallationOrder: Guide = {
  slug: "fence-installation-order",
  title: "Fence Installation Order",
  description:
    "Use a safe planning sequence before digging, then follow system-specific product instructions for panels, site-built wood, or chain-link.",
  updated: "2026-07-21",
  relatedTool: "/build-readiness",
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
      text: "Confirm line and utilities first. Then set out posts and install in the order your product manual requires. Fence Planner is a planning aid, not an install manual.",
    },
    {
      type: "h2",
      text: "Shared planning sequence",
    },
    {
      type: "ol",
      items: [
        "Confirm property line, local rules, and HOA requirements — record links and dates.",
        "Request utility locates and wait for every response; check private-line risks.",
        "Walk the printed layout against the yard; adjust for obstacles and grade notes.",
        "Mark corners, ends, and gate posts before filling every line post.",
        "Open the current installation instructions for the system you will buy and treat them as the checkpoint.",
      ],
    },
    {
      type: "h2",
      text: "System-specific planning notes",
    },
    {
      type: "h3",
      text: "Preassembled panels",
    },
    {
      type: "p",
      text: "Confirm module width, post face, and rack/step limits in the panel instructions before locking bay counts. Hang panels only after posts are set as the manufacturer directs.",
    },
    {
      type: "h3",
      text: "Site-built wood",
    },
    {
      type: "p",
      text: "Confirm post, rail, and board product dimensions against your estimate. Follow the lumber and fastener guidance that ships with or is published for those products.",
    },
    {
      type: "h3",
      text: "Chain-link",
    },
    {
      type: "p",
      text: "Terminals, bracing, fabric, and rail follow chain-link system instructions — not wood-panel sequences. Confirm fittings against the mesh and post products on your list.",
    },
    {
      type: "h2",
      text: "Checkpoint: follow your product manual",
    },
    {
      type: "p",
      text: "Print or save the current install PDF/web page for the exact SKU. Add the document title and date to your Build Readiness notes before digging.",
    },
    { type: "readiness_audit_cta" },
    {
      type: "callout",
      tone: "warn",
      title: "Planner ≠ install order",
      text: "The planner helps with materials and layout. It does not replace manufacturer install order, concrete cure time, or local digging rules.",
    },
  ],
};
