# Fence Planner — Phase 2A Validation and Required Corrections

Status: **conditionally accepted; Phase 2B editorial integration remains on hold**  
Date: 2026-07-17  
Reviewed: `docs/fence-guide-phase-2a-report.md`, production changes, tests, type checking, and live local interfaces

## 1. Executive result

Phase 2A successfully corrected the missing cut-bay boundary post and added most of the requested publishing infrastructure. The following independently reproduced:

- 63 automated tests pass;
- lint passes;
- TypeScript passes with incremental output disabled in the read-only review environment;
- FP-RS-01 now contains 10 purchased panels and 11 posts, including the post at 900 in;
- default concrete for those 11 posts is 68 bags;
- the dedicated concrete calculator returns 25 bags for FP-RS-05;
- the predefined example URL requires a visible confirmation;
- guide evidence blocks, methodology, structured data, sitemap/robots routes, and related-guide support exist.

However, the review found one deeper panel-dimension defect and several incomplete acceptance items. Article #2 cannot be written as a definitive explanation of the calculator until these are corrected.

## 2. Primary blocker: pitch remainder is not cut-panel width

The planner now defines run length as the centerline distance between endpoint post markers. It also defines the default panel module as:

`96 in panel + 4 in post face = 100 in post-to-post pitch`

For the 80 ft reference run:

- run centerline length: 960 in;
- nine complete pitches: 9 × 100 = 900 in;
- last post-to-post pitch: 960 − 900 = 60 in;
- clear space between the faces of two 4 in posts: 60 − 2 − 2 = **56 in**.

The corrected post layout is therefore sound, but `calculatePanels()` stores the 60 in **pitch remainder** as the cut-panel length. The shopping list then says “Trim to 60 in wide.” That instruction is inconsistent with the centerline geometry; a panel fitted between those posts would be approximately 56 in wide before product-specific clearance allowances.

### Required corrected FP-RS-01 language

| Quantity | Correct value under the approved centerline contract |
|---|---:|
| Run | 960 in centerline |
| Full pitch | 100 in |
| Full panels | 9 × 96 in |
| Final pitch | 60 in center-to-center |
| Calculated clear panel space | 56 in before product-specific fitting allowance |
| Panels to purchase | 10 |
| Posts | 11 total: 2 end + 9 line |
| Concrete | 68 bags at current default assumptions |

The tool should distinguish at least:

- **pitch remainder**: center-to-center distance left after full modules;
- **calculated clear panel space**: pitch remainder minus the combined half-faces of its two boundary posts (one full post face for equal square posts);
- **field cut width**: the final dimension after applying the chosen product's required installation clearance. Fence Planner cannot guarantee this last value without a product-specific allowance.

Do not publish “cut the final panel to 60 in.”

## 3. Additional discrepancies

### P0 — reading times are still inconsistent

All 20 guide files retain manual `readingMinutes` values. The individual guide page prefers that override, while the guide index always calls `estimateReadingMinutes()`.

Live example for Article #2:

- guide index: **4 min read**;
- article page: **10 min read**.

The report's claim that reading time is computed is therefore only partially true. Remove the overrides or make every surface use one generated value.

### P0 — sitemap output is invalid without the production origin

Without `NEXT_PUBLIC_SITE_URL`, `/sitemap.xml` emits values such as `<loc>/</loc>` and `<loc>/guides/…</loc>`. Sitemap `<loc>` values must be absolute URLs. Canonicals and some JSON-LD URLs are also omitted without the origin.

The production domain still needs to be supplied by the owner. Code should fail clearly in a production build when it is missing, or use a documented, trustworthy production-host fallback. It should not publish a relative-URL sitemap.

### P1 — “metric” mode changes output units only

The standalone concrete calculator's metric selection is labeled “Display volumes in liters,” but its inputs remain:

- hole diameter in inches;
- hole depth in inches;
- post face in inches;
- bag yield in cubic feet.

The full planner likewise shows inch/cubic-foot concrete controls even when the project unit system is metric. The metric test converts millimetres to internal inches directly; it does not test the interface.

Either implement metric input/display conversion—millimetres and litres—or label the feature honestly as a volume-output display only. True metric inputs are preferred.

### P1 — panel summary still contradicts calculated pitch

After showing a correct 100 in calculated panel pitch, the bottom of the Posts panel still displays `postSpacing` as “8 ft on center” for panel projects. Panel calculations do not use that value. The summary must conditionally show `moduleWidth(project)` for panel projects and `postSpacing` for site-built wood/chain-link.

### P1 — “actual post face” presets are too confident

The interface calls 4 in and 6 in values actual faces and says 4 in is most common. Nominal posts can have smaller actual dimensions, and manufactured systems vary.

Use language such as “post face used by this plan” and ask users to enter the actual measured/manufacturer dimension. Add a custom value; do not present nominal 4×4/6×6 labels as universally actual 4/6 in faces.

### P1 — example confirmation is not a complete accessible modal

The live modal has `role="dialog"` and a label, but when it opens:

- focus remains on `<body>` rather than entering the dialog;
- background controls remain keyboard-accessible;
- no focus containment or inert background is applied;
- Escape is not handled;
- focus restoration is not implemented.

The URL is non-destructive, and loading still requires a click, which is good. Complete the keyboard behavior before guide CTAs send users to this modal.

### P1 — tests overstate some coverage

The gate-split post test says it verifies each remainder boundary but only checks that two gate posts exist and that a category sum equals the total. It does not assert the required line-post coordinates on both gate-separated segments.

The downstream concrete test uses `greaterThanOrEqual` rather than pinning the report's claimed 68-bag result. Add exact assertions.

### P2 — scenario IDs are not strongly typed in guide content

The `scenario` guide block stores `exampleId: string` and casts it to `ReferenceScenarioId` in the renderer. The content-model test builds registered scenarios but does not validate every scenario block used by a guide. Use the shared ID type and add registry validation.

## 4. Accepted Phase 2A work

The following does not need to be redone:

- missing 900 in post correction;
- production reference-scenario builders;
- explicit example-loading confirmation and fresh project identity;
- run-length and planned-gate labels;
- shared concrete calculation function and project-level rounding;
- editable concrete controls in principle;
- evidence block types and rendering approach;
- organization authorship instead of fabricated credentials;
- methodology structure and honest limitation list;
- canonical/JSON-LD configuration hook;
- robots behavior for development/preview;
- clean lint and current test/type results.

## 5. Phase decision

Complete a narrow Phase 2A.1 correction pass before broad article integration. Do not rewrite or redirect the guide portfolio during that pass.

After Cursor returns a passing Phase 2A.1 report, Codex can safely produce:

1. the flagship panel/post guide with reconciled centerline and clear-width arithmetic;
2. the concrete guide and merged frost section;
3. the spacing guide with the six-versus-eight-foot comparison;
4. the measurement and gate guides;
5. the remaining retained guide set, source packages, tables, and original technical-visual specifications;
6. the final merge/redirect map.

