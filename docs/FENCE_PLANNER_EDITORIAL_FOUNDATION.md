# Fence Planner — Editorial Foundation and Content Rebuild Plan

Status: prepared for implementation handoff  
Date: 2026-07-17  
Applies to: Fence Planner tools, guide articles, examples, diagrams, generated outputs, and trust pages

## 1. Correct product context

Fence Planner is a **free fence-planning and materials-estimation tool**. It is not a fence contractor, installer, engineering firm, surveyor, permit office, or utility-locate service.

The site must not invent customer projects, imply that its team installed fences, or use field experience it does not possess. Its defensible original value comes from:

- the planning tool’s calculation logic;
- transparent explanations of that logic;
- reproducible reference scenarios;
- original diagrams and verified screenshots;
- generated layouts, warnings, shopping lists, and comparison outputs;
- authoritative research for safety, manufacturer, and local-rule boundaries;
- explicit limitations and honest uncertainty.

The editorial goal is not to sound like a contractor. It is to become the most transparent and useful explanation of what the free planner calculates, why it calculates it, and what the user must verify outside the tool.

## 2. Editorial promise

Every retained guide should help a reader complete a specific planning decision. A reader should leave with at least one of the following:

- an input they now know how to measure;
- a calculation they can reproduce;
- a visual relationship they can understand;
- an output they can download or print;
- a risk or limitation they know how to verify;
- a preloaded example they can inspect in the live tool.

If a page provides only generic fence advice and does not materially improve use of the tool, it should be merged, converted into a tool state, or removed from the indexable article set.

## 3. What counts as original contribution for Fence Planner

At least one of these should be present on every canonical guide:

1. **Reproducible scenario:** declared inputs, tool state, result, and “Load this example” action.
2. **Transparent calculation:** formula, units, rounding, assumptions, and worked output.
3. **Original interactive visual:** module, joint, gate, slope, concrete, waste, or remainder visualization.
4. **Verified tool output:** screenshot, printable list, plan diagram, or comparison produced by the live application.
5. **Original derived data:** a comparison table generated from controlled planner inputs.
6. **Sourced safety workflow:** official links organized into an actionable process without pretending to replace the authority.

Different wording alone is not an original contribution. A decorative AI image alone is not an original contribution.

## 4. Claims Fence Planner must not make

- Do not claim that the team has built or installed fences unless that later becomes true and can be documented.
- Do not present a hypothetical scenario as a customer project.
- Do not present planner defaults as code, engineering requirements, or universal construction practice.
- Do not present utility marks as precise facility locations or digging permission.
- Do not present a property measurement as a legal boundary.
- Do not present a structure connection as safe without a verified fastening and water-management detail.
- Do not invent retailer prices, product dimensions, bag yields, rack limits, local frost depths, or permit requirements.
- Do not use an “expert reviewed” label unless a real, named reviewer performed that review.

## 5. Provisional canonical content map

This map is editorially recommended but must not be implemented until Cursor completes the route and code inventory in Phase 1.

| Current article | Provisional outcome | Canonical destination or required change |
|---|---|---|
| 1. How to Measure for a New Fence | Keep | Rewrite around proposed-line measurement, temporary markers, obstacles, and a preloaded reference layout |
| 2. How to Calculate Fence Panels and Posts | Keep as flagship | Define measurement basis and module semantics; likely absorb Article 9 |
| 3. Fence Post Spacing Explained | Keep as canonical | Absorb Article 8 and add exact post-count comparisons |
| 4. How Much Concrete Does Each Fence Post Need? | Keep as canonical | Absorb Article 18; add bag-yield and actual-dimension controls |
| 5. How to Plan Fence Corners and End Posts | Keep | Add joint topology and material-specific terminal details |
| 6. How to Measure and Plan a Fence Gate | Keep | Add gate-opening and swing-envelope reference scenario |
| 7. Wood Panels vs Individual Pickets | Keep conditionally | Retain only with a reproducible side-by-side tool comparison |
| 8. Six-Foot vs Eight-Foot Fence Sections | Merge | Redirect to Article 3 after content is absorbed |
| 9. How to Handle an Uneven Final Fence Section | Merge or transform | Prefer absorbing explanation into Article 2; retain only if it becomes a true remainder optimizer |
| 10. How to Plan a Fence on Sloped Ground | Keep | Major technical rewrite; stepped and racked measurement must be separated |
| 11. Privacy Fence Materials Checklist | Keep as tool-backed page | Populate a dynamic printable checklist; absorb general shopping-list content from Article 17 |
| 12. Chain-Link Fence Materials Checklist | Keep | Expand into a complete system diagram and generated checklist |
| 13. Fence Installation Order | Keep conditionally | Rewrite as separate planning sequences by fence system |
| 14. Common Fence-Planning Mistakes | Keep as hub | Convert into an interactive pre-checkout audit that links to canonical guides |
| 15. Fence Permit and Property-Line Checklist | Keep | Add an official-resource worksheet and source dates |
| 16. How to Mark Underground Utilities Before Digging | Keep | Correct the locate workflow and add country/region links and a tolerance-zone visual |
| 17. Fence Project Shopping List | Merge or tool landing | Merge into Articles 11/12 or make this URL the generated-shopping-list landing state |
| 18. Fence Post Depth and Frost Considerations | Merge | Redirect to Article 4 after sourced material is absorbed |
| 19. How to Estimate Fence Waste | Keep conditionally | Retain with transparent category rules, sensitivity output, and stock-length logic |
| 20. How to Plan a Fence Around a House or Existing Structure | Keep | Rewrite with freestanding-post default and strict attachment/service-clearance cautions |

### Redirect rule

Do not delete or redirect any current URL until:

1. Cursor confirms that the route exists and whether it has traffic/backlinks or internal dependencies.
2. The destination article contains the useful source material.
3. Canonical tags, sitemap entries, navigation, related links, and redirects are updated together.
4. The production build and link checks pass.

## 6. Reproducible reference-scenario suite

These scenarios replace the earlier recommendation for a contractor-style case study. They must be clearly labeled as hypothetical planning examples and must be generated by the live tool.

Cursor must first establish the exact measurement and calculation contract. Numerical expected outputs should not be published until that contract is reviewed.

### FP-RS-01 — Straight panel run

**Purpose:** panel-module, endpoint, cut-panel, post-count, and rounding behavior.

Proposed inputs:

- one straight run: 80 ft;
- no gates;
- one panel system with declared panel dimensions;
- declared post cross-section;
- declared module mode;
- two freestanding endpoints.

Required output:

- run measurement basis;
- full panels;
- cut-panel purchase and cut width;
- line and endpoint posts;
- module diagram;
- complete arithmetic;
- tool limitations.

### FP-RS-02 — U-shaped yard

**Purpose:** separate runs, shared corners, structure-side endpoints, gate subtraction, and joined-layout post counting.

Proposed inputs:

- left run: 48 ft;
- rear run: 60 ft;
- right run: 48 ft;
- one 4 ft gate on the left run;
- two rear shared corners;
- two house-side endpoints, represented according to actual tool capabilities.

Required output:

- fill segments;
- gate opening treatment;
- shared corner count;
- endpoint/structure-connection behavior;
- complete material list;
- Plan View screenshot or generated diagram.

### FP-RS-03 — Gate-position remainder comparison

**Purpose:** demonstrate that gate position changes the remainders of the two fill segments on the **same run**, while total gate width and total fill remain constant.

Proposed inputs:

- one 60 ft straight run;
- one 4 ft gate;
- compare at least two gate positions on that run;
- one declared panel/module system.

Required output:

- left and right fill-segment lengths for each position;
- full and cut panels per segment;
- cut widths and short-bay warnings;
- whether total purchased panels changes;
- interactive or side-by-side visual.

### FP-RS-04 — Stepped versus racked slope

**Purpose:** prevent the current article from treating ground-path distance as universal.

Proposed inputs:

- horizontal run: 40 ft;
- rise: 6 ft;
- calculated slope length;
- declared panel width;
- a declared example rack limit sourced from a product, or a user-entered rack limit.

Required output:

- horizontal run, rise, and slope length;
- stepped measurement basis;
- racked/follow-grade measurement basis;
- per-panel step drop or rack demand;
- warning when a product limit is exceeded;
- explicit statement if the current planner does not model slope.

### FP-RS-05 — Concrete and bag yield

**Purpose:** make theoretical concrete volume and purchasing round-up transparent.

Proposed inputs:

- four line posts;
- hole diameter: 12 in;
- hole depth: 36 in;
- actual post cross-section declared separately from nominal label;
- one published bag yield selected explicitly;
- project-level rounding;
- contingency off, then compared with a declared contingency.

Required output:

- cylinder volume;
- displaced post volume;
- net volume per post and project;
- bag calculation using the selected yield;
- difference between per-post and project-level rounding;
- limitations for irregular holes, soil, frost, and post roles.

### FP-RS-06 — Chain-link system layout

**Purpose:** show that a chain-link materials list is a connected system rather than fabric plus generic posts.

Proposed inputs:

- three connected runs totaling 150 ft;
- two corners;
- one 4 ft gate;
- declared line-post spacing;
- declared fabric roll and top-rail stock lengths;
- bottom tension wire or bottom rail selected explicitly.

Required output:

- fabric fill after gate subtraction;
- line and terminal posts by role;
- fabric rolls and splice handling;
- top rail and fittings;
- bottom restraint;
- tension bars/bands, ties, caps, and gate hardware to the extent supported by the current tool;
- unsupported components clearly identified.

## 7. Required label for reference scenarios

Use a notice substantially equivalent to:

> **Hypothetical planning example.** These inputs and results are provided to explain and test Fence Planner. They do not describe a customer project or completed installation. Product requirements, local codes, property boundaries, soil and frost conditions, structural details, and utility locates may change the final plan.

## 8. Content structures by guide type

Avoid forcing every article into one template.

### Calculation guide

Use: decision → measurement contract → formula → reproducible example → interactive output → limitations → sources.

### Planning workflow

Use: objective → inputs to collect → ordered decisions → tool walkthrough → outside-the-tool checks → printable checklist.

### Comparison guide

Use: same declared scenario → option A output → option B output → material/labor implications → decision table → load either option.

### Safety or regulatory guide

Use: boundary of the tool → official process → country/region links → what the user must confirm → tool adaptation → dated sources.

### Checklist/tool page

Use: live/generated checklist first → explanation only where needed → source and assumption panel → print/download.

## 9. Source hierarchy

Use the highest available source tier:

1. Government, municipality, utility-locate authority, or applicable official regulator.
2. Manufacturer installation guide, technical data sheet, or product specification.
3. Recognized industry association or published standard summary.
4. Retailer-hosted manufacturer instructions when the original manufacturer file is unavailable.
5. Secondary editorial sources only for non-critical context, never as the sole support for safety, legal, structural, or calculation claims.

Every product-specific number needs the product name/model or source document and date checked. Every location-dependent rule needs jurisdiction and date checked.

## 10. Authorship and methodology

Use a real accountable author or product owner. “Fence Planner Editorial Team” is acceptable only if it represents a real accountable publishing identity with an About/Methodology page and contact route. Do not invent contractor credentials.

Suggested methodology disclosure:

> This guide was prepared for Fence Planner using documented calculator logic, source research, and AI-assisted drafting. It was reviewed for consistency with the live tool on **[review date]**. Fence Planner provides planning estimates, not surveying, code approval, engineering, product certification, or utility-clearance authorization.

Suggested calculation notice:

> Results depend on the dimensions, measurement basis, product settings, and rounding rules shown with the calculation. Verify product instructions and local requirements before purchasing or digging.

## 11. Content QA requirements

Before any rewritten guide is published:

- every named tool feature exists in production;
- every default matches the current code;
- every example is generated from the current tool or independently reconciled;
- measurement basis is visible;
- units and conversions are correct;
- rounding is explained;
- unsupported capabilities are not implied;
- safety and product claims have appropriate sources;
- the page has a distinct purpose from neighboring guides;
- the reading time is calculated honestly;
- the update date reflects a substantive revision;
- internal links point to the selected canonical pages;
- mobile and print layouts preserve calculation meaning.

## 12. Phased rebuild

### Phase 1 — Code and calculation truth

Cursor inventories the routes, content system, calculation code, defaults, warnings, outputs, and tests. Cursor implements characterization tests for the reference scenarios and reports every mismatch between the code and current articles.

### Phase 2 — Core calculation articles

After Phase 1 results return, rewrite and implement Articles 1–4, 6, 9, 10, 18, and 19 around the verified contract. Apply confirmed merges for Articles 8 and 18 and decide Article 9 from component feasibility.

### Phase 3 — System and safety articles

Rewrite and implement Articles 5, 12, 13, 15, 16, and 20 with sourced technical boundaries and system-specific visuals.

### Phase 4 — Tool-backed checklists and hub

Implement Articles 11, 14, and 17 as generated or interactive experiences. Complete redirects, canonical tags, sitemap changes, and internal linking.

### Phase 5 — Final editorial and AdSense QA

Audit rendered pages, mobile behavior, page-level ad balance, authorship, methodology, citations, structured data, broken links, and consistency with the live calculators.

## 13. Current dependency

Calculation-dependent article rewrites should not start until Cursor completes Phase 1. The existing articles conflict or remain ambiguous on the exact run measurement basis, panel module semantics, endpoint widths, actual versus nominal post dimensions, slope handling, bag yields, waste application, and warning thresholds. The next required artifact is the verified code/calculation report specified in the Cursor handoff.
