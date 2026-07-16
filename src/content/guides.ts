export type Guide = {
  slug: string;
  title: string;
  description: string;
  body: string[];
  relatedTool?: string;
};

export const guides: Guide[] = [
  {
    slug: "how-to-measure-for-a-new-fence",
    title: "How to Measure for a New Fence",
    description: "Measure runs, corners, and gates before you buy materials.",
    relatedTool: "/fence-planner",
    body: [
      "Walk the intended fence line with a tape or measuring wheel. Record each straight run separately rather than only a single total length.",
      "Mark corners, ends, and any house or structure connections. Note gate openings and swing clearance on both sides.",
      "Confirm property lines and setbacks before you dig. Measurements for planning are not a survey.",
      "Enter those run lengths in the Fence Planner so posts and panels fall on the layout you measured.",
    ],
  },
  {
    slug: "how-to-calculate-fence-panels-and-posts",
    title: "How to Calculate Fence Panels and Posts",
    description: "Turn fence length into panels, cut sections, and post counts.",
    relatedTool: "/fence-panel-calculator",
    body: [
      "Subtract gate openings from each run to get fill length — gates are not panels.",
      "Divide each uninterrupted fill segment by your panel module width. Full panels are whole modules; leftovers need a cut panel.",
      "Decide whether your module width is panel-only or includes the post. This setting changes spacing and counts.",
      "Classify posts as line, corner, end, or gate posts, and never double-count shared corner posts.",
    ],
  },
  {
    slug: "fence-post-spacing-explained",
    title: "Fence Post Spacing Explained",
    description: "Why spacing drives rails, panels, and structural feel.",
    relatedTool: "/fence-post-calculator",
    body: [
      "Panel systems often follow an 8-foot bay. Site-built wood may use 6- or 8-foot spacing depending on rails and wind exposure.",
      "Wider spacing means fewer posts but longer rails and more flex. Narrower spacing costs more posts and concrete.",
      "Always check manufacturer guidance for vinyl, metal, and specialty systems.",
      "Use the planner overlays to see where posts land before you buy.",
    ],
  },
  {
    slug: "how-much-concrete-for-fence-posts",
    title: "How Much Concrete Does Each Fence Post Need?",
    description: "Hole volume, post displacement, and bag rounding.",
    relatedTool: "/concrete-for-fence-posts-calculator",
    body: [
      "Estimate hole volume as a cylinder: π × radius² × depth.",
      "Subtract the buried post volume so you do not overbuy concrete.",
      "Multiply by the number of concreted posts, divide by bag yield, and round up to whole bags.",
      "Frost depth and soil conditions vary by location — treat calculator depths as editable assumptions, not code.",
    ],
  },
  {
    slug: "plan-fence-corners-and-end-posts",
    title: "How to Plan Fence Corners and End Posts",
    description: "Shared corners, ends, and structure connections.",
    relatedTool: "/fence-planner",
    body: [
      "A corner joins two runs and usually needs a stronger or larger post than a line post.",
      "End posts terminate a run that does not continue. Structure connections may use brackets on a house wall.",
      "Connected runs share one post at the joint — counting two ends for one corner over-orders materials.",
      "In chain-link systems, corners and ends are often terminal posts with bracing hardware.",
    ],
  },
  {
    slug: "measure-and-plan-a-fence-gate",
    title: "How to Measure and Plan a Fence Gate",
    description: "Gate width, posts, swing, and hardware.",
    relatedTool: "/fence-gate-planner",
    body: [
      "Choose clear opening width for people, mowers, or vehicles. Double gates need a drop rod or cane bolt.",
      "Gate posts are usually heavier. Keep gates a reasonable distance from corners for clearance.",
      "Swing direction matters for walkways, slopes, and obstacles — preview opening in Dream View.",
      "Exclude gate width from panel, picket, or fabric fill calculations.",
    ],
  },
  {
    slug: "wood-panels-vs-individual-pickets",
    title: "Wood Panels vs Individual Pickets",
    description: "When to choose preassembled panels or site-built privacy.",
    relatedTool: "/wood-fence-calculator",
    body: [
      "Preassembled panels install faster and make material counts simpler: full panels plus cut sections.",
      "Site-built picket fences offer more control over gaps, rail count, and board orientation.",
      "Panels may leave an uneven final bay; pickets can absorb leftover length more gradually.",
      "Use the planner’s fence-type switch to compare quantities for the same layout.",
    ],
  },
  {
    slug: "six-foot-vs-eight-foot-fence-sections",
    title: "Six-Foot vs Eight-Foot Fence Sections",
    description: "How bay size changes posts, panels, and waste.",
    relatedTool: "/fence-panel-calculator",
    body: [
      "Eight-foot sections are common for privacy panels. Six-foot bays appear in some wood and specialty systems.",
      "Shorter bays usually mean more posts and concrete for the same total length.",
      "If your total length is not a multiple of the bay, you will need a cut panel or adjusted spacing.",
      "Try both module widths in the calculator and compare cut-panel warnings.",
    ],
  },
  {
    slug: "handle-uneven-final-fence-section",
    title: "How to Handle an Uneven Final Fence Section",
    description: "Cut panels, redistribute length, or change spacing.",
    relatedTool: "/fence-planner",
    body: [
      "An uneven remainder is normal. Buying one extra panel to cut is the usual fix for panel systems.",
      "Very short remainders look awkward and waste material — consider moving a gate or adjusting bay width.",
      "Some builders redistribute small differences across multiple bays when the system allows.",
      "The planner flags short final sections so you can decide before you shop.",
    ],
  },
  {
    slug: "plan-fence-on-sloped-ground",
    title: "How to Plan a Fence on Sloped Ground",
    description: "Stepped vs racked approaches at a planning level.",
    relatedTool: "/guides",
    body: [
      "Stepped fences keep panels level with stepped tops following the grade. Racked fences follow the slope.",
      "Slope affects post height, panel choice, and installation order — not just total length.",
      "This planner estimates flat-run materials. For steep grades, verify product racking limits and local practice.",
      "Measure along the ground (slope distance) for material length when that matches how you will install.",
    ],
  },
  {
    slug: "privacy-fence-materials-checklist",
    title: "Privacy Fence Materials Checklist",
    description: "Posts, panels or pickets, rails, concrete, and hardware.",
    relatedTool: "/privacy-fence-calculator",
    body: [
      "Posts by type: line, corner, end, and gate.",
      "Panels or pickets plus rails for site-built systems.",
      "Concrete bags, gate hinges, latches, and fastener allowance.",
      "Print the planner materials list and fill in store prices on site.",
    ],
  },
  {
    slug: "chain-link-fence-materials-checklist",
    title: "Chain-Link Fence Materials Checklist",
    description: "Fabric, terminals, top rail, ties, and bracing.",
    relatedTool: "/chain-link-fence-calculator",
    body: [
      "Fabric rolls rounded up from fill length after gates.",
      "Line posts on spacing; terminal posts at ends, corners, and gates.",
      "Top rail sections, ties, tension bars, and brace bands.",
      "Edit roll and rail lengths in settings to match the products you buy.",
    ],
  },
  {
    slug: "fence-installation-order",
    title: "Fence Installation Order",
    description: "A practical sequence from layout to gates.",
    relatedTool: "/fence-planner",
    body: [
      "Confirm layout, utilities, and permits before digging.",
      "Set terminal and corner posts first, then line posts, then rails or panels.",
      "Hang gates after adjacent posts are solid and aligned.",
      "Use your printed plan as a field checklist, not as engineering advice.",
    ],
  },
  {
    slug: "common-fence-planning-mistakes",
    title: "Common Fence-Planning Mistakes",
    description: "Double-counted posts, forgotten gates, and ignored remainders.",
    relatedTool: "/fence-planner",
    body: [
      "Counting two posts at every corner instead of one shared post.",
      "Forgetting to subtract gate openings from panel or fabric length.",
      "Ignoring a tiny final section until materials are already purchased.",
      "Treating calculator defaults as building code or survey truth.",
    ],
  },
  {
    slug: "fence-permit-and-property-line-checklist",
    title: "Fence Permit and Property-Line Checklist",
    description: "Planning reminders before you dig.",
    relatedTool: "/about",
    body: [
      "Verify property boundaries with a survey or authoritative markers when needed.",
      "Check local height limits, setbacks, and permit requirements.",
      "HOA or neighborhood rules may add style and height constraints.",
      "This site does not look up permits by address — confirm with local authorities.",
    ],
  },
  {
    slug: "mark-underground-utilities-before-digging",
    title: "How to Mark Underground Utilities Before Digging",
    description: "Safety first for every post hole.",
    relatedTool: "/guides",
    body: [
      "Contact your regional utility-marking service before excavation.",
      "Wait for marks and respect clearance around buried lines.",
      "Post-hole locations from a planner are estimates — adjust in the field for safety.",
      "Never treat a web calculator as clearance approval.",
    ],
  },
  {
    slug: "fence-project-shopping-list",
    title: "Fence Project Shopping List",
    description: "Turn a plan into a store-ready list.",
    relatedTool: "/fence-material-calculator",
    body: [
      "Group items: posts, infill, rails/fabric, concrete, gates, hardware, fasteners.",
      "Leave blank price columns on the printout for in-store totals.",
      "Bring your layout diagram so staff can help match panel systems.",
      "Re-check actual product widths against your module settings before checkout.",
    ],
  },
  {
    slug: "fence-post-depth-and-frost",
    title: "Fence Post Depth and Frost Considerations",
    description: "Why hole depth is local, not universal.",
    relatedTool: "/concrete-for-fence-posts-calculator",
    body: [
      "Frost lines vary widely. Deep freeze areas often need deeper footings.",
      "Soil type, wind exposure, and fence height also influence post setting.",
      "Edit hole depth in the calculator; defaults are starting points only.",
      "Ask local suppliers or inspectors when conditions are uncertain.",
    ],
  },
  {
    slug: "how-to-estimate-fence-waste",
    title: "How to Estimate Fence Waste",
    description: "Apply waste intentionally — not silently to every item.",
    relatedTool: "/fence-calculator",
    body: [
      "Pickets and rails often need a waste percentage for cuts and defects.",
      "Panels may not need percentage waste if you already count cut panels to buy.",
      "Gate hardware usually should not get a waste percentage.",
      "Keep waste visible and editable so your list stays honest.",
    ],
  },
  {
    slug: "plan-fence-around-house-or-structure",
    title: "How to Plan a Fence Around a House or Existing Structure",
    description: "Structure connections, returns, and gates near buildings.",
    relatedTool: "/fence-planner",
    body: [
      "Mark structure-connected ends separately — they may use brackets instead of freestanding posts.",
      "Leave clearance for siding, downspouts, AC units, and door swings.",
      "Side-yard returns are often short L-shapes with one gate.",
      "Use the side-yard preset, then edit lengths to match your measurements.",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
