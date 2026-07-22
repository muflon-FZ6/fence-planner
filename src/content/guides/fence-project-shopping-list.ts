import type { Guide } from "./types";

export const fenceProjectShoppingList: Guide = {
  slug: "fence-project-shopping-list",
  title: "Fence Project Shopping List",
  description:
    "Use the planner’s print-ready shopping list as the dynamic artifact, then verify product dimensions and local prices before you buy.",
  updated: "2026-07-21",
  relatedTool: "/fence-planner",
  relatedGuides: [
    "privacy-fence-materials-checklist",
    "chain-link-fence-materials-checklist",
    "how-to-estimate-fence-waste",
    "how-to-calculate-fence-panels-and-posts",
  ],
  body: [
    {
      type: "h2",
      text: "The short answer",
    },
    {
      type: "p",
      text: "Build the estimate in Fence Planner, open the shopping list, and print it. Then confirm the shelf product still matches the dimensions the list assumed. The app does not claim live SKU or inventory accuracy.",
    },
    {
      type: "h2",
      text: "Primary artifact: planner shopping list",
    },
    {
      type: "ol",
      items: [
        "Finish the layout (or load a Scenario Studio example after confirming).",
        "Open Shopping list from the planner tools bar.",
        "Print the list / field sheet and keep it with your readiness notes.",
        "At the store, check face widths, bag yield, mesh height, and hardware against that printout.",
      ],
    },
    {
      type: "p",
      text: "Start in the visual planner when you have a layout, or use the material calculator for a quick length-based estimate, then move into the planner printout for a grouped list.",
    },
    {
      type: "h2",
      text: "Field kit pairing",
    },
    {
      type: "p",
      text: "Pair the shopping list with the Build Readiness Audit so dig/buy stops (boundary, rules, locates) are visible before you load the cart.",
    },
    { type: "readiness_audit_cta" },
    {
      type: "h2",
      text: "Check before buying",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Verify the product, then the quantity",
      text: "If the shelf product installs differently from the settings that produced your list, stop and recalculate. Do not force-fit a different bay size or post size because the name sounds close enough.",
    },
  ],
};
