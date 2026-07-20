# Fence Planner — Calculation Contract

Status: Phase 1 verified against live code (2026-07-17)  
Labels: **Observed** = current code; **Intended** = types/copy/tests; **Validated** = independently reconciled and safe to document; **Unresolved** = needs product/editorial decision.

Internal storage is always **inches**. Display converts via `unitSystem` (`imperial` | `metric`).

Primary entry points:

| Concern | Path | Symbol |
|---|---|---|
| Defaults | `src/domain/defaults.ts` | `defaultSettings()` |
| Units / bag yield | `src/domain/units.ts` | `DEFAULT_BAG_YIELD_CU_IN`, `feetToInches` |
| Geometry / posts | `src/domain/geometry.ts` | `classifyPosts`, `fillSegments`, `moduleWidth` |
| Materials | `src/calc/engine.ts` | `calculateMaterials` |
| Warnings | `src/warnings/validate.ts` | `validateProject` |

---

## 2.1 Run geometry and measurement basis

### What a run length represents

| Label | Statement |
|---|---|
| **Observed** | `FenceRun.length` is the Euclidean distance between `start` and `end` points in plan-view inches (`distance` / `syncRunLengths` in `geometry.ts`). |
| **Validated** | It is an **abstract planar centerline length** between endpoint coordinates. |
| **Unresolved** | The UI does **not** tell the user whether that length is outside-to-outside, clear opening, or post-center to post-center. **Phase 2 UX requirement:** surface the measurement basis. |

Post widths are **not** automatically added to or subtracted from run length. Module mode may add `postWidth` into the **bay/module** used for panel and line-post spacing (`moduleWidth`), which is separate from run length.

### Endpoints and joining

| Topic | Observed behavior | Code |
|---|---|---|
| Representation | Endpoints are 2D points; runs are edges; posts are classified at points | `FenceRun`, `classifyPosts` |
| Shared corner | Coincident endpoints (ε = 0.5 in) share one post | `pointsEqual`, `keyFor` |
| Corner vs straight | Angle at joint `< 150°` → corner (or chain-link `terminal`); else shared straight treated as `line` for wood/panel | `CORNER_ANGLE_THRESHOLD = 150` |
| Open ends | Unconnected endpoints → `end` (or chain-link `terminal`) | `classifyPosts` endpoint loop |
| Structure connection | `Joint.type === "structure_connection"` → post type `structure` | joints + classify |
| Multi-role posts | Same point: priority `gate > corner > end > structure > terminal > line` | `addPost` rank map |
| Curves / slope | **Not modeled** | no fields |

**Structure connections:** type exists and is preserved by `rebuildJoints`, but Plan View has **no first-class control** to create them. Fixtures can set them in data (`FP-RS-02`).

**Structure BOM effect (Validated):** `concrete` and purchased post quantity use `posts.total - posts.structure` (`engine.ts`). Structure posts are listed as connections, not bought/concreted posts.

---

## 2.2 Panel / module calculation

### Modes (`ModuleWidthMode`)

| Mode | Exact name | Module width | Default |
|---|---|---|---|
| Panel only | `"panel_only"` | `panelWidth + postWidth` | **Yes** |
| Includes post | `"includes_post"` | `panelWidth` | No |

Defaults: `panelWidth = 96 in` (8 ft), `postWidth = 4 in` → module **100 in** in `panel_only`.

Dimensions are **user-editable numbers**. Labels elsewhere may say 4×4; there is **no** separate nominal-vs-actual dimension system — whatever the user (or default) enters is used as actual inches.

### Full / cut / buy (Validated)

Per **fill segment** (`fillSegments`), not per whole run:

1. `full = floor(seg.length / moduleWidth)`
2. `remainder = seg.length - full * moduleWidth`
3. If `remainder > 0.5` in → one cut panel of length `remainder` (still buys 1 full panel)
4. `totalPanelsToBuy = fullPanels + cutPanels.length`
5. If `applyWasteToPanels` → `ceil(buy * (1 + waste%/100))` (default **off**)

Code: `src/calc/panel.ts` `calculatePanels`.

### Short-bay warning (Validated)

`validate.ts`: for panel type, any segment with remainder `> 0.5` and `< 24` in (`SHORT_SECTION_IN`) elevates `panel_leftovers` to severity **warning**; otherwise **info**.

### Endpoint posts vs occupied length

Run length does not expand for half-posts at ends. Line posts are placed along fill segments at `i * spacing` for `i = 1 .. floor(seg/spacing)-1`.

| Label | Note |
|---|---|
| **Observed** | For 80 ft / 100 in module: 9 full + 1 cut (60 in), **10 posts** (2 end + 8 line). |
| **Unresolved** | Construction intuition often wants a post at the last full-module mark before the cut (11 posts). Not fixed in Phase 1 — see report §H. |

Plan View overlays module ticks and classified posts from the same geometry functions.

---

## 2.3 Gate behavior

| Topic | Observed | Code |
|---|---|---|
| Gate width meaning | Stored as `Gate.width` inches; treated as opening removed from fill — **not** labeled clear vs leaf vs kit in UI | `types.ts`, `fillLengthForRun` |
| Position | `offsetFromRunStart` along run | |
| Fill split | Gates sort by offset; segments are non-gate intervals | `fillSegments` |
| Fill removal | `run.length - Σ gate.width` on that run | `fillLengthForRun` |
| Posts | Two posts at gate start/end; wood/panel type `gate`; chain-link `terminal` | `classifyPosts` |
| Shared roles | Gate rank beats corner/end at same point | |
| Hardware | single: 1 hinge + 1 latch; double: 2 hinges + 1 latch + 1 drop rod | `calculateGateHardware` |
| Near-end warning | Within **12 in** of either run end → `gate_corner_*` info | `GATE_NEAR_CORNER_IN` |
| Swing | `swingDirection` / `swingOpen` — **visual only** in Dream View; no calc effect | DreamView |

---

## 2.4 Post spacing

| Topic | Observed |
|---|---|
| Semantics | Spacing used as **on-center** pitch along the fill segment for intermediate posts |
| Panel | Line-post spacing = `moduleWidth(project)` (ignores `postSpacing` for placement) |
| Wood privacy | Default `postSpacing = 96 in` (8 ft); styles may set 6 ft |
| Chain-link | Default `postSpacing = 120 in` (10 ft) |
| Last span | Remainder after `floor(L/spacing)*spacing` has no extra intermediate post |
| Redistribution | **No** automatic redistribute across bays |
| Utility conflict | **No** utility model; only manual layout edits |

Wood span math for rails/pickets (`woodPrivacy.ts`) uses `ceil(seg.length / postSpacing)` spans — related but not identical to `classifyPosts` line-post loop.

---

## 2.5 Concrete calculation

**Validated formula** (`concrete.ts`):

1. Hole (cylinder): `π * (diameter/2)² * depth`
2. Subtract square post: `postCrossSection² * depth`
3. `perPost = max(0, hole - post)`
4. `total = perPost * postCount` (+ optional waste %)
5. `bags = ceil(total / concreteBagYield)` — **project-level** rounding

| Default | Value | Source |
|---|---|---|
| Hole diameter | 12 in | `defaultSettings` |
| Hole depth | 36 in | |
| Post cross-section | 4 in | same field family as post width; not a separate “actual vs nominal” pair |
| Bag yield | `0.33 * 1728` cu in ≈ **0.33 ft³** | `DEFAULT_BAG_YIELD_CU_IN` — comment: typical 50 lb bag; **not** a specific SKU |
| Waste on concrete | off | `applyWasteToConcrete: false` |
| Who gets concrete | `posts.total - posts.structure` | `engine.ts` |
| Per-role hole sizes | **No** — one global hole diameter/depth | |
| Gravel / frost / soil / bell | **Not modeled** | |

FP-RS-05 at defaults, 4 posts: **25 bags** project-level vs **28** if ceil-per-post × 4.

---

## 2.6 Waste and stock rounding

| Category | Default waste? | Stage |
|---|---|---|
| Panels | No | After full+cut buy count |
| Pickets / battens / wire panels / cut boards | Yes (5%) | After pattern multipliers |
| Rails | Yes | After `spans * railsPerSpan` |
| Concrete | No | After volume, before bag ceil (if enabled, multiplies volume) |
| Fasteners | Always uses `wastePercent` inside `packageCount` | `ceil(raw*(1+w%))` then pack to 50 or 100 |

**Stock optimization:** limited labels via `lumberSpec.ts` (`stockLengthFeet` round-up to 6–16 ft) for display names — **not** a cutting-stock optimizer for rails/fabric. Fabric rolls and top rail use `ceil(length / stockLength)` only.

UI: waste toggles exist in settings; print sheet includes assumptions/warnings.

---

## 2.7 Chain-link system

**Calculated (Observed / mostly Validated):**

| Component | Rule |
|---|---|
| Fabric length | Total fill after gates |
| Fabric rolls | `ceil(fill / fabricRollLength)` default 50 ft |
| Top rail sections | `ceil(totalRunLength / topRailSectionLength)` default 21 ft |
| Ties | `ceil((fill/12) * tiesPerFoot)` default 1/ft |
| Line posts | 10 ft O.C. default along fill |
| Terminals | ends, corners, gates as `terminal` |
| Tension bars | engine uses `max(2, posts.terminal)` |
| Brace bands | `tensionBars*2 + (tensionWire ? runs.length : 0)` |
| Tension wire | boolean setting; affects brace-band add-on and line item |
| Gate hardware | same hinge/latch rules; chain-link posts typed terminal |

**Not calculated as distinct SKUs (articles must not imply they are):** bottom rail as alternate restraint SKU, loop caps count, brace rail stock lengths, mesh gauge/height SKU math beyond height label, hog rings separate from ties.

---

## 2.8 Warnings and named features

| Feature / warning | Exists? | Trigger / note | Location |
|---|---|---|---|
| `panel_leftovers` | Yes | rem > 0.5; warning if rem < 24 in | `validate.ts` |
| `gate_corner_*` | Yes | gate within 12 in of run end | |
| `shallow_hole` | Yes | 0 < depth < 24 in | |
| `invalid_hole` | Yes | diameter or depth ≤ 0 | |
| `no_runs` / zero length / gate too wide | Yes | | |
| Utility conflict warning | **No** | guides only | |
| Slope limitation warning | **No** in validator | methodology/guides | |
| Module mismatch warning | **No** | | |
| Plan View | **Yes** | `src/canvas/plan/PlanView.tsx` | |
| Dream View | **Yes** | `src/canvas/dream/DreamView.tsx` — illustrative | |
| Post overlays | **Yes** | Plan View | |
| Presets / intents | **Yes** | `presets.ts`, onboarding | |
| Print plan / shopping list | **Yes** | `PrintSheet`, `ShoppingListPrint` | |
| CSV/PDF export API | **No** | browser print only | |
| Shareable scenario URL | **No** | localStorage only | |

---

## Explicit non-support (do not document as tool capabilities)

- Slope / stepped / racked geometry
- Curves
- Frost-line lookup
- Utility locate / 811 clearance
- Survey / legal boundaries
- Structural engineering
- Live prices / retailer SKUs
- Per-post-role hole specifications

---

## Phase 2 UX flag

**Measurement basis is invisible in the UI.** Until clarified, articles must say the tool uses planar endpoint-to-endpoint run length in inches, and module mode separately defines bay width for panels/posts.
