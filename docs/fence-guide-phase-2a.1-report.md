# Fence Guide Phase 2A.1 Report

Status: **Complete**  
Date: 2026-07-17  
Inputs: `docs/PHASE_2A_VALIDATION_AND_CORRECTIONS.md`, `docs/CURSOR_PHASE_2A_HANDOFF.md`  
Prior: `docs/fence-guide-phase-2a-report.md`

---

## 1. Executive result

Phase 2A.1 closes the validation blockers that held article integration. The cut-panel model now separates **pitch remainder** from **calculated clear panel space**, reading times are computed everywhere, sitemap `<loc>` values are absolute-only, metric concrete inputs are real mm/L conversions, and the example confirmation dialog meets the accessibility checklist.

| Item | Result |
|---|---|
| Pitch remainder vs clear panel space | **Fixed** — FP-RS-01: 60 in O.C. / ≈56 in clear |
| Shopping-list “Trim to 60 in” language | **Removed** |
| Reading-time consistency | **Fixed** — `estimateReadingMinutes` only |
| Absolute sitemap | **Fixed** — empty locally without origin; throws in production |
| Metric concrete inputs | **Fixed** — standalone + Style Studio Posts |
| Panel pitch in Style summary | **Fixed** — `moduleWidth(project)` for panel |
| Post-face copy + custom value | **Fixed** |
| Example modal a11y | **Fixed** — focus, trap, Escape, inert, restore |
| Stronger tests (gate coords, 68 bags) | **Fixed** |
| Typed scenario `exampleId` + registry check | **Fixed** |
| Broad guide rewrites / redirects | **Not started** (held for Phase 2B) |

**Tests:** 64 passing. **Lint:** clean.

---

## 2. Corrected FP-RS-01 language (frozen)

| Quantity | Value |
|---|---:|
| Run | 960 in centerline |
| Full pitch | 100 in |
| Full panels | 9 × 96 in |
| Final pitch remainder | 60 in center-to-center |
| Calculated clear panel space | 56 in (before product fitting allowance) |
| Panels to purchase | 10 |
| Posts | 11 (2 end + 9 line, including 900 in) |
| Concrete | **68 bags** at current defaults |

Do **not** publish “cut the final panel to 60 in.”

---

## 3. Files changed

### Calculation / domain
- `src/domain/types.ts` — `PanelCut.pitchRemainder` + `clearPanelSpace` (removed misleading `length`)
- `src/calc/panel.ts` — computes clear space = pitch − post face (equal square posts)
- `src/calc/engine.ts` — shopping-list copy reports pitch O.C. + clear space + fitting note

### Product / UI
- `src/components/calculators/ConcreteCalculator.tsx` — mm / L inputs when metric selected
- `src/components/planner/StyleBuilder.tsx` — metric concrete fields; panel pitch summary; post-face plan language + custom input
- `src/components/planner/ExampleLoader.tsx` — accessible confirm dialog
- `src/app/methodology/page.tsx` — pitch remainder vs clear panel space

### Publishing
- `src/lib/siteUrl.ts` — `requireSiteOriginForSitemap()`; production fail-fast
- `src/app/sitemap.ts` — absolute URLs only; `[]` when origin unset in non-prod
- `src/app/guides/[slug]/page.tsx` — always `estimateReadingMinutes`
- `src/content/guides/types.ts` — removed `readingMinutes` override; `scenario.exampleId: ReferenceScenarioId`
- Guide content files — prior pass removed hardcoded `readingMinutes`

### Tests
- `src/calc/cutBayBoundaryPosts.test.ts` — clear space 56; gate line coords; bags === 68
- `src/calc/referenceScenarios.test.ts` — same panel/concrete pins
- `src/content/guides/contentModel.test.ts` — registry validation for scenario blocks
- `src/components/guides/GuideBody.tsx` — no unsafe cast for scenario IDs

---

## 4. Acceptance checklist (validation §2–§3)

| ID | Requirement | Status |
|---|---|---|
| Primary | Distinguish pitch remainder / clear panel space / field cut | **Pass** |
| P0 | Unified reading times | **Pass** |
| P0 | Absolute sitemap; fail clearly in production | **Pass** |
| P1 | True metric concrete inputs | **Pass** |
| P1 | Panel summary uses calculated pitch | **Pass** |
| P1 | Post face plan language + custom | **Pass** |
| P1 | Accessible example modal | **Pass** |
| P1 | Exact gate coords + 68 bags | **Pass** |
| P2 | Typed scenario IDs + registry test | **Pass** |

---

## 5. Remaining owner / Phase 2B notes

- Set **`NEXT_PUBLIC_SITE_URL`** to the production origin before launch so sitemap and canonicals populate.
- Phase 2B editorial work (flagship panel/post guide, concrete+frost merge, spacing, measure/gate, retained set, redirects) may proceed against this contract.
- Field cut width remains product-specific; Fence Planner does not invent a fitting allowance.

---

## 6. Persistence

No schema migration. Projects store geometry/settings; panels/posts/concrete recalculate on open.
