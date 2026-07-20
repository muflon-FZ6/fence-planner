# Cursor Handoff — Phase 2B: Core Guide Rebuild, Original Evidence, and Three Merges

## Instruction to Cursor

Work directly in the Fence Planner repository. Phase 2A.1 is accepted for editorial work with the mandatory Task 0 corrections below. Complete Task 0, integrate the six approved core guides, add the original evidence assets, apply the three approved redirects only after their destination pages pass, and return one Phase 2B report to Codex.

Do not rewrite the remaining guides in this phase. Preserve unrelated user changes.

Read before editing:

- repository `AGENTS.md`;
- relevant Next.js 16 documentation in `node_modules/next/dist/docs/` for redirects, metadata, images/static assets, client components, and App Router behavior;
- `docs/fence-guide-phase-2a.1-report.md`;
- `docs/fence-planner-calculation-contract.md`;
- Codex deliverable `PHASE_2A_1_VALIDATION.md`;
- Codex deliverable `FENCE_GUIDES_PHASE_2B_CORE_EDITORIAL_PACKAGE.md`;
- prior editorial foundation/audit files for scope and safety boundaries.

The editorial package is approved source copy. Encode it into typed guide blocks without creative simplification.

## Task 0 — Close the remaining implementation gaps

Complete these fixes before publishing or redirecting any core guide.

### 0.1 Correct `includes_post` material labeling

`includes_post` stores a complete repeating pitch, not a physical panel width.

- Update `panelSpecLabel` or its caller so this mode never emits `H × entered-value W wood fence panel`.
- Use wording substantially equivalent to: `Panel system for a 96 in repeating pitch — verify actual panel width from the product.`
- Preserve the normal height × physical-panel-width label in `panel_only` mode.
- Add tests for both modes and both unit systems.

### 0.2 Classify partial bays from clear space

Extend the panel-result contract so a partial bay exposes:

- `pitchRemainder`;
- `clearPanelSpace`;
- segment/run identity;
- status: `valid`, `short`, or `no_usable_clear_opening` (names may differ if equally clear).

Use centralized thresholds:

- numeric remainder epsilon: existing 0.5 in;
- no usable clear opening: clear space at or below the chosen numeric/constructability epsilon;
- short clear opening: greater than that epsilon and below the existing 24 in planning threshold.

Update warnings and shopping-list copy to use `clearPanelSpace`, not centerline pitch remainder. An impossible opening must say to move an endpoint/gate or revise the module. It must not tell the user to trim a panel.

Tests must cover:

1. FP-RS-01: 60 in pitch, 56 in clear, valid;
2. exact full multiple: no partial bay;
3. a remainder above numeric epsilon but clear space at/below usable epsilon;
4. a clear opening just below 24 in: short;
5. a clear opening at/above 24 in: valid;
6. both module modes;
7. gate-separated segments;
8. shopping-list and warning wording.

### 0.3 Make the example dialog genuinely modal

The current body-child loop skips the application root because that root also contains the dialog.

- Render the dialog through a body-level portal or place the modal and inert background in separate top-level containers.
- Make the planner background unavailable to keyboard and assistive technology while open.
- Lock background scrolling.
- Preserve and restore pre-existing `inert`, `aria-hidden`, and body overflow values.
- Keep first focus, Tab/Shift+Tab containment, Escape as `Keep my plan`, query cleanup, and sensible focus restoration.
- Add component tests proving one background control cannot be focused while open and becomes available again after close.

### 0.4 Finish content-model validation

For every guide:

- every table row length equals its header length;
- figure `alt` is non-empty;
- figure path begins with the approved local `/guides/` prefix unless an external figure policy is explicitly added;
- figure `src` and caption are non-empty;
- source title, organization, and safe http/https URL are non-empty/valid;
- related slugs and scenario IDs remain valid.

### 0.5 Correct unit/result labels

- When concrete contingency is off, label the displayed total `Net calculated project volume`.
- When it is on, label the displayed total `Estimated project volume including contingency` and show the percentage.
- In metric planner projects, display/edit the custom plan post face in millimetres, while preserving internal inch storage.
- In the standalone metric concrete calculator, describe the illustrative default yield in litres (about 9.34 L), not only 0.33 ft³.
- Add interface-level tests for unit equivalence and label state.

Task 0 is complete only when focused tests, the full test suite, TypeScript, and lint pass. If a fix changes the frozen FP-RS-01 values, stop and report instead of rewriting the content around a new result.

## Task 1 — Add the original interactive panel evidence block

Add a typed guide block for a reusable panel-module explorer. A suggested shape is:

```ts
{
  type: "panel_module_explorer";
  defaultRunLength: number;
  defaultEnteredWidth: number;
  defaultPostFace: number;
  defaultMode: ModuleWidthMode;
}
```

Implement it as a focused client component rendered by the normal `GuideBody` block switch. Do not branch on article slug.

Required behavior:

- defaults to FP-RS-01: 960 in run, 96 in physical panel, 4 in post face, panel-itself mode;
- lets the reader edit run, panel-or-pitch, post face, and mode;
- shows repeating pitch, full panels, final pitch, calculated clear space, panel purchases, and post count for **one isolated uninterrupted run**;
- draws a scaled row of full bays and the partial bay;
- never calls final pitch a cut width;
- displays a clear error state for no usable opening;
- labels the `includes_post` value as pitch and does not infer a physical panel width;
- states the isolated-run limitation and product-specific fitting allowance;
- supports imperial and metric display or clearly states that the first version uses inches while the surrounding article provides conversions;
- has labeled controls, keyboard operation, visible focus, an accessible live result summary, and an SVG title/description or equivalent text alternative;
- does not write to or overwrite the user's saved planner project.

Use shared calculation helpers rather than duplicating formulas in the component. Add tests comparing the component/model output with `calculatePanels` for FP-RS-01, an exact multiple, `includes_post`, and an impossible clear opening.

## Task 2 — Integrate the six approved canonical guides

Replace the body/metadata of these files with the corresponding approved package sections:

1. `how-to-measure-for-a-new-fence.ts`
2. `how-to-calculate-fence-panels-and-posts.ts`
3. `fence-post-spacing-explained.ts`
4. `how-much-concrete-for-fence-posts.ts`
5. `plan-fence-corners-and-end-posts.ts`
6. `measure-and-plan-a-fence-gate.ts`

### Encoding rules

- Convert prose headings to `h2`/`h3`, lists to `ul`/`ol`, warnings to `callout`, arithmetic to `formula`, comparisons to `table`, sources to `sources`, diagrams to `figure`, and loadable examples to `scenario`.
- Preserve all exact numbers and distinctions from the package.
- Use `updated: "2026-07-17"` because these are substantive rewrites completed on that date.
- Keep hero-image paths for now, but hero images remain decorative with empty alt text.
- Insert the new `panel_module_explorer` in Article 2 after the static pitch/clear-space diagram and before the final hand-check.
- Do not imply that the planner models slope, curves, frost lookup, utility locations, legal boundaries, structural design, live product inventory, or arbitrary user-share links.
- Do not claim customer work, field installation, or contractor experience.

### Pin the newly published outputs

Expand reference-scenario tests before relying on the copy:

- FP-RS-02: fill segments 96, 432, 720, and 576 in; 2 corners; 2 structure connections; 2 gate posts; 16 line posts; 22 unique points; 20 concreted points.
- FP-RS-03 at gate starts 10, 20, and 28 ft: exact fill segments, full panel counts, partial pitches, clear spaces, and eight purchased panels in each state as listed in the package.
- 96 ft site-built wood: 13 posts at 8 ft O.C.; 17 posts at 6 ft O.C.
- FP-RS-05: 3,495.50 in³ per post within tolerance; 13,982.02 in³ project volume within tolerance; 25 project-rounded bags; 28 for the documented naïve per-post comparison; 26 with 5% contingency.

If any expected output fails, reconcile code and editorial meaning. Do not silently change the package number.

## Task 3 — Create and integrate six original instructional diagrams

Create these code-native SVG assets from the exact specifications in the editorial package:

1. `/public/guides/diagrams/measure-u-shaped-centerlines.svg`
2. `/public/guides/diagrams/panel-pitch-vs-clear-space.svg`
3. `/public/guides/diagrams/post-spacing-96-foot-comparison.svg`
4. `/public/guides/diagrams/concrete-hole-volume.svg`
5. `/public/guides/diagrams/fence-joint-topology.svg`
6. `/public/guides/diagrams/gate-opening-and-swing.svg`

Requirements:

- responsive 16:9 or similarly article-friendly view box;
- legible at mobile width and when printed;
- match existing site colours through a restrained palette with adequate contrast;
- use shape, line style, and text together; never colour alone;
- dimension lines terminate on the correct centers/faces;
- no decorative construction details that imply unsupported engineering;
- no logos, watermarks, stock-photo look, or fake field evidence;
- exact alt and caption from the package;
- diagrams render uncropped in the current figure component;
- source credit: `Original Fence Planner diagram · based on the declared hypothetical scenario`.

Render each guide at desktop and mobile width. Verify labels do not overlap and remain meaningful in print/PDF.

## Task 4 — Apply the three approved merges and redirects

Only after Tasks 0–3 pass for all destination pages:

| Old slug | Permanent destination |
|---|---|
| `/guides/six-foot-vs-eight-foot-fence-sections` | `/guides/fence-post-spacing-explained` |
| `/guides/handle-uneven-final-fence-section` | `/guides/how-to-calculate-fence-panels-and-posts` |
| `/guides/fence-post-depth-and-frost` | `/guides/how-much-concrete-for-fence-posts` |

Use the correct Next.js 16 permanent redirect mechanism after reading the bundled documentation.

Update together:

- guide registry imports and entries;
- sitemap output;
- related-guide links;
- home/index cards if any retired guide is referenced;
- canonical metadata through destination rendering;
- tests for redirect status and destination;
- any structured-data or example references.

The retired guide source files may be removed if Git history provides recovery and no imports remain. Do not leave them indexable, in the sitemap, or in guide navigation.

The redirect must preserve a direct request to the retired URL and must not create chains.

## Task 5 — Verify publishing quality

For each of the six pages, check:

- byline links to the real Fence Planner About page;
- methodology/AI-assistance disclosure remains visible;
- generated reading time agrees across index, home card if present, and article;
- updated date is truthful;
- source links open the intended official manufacturer/government/industry page;
- external sources use safe new-tab behavior;
- scenario CTA prompts before replacing a plan;
- formulas, tables, figures, and captions are not separated by an ad;
- no ad is inserted inside an evidence block;
- related links contain only canonical retained slugs;
- JSON-LD, Open Graph URL, canonical, and sitemap use one configured origin;
- hero image does not carry fake instructional alt text;
- instructional figures have the approved descriptive alt text;
- mobile and print retain table/diagram meaning.

Check source URLs at implementation time. If a URL has moved, use the current official destination from the same organization and note the replacement in the report.

## Task 6 — Required verification

Run and report:

1. focused panel/remainder tests;
2. focused scenario-output tests;
3. component tests for the modal and panel explorer;
4. content-model validation;
5. full Vitest suite;
6. TypeScript;
7. lint;
8. production build with a temporary valid `NEXT_PUBLIC_SITE_URL`;
9. generated sitemap inspection proving the three retired slugs are absent and all retained URLs are absolute;
10. redirect checks for all three old slugs;
11. desktop and mobile rendering of all six guides;
12. keyboard-only checks for the example modal and interactive explorer;
13. print/PDF inspection for tables, formulas, and SVG labels;
14. broken internal/external link check for the six pages.

Do not set a fake production domain in committed configuration. The owner still needs to supply the real `NEXT_PUBLIC_SITE_URL`.

## Required Phase 2B report

Create `docs/fence-guide-phase-2b-report.md` containing:

1. executive result and any blocker;
2. Task 0 fixes with before/after behavior;
3. final FP-RS-01 contract;
4. exact FP-RS-02, FP-RS-03, 6-vs-8, and FP-RS-05 test outputs;
5. six rewritten guide slugs, word counts, generated reading times, sources, scenarios, and diagrams;
6. panel-module explorer behavior and accessibility results;
7. all diagram file paths and visual QA results;
8. redirect status/destination and sitemap proof;
9. source-link validation results and any official URL replacement;
10. byline/methodology/ad-placement/structured-data checks;
11. modal accessibility results including background inertness and scroll lock;
12. full changed-file list;
13. test/type/lint/build results;
14. the exact owner action still required for `NEXT_PUBLIC_SITE_URL`;
15. confirmation that the remaining non-core guides were not broadly rewritten in this phase;
16. recommendations or blockers for Phase 2C.

Stop after the report and return it to Codex.
