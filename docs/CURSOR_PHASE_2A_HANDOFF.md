# Cursor Handoff — Phase 2A: Align the Product Before Rewriting the Guides

## Instruction to Cursor

Work directly in the Fence Planner repository. Phase 1 is accepted. This phase corrects the live calculator contract, makes important assumptions visible, and builds the publishing components needed for evidence-backed guide rewrites.

Fence Planner is a free planning and materials-estimation tool. It is not a fence installer, engineer, surveyor, permit authority, utility-locate service, or product manufacturer. Do not create a contractor case study or imply completed-project experience.

Read and follow all repository instructions, including `AGENTS.md` and the relevant Next.js 16 documentation in `node_modules/next/dist/docs` before changing Next.js files.

Primary inputs:

- `docs/fence-guide-phase-1-report.md`
- `docs/fence-planner-calculation-contract.md`
- `docs/fence-guide-claim-matrix.md`
- `docs/fence-guide-route-inventory.md`
- `src/calc/fixtures/referenceScenarios.ts`
- `src/calc/referenceScenarios.test.ts`
- Codex deliverable `PHASE_1_REVIEW_AND_PRODUCT_DECISIONS.md`

Do not rewrite all 20 articles and do not apply article redirects in Phase 2A.

## Phase 2A acceptance outcome

At completion, the live interface and methodology must agree with the tested calculations. A guide author must be able to add official sources, tables, captioned original visuals, related-guide links, and a reproducible reference-scenario action without inventing one-off React markup.

## Task 1 — Correct the cut-bay boundary-post defect

### Required behavior

For each panel fill segment, every purchased panel bay must have a post boundary at both ends. If the segment has a cut remainder greater than the existing epsilon, place a post at the final full-module boundary before that cut bay.

For FP-RS-01:

- run: 960 in;
- module: 100 in;
- panel result: 9 full panels + one 60 in cut panel = 10 panels to buy;
- post result after correction: 2 end + 9 line = **11 total posts**;
- the added line post is at 900 in.

Do not change the validated panel purchase result.

### Required tests

Replace the observational/todo assertions with construction-correct assertions. Add regression coverage for at least:

1. 960 in / 100 in module with a 60 in remainder → nine internal boundaries and eleven total posts on an isolated run;
2. an exact multiple → no extra phantom boundary after the final full panel;
3. a remainder at or below the existing epsilon → no cut bay and no extra boundary;
4. a fill segment shorter than one module;
5. a gate splitting a run into two fill segments, including a remainder on one or both sides;
6. deduplication/role priority where a calculated boundary coincides with a gate, corner, end, or terminal post;
7. downstream concrete and material quantities that change because of the corrected post total.

The persisted project contains geometry/settings rather than authoritative calculated quantities, so this should recalculate saved projects without a schema migration. Confirm this in the completion report and identify any contrary persistence path if found.

## Task 2 — Make the measurement contract visible

### Run length

Use the user-facing meaning:

> Plan run length — measured along the proposed fence centerline between endpoint markers.

Add concise help text beside the editable run length and repeat the definition in methodology. Do not call it a survey boundary or outside-to-outside installed dimension.

### Gate width

Use the label:

> Planned gate opening width

Explain that this width is removed from fence fill. Do not label it leaf width, kit width, rough opening, or guaranteed finished clear passage. Replace current product copy that calls the model value “clear width” or “clear opening” where that wording promises more precision than the model provides.

### Panel width and module basis

For panel projects, stop presenting `panelWidth` itself as on-center post spacing under the default `panel_only` mode.

Expose the two existing modes using plain language while preserving their stored enum values:

- `panel_only`: entered width is the panel itself; calculated pitch is panel width plus post face;
- `includes_post`: entered width is already the complete repeating module/pitch.

Show the resulting calculated pitch next to the control. Example: “96 in panel + 4 in post = 100 in calculated pitch.”

For site-built wood and chain link, continue to label `postSpacing` as on-center spacing. Ensure panel, post, and preview labels do not contradict material-engine assumptions.

Do not silently change the default module mode or default dimensions in this phase. If Cursor discovers a separate objective reason the default is invalid, document it as a new product decision rather than changing it incidentally.

## Task 3 — Make concrete assumptions genuinely editable

The current `/concrete-for-fence-posts-calculator` route is a thin `ToolPage` even though its copy promises editable hole depth and bag yield. Correct this by building a working calculator using the same pure calculation logic as the planner.

### Required inputs

- number of concreted posts;
- hole diameter;
- hole depth;
- actual square post face/cross-section;
- concrete yield per bag;
- optional contingency/waste, clearly off by default if that remains the product rule;
- imperial/metric display.

### Required output

- cylindrical hole volume;
- displaced buried-post volume;
- net concrete volume per post;
- total net project volume;
- exact bags before rounding;
- whole bags to purchase after **one project-level ceiling**;
- a plain explanation of which values are assumptions.

The default 0.33 ft³ is a planning value, not a universal “50 lb bag” fact. Label it “planning default” and tell the user to enter the yield printed on the selected product. Do not name a brand or bag weight without a product source.

Expose the same hole diameter, hole depth, actual post face, and bag-yield settings in the full planner before the shopping list is calculated. Reuse components/helpers where reasonable; do not create a second formula.

Correct `/methodology` and all tool-page bullets so “editable” means a control the user can actually access.

### Required tests

- retain FP-RS-05: 4 posts, 12 in holes, 36 in depth, 4 in square face, 0.33 ft³ yield → 25 bags with project-level rounding;
- add at least one metric-display conversion test;
- test that contingency/waste is applied only when the user enables it;
- test invalid, zero, and negative inputs at the UI boundary;
- prove the dedicated calculator and full planner call the same calculation function.

## Task 4 — Add predefined, non-destructive reference-scenario loading

The guide rebuild needs reproducible tool examples. Implement loaders for the supported predefined scenarios without pretending arbitrary project-sharing exists.

### Required behavior

- Move reusable scenario builders out of a test-fixture-only location into an appropriate production module; keep tests importing the same builders.
- Support stable URLs such as `/fence-planner?example=fp-rs-01-straight-panel-run` for the five representable scenarios: FP-RS-01, 02, 03, 05, and 06 where a planner state is applicable.
- Do not create a loader for FP-RS-04; the slope scenario remains explicitly unsupported.
- Show the example name and the standard hypothetical-example notice.
- Never overwrite the user's current plan merely because the URL was visited. Require an explicit “Load example” action and create a fresh project identity, or provide an equally safe import confirmation.
- After load, the example must use the production calculator and display the same results asserted by tests.
- This feature is a predefined example loader, not arbitrary serialization and not a user-generated share URL. Keep that distinction in the UI and documentation.

Add a reusable guide CTA field/component so an article can link to a supported example by ID without hard-coding its URL in article prose.

## Task 5 — Expand the guide content model for evidence

Extend the typed guide model and renderer with accessible, reusable structures for:

1. a source list containing source title, organization/publisher, URL, and optional access/checked date;
2. a data table with caption, column headers, and row values;
3. a captioned figure with image path, meaningful alt text, and optional credit/method note;
4. a formula/calculation block or an improved example block that can present inputs, formula steps, rounding, and result without abusing plain list strings;
5. a predefined reference-scenario action;
6. related guide slugs rendered as internal links.

Validate internal guide slugs and allowed external URLs at build/test time. External links should identify their destination and use safe link attributes where appropriate.

Keep existing guide files working during the transition. Do not hard-code citations in `GuideBody` by article slug.

## Task 6 — Add trustworthy publishing and discovery basics

Implement using the repository's Next.js version and documented metadata APIs:

- `metadataBase` using the production site origin from configuration/environment; do not guess a domain if the repo does not define one;
- a self-referencing canonical for every guide and the guide index;
- `sitemap.ts` containing canonical public routes and substantive guide update dates;
- `robots.ts` with indexable production behavior and sensible non-production safeguards if the deployment setup supports them;
- improved Article JSON-LD with canonical URL, headline, description, date modified, publisher/author accurately identified as the Fence Planner organization, and image only where one exists;
- breadcrumb structured data or an equally accessible breadcrumb implementation;
- visible “By Fence Planner” attribution linked to an About or methodology explanation; do not fabricate a person, credential, installer, or technical reviewer;
- a visible “How this guide was prepared” explanation on methodology: calculator behavior was traced and tested, official sources are cited for external requirements, hypothetical examples are labeled, and AI assistance may be used for drafting but claims and calculations require review;
- automatic or test-validated reading-time calculation from rendered article text; remove inflated hand-entered estimates;
- accurate update dates that change only with substantive edits;
- related-guide links driven by the content model.

If the production origin cannot be determined, implement the configuration hook and report the exact environment value the owner must supply. Do not block the rest of the phase.

## Task 7 — Rewrite the methodology page to the verified contract

The methodology page should be the central trust document for the free tool. Cover, in plain language:

- what the tool is and is not;
- centerline endpoint measurement basis;
- panel module modes and displayed pitch;
- gates and per-segment fill;
- post roles and shared-joint priority;
- corrected cut-bay boundary behavior;
- concrete formula and project-level rounding;
- category-specific waste rules;
- chain-link quantities that are calculated and fittings that are not complete;
- structure-connection data behavior and missing Plan View control;
- explicit lack of slope, curve, frost lookup, utility locate, legal boundary, structural engineering, live price, and arbitrary share-link support;
- reference-scenario methodology and tests;
- honest content-production and source-review process.

Do not present every stored setting as editable unless Task 3 exposes it.

## Task 8 — Preserve the editorial hold

In Phase 2A:

- do not broadly rewrite the 20 guide bodies;
- do not delete, redirect, canonicalize away, or `noindex` guide routes;
- do not add unsupported slope, frost, utility, structure-joint, stock-optimizer, or share-project claims;
- do not invent customer projects, field experience, authors, experts, reviews, product SKUs, prices, or local rules;
- do not use AI hero images as a substitute for technical figures or tool evidence.

Small copy corrections required to make the interface truthful are in scope.

## Verification requirements

Run and report:

1. the full Vitest suite;
2. TypeScript type checking;
3. lint;
4. a production build;
5. a route/link check for guide, source, canonical, scenario, and related-guide links;
6. keyboard and screen-reader-oriented checks for new controls, tables, figures, disclosures, and example-loading confirmation;
7. mobile checks for guide evidence blocks and concrete calculator inputs/results;
8. a comparison of all reference-scenario outputs before and after the post correction.

The Phase 1 report identified pre-existing lint errors in `StyleBuilder.tsx` and `projectStore.tsx`. Since this phase must change adjacent files, repair those errors in a behavior-preserving way or clearly prove why a remaining error is unrelated and cannot safely be addressed. The target is a clean lint run.

## Required completion report

Create `docs/fence-guide-phase-2a-report.md` containing:

1. executive result and release readiness;
2. every production file changed;
3. before/after FP-RS-01 outputs, including panels, posts, and concrete;
4. final wording and semantics for run length, gate width, panel width, module pitch, post face, and bag yield;
5. screenshots or exact routes for the new panel assumptions, concrete controls, and example-loader confirmation;
6. guide content-model additions with one minimal fixture/example of each block;
7. metadata, canonical, sitemap, robots, JSON-LD, authorship, reading-time, and related-guide implementation details;
8. updated reference-scenario results;
9. verification command results;
10. any remaining blockers for article rewriting;
11. the production-origin environment/configuration value still needed, if any;
12. confirmation that current user plans are not silently overwritten by reference examples.

Stop after the report. Return it to Codex before Phase 2B article content is integrated.

