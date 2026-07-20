# Cursor Handoff — Phase 2A.1: Reconcile Panel Dimensions and Close Validation Gaps

## Instruction to Cursor

Phase 2A is conditionally accepted. Make only the corrections in this handoff, update the calculation contract/report, and return to Codex before integrating the 20 guide rewrites or applying redirects.

Read:

- `docs/fence-guide-phase-2a-report.md`
- `docs/fence-planner-calculation-contract.md`
- Codex deliverable `PHASE_2A_VALIDATION_AND_CORRECTIONS.md`
- repository `AGENTS.md` and relevant Next.js 16 documentation

Preserve the accepted Phase 2A work and unrelated user changes.

## Task 1 — Separate panel pitch from clear panel width

The approved physical contract is:

- run/fill segment endpoints are post centerline markers;
- panel pitch is center-to-center between successive post markers;
- `panel_only`: pitch = entered panel width + post face;
- `includes_post`: entered value is the complete repeating pitch;
- clear panel space between equal square posts = pitch − one post face;
- a product-specific field cut may require additional clearance that the generic planner does not know.

Do not use the remaining centerline pitch as a trim-to panel width.

### Required implementation behavior

Introduce explicit names/types rather than letting one `length` field mean two things. A partial panel result should expose, at minimum:

- `pitchRemainder`;
- `calculatedClearWidth`;
- `runId` and segment identity/offset if available;
- validity/status when the remaining pitch is too narrow for the two post faces and a usable panel opening.

For equal post faces:

`calculatedClearWidth = max(0, pitchRemainder − postWidth)`

For FP-RS-01:

- 960 in run;
- 100 in full pitch;
- 9 full 96 in panels;
- one 60 in final pitch;
- one 56 in calculated clear panel space;
- 10 panels to buy;
- 11 posts;
- 68 concrete bags at the current default.

The shopping list should say substantially:

> Final bay: 60 in post-to-post pitch; approximately 56 in clear panel space before the manufacturer's fitting allowance. Cut from one stock panel and verify the field dimension.

It must not say “Trim to 60 in wide.”

### `includes_post` mode

In this mode the entered number is a pitch, not a physical panel width. Do not label a 96 in pitch as a “96 in wide panel” unless a separate panel width was entered.

Acceptable short-term material labeling:

> Panel system for a 96 in repeating pitch — verify actual panel width from the product.

If a clean migration can separate `panelWidth` from `panelPitch` without destabilizing saved projects, document the proposal but do not silently change stored semantics in this correction pass.

### Too-short pitch remainder

If `pitchRemainder` is greater than the numeric epsilon but `calculatedClearWidth` is zero or impractically small:

- do not emit an impossible trim instruction;
- raise a specific layout-adjustment warning;
- retain an honest purchase estimate only if its meaning is documented;
- tell the user to move an endpoint/gate or revise the module rather than implying overlapping posts form a valid bay.

Use calculated clear width—not centerline pitch remainder—when deciding whether a cut panel is “short.” Keep the threshold editable/centralized if practical.

### Required tests

Pin exact values for:

1. FP-RS-01: 60 in pitch remainder, 56 in calculated clear width, 10 panels, 11 posts, 68 bags;
2. exact 1000 in run: ten complete pitches, no partial panel, 11 posts;
3. both module modes with declared pitch and calculated clear width;
4. remainder just above epsilon but no usable clear opening;
5. a valid short clear panel near the warning threshold;
6. two gate-separated fill segments with exact expected internal post coordinates and partial-panel dimensions on each side;
7. a coincident module/gate/corner/end boundary with role priority preserved;
8. shopping-list wording that never labels pitch remainder as trim width.

Update the calculation contract, FP-RS-01 fixture comments, methodology, warnings, material-line notes, and Phase 2A report values together.

## Task 2 — Remove contradictory and inaccurate interface labels

### Panel summary

In `StyleBuilder`, the summary under panel projects must show the calculated panel pitch from `moduleWidth(project)`. It must not display the unused `postSpacing` value as the active on-center spacing.

Site-built wood and chain-link should continue to show `postSpacing` on center.

### Post face

Replace “4 in is most common” and other language that treats nominal post labels as exact actual dimensions.

Use:

> Post face used by this plan. Enter the actual measured or manufacturer-listed dimension; nominal labels may differ.

Provide an accessible custom numeric value for `postWidth`. Keep concrete displacement synchronized only when the user has not intentionally entered a different `postCrossSection`, or make the two separate meanings explicit.

## Task 3 — Implement real metric concrete inputs

When metric is selected in the standalone calculator:

- hole diameter, hole depth, and post face are entered/displayed in millimetres;
- bag yield is entered/displayed in litres;
- results use litres;
- changing the unit system converts the displayed values without changing the underlying physical calculation.

When a planner project uses metric:

- the concrete controls must also display/edit millimetres and litres;
- internal storage can remain cubic inches/inches through shared conversion helpers.

Do not maintain separate formula implementations. Add interface-level tests proving equivalent imperial and metric inputs produce the same internal volume and bag count.

Clarify the result label when contingency is enabled: distinguish base net project volume from volume including contingency, or label the displayed total accordingly.

## Task 4 — Make reading time consistent and generated

- Remove all 20 manual `readingMinutes` values, or remove the override behavior entirely.
- Use `estimateReadingMinutes()` consistently on the guide index, home cards, and individual article page.
- Add a test that one guide displays/derives the same value on every surface.
- Count all evidence-block text that a user actually reads; do not count URLs as prose.

Article #2 must no longer show 4 minutes on the index and 10 minutes on the article.

## Task 5 — Require absolute sitemap and canonical origins

The production sitemap must never emit relative `<loc>` values.

- Use `NEXT_PUBLIC_SITE_URL` as the canonical configured origin.
- In a production build/deployment, fail with a clear configuration error if no trustworthy absolute origin is available, or use a documented platform production-origin variable that cannot resolve to a preview hostname.
- In local development, an absolute localhost origin is acceptable for inspection because robots already disallow indexing.
- Add tests for valid http/https origin normalization and absolute sitemap entries.
- Confirm guide canonicals, Open Graph URLs, JSON-LD entity URLs, and the robots sitemap URL use the same origin.

The site owner must still supply the real production domain. Report the exact value needed; do not guess it.

## Task 6 — Complete example-dialog keyboard behavior

When the predefined-example dialog opens:

- move focus to a sensible control or the dialog heading;
- contain Tab/Shift+Tab within the dialog;
- make underlying planner controls inert or otherwise unavailable to assistive technology and keyboard focus;
- Escape must perform the safe “Keep my plan” action and remove the query parameter;
- restore focus sensibly after dismissal;
- prevent background scrolling while modal;
- keep the existing explicit Load/Keep choices and no-auto-overwrite behavior.

Add component-level coverage if the current test stack supports it. Otherwise document a repeatable keyboard check and include it in the completion report.

## Task 7 — Strengthen content-model validation

- Type `GuideBlock` scenario IDs with the shared `ReferenceScenarioId`, not `string` plus a renderer cast.
- Validate every scenario block in every guide against the registered production examples.
- Validate table row lengths against header count.
- Validate figure paths and non-empty alt text for instructional figures.
- Continue validating related slugs and safe http/https source URLs.

## Task 8 — Verify without broad editorial changes

Do not rewrite guide bodies or add redirects in Phase 2A.1 except for small methodology/copy changes required to reflect the corrected contract.

Run:

1. full Vitest suite;
2. TypeScript;
3. lint;
4. production build with a temporary valid `NEXT_PUBLIC_SITE_URL`;
5. an absolute-URL check on generated sitemap/canonical/JSON-LD output;
6. live desktop and mobile checks for panel controls and both concrete unit systems;
7. keyboard-only example-dialog check;
8. exact FP-RS-01 output comparison.

## Required report

Create `docs/fence-guide-phase-2a1-report.md` with:

1. corrected panel terminology and formulas;
2. FP-RS-01 exact output, including 60 in pitch and 56 in calculated clear width;
3. handling of too-short/impossible remainders;
4. both module-mode behaviors and material labels;
5. metric/imperial UI equivalence results;
6. final generated reading times for all 20 current guides;
7. absolute sitemap/canonical configuration and the owner-supplied env value still needed;
8. modal keyboard/focus results;
9. strengthened test assertions and all verification results;
10. changed-file list;
11. confirmation that no guide redirects or broad rewrites were applied;
12. any blocker that remains before Phase 2B.

Stop after the report and return it to Codex.

