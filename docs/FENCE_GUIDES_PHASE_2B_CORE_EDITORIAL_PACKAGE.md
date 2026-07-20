# Fence Guides Phase 2B — Core Editorial Package

Status: Approved editorial source for implementation after Phase 2B Task 0

Date: 2026-07-17

## How Cursor should use this package

This document supplies the final editorial meaning and wording for the first six canonical guides. Convert each labeled element into the existing typed `GuideBlock` structure. Preserve the calculations, limitations, source names, source URLs, figure alt text, and reference-scenario IDs exactly. Minor punctuation changes needed for rendering are acceptable; do not simplify the technical distinctions.

These are transparent demonstrations of a free software tool. They are not customer projects, case studies, or claims of fence-installation experience.

Each guide must retain the site-wide byline, methodology link, AI-assistance disclosure, planning-estimate boundary, truthful generated reading time, and substantive update date already implemented by the product.

---

# Guide 1 — How to Measure for a New Fence

## Metadata

- Slug: `how-to-measure-for-a-new-fence`
- Title: `How to Measure for a New Fence`
- Description: `Measure a proposed fence as separate centerline runs, gate openings, corners, and endpoints so the planner can produce a layout-based materials estimate.`
- Related tool: `/fence-planner`
- Related guides: `how-to-calculate-fence-panels-and-posts`, `measure-and-plan-a-fence-gate`, `fence-permit-and-property-line-checklist`, `mark-underground-utilities-before-digging`
- Scenario: `fp-rs-02-u-shaped-yard`

## Publication-ready body

Measuring a fence is not the same as collecting one perimeter number. Panels and posts depend on where each straight run starts and stops, where two runs share a corner, and where a gate removes fill. A useful field sketch preserves those decisions instead of flattening the yard into “156 feet of fence.”

Fence Planner uses an overhead layout. A run is the plan-view centerline distance between two endpoint markers. Those markers represent future post centers or another declared endpoint condition; they are not the outside faces of installed posts. Keeping that convention consistent is more important than choosing a particular tape or measuring wheel.

### Callout — A planning measurement is not a property survey

Tape, wheel, satellite image, and planner measurements estimate a proposed layout. They do not establish a legal boundary. If the line is unclear, missing, disputed, or close to an easement, obtain the applicable survey or qualified local help before locating the fence. Local fence rules also vary, so record the source and date of every requirement you rely on.

## Make the field sketch before measuring

Draw a simple overhead outline of the house and yard. It does not need to be artistic. It does need to preserve the layout.

| Record | Why the planner needs it |
|---|---|
| Each straight run as A, B, C, and so on | Modules and remainders are calculated per run and per gate-free segment |
| Every corner and open end | Shared corners are one joint; open ends are separate endpoints |
| Each planned gate opening and its position along the run | A gate removes fill and splits a run into two calculation segments |
| House, garage, wall, or other structure near an endpoint | A structure-adjacent condition is not automatically a normal freestanding end post |
| Trees, downspouts, equipment, paving, and major grade changes | These may force a post, gate, or endpoint to move |
| Source/date for the property line and local rules | The planner cannot verify boundaries, permits, setbacks, or easements |

## Use temporary markers, not installed posts

Place flags, stakes, or removable marks at the proposed start, corner, gate, and end points. Run a taut string for one straight segment at a time. The string represents the proposed fence centerline.

Do not bend a measuring tape around a corner and treat the result as one run. Measure to the corner marker, record that run, reposition for the next straight run, and record it separately. A helper keeps a long tape straight and reduces the chance of measuring a diagonal between offset points.

If you use a measuring wheel, repeat important dimensions with a tape where practical. Wheels are convenient on long ground paths but can accumulate error over bumps, vegetation, and turns.

## Field method

1. Confirm that the proposed line is inside the area you are entitled to plan. Resolve uncertain boundaries before treating the sketch as authoritative.
2. Mark the start and end of every straight run with temporary points.
3. Pull a taut string along one run so its alignment is visible.
4. Measure from endpoint marker to endpoint marker along that centerline and write the value beside the same run on the sketch.
5. At every turn, stop the measurement and begin a new run from the shared corner marker.
6. Mark each gate on its host run. Record its planned opening width, distance from the run start, swing side, and the object or equipment that must pass through it.
7. Measure offsets to obstacles that may conflict with a post or swing envelope.
8. Repeat the critical dimensions, then enter the same run structure in Plan View and compare the displayed shape with the field sketch.

### Callout — Gate width is still a planning input

Fence Planner removes the entered planned gate opening from fill. It does not derive a finished leaf width, hinge gap, latch gap, or manufacturer-specific post opening. Select the gate system and use its instructions before setting gate posts.

## Slopes and curves need extra notes

Fence Planner is a plan-view tool; it does not model rise, stepped panels, racked panels, or curves.

On a noticeable slope, record both the horizontal plan distance and the ground/slope distance. A stepped system is governed primarily by horizontal post spacing, while a racked or follow-the-grade system may also depend on the slope length and the product's rack limit. Do not silently substitute one measurement for the other.

For a curved boundary, decide whether the built fence will be a sequence of short straight runs. Record each intended chord as a separate run. Do not enter one long straight run if the field installation will turn several times.

## Reproducible example — FP-RS-02 U-shaped yard

### Scenario notice

Hypothetical planning example. These inputs and results explain and test Fence Planner. They do not describe a customer project or completed installation.

### Inputs

- Left run: 48 ft
- Rear run: 60 ft
- Right run: 48 ft
- One 4 ft planned gate opening on the left run, starting 8 ft from the house-side endpoint
- Two rear corners shared by adjacent runs
- Two house-side endpoints represented as structure connections in the predefined fixture
- Default panel settings: 96 in panel, 4 in post face, 100 in calculated pitch

### What the measurement preserves

| Quantity | Result |
|---|---:|
| Total run length | 156 ft |
| Planned gate opening removed from fill | 4 ft |
| Total panel fill | 152 ft |
| Straight runs retained | 3 |
| Gate-free fill segments | 4 |
| Shared rear corners | 2 |
| Structure-side endpoints in this fixture | 2 |

Entering only “152 feet of fill” would lose the gate position, shared corners, and structure-side endpoint conditions. Entering the three runs and the gate preserves the geometry that the post and panel calculations need.

### Scenario block

- `exampleId`: `fp-rs-02-u-shaped-yard`
- Label: `Open the U-shaped measurement example`

## Before leaving the yard

- Every straight run has its own recorded length.
- Every corner, open end, and structure-adjacent endpoint is marked.
- Every gate has an opening, offset, and swing note.
- Obstacles and grade changes that could move a post are shown.
- Critical dimensions were repeated.
- Property, permit, and utility questions are listed as outside-the-tool checks.
- Plan View resembles the field sketch before materials are trusted.

## Sources

1. Title: `Office of the Surveyor General glossary`
   - Organization: `Government of Ontario`
   - URL: `https://www.ontario.ca/page/office-surveyor-general-glossary`
   - Accessed: `2026-07-17`
2. Title: `Line Fences Act guidance`
   - Organization: `Government of Ontario`
   - URL: `https://www.ontario.ca/page/line-fences-act`
   - Accessed: `2026-07-17`
3. Title: `Wood fence installation instructions`
   - Organization: `Outdoor Essentials / UFP Retail Solutions`
   - URL: `https://www.outdooressentialproducts.com/-/media/project/ufpi/outdoor-essentials/products/documents/assembly-instructions/wood-fence/outdoor-essentials_generic-wood-fence-installation_14548.pdf?sc_lang=en`
   - Accessed: `2026-07-17`

## Original figure specification

- File: `/guides/diagrams/measure-u-shaped-centerlines.svg`
- Alt: `Overhead U-shaped proposed fence with three separately dimensioned centerline runs, two shared rear corners, temporary endpoint markers, a four-foot gate opening on the left run, and two house-side endpoints.`
- Caption: `Measure one straight centerline run at a time. Preserve corners, endpoints, and the gate position instead of recording only one total.`
- Required labels inside the figure: `48 ft`, `60 ft`, `48 ft`, `4 ft planned opening`, `8 ft from run start`, `temporary marker`, `shared corner`, `house-side endpoint`
- Do not depict installed permanent posts as the measuring targets.

---

# Guide 2 — How to Calculate Fence Panels and Posts

## Metadata

- Slug: `how-to-calculate-fence-panels-and-posts`
- Title: `How to Calculate Fence Panels and Posts`
- Description: `Use centerline runs, panel pitch, gate-free fill segments, clear final-bay space, and shared joints to reproduce the planner's panel and post counts.`
- Related tool: `/fence-panel-calculator`
- Related guides: `how-to-measure-for-a-new-fence`, `fence-post-spacing-explained`, `measure-and-plan-a-fence-gate`
- Scenarios: `fp-rs-01-straight-panel-run`, `fp-rs-03-gate-position-remainders`
- Absorbs the useful intent of: `handle-uneven-final-fence-section`

## Publication-ready body

Panel estimation is not just total length divided by a nominal panel size. A reproducible count needs four declared quantities: the centerline run, gate-free fill segments, the repeating post-to-post pitch, and the post face used to convert a final pitch into approximate clear panel space.

Fence Planner calculates each gate-free fill segment separately. It buys a whole stock panel for every partial bay, merges posts that occupy the same geometric point, and keeps a final center-to-center pitch separate from the physical cut dimension.

## The measurement contract

- A run is measured in plan view along the proposed fence centerline between endpoint markers.
- A planned gate opening is removed from fill and splits its host run into separate fill segments.
- Panel bays repeat by center-to-center pitch.
- Post faces consume some of the center-to-center distance.
- A product may require additional fitting clearance that the generic planner does not know.

### Callout — Pitch is not panel width

A final 60 in post-to-post pitch does not mean “cut the panel to 60 in.” With equal 4 in post faces, it leaves about 56 in between the facing post surfaces before the product's brackets, grooves, expansion gaps, or other fitting allowance is considered.

## Choose the correct module mode

| Planner mode | Entered value means | Repeating pitch | What can be inferred about the physical panel |
|---|---|---|---|
| Panel itself (`panel_only`) | Physical panel width used by the estimate | Entered panel width + post face | The entered width is the stock panel width |
| Complete repeating pitch (`includes_post`) | Center-to-center system pitch | Entered value | Physical panel width is unknown unless separately supplied by the product |

Example with a 4 in post face:

| Mode example | Entered value | Calculated pitch | Calculated clear space in a full bay |
|---|---:|---:|---:|
| Panel itself | 96 in panel | 100 in O.C. | About 96 in before product allowance |
| Complete repeating pitch | 96 in pitch | 96 in O.C. | About 92 in before product allowance; actual panel width still requires product data |

Manufacturer instructions are the authority for the selected system. Some instructions derive post centers from panel width plus post width; others specify a complete installed module. Match the planner mode to the document in front of you.

## Calculate panels per fill segment

### Formula block — Panel count for one gate-free segment

Inputs:

- Segment centerline length `L`
- Repeating pitch `P`
- Equal square post face `F`
- Numeric tolerance `ε = 0.5 in` in the current planner

Steps:

1. `full panels = floor(L ÷ P)`
2. `pitch remainder = L − (full panels × P)`
3. If the pitch remainder is greater than `ε`, purchase one additional stock panel for the partial bay.
4. `calculated clear panel space = max(0, pitch remainder − F)`
5. Verify the field cut from the actual post positions and product fitting instructions.

Rounding:

Count stock panels as whole purchasable units. Do not turn a half-width cut into half a purchased panel.

## Reproducible example — FP-RS-01 straight 80 ft run

### Scenario notice

Hypothetical planning example. These inputs and results explain and test Fence Planner. They do not describe a customer project or completed installation.

### Inputs

- One isolated straight run: 80 ft = 960 in centerline
- No gate
- Panel-itself mode
- Stock panel width: 96 in
- Post face: 4 in
- Repeating pitch: 96 + 4 = 100 in O.C.
- Panel waste toggle: off

### Complete arithmetic

1. `floor(960 ÷ 100) = 9` full panels.
2. `960 − (9 × 100) = 60 in` final pitch.
3. The remainder is meaningful, so one additional stock panel is purchased.
4. `60 − 4 = 56 in` calculated clear panel space before product fitting allowance.
5. Panels to buy: `9 + 1 = 10`.
6. Posts occur at both run endpoints and at 100, 200, 300, 400, 500, 600, 700, 800, and 900 in.
7. Posts: 2 end + 9 line = 11.

| Output | Value |
|---|---:|
| Full stock panels | 9 |
| Partial bays | 1 |
| Panels to purchase | 10 |
| Final pitch | 60 in O.C. |
| Calculated clear panel space | About 56 in |
| End posts | 2 |
| Line posts | 9 |
| Total posts | 11 |

The calculator can estimate the clear space, but it cannot invent the final saw dimension. Confirm the installed post faces and the chosen product's fitting allowance before cutting.

### Scenario block

- `exampleId`: `fp-rs-01-straight-panel-run`
- Label: `Open the tested 80 ft panel example`

## How shared posts change the total

Do not calculate every run in isolation and add all endpoint posts. Posts belong to a joined layout:

- an isolated straight run has two end posts;
- two runs meeting at one corner share one corner post;
- a gate normally contributes two boundary positions, but a coincident gate/corner point is counted once with the higher gate role;
- a declared structure connection is not automatically a purchased freestanding post;
- chain-link ends, corners, and gate boundaries are terminal conditions rather than ordinary line posts.

The simple identity “posts = panels + 1” works only for one isolated, uninterrupted panel run. It is not a project-wide rule.

## What to do with an awkward final bay

An uneven final section is normal. The safe choices are layout decisions, not arithmetic tricks:

1. Accept a partial bay and cut one purchased stock panel after field verification.
2. Move a gate on the same run to redistribute the left and right segment remainders.
3. Move an endpoint only if the property, clearance, and design constraints allow it.
4. Change the panel system or pitch only if the new value matches an actual product.
5. Use a site-built method that can distribute spacing only when its structural and visual rules permit it.

If the pitch remainder leaves zero or impractically small clear space after the post faces, do not install overlapping posts or describe the result as a valid cut. Move a boundary or revise the layout.

## Reproducible comparison — FP-RS-03 gate position

One 60 ft run contains one 4 ft planned gate opening. Total fill remains 56 ft, but moving the gate changes the two segment remainders. Default pitch is 100 in with a 4 in post face.

| Gate start from run start | Fill segments | Partial pitches | Approximate clear spaces | Panels to buy |
|---:|---|---|---|---:|
| 10 ft | 120 in + 552 in | 20 in + 52 in | 16 in + 48 in | 8 |
| 20 ft | 240 in + 432 in | 40 in + 32 in | 36 in + 28 in | 8 |
| 28 ft | 336 in + 336 in | 36 in + 36 in | 32 in + 32 in | 8 |

This example shows why a remainder optimizer should report more than the purchase total. All three positions buy eight panels, but they produce very different final openings. Moving a gate on another run would not change these remainders.

### Scenario block

- `exampleId`: `fp-rs-03-gate-position-remainders`
- Label: `Open the tested gate-position example`

## Hand-check before shopping

- The run basis is centerline to centerline.
- Every gate was removed from fill on its actual host run.
- Every fill segment was divided separately.
- The selected mode matches the product's dimension convention.
- Final pitch and calculated clear space are shown as different values.
- Partial bays buy whole stock panels.
- Shared corners and coincident roles are counted once.
- No impossible clear opening is presented as a cut instruction.

## Sources

1. Title: `Horizontal privacy fence panel installation instructions`
   - Organization: `Barrette Outdoor Living`
   - URL: `https://www.barretteoutdoorliving.com/wp-content/uploads/2021/12/BOM-34111282_HorizontalPrivacyFencePanel.pdf`
   - Accessed: `2026-07-17`
2. Title: `Wood fence installation instructions`
   - Organization: `Outdoor Essentials / UFP Retail Solutions`
   - URL: `https://www.outdooressentialproducts.com/-/media/project/ufpi/outdoor-essentials/products/documents/assembly-instructions/wood-fence/outdoor-essentials_generic-wood-fence-installation_14548.pdf?sc_lang=en`
   - Accessed: `2026-07-17`

## Original figure and interactive specifications

### Static figure

- File: `/guides/diagrams/panel-pitch-vs-clear-space.svg`
- Alt: `Two dimensioned panel bays comparing a 100-inch post-center pitch with a 96-inch panel and a 60-inch final pitch with about 56 inches of clear space between four-inch post faces.`
- Caption: `The same post faces are present in every bay. Center-to-center pitch and clear panel space are related, but they are not interchangeable cut dimensions.`
- Required labels: `post center`, `post face`, `96 in stock panel`, `100 in O.C. full pitch`, `60 in O.C. final pitch`, `about 56 in clear`, `verify fitting allowance`

### Interactive block

Add a reusable `panel_module_explorer` guide block that accepts run length, entered panel-or-pitch value, post face, and module mode. It must update:

- repeating pitch;
- full panel count;
- final pitch;
- calculated clear space;
- panels to purchase;
- posts for one isolated uninterrupted run;
- a scaled bay diagram;
- an explicit error state when no usable clear opening remains.

Default state: FP-RS-01. The block must state that its post count applies only to an isolated uninterrupted run and that the field cut remains product-specific.

---

# Guide 3 — Fence Post Spacing Explained

## Metadata

- Slug: `fence-post-spacing-explained`
- Title: `Fence Post Spacing Explained: On-Center, Clear Span, 6 ft, and 8 ft`
- Description: `Compare on-center spacing with clear span and see the exact post-count difference between 6-foot and 8-foot layouts before choosing a product or structural approach.`
- Related tool: `/fence-post-calculator`
- Related guides: `how-to-calculate-fence-panels-and-posts`, `plan-fence-corners-and-end-posts`, `wood-panels-vs-individual-pickets`
- Absorbs: `six-foot-vs-eight-foot-fence-sections`

## Publication-ready body

Post spacing controls more than the number of holes. It changes rail span, panel fit, concrete quantity, the location of remainder bays, and the load carried by each post. The useful question is not “Is six feet or eight feet better?” It is “What spacing does this fence system require for this site, and what does that decision do to the layout?”

## On-center spacing and clear span are different

On-center spacing is measured from the center of one post to the center of the next. Clear span is measured between the two facing post surfaces.

For equal square posts:

`clear span = on-center spacing − one full post face`

With equal 4 in post faces:

| On-center spacing | Approximate clear span |
|---:|---:|
| 96 in O.C. | 92 in |
| 72 in O.C. | 68 in |

These values do not include product-specific brackets, grooves, or installation clearance. Use the actual measured or manufacturer-listed post face, not a nominal lumber label assumed to be exact.

## Panel systems and site-built fences use spacing differently

- A preassembled panel system follows the product's repeating pitch. In panel-itself mode, Fence Planner calculates pitch as panel width plus post face. In complete-pitch mode, the entered value is already the pitch.
- A site-built wood fence uses editable post spacing independently of individual board coverage. Rails and boards are then calculated across those spans.
- A chain-link layout uses line-post spacing between terminal conditions. Ends, corners, and gates are terminals, not ordinary line posts.
- Engineered vinyl, aluminum, steel, composite, and specialty systems may prescribe exact openings, post types, brackets, and maximum spans. Their installation documents take priority over a generic planning default.

### Callout — “Six-foot section” is not “six-foot fence height”

Section length and fence height are separate dimensions. A six-foot-tall privacy fence can use an eight-foot horizontal rhythm, and a shorter fence can use six-foot bays. Always name the axis and measurement basis.

## Exact comparison — one 96 ft site-built wood run

Assumptions:

- One isolated straight run
- 96 ft centerline length
- No gates or shared corners
- Site-built wood spacing
- Exact multiples at both options

| Layout | Spans | Line posts | End posts | Total posts |
|---|---:|---:|---:|---:|
| 8 ft O.C. | 12 | 11 | 2 | 13 |
| 6 ft O.C. | 16 | 15 | 2 | 17 |
| Difference | +4 | +4 | 0 | +4 |

The six-foot layout needs four additional posts, four additional holes, and concrete for four additional posts before any role-specific changes. It also shortens every rail span. That is a real material and labor tradeoff, not a stylistic toggle.

## What changes as spacing narrows

- More posts, holes, and post-setting material
- Shorter rail or bay spans
- More joints and fastening points
- Different remainder behavior on runs that are not exact multiples
- Potentially more freedom to distribute a site-built layout, if the construction system permits it

## What changes as spacing widens

- Fewer posts and holes
- Longer rails or wider modules
- More demand on each rail, panel, and post connection
- Greater sensitivity to the product's stated maximum span and the site's wind, height, and soil conditions

These are planning consequences, not a structural approval. Tall solid fences, exposed sites, weak soils, and heavy gates may require a different system or professional design.

## Deal with the last span deliberately

A run that is not an exact multiple needs a final-span decision. Panel systems normally produce a partial bay and one additional stock-panel purchase. Site-built systems may allow a smaller last span or limited redistribution, but only within the selected rail and connection method. Chain-link fabric can be cut, while the terminal and line-post rhythm still needs a coherent layout.

Do not change an eight-foot setting to six feet merely to make a warning disappear. First confirm that the product and construction method allow the new spacing, then recalculate posts, rails, fasteners, and concrete.

## Selection checklist

1. Identify fence type, height, and whether the system is panelized or site-built.
2. Read the chosen product's installation instructions and maximum-span rules.
3. Enter actual post face and the correct on-center pitch or spacing.
4. Compare exact post and remainder counts on the measured runs.
5. Review wind exposure, soil, gate weight, and local requirements outside the planner.
6. Choose the spacing only after the structural/product constraints and material consequences agree.

## Sources

1. Title: `Horizontal privacy fence panel installation instructions`
   - Organization: `Barrette Outdoor Living`
   - URL: `https://www.barretteoutdoorliving.com/wp-content/uploads/2021/12/BOM-34111282_HorizontalPrivacyFencePanel.pdf`
   - Accessed: `2026-07-17`
2. Title: `Wood fence installation instructions`
   - Organization: `Outdoor Essentials / UFP Retail Solutions`
   - URL: `https://www.outdooressentialproducts.com/-/media/project/ufpi/outdoor-essentials/products/documents/assembly-instructions/wood-fence/outdoor-essentials_generic-wood-fence-installation_14548.pdf?sc_lang=en`
   - Accessed: `2026-07-17`
3. Title: `How to erect chain link fence`
   - Organization: `Chain Link Fence Manufacturers Institute`
   - URL: `https://chainlinkinfo.org/wp-content/uploads/2015/08/Step-by-step-installation-guide-page1.pdf`
   - Accessed: `2026-07-17`

## Original figure specification

- File: `/guides/diagrams/post-spacing-96-foot-comparison.svg`
- Alt: `Two aligned 96-foot fence runs comparing twelve eight-foot spans and thirteen posts with sixteen six-foot spans and seventeen posts.`
- Caption: `On the same isolated 96 ft run, changing from 8 ft to 6 ft on-center spacing adds four posts and four holes.`
- Required labels: `96 ft centerline`, `8 ft O.C.`, `12 spans`, `13 posts`, `6 ft O.C.`, `16 spans`, `17 posts`, `+4 posts`

---

# Guide 4 — How Much Concrete Does Each Fence Post Need?

## Metadata

- Slug: `how-much-concrete-for-fence-posts`
- Title: `How Much Concrete Does Each Fence Post Need?`
- Description: `Calculate cylinder volume minus post displacement, enter the bag yield printed on the product, compare project-level rounding, and account for local depth and frost requirements.`
- Related tool: `/concrete-for-fence-posts-calculator`
- Related guides: `fence-post-spacing-explained`, `how-to-estimate-fence-waste`, `fence-permit-and-property-line-checklist`
- Scenario: `fp-rs-05-concrete-bag-yield`
- Absorbs: `fence-post-depth-and-frost`

## Publication-ready body

“Bags per post” is only a shortcut. The quantity changes with hole diameter, hole depth, post cross-section, bag yield, post count, and the way whole bags are rounded. Fence Planner exposes those inputs so the result can be checked instead of repeated as a rule of thumb.

The calculator estimates a cylindrical hole with a centered square post. Real holes are irregular, and local installation requirements may call for gravel, a different shape, a deeper embedment, or role-specific footings. Treat the result as a transparent materials estimate, not an engineered footing design.

## Formula

For one post:

`hole volume = π × (hole diameter ÷ 2)² × hole depth`

`buried post displacement = post face² × hole depth`

`net concrete per post = max(0, hole volume − post displacement)`

For the project:

`estimated project volume = net concrete per post × concreted post count`

If optional contingency is enabled:

`volume including contingency = estimated project volume × (1 + contingency percentage)`

Finally:

`bags = ceiling(volume used for purchase ÷ stated bag yield)`

Fence Planner rounds once at project level. Rounding each post separately can overstate the purchase.

## Reproducible example — FP-RS-05

### Scenario notice

Hypothetical planning example. These inputs and results explain and test Fence Planner. They do not describe a customer project or completed installation.

### Inputs

- Concreted posts: 4
- Hole diameter: 12 in
- Hole depth: 36 in
- Square post cross-section used by the estimate: 4 in × 4 in
- Illustrative bag yield: 0.33 ft³ = 570.24 in³ = about 9.34 L
- Concrete contingency: off
- Project-level whole-bag rounding

### Arithmetic

1. Hole cylinder: `π × 6² × 36 = 4,071.50 in³`.
2. Buried post displacement: `4 × 4 × 36 = 576 in³`.
3. Net concrete per post: `4,071.50 − 576 = 3,495.50 in³` = about `2.023 ft³` or `57.28 L`.
4. Four-post project: `13,982.02 in³` = about `8.091 ft³` or `229.12 L`.
5. Unrounded bag count: `13,982.02 ÷ 570.24 = 24.52`.
6. Purchase estimate: `25 bags` after one project-level ceiling.

| Result | Value |
|---|---:|
| Net concrete per post | 3,495.50 in³ / 57.28 L |
| Net project volume | 13,982.02 in³ / 229.12 L |
| Raw bag result | 24.52 |
| Project-rounded purchase | 25 bags |
| If each post were rounded separately | 28 bags |
| With 5% contingency, project-rounded | 26 bags |

The 0.33 ft³ yield is an illustrative planner default, not a named product. Replace it with the yield printed on the selected bag or its current technical data sheet.

### Scenario block

- `exampleId`: `fp-rs-05-concrete-bag-yield`
- Label: `Open the tested four-post concrete example`

## Use actual dimensions, not labels

A nominal post name is not a reliable displacement input. Enter the actual measured cross-section or manufacturer-listed dimension. The difference is usually small compared with hole volume, but the calculator should still state what it used.

The same rule applies to the hole. A nominal “12-inch hole” that flares, collapses, or is over-augered consumes more material than a perfect cylinder. Contingency can cover ordinary variation; it cannot repair a fundamentally wrong depth or footing design.

## Bag yield belongs to a product

Bag weight alone does not safely define yield across every mix and market. Select the actual concrete product, read its packaging or data sheet, and enter the published yield. Official manufacturer calculators also describe their results as approximate and round to whole bags.

Do not mix requirements from one product with the yield or water instructions from another. Follow the chosen product's current preparation, water, temperature, loading, and cure guidance.

## Depth, frost, soil, wind, and post role

There is no universal fence-post depth. The correct detail can change with:

- local frost conditions and applicable requirements;
- fence height and wind exposure;
- soil, fill, drainage, and rock;
- wood, metal, vinyl, or other post system;
- line, end, corner, or gate role;
- manufacturer instructions and any approved design.

The current planner uses one hole diameter and one depth for all concreted posts. If a gate or terminal requires a different footing, calculate that group separately and add the quantities.

Rock is not permission to stop at an arbitrary shallow depth. If the required hole cannot be constructed, obtain an approved alternate detail from the applicable authority, manufacturer, or qualified professional.

### Callout — The planner does not look up a frost line

The tool has no location-based frost model and does not know the soil or exposure at the site. Verify the required depth locally before using the bag total for purchasing.

## Before buying concrete

- Count only posts that will actually receive the selected concrete detail.
- Separate groups when line, gate, corner, or terminal posts use different holes.
- Enter measured/manufacturer post cross-section.
- Enter verified hole diameter and depth.
- Enter the selected product's stated bag yield in ft³ or litres.
- Decide whether contingency is needed and label the resulting volume honestly.
- Round once at project level unless purchasing or staging requires a different documented rule.
- Follow the product's mixing, water, temperature, and loading instructions.

## Sources

1. Title: `Concrete calculator — Fast-Setting Concrete for posts`
   - Organization: `QUIKRETE`
   - URL: `https://www.quikrete.com/calculator/main.asp`
   - Accessed: `2026-07-17`
2. Title: `Setting posts in concrete`
   - Organization: `QUIKRETE`
   - URL: `https://www.quikrete.com/athome/settingposts.asp`
   - Accessed: `2026-07-17`
3. Title: `Horizontal privacy fence panel installation instructions`
   - Organization: `Barrette Outdoor Living`
   - URL: `https://www.barretteoutdoorliving.com/wp-content/uploads/2021/12/BOM-34111282_HorizontalPrivacyFencePanel.pdf`
   - Accessed: `2026-07-17`

## Original figure specification

- File: `/guides/diagrams/concrete-hole-volume.svg`
- Alt: `Cutaway of a centered square fence post in a cylindrical concrete-filled hole, with hole diameter, hole depth, post face, net concrete region, and bag-yield calculation labeled.`
- Caption: `The estimate subtracts the buried square post from a cylindrical hole, multiplies by the concreted post count, then rounds the project to whole bags.`
- Required labels: `12 in hole diameter`, `36 in modeled depth`, `4 in post face used by estimate`, `cylinder volume`, `post displacement`, `net concrete`, `bag yield from selected product`
- The figure must not imply that 12 in × 36 in is a universal required footing.

---

# Guide 5 — How to Plan Fence Corners and End Posts

## Metadata

- Slug: `plan-fence-corners-and-end-posts`
- Title: `How to Plan Fence Corners, Ends, and Terminal Posts`
- Description: `Classify shared corners, open ends, gate boundaries, chain-link terminals, and structure-adjacent endpoints before counting posts and concrete.`
- Related tool: `/fence-planner`
- Related guides: `how-to-measure-for-a-new-fence`, `how-to-calculate-fence-panels-and-posts`, `measure-and-plan-a-fence-gate`, `plan-fence-around-house-or-structure`
- Scenario: `fp-rs-02-u-shaped-yard`

## Publication-ready body

A post count is a property of the whole joined layout, not a number calculated independently for each line. When two runs meet at one point, that point is one joint. Its role—line, corner, end, gate, chain-link terminal, or declared structure connection—determines how it should appear in the materials estimate.

## Classify the geometry first

| Layout point | Planning meaning | Counting consequence |
|---|---|---|
| Line post | Intermediate support on a straight fill segment | Counted at the active panel pitch or site-built spacing |
| Corner | Two runs turn at one shared point | One shared post, not two run endpoints |
| Open end | A run stops without joining another run | One endpoint condition |
| Gate boundary | Start or end of a planned gate opening | One gate/terminal position; may coincide with another role |
| Chain-link terminal | End, corner, or gate condition that terminates/tensions fabric | Not an ordinary line-post assembly |
| Structure connection | A specifically declared connection to a verified structure | Not automatically a purchased/concreted freestanding post in the fixture |

Fence Planner merges coincident points instead of purchasing multiple posts at the same coordinate. When roles coincide, the tool gives the point one higher-priority role; a gate position, for example, takes priority over a line post at the same location.

## Shared corners prevent double counting

For an L shape with two runs, naïvely counting two endpoint posts per run produces four endpoint positions. The joined layout actually has three unique points: two open ends and one shared corner.

The same principle applies to U shapes and closed outlines. Draw the connected geometry first, then classify unique joints. Do not total isolated run worksheets and try to subtract duplicates from memory.

## Wood and chain-link corners are not the same assembly

In a wood or panel fence, a corner is where rails or panels arrive from two directions. The selected system may require a larger post, different brackets, or a specific fastening detail.

In chain-link, ends, corners, and gates are terminal conditions that carry fabric tension. Terminal assemblies use fittings that line posts do not. Fence Planner estimates several chain-link components, but it is not a complete fittings catalogue; check the selected system's installation guide.

## Treat structure attachment as an exception

A fence meeting a house, garage, wall, or other structure does not automatically justify removing an end post. Siding, trim, masonry veneer, and unknown wall assemblies may not be suitable structural or water-managed attachment points.

Prefer a freestanding end-post option when the attachment detail is not verified. Use a structure connection only when the wall and fence manufacturers or a qualified professional provide a suitable load path, fasteners, clearances, and water-management detail.

## Gates near corners

A gate can share a geometric point with a corner, but that does not prove the combined post and hardware are suitable. Gate weight, hinge geometry, bracing, swing, and the adjoining run all act at the same location. Use a dedicated gate/corner detail approved for the chosen system rather than treating the coincidence as a material-saving shortcut.

## Reproducible example — FP-RS-02 topology

The U-shaped scenario contains three connected runs, one gate, two rear corners, and two fixture-only structure connections at the house side.

| Role | Expected count |
|---|---:|
| Shared rear corners | 2 |
| Structure connections in the fixture | 2 |
| Gate posts | 2 |
| Line posts under the current 100 in panel pitch | 16 |
| Unique classified points | 22 |
| Concreted points in this fixture | 20 |

The two structure connections are excluded from purchased/concreted post quantity by the current fixture. Plan View does not yet provide a first-class control for creating arbitrary structure connections, so this is a tested predefined example rather than a promise about every user-drawn endpoint.

### Scenario block

- `exampleId`: `fp-rs-02-u-shaped-yard`
- Label: `Open the tested corner and endpoint example`

## Joint checklist

1. Draw every run as connected geometry.
2. Label each unique point as line, corner, open end, gate boundary, terminal, or verified structure connection.
3. Merge coincident roles before totaling posts.
4. Match each role to the selected manufacturer's post, bracket, bracing, and fitting requirements.
5. Separate post groups if their hole dimensions differ.
6. Treat house attachment as a verified detail, not a default.
7. Reconcile the Plan View post markers with the field sketch before shopping.

## Sources

1. Title: `How to erect chain link fence`
   - Organization: `Chain Link Fence Manufacturers Institute`
   - URL: `https://chainlinkinfo.org/wp-content/uploads/2015/08/Step-by-step-installation-guide-page1.pdf`
   - Accessed: `2026-07-17`
2. Title: `Chain link fence parts`
   - Organization: `Chain Link Fence Manufacturers Institute`
   - URL: `https://chainlinkinfo.org/chain-link-fence-parts/`
   - Accessed: `2026-07-17`
3. Title: `Wood fence installation instructions`
   - Organization: `Outdoor Essentials / UFP Retail Solutions`
   - URL: `https://www.outdooressentialproducts.com/-/media/project/ufpi/outdoor-essentials/products/documents/assembly-instructions/wood-fence/outdoor-essentials_generic-wood-fence-installation_14548.pdf?sc_lang=en`
   - Accessed: `2026-07-17`

## Original figure specification

- File: `/guides/diagrams/fence-joint-topology.svg`
- Alt: `Plan-view topology showing one line post, one shared ninety-degree corner, one open end, two gate boundary posts, a chain-link terminal example, and a structure-adjacent endpoint as distinct labeled node types.`
- Caption: `Count unique layout points first, then assign the post or connection required by the selected fence system.`
- Required labels: `line`, `shared corner`, `open end`, `gate boundary`, `terminal`, `structure-adjacent endpoint`, `one point—one counted role`
- Use shape plus text so role meaning does not depend on colour.

---

# Guide 6 — How to Measure and Plan a Fence Gate

## Metadata

- Slug: `measure-and-plan-a-fence-gate`
- Title: `How to Measure and Plan a Fence Gate`
- Description: `Plan the passage, manufacturer-defined post opening, swing envelope, gate-post roles, and the panel remainders on both sides before digging.`
- Related tool: `/fence-gate-planner`
- Related guides: `how-to-measure-for-a-new-fence`, `how-to-calculate-fence-panels-and-posts`, `plan-fence-corners-and-end-posts`
- Scenario: `fp-rs-03-gate-position-remainders`

## Publication-ready body

A gate plan has at least three widths: the passage you want, the manufactured leaf or kit, and the required opening between posts after hinge and latch allowances. They are not automatically equal. Decide what must pass through, choose the gate system, and then translate its instructions into the planned opening used by the fence layout.

Fence Planner stores a planned gate opening, removes that width from fence fill, places two boundary points, and shows swing direction visually. It does not calculate a product-specific leaf width, hinge gap, latch gap, drop-rod clearance, frame sag, or structural gate-post design.

## Complete the gate worksheet

| Input | What to record |
|---|---|
| Required passage | Width of the widest person, bin, mower, equipment, or vehicle, plus comfortable maneuvering clearance |
| Gate product | Manufacturer, model/system, single or double leaf, stated maximum opening |
| Required post opening | The exact face-to-face or center-to-center dimension specified by that product |
| Hinge side | Post location, hardware, fasteners, and direction of swing |
| Latch side | Latch clearance and how it will be reached from both approaches |
| Swing envelope | Leaf radius, slope, paving, wall, equipment, and pedestrian conflicts |
| Ground clearance | Product requirement plus the highest point across the swing path |
| Inactive-leaf hardware | Drop rod/cane bolt and receiving surface for a double gate |
| Post/footing detail | Gate weight, wind area, post size, hole detail, and load/cure requirements from the selected system |

### Callout — Use the selected product's allowance

Manufacturer instructions do not use one universal hinge-and-latch allowance. One gate system may define the opening as leaf width plus separate hardware clearances; another may require cutting a gate section by a stated deduction from the measured opening. Do not transfer a number from one system to another.

## Position the opening before sizing adjacent panels

Place the gate on its actual host run and record the offset from the run start. A mid-run gate creates two fill segments. Each segment gets its own panel division and final-bay check.

Moving a gate changes those two segment lengths while total fill remains the same. This can improve an awkward skinny bay, but it does not guarantee fewer purchased panels. Moving a gate on a different run does not change the remainders on this run.

## Reproducible example — FP-RS-03

### Scenario notice

Hypothetical planning example. These inputs and results explain and test Fence Planner. They do not describe a customer project or completed installation.

### Inputs

- One straight 60 ft centerline run
- One 4 ft planned gate opening
- Default 100 in panel pitch
- Equal 4 in post faces
- Compare the same gate beginning 10 ft, 20 ft, and 28 ft from the run start

| Gate start | Left/right fill segments | Full panels | Partial pitches | Approximate clear final spaces | Panels to buy |
|---:|---|---:|---|---|---:|
| 10 ft | 120 in / 552 in | 1 + 5 | 20 in / 52 in | 16 in / 48 in | 8 |
| 20 ft | 240 in / 432 in | 2 + 4 | 40 in / 32 in | 36 in / 28 in | 8 |
| 28 ft | 336 in / 336 in | 3 + 3 | 36 in / 36 in | 32 in / 32 in | 8 |

At 10 ft, one side leaves only about 16 in of clear panel space before fitting allowance. Centering the opening produces two balanced 32 in clear spaces. The purchase total remains eight panels in all three states, so the improvement is layout quality and buildability rather than fewer panels.

### Scenario block

- `exampleId`: `fp-rs-03-gate-position-remainders`
- Label: `Open the tested gate-position example`

## Single and double gates

A double gate is not merely one wide leaf split in half. It normally adds a second hinge set and an inactive-leaf restraint such as a drop rod. The clear opening, center stop, paving or receiver, slope, and wind behavior need to be planned as one system.

Use the manufacturer's maximum opening and hardware instructions. A wide opening may require different posts, frames, footings, or operators than the adjoining fence.

## Swing and grade

Check the entire leaf path, not only the closed position. A gate can fit between posts and still fail because it climbs into a slope, crosses a step, strikes equipment, blocks a walkway, or opens into an unsafe area.

Fence Planner's swing display is illustrative. It does not calculate vertical clearance. Measure the highest ground or paving point across the arc and verify the product's required clearance and local rules.

## Before setting gate posts

1. Confirm the required passage with the real item or equipment where possible.
2. Select the actual gate system and hardware.
3. Derive the post opening from that product's instructions.
4. Verify hinge side, latch access, swing envelope, and grade.
5. Place the planned opening on the correct run.
6. Review both adjacent fill-segment remainders and move the gate if a layout alternative is better.
7. Use the approved gate-post and footing detail; do not assume a line-post detail is sufficient.
8. Field-check post positions and product allowances before cutting panels or hanging the gate.

## Sources

1. Title: `Adjustable fence gate installation instructions`
   - Organization: `Barrette Outdoor Living`
   - URL: `https://www.barretteoutdoorliving.com/wp-content/uploads/2021/06/BARRETTE-WEB_AFGate.pdf`
   - Accessed: `2026-07-17`
2. Title: `Transform gate kit installation instructions`
   - Organization: `Barrette Outdoor Living`
   - URL: `https://barretteoutdoorliving.com/wp-content/uploads/2023/02/34107783-TFM-Gate-Kit-Instructions-WEB-03.23.pdf`
   - Accessed: `2026-07-17`
3. Title: `How to erect chain link fence`
   - Organization: `Chain Link Fence Manufacturers Institute`
   - URL: `https://chainlinkinfo.org/wp-content/uploads/2015/08/Step-by-step-installation-guide-page1.pdf`
   - Accessed: `2026-07-17`

## Original figure specification

- File: `/guides/diagrams/gate-opening-and-swing.svg`
- Alt: `Plan and elevation views of a fence gate showing desired passage, product-defined opening between gate posts, hinge and latch sides, swing arc, and two adjacent panel fill segments.`
- Caption: `Start with the passage need, translate the selected gate product into a post opening, then check swing and the panel remainder on both sides.`
- Required labels: `desired passage`, `product-defined post opening`, `hinge side`, `latch side`, `swing envelope`, `grade check`, `left fill segment`, `right fill segment`

---

# Cross-guide editorial rules

1. Never call a pitch remainder a physical panel cut width.
2. Never state that a nominal post label is an exact measured face.
3. Never present 6 ft, 8 ft, 10 ft, 12 in, 36 in, or a bag yield as universal.
4. Identify every example as hypothetical and tool-tested, not a customer project.
5. Use exact scenario outputs only after automated tests pin them.
6. Keep manufacturer-specific dimensions attached to the named source/product system.
7. Keep legal boundary, permit, utility, engineering, frost, soil, and product approval outside the planner's authority.
8. Do not use generic AI photography as the instructional proof. The original diagram, formula, source block, and loadable scenario are the evidence.
9. Hero photographs may remain decorative with empty alt text; instructional diagrams require descriptive alt text and captions.
10. Do not insert ad units between a formula and its worked result, between a figure and its caption, or inside a scenario block.

# Redirects approved after destination verification

| Retired guide | Canonical destination | Reason |
|---|---|---|
| `/guides/six-foot-vs-eight-foot-fence-sections` | `/guides/fence-post-spacing-explained` | Section-length comparison is now a tested subsection of spacing |
| `/guides/handle-uneven-final-fence-section` | `/guides/how-to-calculate-fence-panels-and-posts` | Remainder logic and the corrected same-run gate comparison are now in the flagship calculation guide |
| `/guides/fence-post-depth-and-frost` | `/guides/how-much-concrete-for-fence-posts` | Depth, frost, hole dimensions, and bag quantity are one calculation decision |

Use permanent redirects only after the three destination guides render correctly, the retired slugs are removed from the guide registry/sitemap, related links are updated, and redirect tests pass.
