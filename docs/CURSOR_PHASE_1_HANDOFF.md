# Cursor Handoff — Phase 1: Establish Fence Planner’s Calculation Truth

## Instruction to Cursor

Work directly in the Fence Planner website repository. This is the first phase of a larger content and product-quality rebuild intended to reduce Google AdSense low-value-content risk without pretending that Fence Planner is a fence contractor.

Fence Planner is a **free planning and materials-estimation tool**. Its original value must come from transparent, reproducible tool behavior—not fabricated customer projects or claims of installation experience.

Do not begin wholesale article rewrites in this phase. First establish what the live application actually calculates, how it measures, where its defaults come from, and which current article claims match or conflict with the code.

Supporting documents supplied with this handoff:

- `FENCE_GUIDES_EDITORIAL_AUDIT.md`
- `FENCE_PLANNER_EDITORIAL_FOUNDATION.md`

This handoff is self-contained, but those documents provide the editorial rationale and full article audit.

## Phase 1 objective

Create a verified, test-backed calculation contract for Fence Planner and a complete inventory of the 20 guide routes. At completion, another editor must be able to rewrite the guides without guessing:

- what every input means;
- which units and measurement bases are used;
- how gates, corners, endpoints, and segments are represented;
- how every material quantity is calculated and rounded;
- which defaults and warning thresholds are active;
- what the tool does **not** support;
- which current guide statements are correct, ambiguous, obsolete, or false.

## Mandatory working rules

1. Read all repository-level and directory-level instructions before changing files.
2. Preserve unrelated user changes and avoid destructive Git operations.
3. Use the repository’s existing test framework and conventions.
4. Treat current code behavior and current article prose as two separate claims. Neither automatically proves the other correct.
5. Do not encode an article’s expected result into a test merely because the article says it is correct.
6. Clearly label behavior as:
   - **Observed:** what the current code does;
   - **Intended:** what existing product copy, types, or tests explicitly define;
   - **Validated:** mathematically or source-verified behavior approved for documentation;
   - **Unresolved:** requires a product/editorial decision.
7. Do not delete, redirect, canonicalize away, or `noindex` article routes in Phase 1.
8. Do not invent new construction rules, product dimensions, frost depths, permit rules, or utility-clearance distances.
9. Do not imply slope, engineering, survey, utility, or product-specific support if the code does not provide it.
10. Fix an obvious implementation defect only after capturing it in a failing test and explaining why it is objectively a defect. List every production behavior change in the final report.

## Task 1 — Map the repository

Identify and document:

- framework and build system;
- routing system;
- source location for the 20 guide articles;
- source location for page metadata, reading times, dates, authorship, canonical URLs, and structured data;
- planner/calculator domain models;
- formula/calculation modules;
- unit-conversion and rounding helpers;
- configuration/default files;
- warning/validation logic;
- printable/downloadable output code;
- Plan View, Dream View, presets, or similarly named features actually present;
- test framework and existing coverage;
- sitemap, redirects, navigation, and related-guide generation;
- ad-placement components used on guide pages.

Create a repository document following existing conventions. Preferred path if no convention exists:

`docs/fence-guide-route-inventory.md`

For each guide, record:

| Field | Required value |
|---|---|
| Article number and title | Exact current title |
| Slug and public URL | Exact current route |
| Source file | Repository-relative path |
| Rendering component | Repository-relative path |
| Related tool route | Current route or missing |
| Indexability | Current robots/canonical behavior |
| Internal links | Main inbound/outbound guide links |
| Tool dependencies | Calculator or component names |
| Current status | Live, draft, hidden, missing, or duplicate |

Inventory these expected slugs and reconcile any differences:

1. `how-to-measure-for-a-new-fence`
2. `how-to-calculate-fence-panels-and-posts`
3. `fence-post-spacing-explained`
4. `how-much-concrete-for-fence-posts`
5. `plan-fence-corners-and-end-posts`
6. `measure-and-plan-a-fence-gate`
7. `wood-panels-vs-individual-pickets`
8. `six-foot-vs-eight-foot-fence-sections`
9. `handle-uneven-final-fence-section`
10. `plan-fence-on-sloped-ground`
11. `privacy-fence-materials-checklist`
12. `chain-link-fence-materials-checklist`
13. `fence-installation-order`
14. `common-fence-planning-mistakes`
15. `fence-permit-and-property-line-checklist`
16. `mark-underground-utilities-before-digging`
17. `fence-project-shopping-list`
18. `fence-post-depth-and-frost`
19. `how-to-estimate-fence-waste`
20. `plan-fence-around-house-or-structure`

## Task 2 — Create the calculation contract

Trace the live code and create:

`docs/fence-planner-calculation-contract.md`

Use exact code references. For every rule, include source file/function, input units, formula, rounding stage, default, output field, warning condition, and known limitation.

### 2.1 Run geometry and measurement basis

Answer:

- What does a user-entered run length represent?
- Is it endpoint center-to-center, outside-to-outside, inside/clear distance, or an abstract line length?
- Are post widths included in the run or module?
- Are endpoints represented as nodes, post centers, edges, or something else?
- How are multiple connected runs joined?
- How is a corner recognized and counted once?
- How are open ends counted?
- How are structure connections represented?
- Can one physical post serve multiple roles, such as corner plus gate?
- Does any code model curves, slope, rise, or ground-path distance?

If the interface does not currently tell the user the measurement basis, flag that as a Phase 2 UX requirement.

### 2.2 Panel/module calculation

Document:

- all panel/module modes and their exact names;
- meaning of “panel-only,” “includes-post,” or equivalent modes;
- whether panel width is nominal or actual;
- whether post width is nominal or actual;
- full-panel calculation;
- remainder calculation;
- cut-panel purchase calculation;
- minimum remainder/epsilon behavior;
- short-bay warning threshold;
- whether cut math occurs per whole run or per fill segment;
- how endpoint posts affect total occupied length;
- how the displayed diagram reconciles with the material count.

### 2.3 Gate behavior

Document:

- whether gate input means clear opening, leaf width, kit width, or another dimension;
- how gate position is stored;
- how a gate splits a run into fill segments;
- how gate width is removed from fill;
- single- versus double-gate material rules;
- gate-post counting and shared-post exceptions;
- hinge, latch, drop-rod, or hardware rules;
- near-end/near-corner warning thresholds;
- whether swing direction or swing clearance affects calculations or is visual only.

### 2.4 Post spacing

Document:

- on-center versus clear-spacing semantics;
- spacing defaults by fence type/style;
- line-post calculation and endpoint handling;
- last-span handling;
- relationship between panel module and post spacing;
- whether spacing can redistribute across a run;
- behavior when a gate or utility conflict interrupts the rhythm.

### 2.5 Concrete calculation

Document:

- hole shape assumption;
- diameter and depth units;
- post displacement formula;
- post cross-section input and whether it is nominal or actual;
- default bag yield and what bag/product it is intended to represent;
- per-post versus project-level volume and bag rounding;
- concrete waste/contingency rule;
- which post roles receive concrete;
- whether different post roles can use different hole specifications;
- structure-connection treatment;
- any gravel, void, bell-bottom, slope, frost, or soil modeling actually supported.

### 2.6 Waste and stock rounding

Document:

- default waste percentage;
- material categories receiving waste;
- order of operations: base quantity, cut purchase, waste, pack rounding;
- categories excluded from waste;
- stock-length optimization versus percentage waste;
- fastener/package rounding;
- fabric-roll and top-rail stock rounding;
- concrete contingency versus bag rounding;
- whether users can see these rules in the UI and printout.

### 2.7 Chain-link system

Document support for:

- fabric fill and roll rounding;
- line posts;
- end, corner, and gate terminal posts;
- top rail and sleeves;
- rail ends and loop caps;
- bottom tension wire or bottom rail;
- tension bars and bands;
- brace bands, brace rail, truss rods, or turnbuckles;
- ties/hog rings and their quantity logic;
- gates and hardware;
- unsupported items that the current article implies are calculated.

### 2.8 Warnings and tool features

Inventory every warning, notice, and visualization referenced by the guides:

- short final section;
- gate near run end/corner;
- utility conflict, if any;
- structure connection;
- slope limitation;
- concrete assumptions;
- module mismatch;
- unsupported fence type;
- Plan View;
- Dream View;
- post overlays;
- presets;
- printable diagrams;
- material exports.

For each, state whether it exists, exact trigger, displayed text, and code location.

## Task 3 — Build the article-to-code claim matrix

Create:

`docs/fence-guide-claim-matrix.md`

For each article, extract every statement about:

- tool behavior;
- numerical defaults;
- formulas;
- rounding;
- warnings;
- supported fence systems;
- named interface features;
- generated materials;
- redirects/related tool routes.

Classify each claim:

| Classification | Meaning |
|---|---|
| Matches | Article and code agree, and behavior is suitable to document |
| Ambiguous | Article or code does not define the measurement/condition precisely enough |
| Mismatch | Article states behavior different from the code |
| Unsupported | Article implies a capability the tool does not have |
| Potential code defect | The code appears internally inconsistent or mathematically wrong |
| External verification needed | Product, safety, legal, or construction claim cannot be validated from code |

At minimum, explicitly inspect these known editorial problems:

1. Article 2’s 8 ft panel + 4 in post = 100 in module convention.
2. Article 2’s 80 ft panel example and endpoint/post accounting.
3. Article 3’s 6 ft versus 8 ft spacing example and exact post counts.
4. Article 4’s 4×4 post displacement and 0.33 ft³ default bag yield.
5. Article 6’s gate split calculation and gate-post assumptions.
6. Article 9’s invalid side-run gate/back-run remainder example.
7. Article 10’s ground-path slope advice and whether slope is modeled.
8. Article 11/18 “Bag bags” copy error and their concrete claims.
9. Article 13’s system-independent installation order.
10. Article 16’s implication that moving a post away from a mark is sufficient.
11. Article 19’s 5% waste default and category application.
12. Article 20’s structure-connection material behavior.

## Task 4 — Add reference-scenario fixtures and characterization tests

Implement fixtures using the repository’s existing test conventions. Preferred identifiers:

- `FP-RS-01-straight-panel-run`
- `FP-RS-02-u-shaped-yard`
- `FP-RS-03-gate-position-remainders`
- `FP-RS-04-stepped-vs-racked-slope`
- `FP-RS-05-concrete-bag-yield`
- `FP-RS-06-chain-link-system`

The complete scenario definitions are in `FENCE_PLANNER_EDITORIAL_FOUNDATION.md`.

### Test rule: do not freeze a suspected bug

For each scenario:

1. Capture current observed output.
2. Independently reconcile the math using the documented code contract.
3. Identify whether the result is validated or unresolved.
4. Write a durable expected-output test only for validated behavior.
5. For unresolved behavior, create a skipped/pending test or a report item according to repository conventions—do not silently bless the current result.

### Minimum test coverage

Tests must cover:

- unit conversion;
- endpoint and shared-corner counting;
- gate subtraction and per-segment remainder math;
- full versus cut panel purchases;
- 6 ft versus 8 ft post-spacing counts on a simple run;
- concrete cylinder volume, post displacement, selected bag yield, and final rounding;
- waste application order and exclusions;
- fabric/rail stock rounding for chain-link;
- warning thresholds used by published content;
- stable serialization or preloading of each reference scenario if the app supports shareable state.

If the current tool has no slope model, do **not** invent one in Phase 1. Add a limitation test/report confirming that the scenario cannot yet be represented.

## Task 5 — Correct only safe, objective defects

Phase 1 may fix:

- arithmetic or unit-conversion defects proven by tests;
- inconsistent use of the same documented measurement basis;
- crashes, NaN/Infinity, negative quantities, or unstable rounding;
- stale feature names or routes that are objectively broken;
- obvious article production typos only if the current article source is already in the repository and the change will not conflict with the later rewrite.

Phase 1 must not decide without review:

- a new measurement convention;
- a new panel/module definition;
- nominal versus actual dimensions as a global product policy;
- a universal bag yield;
- slope calculation behavior;
- new construction/safety defaults;
- redirect/removal decisions;
- a large visual redesign.

Put unresolved decisions in the final report with options and consequences.

## Task 6 — Verify the repository

Run the repository’s applicable:

- unit tests;
- integration/end-to-end tests;
- type checks;
- lint/format checks;
- production build;
- route/link checks if available.

Record commands and results. Do not claim a check passed if it was not run.

## Required Phase 1 deliverables

Use existing repository documentation/test locations where established; otherwise use these names:

1. `docs/fence-guide-route-inventory.md`
2. `docs/fence-planner-calculation-contract.md`
3. `docs/fence-guide-claim-matrix.md`
4. Reference-scenario fixtures in the existing fixture location
5. Automated tests for every validated scenario/rule
6. `docs/fence-guide-phase-1-report.md`

## Required final report format

Create `docs/fence-guide-phase-1-report.md` with these sections.

### A. Executive result

- Overall confidence in calculator correctness: High / Medium / Low
- Safe to begin article rewrites: Yes / Partially / No
- Number of guide routes found
- Number of article/code matches
- Number of ambiguities
- Number of mismatches
- Number of unsupported claims
- Number of confirmed code defects fixed
- Number of unresolved product decisions

### B. Repository map

Summarize framework, content source, route generation, calculation modules, tests, metadata, sitemap/canonical handling, and ad components.

### C. Calculation-contract summary

Provide a compact table:

| Domain | Observed behavior | Validated? | Key code location | Documentation consequence |
|---|---|---:|---|---|

Include run geometry, modules, gates, post spacing, concrete, waste, chain-link, slope, structure connections, and warnings.

### D. Reference-scenario results

| Scenario | Can current tool represent it? | Observed output | Independently reconciled? | Test status | Issues |
|---|---:|---|---:|---|---|

### E. Article claim findings

List findings by article number, with source path and relevant code reference.

### F. Production changes made

For every behavior change:

- file and function;
- prior behavior;
- new behavior;
- failing test added first;
- reason it is objectively correct;
- user-visible effect.

Write “None” if no production behavior changed.

### G. Proposed content architecture

Report technical feasibility and route implications for:

- Article 8 → Article 3;
- Article 18 → Article 4;
- Article 9 → Article 2 versus standalone remainder optimizer;
- Article 17 → Article 11/12 versus generated-shopping-list landing state;
- Article 14 as an interactive audit hub.

Do not apply these redirects yet.

### H. Questions requiring product/editorial decisions

For each unresolved issue, provide:

- exact question;
- current behavior;
- at least two viable options;
- effect on existing calculations and saved/shared plans;
- recommended option and rationale;
- migration or compatibility concern.

### I. Verification results

List each test/build/check command and its result.

### J. Phase 2 readiness

State exactly which articles can be rewritten immediately and which must wait for a decision or implementation change.

## Questions Cursor must answer explicitly

1. What physical points does a run-length input measure between?
2. What exactly does each panel/module mode mean?
3. Are post dimensions nominal, actual, or user-defined?
4. How are first and last half-post widths handled, if at all?
5. Are gates subtracted once from a run and then calculated per fill segment?
6. Are cut panels purchased and rounded per segment or after aggregation?
7. What produces the short-final-section warning, including threshold and units?
8. What is the default concrete bag yield, and which bag/product is it intended to represent?
9. Is concrete rounded once per project or once per post?
10. Which post roles receive concrete, and can their hole sizes differ?
11. Which material categories receive waste, and at what stage?
12. Does the tool optimize stock lengths, or only apply percentages and round packs?
13. What chain-link components are actually calculated?
14. Does the tool model slope, or only accept a single run length?
15. What does a structure connection remove or add to the bill of materials?
16. Which named features from the articles exist exactly as written?
17. Are reference scenarios serializable into shareable/preloaded URLs or saved states?
18. Which proposed interactive components can reuse current domain logic without duplicating formulas?

## Acceptance criteria

Phase 1 is complete only when:

- all 20 expected slugs are reconciled with the repository;
- every calculator default used by the guides is documented with a code reference;
- every formula and rounding stage is documented;
- all named guide/tool features are verified or marked missing;
- validated reference scenarios have automated tests;
- unresolved scenarios are not falsely frozen as correct;
- the article claim matrix is complete;
- all objective fixes have regression tests;
- applicable tests, types, lint, and production build pass, or failures are fully reported;
- no redirects, article deletions, or large UX changes were applied;
- the Phase 1 report clearly identifies what Codex can rewrite next.

## Handoff back to Codex

When complete, provide:

1. the full text of `docs/fence-guide-phase-1-report.md`;
2. links or contents for the calculation contract, route inventory, and claim matrix;
3. the list of files changed;
4. test/build results;
5. any unresolved questions that block Phase 2.

Do not ask Codex to infer formulas from screenshots or prose. Supply exact code paths, functions, defaults, units, and rounding behavior.
