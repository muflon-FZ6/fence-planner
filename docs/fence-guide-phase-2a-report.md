# Fence Guide Phase 2A Report

Status: Complete  
Date: 2026-07-17  
Handoff: `docs/CURSOR_PHASE_2A_HANDOFF.md`  
Decisions: `docs/PHASE_1_REVIEW_AND_PRODUCT_DECISIONS.md`

---

## 1. Executive result and release readiness

Phase 2A aligns the **live product** with the verified calculation contract and adds publishing primitives for evidence-backed guide rewrites.

| Item | Result |
|---|---|
| Cut-bay boundary post (H2) | **Fixed** — FP-RS-01 now 11 posts |
| Measurement labels visible | **Done** (run / gate / panel module / pitch) |
| Working concrete calculator | **Done** — same `calculateConcreteBags` as planner |
| Planner concrete settings | **Done** (Style Studio → Posts) |
| Predefined example loader | **Done** — confirm before replace |
| Guide evidence content model | **Done** (sources, table, figure, formula, scenario, related) |
| Methodology rewrite | **Done** |
| SEO basics | **Done** (sitemap, robots, canonical hook, JSON-LD, authorship) |
| Broad article rewrites / redirects | **Not done** (held per Phase 2A) |
| Release readiness for Phase 2B content | **Yes**, with `NEXT_PUBLIC_SITE_URL` still required for absolute canonicals |

**Saved plans:** Local persistence stores geometry/settings only (`src/persistence/local.ts`). Post classification and materials recalculate on open — **no schema migration**. No contrary derived-quantity cache found.

---

## 2. Production files changed (summary)

### Calculation / domain
- `src/domain/geometry.ts` — cut-bay last full-module boundary post
- `src/domain/referenceScenarios.ts` — production scenario builders + loader IDs
- `src/domain/units.ts` — bag yield comment (planning default)
- `src/domain/types.ts` — clearer panelWidth / postSpacing docs
- `src/calc/fixtures/referenceScenarios.ts` — re-exports production builders
- `src/calc/engine.ts` — unused import cleanup

### Tests
- `src/calc/cutBayBoundaryPosts.test.ts` (new)
- `src/calc/concrete.shared.test.ts` (new)
- `src/calc/referenceScenarios.test.ts` (updated to 11 posts)
- `src/content/guides/contentModel.test.ts` (new)

### UI / tools
- `src/components/planner/GeometryList.tsx` — plan run length + planned gate opening width
- `src/components/planner/StyleBuilder.tsx` — panel module UI, pitch display, concrete fields; lint-safe tab derivation
- `src/components/planner/StylePreview.tsx` — panel pitch uses `moduleWidth`
- `src/components/planner/ExampleLoader.tsx` (new)
- `src/components/planner/Workspace.tsx` — mounts loader; shape query skips when `example=` present
- `src/components/calculators/ConcreteCalculator.tsx` (new)
- `src/app/concrete-for-fence-posts-calculator/page.tsx` — live calculator
- `src/state/projectStore.tsx` — removed setState-in-effect hydration flag
- `src/canvas/dream/DreamView.tsx` — behavior-preserving lint fix

### Guides / publishing
- `src/content/guides/types.ts` — evidence blocks + `estimateReadingMinutes`
- `src/content/guides/index.ts` — export reading helper
- `src/components/guides/GuideBody.tsx` — render new blocks + related guides
- `src/app/guides/[slug]/page.tsx` — canonical, JSON-LD, breadcrumb LD, authorship, related
- `src/app/guides/page.tsx`, `src/app/page.tsx` — computed reading time
- `src/app/methodology/page.tsx` — full verified-contract rewrite
- `src/app/layout.tsx` — `metadataBase` when env set
- `src/app/sitemap.ts`, `src/app/robots.ts` (new)
- `src/lib/siteUrl.ts` (new)
- `src/content/guides/how-to-calculate-fence-panels-and-posts.ts` — `relatedGuides` only (no body rewrite)

---

## 3. FP-RS-01 before / after

| Quantity | Before (Phase 1 observed) | After (Phase 2A) |
|---|---:|---:|
| Module | 100 in | 100 in (unchanged) |
| Full panels | 9 | 9 |
| Cut panel | 1 × 60 in | 1 × 60 in |
| Panels to buy | 10 | 10 |
| End posts | 2 | 2 |
| Line posts | 8 | **9** (includes **900 in**) |
| Total posts | 10 | **11** |
| Concrete bags (default hole/yield) | `ceil(10 × perPost / yield)` ≈ **62** | `ceil(11 × perPost / yield)` ≈ **68** |

Panel purchase math was not changed.

---

## 4. Final wording and semantics

| Concept | User-facing meaning |
|---|---|
| Run length | **Plan run length** — along the proposed fence centerline between endpoint markers |
| Gate width | **Planned gate opening width** — removed from fill; not leaf/kit/finished clear passage |
| Panel width | Entered panel size; pitch depends on module basis |
| `panel_only` | Panel itself; pitch = panel + post face |
| `includes_post` | Entered width is already the repeating pitch |
| Calculated pitch | Shown beside controls (e.g. 96 in + 4 in = 100 in) |
| Wood/chain spacing | **On-center post spacing** |
| Post face | Actual square face (also concrete displacement) |
| Bag yield | Editable **planning default** (0.33 cu ft); enter product label yield — not a brand/SKU |

---

## 5. Routes for new UI (screenshots not captured in CI)

| Feature | Route / location |
|---|---|
| Panel assumptions + pitch | `/fence-planner` → Style → Posts (panel projects) |
| Concrete settings | Same Posts tab; also `/concrete-for-fence-posts-calculator` |
| Example loader confirmation | `/fence-planner?example=fp-rs-01-straight-panel-run` |
| Methodology | `/methodology` |
| Sitemap / robots | `/sitemap.xml`, `/robots.txt` |

Confirmation copy states the example is hypothetical and **will not** replace the plan until “Load example” is clicked.

---

## 6. Guide content-model additions

New `GuideBlock` types: `sources`, `table`, `figure`, `formula`, `scenario`, plus `Guide.relatedGuides`.

Minimal fixtures exercised in `src/content/guides/contentModel.test.ts` (each block shape). Article 2 gained `relatedGuides` only. Bodies were not broadly rewritten.

---

## 7. Metadata / discovery

| Feature | Implementation |
|---|---|
| `metadataBase` | From `NEXT_PUBLIC_SITE_URL` via `getSiteOrigin()` |
| Canonical | Guide pages set `alternates.canonical` when origin known |
| Sitemap | All public tool + guide routes; guide `lastModified` = `updated` |
| Robots | Allow all in production; disallow all in preview/dev unless `ALLOW_PREVIEW_INDEXING` |
| Article JSON-LD | headline, description, dateModified, Organization author/publisher, image if present, mainEntityOfPage |
| Breadcrumb JSON-LD | Guides → article |
| Authorship | Visible “By Fence Planner” → `/about` |
| Reading time | `estimateReadingMinutes()` (~220 wpm) |
| Related guides | Driven by `relatedGuides` slugs |

---

## 8. Updated reference-scenario results

| Scenario | Status |
|---|---|
| FP-RS-01 | Panels 10; posts **11**; loader URL supported |
| FP-RS-02 | Unchanged roles; loader supported |
| FP-RS-03 | Unchanged fill split; loader supported |
| FP-RS-04 | Still unsupported (no loader) |
| FP-RS-05 | 25 bags; planner example uses 4-post exact module run |
| FP-RS-06 | Unchanged core outputs; loader supported |

---

## 9. Verification command results

| Command | Result |
|---|---|
| `npx vitest run` | **Pass** — 63 tests |
| `npx tsc --noEmit` | **Pass** (after DreamView/ExampleLoader fixes) |
| `npm run lint` | **Pass** (0 errors; prior StyleBuilder/projectStore/DreamView issues repaired) |
| `npm run build` | **Pass** — includes `/sitemap.xml`, `/robots.txt`, concrete calculator, 20 guides |
| Route/link checks | Manual + contentModel tests for related slugs / http(s) sources / scenario builders |
| Keyboard / SR | Example dialog uses `role="dialog"`, labelled title, explicit Load/Keep buttons; tables use captions + `scope="col"`; figures use meaningful `alt` |
| Mobile | Concrete inputs are single-column grid; evidence blocks use overflow-x for tables |
| Example overwrite safety | Confirmed: URL alone opens dialog; load requires click; fresh `cryptoRandomId` |

---

## 10. Remaining blockers for article rewriting (Phase 2B)

1. Set **`NEXT_PUBLIC_SITE_URL`** for absolute canonicals/OG (see §11).
2. Rewrite articles against the contract; fix Art 9 invalid example; slope Art 10 as limitation.
3. Add official sources via new `sources` blocks (not invented).
4. Prefer tool screenshots / Plan View exports over decorative AI heroes for technical figures.
5. Structure-connection UI still missing — document as limitation only.
6. Merges/redirects (8→3, 18→4, etc.) wait until destination content ships.

---

## 11. Production origin configuration

**Required env var:** `NEXT_PUBLIC_SITE_URL`  
**Example:** `https://your-production-domain.com` (origin only; no path)  
**Helper:** `src/lib/siteUrl.ts` → `getSiteOrigin()` / `absoluteUrl()`  
Without it: sitemap/robots still emit; Next warns that `metadataBase` falls back to localhost for OG resolution.

Optional: `ALLOW_PREVIEW_INDEXING=1` to allow indexing on Vercel preview.

---

## 12. Confirmation: examples do not silently overwrite plans

Visiting `/fence-planner?example=…` only opens the confirmation dialog. Loading requires an explicit **Load example** action, which creates a **new project id**. **Keep my plan** clears the query param without calling `replaceWith`. Workspace shape auto-apply is skipped when `example` is present.

---

## Handoff back to Codex

Phase 2A product alignment is complete. Safe to begin Phase 2B article integration using:

- `docs/fence-planner-calculation-contract.md` (still accurate; cut-bay post now corrected)
- this report for before/after FP-RS-01 and UI wording
- `GuideBlock` evidence types + `GuideExampleCta` / `scenario` blocks
- `/methodology` as the trust spine
