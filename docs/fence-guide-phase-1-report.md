# Fence Guide Phase 1 Report

Status: Complete  
Date: 2026-07-17  
Handoff: `docs/CURSOR_PHASE_1_HANDOFF.md`

Companion artifacts:

- `docs/fence-guide-route-inventory.md`
- `docs/fence-planner-calculation-contract.md`
- `docs/fence-guide-claim-matrix.md`
- `src/calc/fixtures/referenceScenarios.ts`
- `src/calc/referenceScenarios.test.ts`

---

## A. Executive result

| Item | Result |
|---|---|
| Overall confidence in calculator correctness | **Medium** |
| Safe to begin article rewrites | **Partially** |
| Guide routes found | **20 / 20** expected slugs |
| Article/code matches (claim-level, approx.) | **48** |
| Ambiguities | **22** |
| Mismatches | **9** |
| Unsupported claims | **14** |
| Confirmed code defects fixed | **0** |
| Unresolved product decisions | **5** (see §H) |

**Why Medium, not High:** Panel fill/cut math, concrete volume, waste flags, gate fill splits, and shared-corner counting are solid and test-backed. Confidence is reduced by (1) invisible measurement basis in the UI, (2) unresolved line-post placement when a cut remainder exists, (3) structure connections existing in data but not in Plan View UI, (4) chain-link hardware being coefficient estimates rather than a full fittings kit.

**Why Partially safe to rewrite:** Articles 1–7, 11–12, 14–15, 19 can be rewritten **around the verified contract** immediately if they state limitations honestly. Articles 8, 9, 10, 13, 16–18, 20 need decisions or careful limitation language first (merges, slope, utilities, structure UI, shopping-list architecture).

---

## B. Repository map

| Area | Finding |
|---|---|
| Framework | Next.js **16.2.10**, React 19.2.4, App Router (`src/app/`) |
| Guides content | `src/content/guides/{slug}.ts` + `index.ts`; renderer `GuideBody` |
| Guide routes | `/guides`, `/guides/[slug]` via `generateStaticParams` |
| Metadata | title/description; readingMinutes + updated in UI; minimal Article JSON-LD |
| Sitemap / robots / canonical | **Absent** |
| Calc domain | `src/domain/*` |
| Calc engine | `src/calc/*` (`engine`, `panel`, `concrete`, `gates`, `woodPrivacy`, `chainLink`, `fasteners`) |
| Warnings | `src/warnings/validate.ts` |
| Persistence | `localStorage` only — **no** shareable URLs |
| Plan / Dream | `src/canvas/plan/PlanView.tsx`, `src/canvas/dream/DreamView.tsx` |
| Print | `PrintSheet`, `ShoppingListPrint` (planner only) |
| Ads | `AdSlot` `guide-inline` on guide pages + footer |
| Tests | Vitest — `engine.test.ts` + new `referenceScenarios.test.ts` |

Full route table: `docs/fence-guide-route-inventory.md`.

---

## C. Calculation-contract summary

| Domain | Observed behavior | Validated? | Key code | Documentation consequence |
|---|---|---:|---|---|
| Run geometry | Planar endpoint-to-endpoint length (inches) | Partial | `geometry.ts` | Must say basis is abstract centerline; UI does not label O.C. vs outside |
| Modules | `panel_only` = panel+post (default 100 in); `includes_post` = panel | Yes | `moduleWidth` | Document exact enum names and defaults |
| Gates | Width removed from fill; splits segments; 2 posts; hardware by single/double | Yes (width meaning Ambiguous) | `fillSegments`, `gates.ts` | Call input “gate width as entered,” not proven clear opening |
| Post spacing | O.C. pitch; panel uses module; wood 8 ft; chain 10 ft | Yes | `classifyPosts`, defaults | Publish 96 ft → 13 vs 17 posts for 8 vs 6 ft wood |
| Concrete | πr²h − face²h; project-level bag ceil; 0.33 ft³ yield | Yes | `concrete.ts` | 4 posts → **25** bags default; not 28 |
| Waste | 5%; panels/concrete off; pickets/rails on; fasteners pack w/ % | Yes | flags + `packageCount` | Do not claim stock optimizer |
| Chain-link | Fabric, rolls, top rail, ties, terminals, rough brace bands | Partial | `chainLink.ts`, engine | List unsupported fittings explicitly |
| Slope | Not modeled | Yes (as limitation) | — | FP-RS-04 = cannot represent |
| Structure | `structure` posts not bought/concreted | Yes in data / No UI | engine + joints | Do not claim easy UI control |
| Warnings | leftovers 24 in; gate-near-end 12 in; shallow hole 24 in | Yes | `validate.ts` | Use exact thresholds |

---

## D. Reference-scenario results

| Scenario | Representable? | Observed output (summary) | Independently reconciled? | Test status | Issues |
|---|---:|---|---:|---|---|
| FP-RS-01 straight panel 80 ft | Yes | Module 100 in; 9 full + 1×60 in cut; buy 10; **10 posts** (2 end + 8 line) | Panels **yes**; posts **unresolved** | Panels asserted; post count observed; `it.todo` for boundary post | Cut-bay post placement |
| FP-RS-02 U 48/60/48 + gate + structure | Yes (structure via fixture) | Fill 152 ft; 2 corners; 2 structure; 2 gate; concrete excludes structure | Yes for fill/roles | Passing | Structure not creatable in Plan View UI |
| FP-RS-03 gate positions on 60 ft | Yes | Fill always 56 ft; segment lengths change; buy count stable across offsets tested | Yes | Passing | — |
| FP-RS-04 slope | **No** | N/A | Limitation confirmed | Passing null/limitation test | Do not invent slope in Phase 1 |
| FP-RS-05 concrete | Yes | perPost ≈ 2.02 ft³; project bags **25**; naive 7×4=28 | Yes | Passing | Yield not a SKU |
| FP-RS-06 chain 150 ft + gate | Yes | Fill 146 ft; 3 rolls; top rail ceil(150/21); terminals ≥5; hinge/latch 1 | Partial (fittings incomplete) | Passing core asserts | Unsupported SKUs |

Serialization: **not supported** (`REFERENCE_SCENARIO_SERIALIZATION.shareUrl === false`).

---

## E. Article claim findings

See full matrix: `docs/fence-guide-claim-matrix.md`.

Highest-priority findings:

1. **Art 2** — Panel math Matches; post total with remainder **Unresolved / potential defect**.
2. **Art 9** — Worked example claiming a side-run gate fix changes a **back-run** remainder is a **Mismatch**.
3. **Art 10** — Slope advice exceeds tool capability (**Unsupported** beyond “enter a length”).
4. **Art 16** — Utility workflow needs official sources; tool has **no** locate feature (**External** + overclaim risk).
5. **Art 20** — Structure BOM Matches in engine; **Unsupported** as user-facing control.
6. **Art 11/17** — Checklists are static prose, not generated tool output (**Unsupported** as interactive pages).
7. **Art 8 / 18** — Merge candidates editorially (not code bugs).

---

## F. Production changes made

**None.**

No calculator, warning, or routing behavior was changed. Phase 1 added documentation, fixtures, and tests only.

(Pre-existing ESLint `react-hooks/set-state-in-effect` errors in `StyleBuilder.tsx` / `projectStore.tsx` were not introduced here and were not fixed.)

---

## G. Proposed content architecture (feasibility only — no redirects applied)

| Proposal | Technical feasibility | Route implication |
|---|---|---|
| Art 8 → Art 3 | High — spacing content overlaps | Redirect later after Art 3 absorbs bay-size comparison |
| Art 18 → Art 4 | High — frost is editable `holeDepth` context for concrete | Redirect after Art 4 absorbs sourced frost guidance |
| Art 9 → Art 2 vs remainder optimizer | Absorbing explanation into Art 2: High. True optimizer UI: Medium — needs new interaction on Plan View leftovers | Prefer merge until optimizer exists |
| Art 17 → Art 11/12 or generated list landing | Generated list already exists in planner print; landing URL could deep-link `/fence-planner` print stage — Medium | Do not pretend `/fence-project-shopping-list` generates lists today |
| Art 14 interactive audit hub | High reuse of `validateProject` + claim checklist — Medium UI work | Keep static until hub ships |

**No redirects, noindex, or deletions applied in Phase 1.**

---

## H. Questions requiring product/editorial decisions

### H1. Measurement basis labeling
- **Question:** What physical points does run length measure between?
- **Current:** Abstract planar endpoint distance; UI silent.
- **Options:** (A) Document as centerline between endpoint markers; (B) Redefine to outside-to-outside including posts; (C) Offer mode toggle.
- **Effect:** (B)/(C) change all lengths and saved projects.
- **Recommend:** (A) for Phase 2 copy + UX label; revisit (C) later.
- **Migration:** None for (A).

### H2. Line post at last full module before cut (FP-RS-01)
- **Question:** Should 80 ft / 100 in module place a post at 900 in (11 posts) or keep observed 10?
- **Current:** `i = 1 .. floor(L/mod)-1` → 10 posts.
- **Options:** (A) Keep observed + document limitation; (B) Place posts at every full-module boundary including last before remainder; (C) Separate “panel count” from “post layout” algorithms with explicit rules.
- **Effect:** (B)/(C) change post and concrete totals for many layouts.
- **Recommend:** (B) after failing characterization test — appears objectively wrong for panel construction — but **needs explicit product sign-off** before coding (saved plans would shift).
- **Migration:** Recalculate on load or version settings.

### H3. Gate width = clear opening?
- **Question:** Is `Gate.width` clear opening, leaf, or kit?
- **Current:** Undifferentiated inches subtracted from fill.
- **Options:** (A) Label as “opening width as entered”; (B) Split clear vs leaf fields.
- **Recommend:** (A) now; (B) later if hardware kits require it.

### H4. Structure-connection UX
- **Question:** How should users mark house connections?
- **Current:** Data model yes; Plan View no.
- **Options:** (A) Add joint tool; (B) Keep data-only and tell articles not to promise UI; (C) Auto-detect near “house” scene (fragile).
- **Recommend:** (B) for rewrites now; (A) before Art 20 becomes flagship.

### H5. Bag yield SKU identity
- **Question:** Which product is 0.33 ft³?
- **Current:** Constant + comment “typical 50 lb.”
- **Options:** (A) Keep as editable planning average; (B) Bind to named bag with sourced yield.
- **Recommend:** (A) in copy; never invent a brand yield without a source.

---

## I. Verification results

| Command | Result |
|---|---|
| `npx vitest run` | **Pass** — 45 passed, 1 todo (2 files) |
| `npx tsc --noEmit` | **Pass** |
| `npm run lint` | **Fail (pre-existing)** — 3 errors / 1 warning in `StyleBuilder.tsx`, `projectStore.tsx` (react-hooks/set-state-in-effect); unrelated to Phase 1 |
| `npm run build` | **Pass** — 41 static routes including all 20 guide slugs |
| Route/link checker | **Not present** in repo; manual inventory used instead |

---

## J. Phase 2 readiness

### Can rewrite immediately (with contract + limitation language)

- **1** Measure (state measurement basis Ambiguous → use contract wording)
- **2** Panels/posts (publish validated panel math; footnote unresolved post tally)
- **3** Spacing (include 13 vs 17 on 96 ft)
- **4** Concrete (25 bags example; editable yield)
- **5** Corners/ends (shared joints; chain-link terminal language careful)
- **6** Gates (segment split; swing visual-only)
- **7** Panels vs pickets (comparison via fence-type switch)
- **11–12** Checklists (static OK if honest; note not live-generated)
- **14** Mistakes (static hub OK)
- **15** Permits (external sources required in rewrite)
- **19** Waste (category flags)

### Must wait for decision or implementation

| Article | Blocker |
|---|---|
| **8** | Merge decision into Art 3 |
| **9** | Fix/replace invalid example; merge vs optimizer decision |
| **10** | Slope model decision — rewrite as limitation + measurement advice only, or wait for feature |
| **13** | System-specific sequences (editorial) |
| **16** | Official locate links + tone (no “move post = safe”) |
| **17** | Shopping-list architecture / deep-link |
| **18** | Merge into Art 4 |
| **20** | Structure UX decision |

---

## Explicit answers to handoff questions

1. **Run length points:** Planar coordinates of run `start`/`end` (abstract centerline). Not labeled O.C./outside in UI.  
2. **Module modes:** `"panel_only"` → panel+post; `"includes_post"` → panel width only.  
3. **Post dimensions:** Single user/default inch values — no nominal/actual pair.  
4. **Half-post widths:** Not applied to run length; may be inside module via `panel_only`.  
5. **Gates:** Width subtracted; fill computed **per segment** after split.  
6. **Cut panels:** Purchased **per segment**, then summed; waste (if on) after aggregation.  
7. **Short final warning:** remainder `> 0.5` and `< 24` in → severity warning (`panel_leftovers`).  
8. **Bag yield:** `0.33 ft³` (`DEFAULT_BAG_YIELD_CU_IN`); intended as typical 50 lb planning average — **not** a sourced SKU.  
9. **Concrete rounding:** **Once per project** (`ceil(totalVolume / yield)`).  
10. **Who gets concrete:** All posts except `structure`; hole sizes are global, not per role.  
11. **Waste:** Default 5%; pickets/rails on; panels/concrete off; fasteners use % inside pack rounding.  
12. **Stock optimization:** No true optimizer — percentage waste + ceil-to-roll/rail/pack + lumber label rounding.  
13. **Chain-link calculated:** Fabric, rolls, top rail sections, ties, line/terminal posts, tension wire flag, estimated tension bars/brace bands, gate hardware.  
14. **Slope:** **Not modeled** — single planar run length only.  
15. **Structure connection:** Removes post from purchase count and concrete; may still appear as structure post; **no** auto bracket SKU line beyond generic fasteners/notes.  
16. **Named features:** Plan View, Dream View, overlays, leftovers warning, gate-near-end tip, presets, print — **exist**. Utility overlay, slope controls, share URLs, interactive audit — **missing**.  
17. **Serializable scenarios:** **No** share URLs; localStorage project JSON only.  
18. **Reusable for interactive components:** `validateProject`, `calculateMaterials`, `fillSegments`, `moduleWidth`, fixtures in `referenceScenarios.ts` can power Art 9/14 tools without duplicating formulas.

---

## Files changed (Phase 1)

**Added**

- `docs/fence-guide-route-inventory.md`
- `docs/fence-planner-calculation-contract.md`
- `docs/fence-guide-claim-matrix.md`
- `docs/fence-guide-phase-1-report.md` (this file)
- `src/calc/fixtures/referenceScenarios.ts`
- `src/calc/referenceScenarios.test.ts`

**Not changed:** calculator production logic, guide article prose, redirects, sitemap, robots.

---

## Handoff back to Codex

1. This report is the Phase 1 source of truth for rewrite safety.  
2. Use the calculation contract for every numeric claim; use the claim matrix for conflict lists.  
3. Do not publish FP-RS-01 post totals as “correct” until H2 is decided.  
4. Do not invent slope, utility clearance, or bag SKUs.  
5. Unresolved blockers for full Phase 2: H1–H5 above, plus merge decisions for Arts 8/18/9/17.
