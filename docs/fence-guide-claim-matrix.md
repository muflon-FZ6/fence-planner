# Fence Planner — Guide Claim Matrix (Article ↔ Code)

Status: Phase 1  
Date: 2026-07-17  
Method: Extract tool/default/formula/feature claims from `src/content/guides/*.ts` and classify against live code (`docs/fence-planner-calculation-contract.md`).

Classifications: **Matches** | **Ambiguous** | **Mismatch** | **Unsupported** | **Potential code defect** | **External verification needed**

---

## Summary counts (Phase 1)

| Classification | Count (approx.) |
|---|---:|
| Matches | 48 |
| Ambiguous | 22 |
| Mismatch | 9 |
| Unsupported | 14 |
| Potential code defect | 1 |
| External verification needed | 11 |

Counts are claim-level, not article-level. One article can contain several classes.

---

## Mandatory known-problem inspections

### 1. Article 2 — 8 ft panel + 4 in post = 100 in module

| Claim | Class | Notes |
|---|---|---|
| Default module is panel-only = panel + post = 100 in | **Matches** | `moduleWidthMode: "panel_only"`, 96+4 |
| Modes named panel-only / includes-post | **Matches** | exact enum strings |
| Cut if remainder meaningful; buy whole panel | **Matches** | rem > 0.5 in |
| 80 ft → 9 full + 1 cut = 10 buy | **Matches** | FP-RS-01 validated |
| “Posts: ends plus line posts on the module” without stating 10 vs 11 | **Ambiguous** | Observed total posts = 10; construction may expect 11 |
| Endpoint/post accounting fully explained | **Ambiguous** / **Potential code defect** | Missing post at last full-module mark before cut — unresolved |

Source: `src/content/guides/how-to-calculate-fence-panels-and-posts.ts`  
Code: `geometry.ts` `moduleWidth`, `panel.ts`, `classifyPosts`

### 2. Article 2 — 80 ft example endpoint accounting

| Claim | Class | Notes |
|---|---|---|
| Example buy count 10 panels | **Matches** | |
| Implies posts follow module cleanly | **Ambiguous** | Does not publish a post total; observed 10 posts |

### 3. Article 3 — 6 ft vs 8 ft on 96 ft

| Claim | Class | Notes |
|---|---|---|
| 8 ft O.C. divides evenly into 12 spans | **Matches** | 96/8 = 12 |
| 6 ft O.C. adds more line posts | **Matches** | Observed totals 13 vs 17 posts (2 ends + line) |
| Exact post counts not stated | **Ambiguous** | Safe; tests pin 13 / 17 |

Source: `fence-post-spacing-explained.ts`

### 4. Article 4 — 4×4 displacement and 0.33 ft³ yield

| Claim | Class | Notes |
|---|---|---|
| Cylinder − square post × depth | **Matches** | `concrete.ts` |
| Defaults 12×36, 4 in face, 0.33 ft³ | **Matches** | |
| ~2.02 cu ft/post; ~7 bags if ceil per post | **Matches** | |
| Project-level round once smarter than per-post | **Matches** | FP-RS-05: 25 vs 28 |
| Yield is “typical 50 lb” | **Ambiguous** | Code comment only; not a SKU — **External** for brand claims |
| Post cross-section = nominal 4×4 actual | **Ambiguous** | Single editable number; no nominal/actual pair |

### 5. Article 6 — gate split and gate posts

| Claim | Class | Notes |
|---|---|---|
| Gate excluded from fill; mid-run → two segments | **Matches** | |
| Two gate posts; hinges/latch/drop rod rules | **Matches** | |
| Example 60 ft + 4 ft centered | **Matches** conceptually | |
| “Clear opening” language | **Ambiguous** | Code stores undifferentiated `width` |
| Swing affects calc | **Unsupported** if implied | Swing is visual only |

### 6. Article 9 — side-run gate / back-run remainder example

| Claim | Class | Notes |
|---|---|---|
| Moving a **side-yard** gate changes **back-run** remainder | **Mismatch** | Gate only splits its own run’s fill segments |
| Cut panel still costs a full panel | **Matches** | |
| Short leftover strategies generally | **Matches** / **Ambiguous** | “Move gate” valid only on **same** run |

Source: `handle-uneven-final-fence-section.ts` worked example

### 7. Article 10 — ground-path slope

| Claim | Class | Notes |
|---|---|---|
| Measure ground path for materials | **Ambiguous** editorial advice | Tool accepts whatever length user enters |
| Tool estimates flat-run materials | **Matches** (callout) | |
| Stepped vs racked modeled | **Unsupported** | No slope model (FP-RS-04 null) |
| Enter slope length as run length | **Ambiguous** | Possible workaround, not a feature |

### 8. Articles 11 / 18 — concrete / “Bag bags” wording

| Claim | Class | Notes |
|---|---|---|
| Art 11 checklist: “Bag bags from hole size × post count” | **Ambiguous** | Oversimplifies (misses post displacement & project ceil) — not a literal “Bag bags” typo in current source |
| Art 18: edit depth; defaults are starting points | **Matches** | |
| Frost modeling in tool | **Unsupported** | Editable depth only |
| Local frost depths | **External verification needed** | |

### 9. Article 13 — system-independent install order

| Claim | Class | Notes |
|---|---|---|
| Generic order: layout → terminals/corners → line → rails/panels/fabric → gates | **Ambiguous** | Reasonable planning prose; not tool-enforced |
| Implies one sequence fits all systems | **Ambiguous** / editorial | Chain-link tensioning differs — rewrite risk for Phase 3 |

### 10. Article 16 — moving a post away from a mark

| Claim | Class | Notes |
|---|---|---|
| Call before you dig / wait for marks | **External verification needed** | Process OK; needs official links in Phase 3 |
| Adjust layout when mark conflicts | **Matches** as planning advice | |
| Implies relocating post is always sufficient | **Unsupported** / safety overclaim risk | Tolerance zones, hand-dig rules, private lines — tool has **no** utility warning |

### 11. Article 19 — 5% waste defaults

| Claim | Class | Notes |
|---|---|---|
| Default wastePercent = 5 | **Matches** | |
| Panels off; pickets/rails on; concrete off; hardware not %-bumped as discrete | **Matches** with nuance | Fasteners still use waste inside pack rounding |
| Stock-length optimization | **Unsupported** if implied | Only ceil-to-stock / pack round |

### 12. Article 20 — structure-connection materials

| Claim | Class | Notes |
|---|---|---|
| Bracketed connection may remove purchased post/concrete | **Matches** | `posts.structure` excluded from buy & bags |
| Easy to set in UI | **Unsupported** | No Plan View control; data-model only |
| Side-yard preset exists | **Matches** | `projectFromYardShape("side_yard")` |

---

## Per-article matrix (condensed)

### 1. How to Measure for a New Fence
| Claim | Class |
|---|---|
| Measure runs separately; gates; corners | **Matches** planning model |
| Measurements ≠ survey | **Matches** disclaimer intent |
| “Enter run lengths in planner” | **Matches** |
| Measurement basis (what points) | **Ambiguous** — UI silent |

### 2. How to Calculate Fence Panels and Posts
See mandatory §1–2. Overall: strong Matches on panel math; Ambiguous/Potential defect on post tally with cuts.

### 3. Fence Post Spacing Explained
| Claim | Class |
|---|---|
| O.C. vs clear | **Matches** conceptually; UI doesn’t label |
| Defaults 8 ft wood / ~10 ft chain / panel module | **Matches** |
| Post overlays exist | **Matches** Plan View |

### 4. Concrete
See mandatory §4.

### 5. Corners and end posts
| Claim | Class |
|---|---|
| Shared corner counted once | **Matches** |
| Chain-link terminals/bracing language | **Matches** partially — brace bands estimated, not full brace kit |
| Structure vs end | **Matches** in data; UI gap |

### 6. Gates
See mandatory §5.

### 7. Panels vs pickets
| Claim | Class |
|---|---|
| Switch fence type on same layout | **Matches** |
| Pattern multipliers (bob/shadowbox) | **Ambiguous** if articles imply exact geometry — code uses estimate factors |

### 8. Six vs eight foot sections
| Claim | Class |
|---|---|
| Bay size changes posts/concrete | **Matches** |
| Overlaps Article 3 | Editorial merge candidate (not a code mismatch) |

### 9. Uneven final section
See mandatory §6 — **Mismatch** in worked example topology.

### 10. Slope
See mandatory §7.

### 11. Privacy checklist
| Claim | Class |
|---|---|
| Category grouping | **Matches** print categories roughly |
| Dynamic generated checklist on page | **Unsupported** — static article |
| Concrete line oversimplified | **Ambiguous** |

### 12. Chain-link checklist
| Claim | Class |
|---|---|
| Fabric after gates; terminals; top rail; ties | **Matches** |
| Loop caps / brace rail / bottom rail as calculated SKUs | **Unsupported** (partial) |
| Edit roll/rail lengths in settings | **Matches** |

### 13. Installation order
See mandatory §9.

### 14. Common mistakes
| Claim | Class |
|---|---|
| Double-count corners; forget gates; leftovers; defaults ≠ code | **Matches** |
| Interactive audit hub | **Unsupported** today — static article |

### 15. Permit / property line
| Claim | Class |
|---|---|
| Tool does not look up permits | **Matches** |
| Local rules | **External verification needed** |

### 16. Utilities
See mandatory §10.

### 17. Shopping list
| Claim | Class |
|---|---|
| Print list + blank prices | **Matches** planner print |
| This URL is the live generated list | **Unsupported** — article points at SEO tool page |

### 18. Post depth / frost
See mandatory §8.

### 19. Waste
See mandatory §11.

### 20. House / structure
See mandatory §12.

---

## Named features: article wording vs product

| Named in guides | Exists exactly? |
|---|---|
| Fence Planner / Plan View | Yes |
| Dream View | Yes |
| Post overlays | Yes (Plan View) |
| Leftover / short section warning | Yes (`panel_leftovers`) |
| Gate-near-corner tip | Yes (info) |
| Print materials / diagram | Yes in planner |
| Side-yard preset | Yes |
| Utility mark overlay | **No** |
| Slope / rack limit controls | **No** |
| Shareable “load this example” URL | **No** |
| Interactive remainder optimizer | **No** |
| Interactive pre-checkout audit (Art 14) | **No** |

---

## Related-tool routes

All current `relatedTool` paths resolve (see `docs/fence-guide-route-inventory.md`). Several are thin `ToolPage` shells, not distinct calculators — **Ambiguous** for readers expecting a dedicated widget on that URL.
