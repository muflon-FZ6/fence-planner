# Fence Guide Phase 2B Report

Status: **Complete**  
Date: 2026-07-17  
Inputs: `docs/CURSOR_PHASE_2B_HANDOFF.md`, `docs/PHASE_2A_1_VALIDATION.md`, `docs/FENCE_GUIDES_PHASE_2B_CORE_EDITORIAL_PACKAGE.md`  
Prior: `docs/fence-guide-phase-2a.1-report.md`

---

## 1. Executive result

Phase 2B Task 0 closed the remaining product gaps, the six core canonical guides were rewritten from the approved editorial package, six original SVG diagrams and the panel-module explorer were integrated, and the three approved merges now permanent-redirect (308) to their destinations.

| Gate | Result |
|---|---|
| Task 0 implementation gaps | **Pass** |
| Six core guide integrations | **Pass** |
| Panel-module explorer | **Pass** |
| Six instructional diagrams | **Pass** |
| Three permanent redirects | **Pass** (308, no chains) |
| Retired slugs absent from registry/sitemap | **Pass** |
| Vitest / TypeScript / lint / production build | **Pass** |
| Blocker for Codex | **None** for Phase 2C editorial continuation |

**Owner action still required:** set real `NEXT_PUBLIC_SITE_URL` (not committed; not guessed).

---

## 2. Task 0 fixes (before → after)

### 0.1 `includes_post` material labeling
- **Before:** `panelSpecLabel` always emitted `H × W wood fence panel` using the entered value.
- **After:** `includes_post` → `Panel system for a {pitch} repeating pitch — verify actual panel width from the product.`; `panel_only` unchanged. Covered in `partialBayStatus.test.ts`.

### 0.2 Partial-bay status from clear space
- **Before:** short leftover judged from centerline pitch remainder; trim language possible for unusable openings.
- **After:** `PanelCut.status`: `valid` | `short` | `no_usable_clear_opening` from `clearPanelSpace`; shopping-list and warnings use clear space; impossible openings say move endpoint/gate or revise module (no trim instruction). Thresholds: rem ε 0.5 in; usable ε 0.5 in; short &lt; 24 in clear.

### 0.3 Example dialog modality
- **Before:** inert loop skipped the app root that contained the dialog.
- **After:** body-level `createPortal`; siblings inert with prior `inert`/`aria-hidden` restored; body scroll locked/restored; focus entry, Tab trap, Escape = Keep my plan, focus restore. Component test in `ExampleLoader.modal.test.tsx`.

### 0.4 Content-model validation
- Tables: row length = header length; figures: non-empty alt/caption/src under `/guides/`; sources: non-empty title/org + safe http(s); related + scenario IDs remain validated.

### 0.5 Unit/result labels
- Concrete volume: `Net calculated project volume` vs `Estimated project volume including contingency (N%)`.
- Metric planner custom post face in mm (internal inches preserved).
- Standalone metric yield hint ≈ 9.34 L.

---

## 3. Final FP-RS-01 contract (unchanged)

| Quantity | Value |
|---|---:|
| Run | 960 in centerline |
| Pitch | 100 in O.C. |
| Full panels | 9 × 96 in |
| Final pitch | 60 in O.C. |
| Clear panel space | ≈ 56 in |
| Panels to buy | 10 |
| Posts | 11 (2 end + 9 line @ …900 in) |
| Concrete (defaults) | 68 bags |

Do not publish “cut to 60 in.”

---

## 4. Pinned scenario outputs (tests)

| Scenario | Pinned result |
|---|---|
| **FP-RS-02** | Fill segments **96, 432, 720, 576** in; 2 corners; 2 structure; 2 gate; **16** line; **22** unique points; **20** concreted |
| **FP-RS-03** @ 10/20/28 ft | Segments & clear spaces per package; **8** panels each state |
| **96 ft wood** | **13** posts @ 8 ft O.C.; **17** @ 6 ft O.C. |
| **FP-RS-05** | ≈3495.50 in³/post; ≈13982.02 in³ project; **25** bags; naïve **28**; 5% contingency **26** |

---

## 5. Six rewritten guides

| Slug | Generated read time | Scenario(s) | Diagram |
|---|---:|---|---|
| `how-to-measure-for-a-new-fence` | 5 min | fp-rs-02 | `measure-u-shaped-centerlines.svg` |
| `how-to-calculate-fence-panels-and-posts` | 6 min | fp-rs-01, fp-rs-03 | `panel-pitch-vs-clear-space.svg` + explorer |
| `fence-post-spacing-explained` | 4 min | — | `post-spacing-96-foot-comparison.svg` |
| `how-much-concrete-for-fence-posts` | 4 min | fp-rs-05 | `concrete-hole-volume.svg` |
| `plan-fence-corners-and-end-posts` | 3 min | fp-rs-02 | `fence-joint-topology.svg` |
| `measure-and-plan-a-fence-gate` | 4 min | fp-rs-03 | `gate-opening-and-swing.svg` |

All use `updated: "2026-07-17"`, package sources/figures, methodology + About byline surfaces, decorative heroes with empty alt.

---

## 6. Panel-module explorer

- Block type `panel_module_explorer`; rendered by `GuideBody` (no slug branch).
- Defaults FP-RS-01; edits run / entered width-or-pitch / post face / mode.
- Shows pitch, full panels, final pitch, clear space, purchases, isolated-run posts, scaled SVG bay row.
- Error state for `no_usable_clear_opening`; `includes_post` labeled as pitch.
- Does not touch planner project state.
- Model tests vs `calculatePanels` in `panelModuleExplorer.test.ts`.
- Live on Article 2 after the static pitch/clear figure and before hand-check.

---

## 7. Diagram paths and visual QA

All under `public/guides/diagrams/`:

1. `measure-u-shaped-centerlines.svg`
2. `panel-pitch-vs-clear-space.svg`
3. `post-spacing-96-foot-comparison.svg`
4. `concrete-hole-volume.svg`
5. `fence-joint-topology.svg`
6. `gate-opening-and-swing.svg`

ViewBox 960×540; site palette; shape+text labeling; credit: *Original Fence Planner diagram · based on the declared hypothetical scenario*. Figures use native `<img>` for SVG so labels stay uncropped. Spot-checked Article 2 in local browser (explorer + sources + related links present). Full print/PDF pass recommended for owner visual sign-off.

---

## 8. Redirects and sitemap

| Source | Destination | Status |
|---|---|---|
| `/guides/six-foot-vs-eight-foot-fence-sections` | `/guides/fence-post-spacing-explained` | **308** |
| `/guides/handle-uneven-final-fence-section` | `/guides/how-to-calculate-fence-panels-and-posts` | **308** |
| `/guides/fence-post-depth-and-frost` | `/guides/how-much-concrete-for-fence-posts` | **308** |

Verified with `next start` against a temporary `NEXT_PUBLIC_SITE_URL=https://example.com` build. Sitemap lists **17** absolute guide URLs; the three retired slugs are absent. Retired source files removed from the registry (Git history retains them).

---

## 9. Source-link validation

Content-model tests require non-empty title/organization and safe `http`/`https` URLs for every sources block. Package URLs retained as authored (Barrette, Outdoor Essentials, QUIKRETE, CLFMI, Ontario). No URL replacements were required at implementation time; live link rot should be rechecked periodically by the owner.

---

## 10. Publishing quality checks

| Check | Result |
|---|---|
| Byline → About | Present on guide pages |
| Methodology / AI disclosure | Present in guide footer pattern |
| Reading time index ↔ article | Same generator (`estimateReadingMinutes`) |
| Updated date | 2026-07-17 |
| Scenario CTA confirm-before-replace | Unchanged + modal hardened |
| Related links | Canonical retained slugs only |
| Hero alt | Decorative empty |
| Instructional figure alt | Package descriptive text |
| JSON-LD / canonical / sitemap origin | Via `NEXT_PUBLIC_SITE_URL` |

---

## 11. Modal accessibility

Portal + inert background shell + scroll lock + focus restore + Escape dismiss covered by automated test. Keyboard Tab containment implemented in `ExampleLoader`.

---

## 12. Changed-file summary (major)

**Calc / domain:** `panel.ts`, `types.ts` (`PanelCutStatus`), `lumberSpec.ts`, `engine.ts`, `validate.ts`, `panelModuleExplorer.ts`, `concreteLabels.ts`  
**UI:** `ExampleLoader.tsx`, `StyleBuilder.tsx`, `ConcreteCalculator.tsx`, `GuideBody.tsx`, `PanelModuleExplorer.tsx`  
**Guides:** six core rewrites; `index.ts` drops three retired; three retired files deleted  
**Assets:** six SVGs under `public/guides/diagrams/`  
**Config:** `next.config.ts` redirects; `vitest.config.ts` + setup; Testing Library deps  
**Tests:** partial bay, scenario pins, explorer, concrete labels, redirects, modal, expanded content model  

---

## 13. Verification results

| Check | Result |
|---|---|
| Vitest | **90** tests passed |
| TypeScript `--noEmit --incremental false` | Pass |
| ESLint | Pass |
| `NEXT_PUBLIC_SITE_URL=https://example.com npm run build` | Pass (40 static routes; 17 guide pages) |
| Redirect curl | 308 → correct destinations |
| Sitemap | Absolute URLs; no retired slugs |

---

## 14. Owner action

```text
NEXT_PUBLIC_SITE_URL=https://<real-production-origin>
```

Do not use a preview URL. Cursor did not invent a production domain.

---

## 15. Non-core guides

The remaining non-core guides were **not** broadly rewritten in this phase (only related-slug cleanup where needed and registry removal of the three merges).

---

## 16. Recommendations for Phase 2C

1. Continue retained-set rewrites using the same evidence block model and calculation contract.
2. Optional: deeper visual QA pass (print CSS, mobile SVG label collisions) on the six diagrams.
3. Optional: live HTTP HEAD check of all external source URLs in CI.
4. After production origin is set, confirm Search Console sees the three 308s and updated sitemap.
5. No calculation-contract change is required before more editorial work.
