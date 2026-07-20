import type { Guide } from "./types";

export const fenceProjectShoppingList: Guide = {
  slug: "fence-project-shopping-list",
  title: "Fence Project Shopping List",
  description:
    "Turn a material estimate into a store-ready list, grouped by the actual fence system and with room to confirm product dimensions and prices.",
  updated: "2026-07-19",
  relatedTool: "/fence-material-calculator",
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
      text: "Bring a list that separates posts, fill, concrete, gates, hardware, tools, and finishing items. Do not substitute a similarly named product without checking its installation dimensions.",
    },
    {
      type: "h2",
      text: "Why it matters",
    },
    {
      type: "p",
      text: "An ungrouped estimate is easy to shop incompletely. A mismatched product can make every quantity on the list wrong.",
    },
    {
      type: "h2",
      text: "Do this first",
    },
    {
      type: "ol",
      items: [
        "Group the cart: posts, fill, rails or top rail, concrete, gates and hardware, then fasteners and finishing items.",
        "Bring the layout diagram and notes on the product dimensions you assumed.",
        "Confirm the product in your hands still matches those dimensions before you buy the full quantity.",
        "Leave room on the list for unit prices and a small, labelled allowance for normal cuts or variation.",
      ],
    },
    {
      type: "h2",
      text: "Use Fence Planner for this part",
    },
    {
      type: "p",
      text: "Start with the estimate, then add the manufacturer-specific components and a small, labelled allowance for normal cuts or variation.",
    },
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
