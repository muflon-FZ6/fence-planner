import type { ReferenceScenarioId } from "@/domain/referenceScenarios";

export type ScenarioStudioEntry = {
  id: ReferenceScenarioId;
  slug: string;
  title: string;
  description: string;
  question: string;
  heroAlt: string;
  assumptions: string[];
  whatItShows: string[];
  whatItMeans: string[];
  limitations: string[];
  relatedGuides: string[];
  updated: string;
};

/**
 * Public Scenario Studio registry. Material counts are never stored here —
 * they are derived via buildScenarioStudioSummary(entry.id).
 */
export const scenarioStudioEntries: ScenarioStudioEntry[] = [
  {
    id: "fp-rs-01-straight-panel-run",
    slug: "straight-80-foot-panel-run",
    title: "Straight 80-foot panel run",
    description:
      "See how an 80 ft panel run produces full modules, a final bay, and boundary posts from the shared calculator.",
    question:
      "If my backyard run is 80 feet with 8-foot panels, how many panels and posts does the calculator buy?",
    heroAlt:
      "Top-down plan of a straight eighty-foot fence run with posts marked along the line",
    assumptions: [
      "Single straight run, 80 ft centerline length",
      "Panel fence system with panel-only module (8 ft panel + 4 in post face)",
      "Default hole and concrete bag-yield settings",
      "No gates on the run",
    ],
    whatItShows: [
      "Repeating panel pitch along one run",
      "A final bay that is not a full module (cut panel purchase)",
      "End posts plus line posts at module spacing, including the last full-module boundary",
    ],
    whatItMeans: [
      "Panel purchases come from full modules plus any remainder bay that still needs a panel to buy.",
      "Post count is driven by module spacing and ends — not by guessing one post every eight feet of tape measure alone.",
      "Concrete bags follow freestanding posts and editable hole/yield assumptions — change those before treating the bag count as shopping truth.",
    ],
    limitations: [
      "This is a hypothetical planning example, not a surveyed property or completed install.",
      "It does not model slope, frost depth, curves, or product-specific clearance beyond the calculator’s clear-space check.",
      "Store SKUs and live inventory are outside the estimate.",
    ],
    relatedGuides: [
      "how-to-calculate-fence-panels-and-posts",
      "fence-post-spacing-explained",
      "how-to-estimate-fence-waste",
      "how-much-concrete-for-fence-posts",
    ],
    updated: "2026-07-21",
  },
  {
    id: "fp-rs-02-u-shaped-yard",
    slug: "u-shaped-yard-with-gate",
    title: "U-shaped yard with a gate",
    description:
      "Shared corners, structure connections, and a gate that removes fill from the panel/board count.",
    question:
      "How do shared corners and a walk gate change posts and fill length on a three-sided backyard?",
    heroAlt:
      "Top-down U-shaped fence plan with two corners, structure ends, and a labelled gate opening",
    assumptions: [
      "U-shaped layout: two sides and a back run sized to the fixture",
      "Panel system with a single walk gate on one run",
      "Two joints connect to a structure (not concreted in the estimate)",
      "Shared corner posts are counted once",
    ],
    whatItShows: [
      "Corner posts shared between runs",
      "Structure endpoints excluded from concrete",
      "Gate-separated fill so opening width is not bought as fence fill",
    ],
    whatItMeans: [
      "Corners are one post each — the calculator must not double-count shared joints.",
      "Gate width leaves the fill length; gate hardware is separate from panels or boards.",
      "Structure connections change concrete and post roles even when the drawn length looks continuous.",
    ],
    limitations: [
      "Hypothetical example only — not a customer yard survey.",
      "Does not decide hinge side, swing direction clearances, or HOA design rules.",
      "Slope and grade changes along the U are not modeled.",
    ],
    relatedGuides: [
      "how-to-measure-for-a-new-fence",
      "plan-fence-corners-and-end-posts",
      "measure-and-plan-a-fence-gate",
      "plan-fence-around-house-or-structure",
    ],
    updated: "2026-07-21",
  },
  {
    id: "fp-rs-03-gate-position-remainders",
    slug: "gate-position-and-final-bay",
    title: "Gate position and the final bay",
    description:
      "Moving a 4 ft gate on the same 60 ft run keeps total fill constant while the two fill segments change.",
    question:
      "Why does sliding a gate along one run change the leftover panel bays on each side?",
    heroAlt:
      "Top-down straight fence run with a dashed gate opening offset from one end",
    assumptions: [
      "One 60 ft straight run",
      "One 4 ft single gate (default fixture offset 10 ft from run start)",
      "Panel system with the same module as other panel fixtures",
      "Same total fill length when the gate moves; segment lengths change",
    ],
    whatItShows: [
      "Fill split into segments on either side of the gate",
      "Total fill staying constant when only gate offset changes",
      "Why final-bay remainders can differ by segment even when purchases look similar overall",
    ],
    whatItMeans: [
      "Gate location is a layout decision — not only a hardware SKU.",
      "Remainder bays are computed per fill segment after the opening is removed.",
      "Open the planner example to try another offset and watch both sides update together.",
    ],
    limitations: [
      "Does not prove swing clearance past obstacles or code-required gate widths.",
      "Does not auto-optimize “best” gate placement for you.",
      "Hypothetical inputs only.",
    ],
    relatedGuides: [
      "measure-and-plan-a-fence-gate",
      "how-to-calculate-fence-panels-and-posts",
      "fence-post-spacing-explained",
      "common-fence-planning-mistakes",
    ],
    updated: "2026-07-21",
  },
  {
    id: "fp-rs-05-concrete-bag-yield",
    slug: "four-post-concrete-bag-yield",
    title: "Four-post concrete bag yield",
    description:
      "Hole volume, project-level bag rounding, and why bag yield is an editable assumption — not a brand promise.",
    question:
      "How many concrete bags does the calculator buy for a short run of freestanding posts?",
    heroAlt:
      "Top-down short fence run highlighting four posts that need concrete",
    assumptions: [
      "Short post run sized to the FP-RS-05 fixture",
      "Default hole diameter/depth and bag-yield settings from the project",
      "Structure posts (if any) are excluded from concrete",
      "Bags are rounded at the project level after summing hole volume",
    ],
    whatItShows: [
      "Concrete tied to freestanding posts, not every drawn point",
      "Project-level rounding of bag count",
      "How changing yield or hole size would change the shopping number",
    ],
    whatItMeans: [
      "Bag yield is an assumption you can edit — verify against the bag label you will buy.",
      "Hole size drives volume more than “rules of thumb” on social media.",
      "Use the dedicated concrete calculator when you only need bags, not a full layout.",
    ],
    limitations: [
      "Does not look up frost-line depth by ZIP code.",
      "Does not certify structural post embedment for wind or soil type.",
      "Not a retailer quote for a named concrete brand.",
    ],
    relatedGuides: [
      "how-much-concrete-for-fence-posts",
      "fence-post-spacing-explained",
      "mark-underground-utilities-before-digging",
      "fence-project-shopping-list",
    ],
    updated: "2026-07-21",
  },
  {
    id: "fp-rs-06-chain-link-system",
    slug: "chain-link-system-layout",
    title: "Chain-link system layout",
    description:
      "Terminals, fabric rolls, top rail, and the calculator’s chain-link boundary on a long connected layout.",
    question:
      "What materials does the chain-link path estimate for a long connected run with one gate?",
    heroAlt:
      "Top-down chain-link fence plan with terminal posts and a gate opening marked",
    assumptions: [
      "Connected runs totaling 150 ft as in the FP-RS-06 fixture",
      "Chain-link fence type with default roll and rail settings",
      "One gate on the layout",
      "Terminal / end roles follow the joint model",
    ],
    whatItShows: [
      "Fabric length and roll rounding",
      "Top-rail section count from settings",
      "Terminal and gate post roles distinct from wood-panel line posts",
    ],
    whatItMeans: [
      "Chain-link shopping lines differ from wood panel lines — fabric and rail replace boards.",
      "Terminal hardware and bracing are allowances, not a full installer kit list.",
      "Always confirm mesh height, gauge, and fittings against the product you will buy.",
    ],
    limitations: [
      "Does not design wind bracing, tension bars, or local code fittings in detail.",
      "Does not price live retailer SKUs.",
      "Hypothetical connected layout — not a surveyed boundary.",
    ],
    relatedGuides: [
      "chain-link-fence-materials-checklist",
      "how-to-measure-for-a-new-fence",
      "measure-and-plan-a-fence-gate",
      "fence-project-shopping-list",
    ],
    updated: "2026-07-21",
  },
];

export function getScenarioStudioEntry(
  slug: string,
): ScenarioStudioEntry | undefined {
  return scenarioStudioEntries.find((e) => e.slug === slug);
}

export function getScenarioStudioEntryById(
  id: ReferenceScenarioId,
): ScenarioStudioEntry | undefined {
  return scenarioStudioEntries.find((e) => e.id === id);
}
