# Fence Planner — Publisher-Value Upgrade Report

**Date:** 2026-07-21  
**Public origin:** `https://fenceblueprint.com`  
**Scope:** AdSense-oriented usefulness / transparency upgrade per `docs/CURSOR_ADSENSE_VALUE_UPGRADE_HANDOFF.md`

This report documents evidence-backed product work. It is **not** an AdSense approval guarantee.

---

## 1. Implementation summary and public routes

### Added

| Route | Role |
|---|---|
| `/examples/[slug]` × 5 | Indexable Reference Scenario Studio detail pages |
| `/build-readiness` | Build Readiness Audit + printable field kit |

### Changed

| Route | Change |
|---|---|
| `/examples` | Replaced shallow `shape=` cards with Scenario Studio index |
| `/about` | Expanded publisher trust: what we are / are not, process, corrections, ads |
| `/privacy` | Notes Build Readiness answers stay in local storage |
| `/`, `/fence-planner`, `/fence-calculator`, `/about`, `/examples`, `/build-readiness` | Canonical + Open Graph when `NEXT_PUBLIC_SITE_URL` is set |
| Guides (6) | Evidence blocks, audit CTAs, sources / slope lab as applicable |
| Sitemap | `/build-readiness` + five `/examples/[slug]` URLs |
| Footer | Scenario Studio, Build readiness, Methodology |

### Scenario detail slugs

1. `/examples/straight-80-foot-panel-run` → `fp-rs-01-straight-panel-run`  
2. `/examples/u-shaped-yard-with-gate` → `fp-rs-02-u-shaped-yard`  
3. `/examples/gate-position-and-final-bay` → `fp-rs-03-gate-position-remainders`  
4. `/examples/four-post-concrete-bag-yield` → `fp-rs-05-concrete-bag-yield`  
5. `/examples/chain-link-system-layout` → `fp-rs-06-chain-link-system`  

FP-RS-04 remains a non-loadable limitation (slope lab + index note only).

---

## 2. Calculation sources of truth

| Concern | Helper |
|---|---|
| Scenario fixtures | `buildReferenceScenario` (`src/domain/referenceScenarios.ts`) |
| Display summaries | `buildScenarioStudioSummary` → `calculateMaterials` (`src/domain/scenarioStudio.ts`, `src/calc/engine.ts`) |
| Slope lab | `computeSlopeDecision` (`src/calc/slopeDecision.ts`) — geometry only; no planner slope model |
| Readiness decisions | `evaluateReadinessAudit` (`src/domain/buildReadiness.ts`) |
| Planner CTA | `examplePlannerHref` + existing `ExampleLoader` confirmation |

Material counts are **not** hard-coded in the scenario content registry.

---

## 3. Scenario highlights and limitations

Pinned via `src/domain/scenarioStudio.test.ts` against the shared engine (same pins as existing reference tests where applicable):

| ID | Derived highlights (engine) | Stated limitations (content) |
|---|---|---|
| FP-RS-01 | 80 ft run; 11 posts (2 end / 9 line); 10 panels to buy; 68 concrete bags | Hypothetical; no slope/frost/SKU inventory |
| FP-RS-02 | ~152 ft fill; 2 corners, 2 structure, 2 gate | Not a survey; no swing/HOA design |
| FP-RS-03 | 56 ft fill; gate segment summary | Does not optimize gate placement |
| FP-RS-05 | Concrete bags from freestanding posts + settings | No frost ZIP lookup; not a brand quote |
| FP-RS-06 | Chain-link fabric/rail lines from engine | Not a full bracing design |

Each page labels **Hypothetical planning example**, shows assumptions, plan SVG (`PlanDiagram`), engine results, “what it means”, “what it does not prove”, confirmation-based planner CTA, related guides, methodology link.

---

## 4. Sources added / verified

| Guide | Sources | Notes |
|---|---|---|
| Permit / property-line | About + Methodology on fenceblueprint.com | Process only — no local legal setbacks |
| Utilities | https://call811.com/ ; https://www.clickbeforeyoudig.com/ | Checked 2026-07-21; private-line distinction without invented clearance distances |
| Installation order | None external | Explicit “follow your product manual” checkpoint; no fake manufacturer URL |
| Slope | N/A (lab) | No manufacturer rack-limit claim without a cited product |

No previously cited external URLs were replaced; these guides previously had no `sources` blocks.

---

## 5. Publisher / metadata changes

- About: DoubleM publisher name, `hello@doublem.ca`, corrections path, ads separation copy  
- Root layout: `metadataBase`, root canonical, site OG when origin configured  
- Homepage, planner, calculator, examples, build-readiness: route metadata + canonical/OG  
- `fence-calculator` / `fence-planner`: server shells + client children so metadata can export  
- No review stars, Product, or LocalBusiness schema added  
- Separate `/editorial-policy` **not** added (About + Methodology cover it)

---

## 6. Verification results

| Check | Result |
|---|---|
| `npm run test` | Pass — 119 tests |
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass (via build) |
| `NEXT_PUBLIC_SITE_URL=https://fenceblueprint.com npm run build` | Pass — 48 static routes including 5 scenario pages |

**Browser / mobile / print:** Implemented with print classes for readiness field kit and existing `no-print` conventions. Owner should spot-check after deploy:

- Scenario CTA with an existing local plan (confirmation modal)  
- Ready / Verify / Stop audit states + print preview  
- Narrow viewport on Scenario Studio and audit  

---

## 7. Deliberate deferrals

- No named human editor/credentials (none supplied)  
- No `/editorial-policy` page (avoid duplication)  
- No manufacturer-specific rack-limit comparison in slope lab (no verified product source)  
- No automated browser visual regression suite in CI for this phase  
- Shallow legacy `shape=` example cards removed from `/examples` (planner query presets elsewhere unchanged)

---

## 8. Owner release checklist

1. Confirm About publisher display (“Fence Planner, published by DoubleM”)  
2. Deploy (Hostinger will pick up `.env.production` site URL)  
3. Verify live: `/ads.txt`, `/examples`, one scenario page, `/build-readiness`, `/sitemap.xml`  
4. Submit / refresh sitemap in Search Console  
5. Apply or reapply to AdSense with the stronger usefulness evidence above  

Again: this improves the publisher case; it does not guarantee AdSense approval.
