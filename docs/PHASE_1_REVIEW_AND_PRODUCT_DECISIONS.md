# Fence Planner — Phase 1 Review and Product Decisions

Status: approved to proceed to product-alignment work  
Date: 2026-07-17  
Input reviewed: `docs/fence-guide-phase-1-report.md` and all companion artifacts in the Fence Planner repository

## 1. Executive decision

Cursor's Phase 1 report is thorough and usable. Its core calculation findings were checked against the implementation, reference fixtures, guide renderer, persistence layer, and tests.

Do **not** start the broad article rewrite yet. The correct next step is a short product-alignment phase because the content currently depends on one incorrect result, several invisible assumptions, and at least three interface claims that are not true in the live product.

The most important finding is a real panel-post defect:

- An 80 ft run is 960 in.
- The current default module is 100 in: a 96 in panel plus a 4 in post face.
- The run therefore has nine full modules and one 60 in cut-panel bay.
- Ten panel bays require eleven supporting boundary posts on an isolated straight run.
- The current classifier omits the post at 900 in and reports ten posts.

Fence Planner should place the missing boundary post. This is a correctness change, not an editorial preference.

## 2. Additional findings from the Phase 1 review

### 2.1 Saved plans do not require a schema migration for the post correction

`src/persistence/local.ts` stores project geometry and settings. Material quantities and post classifications are derived when the project is calculated; they are not persisted as authoritative results.

The correction will therefore recalculate existing plans when opened. Cursor should confirm that no other cache stores derived quantities, but a saved-project schema migration should not be necessary. A regression test and a brief calculation-change note are sufficient unless Cursor finds a second persistence path.

### 2.2 The panel interface contradicts the panel calculation

For a panel project, `StyleBuilder` labels the setting as “Space between posts” and describes it as on-center spacing. Choosing 8 ft also sets `panelWidth` to 96 in.

Under the default `panel_only` mode, however, the engine calculates the module as:

`panelWidth + postWidth = 96 in + 4 in = 100 in on center`

The user sees 8 ft post spacing while the material engine uses 8 ft 4 in. The interface must expose the panel-width basis and display the calculated module/pitch. It must not present the panel width itself as on-center post spacing.

### 2.3 Concrete inputs are stored but not editable in the interface

The project model contains hole diameter, hole depth, post cross-section, bag yield, waste percentage, and category flags. The live planner does not expose the concrete fields.

This makes the following current claims inaccurate:

- `/concrete-for-fence-posts-calculator` says hole depth and bag yield are editable.
- `/methodology` says all calculations are transparent and editable.
- The concrete tool route is a thin link page rather than a working concrete calculator.

Phase 2A should expose these assumptions and turn the concrete route into a functional tool using the shared calculation code. If a control is not implemented, every claim that it is editable must be removed.

### 2.4 “Clear gate width” is stronger than the model supports

The model stores one undifferentiated width, subtracts it from fill, and creates two gate posts. It does not separately model rough opening, clear passage, leaf width, hinge allowance, latch allowance, or kit width.

Until those concepts are split, the safe label is **planned gate opening width**. Existing guide copy that promises “clear opening width” should be revised.

### 2.5 The current guide format cannot carry enough evidence

`GuideBlock` supports plain paragraphs, headings, lists, callouts, and examples. It has no structured source list, accessible data table, captioned technical figure, reproducible-example action, or related-guide model. Plain strings also cannot contain proper inline links.

Those capabilities should exist before the guides are rewritten. Otherwise, source citations and original tool evidence will be added inconsistently or hard-coded in article components.

## 3. Decisions on Cursor's unresolved questions

| ID | Decision | Reason |
|---|---|---|
| H1 — run measurement | Define the input as **plan run length along the centerline between endpoint markers**. | It accurately describes the existing abstract geometry and requires no calculation change. It must be visible beside the input and in methodology. |
| H2 — last full-module post | **Correct the classifier** so a cut panel has a support post at the last full-module boundary. | Ten bays cannot be supported by ten isolated boundary posts. FP-RS-01 becomes 2 end + 9 line = 11 total. |
| H3 — gate width | Label it **planned gate opening width**. | The current model does not distinguish leaf, kit, rough, or finished-clear dimensions. |
| H4 — structure connections | Do not promise a user-facing structure-connection control yet. Keep the data behavior documented as an internal capability/limitation. | The Plan View has no way to create or edit the joint role. A joint tool can be a later product phase. |
| H5 — bag yield | Treat 0.33 ft³ as an editable **planning default**, not a named bag size or brand. Require the user to copy yield from the product label. | A bag yield without a specified product is not a universal fact. |

## 4. Content architecture decisions

These decisions can now be treated as approved, but redirects must wait until the destination content is published and verified.

| Current article | Decision |
|---|---|
| #8 Six-Foot vs Eight-Foot Fence Sections | Merge its useful comparison into #3, then redirect #8 to #3. |
| #9 Uneven Final Fence Section | Merge the explanation into flagship article #2. Do not retain a separate page unless a real remainder optimizer is built. |
| #17 Fence Project Shopping List | Merge general guidance into #11/#12 and make the existing planner print/copy output the real shopping-list experience. |
| #18 Fence Post Depth and Frost | Merge into #4 with official/local-verification guidance, then redirect #18 to #4. |
| #14 Common Planning Mistakes | Keep as a static, well-linked audit hub for now. Make it interactive only after the validator can be safely surfaced there. |
| #20 Around a House or Structure | Keep, but explain the current product limitation and favor a freestanding endpoint in general planning copy. Do not claim the planner has a structure-joint tool. |

## 5. Required sequence

### Phase 2A — product truth and publishing foundation

Cursor should now:

1. fix and test the cut-bay boundary-post defect;
2. make run, gate, panel-module, and concrete assumptions visible and editable where promised;
3. add non-destructive loaders for the predefined reference scenarios;
4. add guide content types for sources, tables, figures, and reference-scenario actions;
5. add sitemap, robots, canonical metadata, accurate authorship/process information, related guides, and honest reading times;
6. rewrite the methodology page around the verified contract and limitations;
7. return a Phase 2A implementation report and updated expected outputs.

### Phase 2B — editorial production

After the Phase 2A report is returned, Codex will prepare the publication-ready rewrites, source packages, scenario tables, and original visual specifications. Cursor will then place that approved content into the typed guide files.

### Phase 2C — consolidation and final QA

Only after the destination articles are complete:

1. apply redirects for #8, #9, #17, and #18;
2. update the guide index, internal links, sitemap, canonicals, and related-guide links together;
3. verify every guide against the live tool state;
4. check mobile layout, ad-to-content balance, accessibility, build output, and broken links;
5. record the actual substantive update date for each changed article.

## 6. AdSense and Google-quality rationale

The objective is not to make the pages longer. It is to add original, verifiable contribution: tested calculator behavior, declared scenarios, transparent arithmetic, useful controls, original diagrams, and properly attributed external requirements.

This follows Google's current emphasis on original information or analysis, substantial added value, clear “Who, How, and Why,” accurate authorship, and content made for an existing audience. It also avoids thin doorway-style tool pages and keeps advertising subordinate to publisher content.

Official references:

- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [AdSense policies: a beginner's guide](https://support.google.com/adsense/answer/23921?hl=en)
- [More ads or paid promotional material than publisher-content](https://support.google.com/publisherpolicies/answer/11169917?hl=en)

## 7. Publication hold

Until Phase 2A is complete:

- do not publish a definitive FP-RS-01 post total from the current production engine;
- do not claim concrete assumptions are editable;
- do not call the gate input a finished clear opening;
- do not document slope, utility, structure-joint, frost lookup, or arbitrary share-link features as if they exist;
- do not apply article redirects.

