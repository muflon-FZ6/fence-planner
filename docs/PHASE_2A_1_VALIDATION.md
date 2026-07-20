# Phase 2A.1 Validation — Accepted with a Mandatory Phase 2B Task 0

Reviewed: `docs/fence-guide-phase-2a.1-report.md`, calculation code, guide content model, planner interfaces, accessibility implementation, tests, type checking, lint, and production build

Date: 2026-07-17

## Decision

Phase 2A.1 establishes a usable calculation contract for editorial work, so the core guide rewrites can proceed. It is **not fully complete as reported**. Five implementation requirements remain open and must be the first task in Phase 2B before the new panel/post, remainder, concrete, and gate content is published.

This is not another stand-alone correction phase. Cursor should fix the remaining items as **Phase 2B Task 0**, run the focused tests, and then integrate the approved core content in the same phase.

## Independent verification

| Check | Result |
|---|---|
| Vitest | 64 tests passed |
| TypeScript | Passed with `--noEmit --incremental false` |
| ESLint | Passed |
| Production build | Passed with a temporary absolute `NEXT_PUBLIC_SITE_URL`; 43 static pages/routes generated |
| FP-RS-01 panel arithmetic | Passed: 960 in run, 100 in pitch, 9 full panels, 60 in final pitch, about 56 in clear space, 10 panels, 11 posts, 68 bags |
| Exact 1,000 in run | Passed: 10 full panels, no partial bay, 11 posts |
| Gate-boundary post coordinates | Passed for the covered 60 ft test case |
| Generated reading time | Passed at implementation level; manual override removed |
| Absolute production sitemap behavior | Passed when the production origin is supplied |
| True metric concrete fields | Passed for hole diameter, hole depth, post cross-section, and bag yield |
| Dialog focus entry, Tab loop, Escape, and focus restoration | Implemented |

## Accepted calculation language

The following wording is frozen for FP-RS-01:

| Quantity | Accepted value |
|---|---:|
| Plan run | 960 in centerline |
| Complete panel pitch | 100 in on center |
| Full stock panels | 9 × 96 in |
| Final pitch | 60 in on center |
| Calculated clear panel space | About 56 in before product fitting allowance |
| Panels to purchase | 10 |
| Posts | 11: 2 end + 9 line |
| Concrete at current illustrative defaults | 68 bags |

Do not publish “cut the final panel to 60 inches.” The final pitch and the physical cut dimension are different quantities.

## Requirements still open

### 1. `includes_post` still mislabels a pitch as a physical panel width

`moduleWidthMode: "includes_post"` defines the stored `panelWidth` value as a complete repeating pitch. However, `src/calc/lumberSpec.ts::panelSpecLabel()` always formats that stored value as a physical `H × W wood fence panel`, and `src/calc/engine.ts` calls it without mode-specific handling.

That means a 96 in repeating pitch can still appear in the materials list as a 96 in wide physical panel even though no physical panel width was entered. This contradicts the Phase 2A.1 requirement.

Required short-term label:

> Panel system for a 96 in repeating pitch — verify the actual panel width from the product.

Keep the normal height × physical-width label only in `panel_only` mode.

### 2. Impossible and short remainders are still judged from centerline pitch

`PanelCut` now contains `pitchRemainder` and `clearPanelSpace`, which fixes the most serious terminology problem. It still has no validity/status field. `src/warnings/validate.ts` continues to compare the raw pitch remainder with the 24 in short-section threshold.

Consequences:

- a pitch remainder only slightly wider than the numeric epsilon can produce `clearPanelSpace = 0` and still be presented as a cut bay;
- the warning may call a final opening acceptable when its **clear** width is below the intended threshold;
- copy still says short leftover pieces “will need cutting,” even when the post faces leave no usable panel opening.

Required behavior:

- classify partial bays as `valid`, `short`, or `no_usable_clear_opening`;
- apply the short-section threshold to `clearPanelSpace`;
- when clear space is zero or unusable, tell the user to move an endpoint/gate or revise the module;
- do not emit a trim instruction for an impossible opening;
- keep the purchase estimate only with an explicit explanation of what is being counted.

### 3. The example dialog does not actually isolate the planner background

The dialog focus and Escape behavior are present, but the inert logic is structurally ineffective. `ExampleLoader` loops over `document.body.children` and skips a child when that child contains the dialog. The dialog is rendered inside the same application root as the planner, so the code skips the root that also contains every background planner control.

The dialog also does not lock background scrolling.

Required behavior:

- render the modal in a body-level portal or inert the planner shell while leaving a separately mounted modal interactive;
- preserve and restore any pre-existing `inert`, `aria-hidden`, and body overflow values;
- prevent background scrolling while the dialog is open;
- keep first focus, Tab/Shift+Tab containment, Escape as “Keep my plan,” and sensible focus restoration;
- add component tests that prove a background control is unavailable while the dialog is open and available again after dismissal.

### 4. Content-model validation is incomplete

The test suite validates related slugs, safe source URLs, and reference-scenario IDs. It does not yet validate:

- every table row has the same number of cells as its header;
- every instructional figure has a non-empty alt description;
- every figure path is a safe local guide path or explicitly approved URL;
- source titles and organizations are non-empty.

These checks are required before adding the evidence-heavy Phase 2B blocks.

### 5. Two smaller interface-truth issues remain

1. The standalone concrete result is labeled “Total net project volume” even when optional contingency/waste is applied. Label it “Estimated project volume including contingency” when the option is on, and keep “Net calculated project volume” when it is off.
2. Metric planner projects still show the custom plan post face in inches. This post face affects pitch and clear-space math, so display/edit it in millimetres when the project unit system is metric. Convert the display value; do not change internal inch storage.

The standalone metric helper should also show the default bag yield in litres rather than only saying `0.33 cu ft`.

## Production-origin owner action

The build now correctly refuses to invent a production origin. The site owner must set:

```text
NEXT_PUBLIC_SITE_URL=https://the-real-production-domain.example
```

Replace the example with the real canonical origin. Do not use a preview URL. Cursor must report the configured variable name but must not guess the domain.

## Editorial go/no-go

| Work | Decision |
|---|---|
| Draft the six core canonical rewrites | Go |
| Build source packages and visual specifications | Go |
| Integrate Article 1 (measurement) | Go after Task 0 tests pass |
| Integrate Article 2 / merge Article 9 | Go after remainder and mode-label fixes pass |
| Integrate Article 3 / merge Article 8 | Go after remainder and mode-label fixes pass |
| Integrate Article 4 / merge Article 18 | Go after concrete result-label fix passes |
| Integrate Article 5 | Go after content-model validation passes |
| Integrate Article 6 | Go after dialog and remainder fixes pass |
| Apply redirects | Only after destination content, figures, metadata, sitemap, and internal links are verified together |

## Final instruction

Proceed to Phase 2B with the accompanying core editorial package. Cursor must complete Task 0 first, but it does not need to stop for another report between Task 0 and article integration unless a test exposes a calculation-contract change.
