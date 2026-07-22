# Cursor Handoff — Fence Planner Publisher-Value Upgrade

## Purpose

Implement a focused product-and-publishing upgrade for `https://fenceblueprint.com`. The goal is not to manufacture more SEO pages. The goal is to make the site visibly more useful, more transparent, and more defensible as original publisher content for an AdSense review.

Fence Planner is a free planning and materials-estimation utility. Its strongest evidence of value is its actual calculation and planning behavior. Preserve that truth: do not invent contractor experience, customer projects, permits, jurisdiction rules, live retailer data, product specifications, or author credentials.

This handoff is intentionally scoped around four mutually reinforcing improvements:

1. a real **Reference Scenario Studio** built from the app's tested reference scenarios;
2. a printable, interactive **Build Readiness Audit**;
3. a stronger **publisher / editorial-trust layer** and source model for thin guides;
4. consistent metadata and crawl-facing polish for the homepage and core tool routes.

The public origin is **`https://fenceblueprint.com`**. Do not use or introduce `fencebluprint.com`.

## Instruction to Cursor

Work directly in the Fence Planner repository. Preserve unrelated user changes. Use small, coherent commits or clearly separable implementation sections. Do not stop after writing a plan: implement, test, render, and report the work.

Before editing, read:

- repository `AGENTS.md`;
- the relevant Next.js 16 documentation under `node_modules/next/dist/docs/` before using or changing App Router metadata, static params, route layouts, client/server boundaries, dynamic routes, or image behavior;
- `docs/FENCE_GUIDES_EDITORIAL_AUDIT.md`;
- `docs/FENCE_PLANNER_EDITORIAL_FOUNDATION.md`;
- `docs/FENCE_GUIDES_PHASE_2B_CORE_EDITORIAL_PACKAGE.md`;
- `docs/fence-planner-calculation-contract.md`;
- `docs/fence-guide-phase-2b-report.md`, if present;
- the current implementation files named in the file map below.

Do not add a CMS, database, login, remote API, analytics vendor, payment flow, or new third-party package for this work. Use the existing Next 16 / React 19 / TypeScript / Tailwind / Vitest stack.

## Non-negotiable editorial and product rules

1. Do not describe hypothetical reference scenarios as customer projects, completed installations, field tests, or contractor work.
2. Do not state permit rules, setback distances, utility-clearance distances, slope limits, structural advice, or product dimensions unless a current primary source is cited and the statement is qualified to that source.
3. Do not generate location-specific legal answers from a city name. The product may help a visitor record and verify their own official sources; it must not pretend to be a permitting authority.
4. Do not claim a named human reviewer or credentials unless the repository owner supplies them. Use the truthful publisher name `DoubleM` / `Fence Planner` and the existing correction contact path.
5. Do not place ads inside diagrams, formulas, scenario outputs, the planner canvas, print output, or readiness-audit results. Preserve the current separation between ads and core task completion.
6. Do not solve the content problem by adding generic 500-word articles. Every new indexable page must expose original input, output, evidence, a decision, or a reusable user artifact.
7. Reuse the existing source-of-truth calculation helpers. Do not duplicate panel, gate, concrete, pricing, or material math in page components.
8. Retain the planner's explicit confirmation before replacing a user’s saved plan with a reference scenario.

## Current architecture: use these files, do not reinvent them

| Concern | Current source of truth | Implementation direction |
|---|---|---|
| Reference fixtures | `src/domain/referenceScenarios.ts` | Build studio entries from these supported IDs; do not create a parallel untested fixture system. |
| Material calculation | `src/calc/engine.ts` (`calculateMaterials`) | Derive scenario summaries from this shared engine. |
| Pricing calculations | `src/calc/pricing.ts` and `src/content/pricing/*` | Use only if an explicitly labelled dated estimate is useful; never call it a retailer quote. |
| Existing simple examples | `src/content/examples.ts`, `src/app/examples/page.tsx` | Replace the shallow card-only model with the Scenario Studio. Avoid new on-site links to raw `shape=...` query examples. |
| Scenario confirmation | `src/components/planner/ExampleLoader.tsx` | Continue to use `?example=<ReferenceScenarioId>` and the existing confirmation modal. |
| Existing plan diagram | `src/canvas/plan/PlanDiagram.tsx` | Reuse it for scenario visuals where its client/server boundary permits; otherwise extract a small pure SVG presenter from the same geometry rules rather than drawing a second, divergent plan model. |
| Guide model / renderer | `src/content/guides/types.ts`, `src/components/guides/GuideBody.tsx` | Extend this typed system rather than branching on guide slug. |
| Guide route / metadata | `src/app/guides/[slug]/page.tsx` | Keep the existing canonical, Article JSON-LD, BreadcrumbList, and metadata behavior. |
| Publisher pages | `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/methodology/page.tsx` | Expand truthful process and correction information. |
| Site metadata | `src/app/layout.tsx`, `src/lib/siteUrl.ts` | Add safe, configured-origin canonical/Open Graph metadata for the site root and core tool surfaces. |
| Sitemap and robots | `src/app/sitemap.ts`, `src/app/robots.ts` | Add indexable scenario routes and preserve absolute URLs. |
| Planner outputs | `src/components/planner/BuildPanel.tsx`, `ShoppingListPrint.tsx`, `PrintSheet.tsx` | Reuse language and output conventions; do not fork business logic. |
| Tests | `src/calc/*.test.ts`, `src/content/guides/contentModel.test.ts` | Add focused scenario, source-model, UI, and route tests. |

## Work order

Implement in this order so every public claim is backed by an output before it is published.

### 1. Build the Reference Scenario Studio (highest priority)

Replace the current `/examples` card grid with a scenario index that leads to full, indexable scenario pages.

#### Required routes

- Keep `/examples` as the studio index.
- Add `src/app/examples/[slug]/page.tsx`.
- Generate static params from a typed scenario-content registry.
- Add each detail page to `src/app/sitemap.ts`.
- Provide canonical URL, title, description, Open Graph fields, Article JSON-LD, and BreadcrumbList JSON-LD for every detail page using `getSiteOrigin` / `absoluteUrl`.

#### Use these tested reference scenarios

Create one scenario-page entry for each currently supported planner fixture:

| ID | Public slug | Required focus |
|---|---|---|
| `fp-rs-01-straight-panel-run` | `straight-80-foot-panel-run` | repeating pitch, a final bay, panel purchases, and boundary posts |
| `fp-rs-02-u-shaped-yard` | `u-shaped-yard-with-gate` | shared corners, structure connections, gate-separated fill |
| `fp-rs-03-gate-position-remainders` | `gate-position-and-final-bay` | why moving a gate on the *same run* changes the two fill segments |
| `fp-rs-05-concrete-bag-yield` | `four-post-concrete-bag-yield` | hole volume, project-level bag rounding, and bag-yield limitation |
| `fp-rs-06-chain-link-system` | `chain-link-system-layout` | terminals, fabric, rail, and the current calculation boundary |

Do not create a modeled slope scenario: `FP-RS-04` is explicitly not representable by the current planner. It may be linked as a limitation from a slope guide, but not presented as a live planner scenario.

#### New typed registry

Refactor or replace `src/content/examples.ts` into a registry with a shape similar to the following. Names may differ, but preserve these semantics and use `ReferenceScenarioId`.

```ts
type ScenarioStudioEntry = {
  id: ReferenceScenarioId;
  slug: string;
  title: string;
  description: string;
  question: string;
  heroAlt: string;
  assumptions: string[];
  whatItShows: string[];
  limitations: string[];
  relatedGuides: string[];
  updated: string;
};
```

Create a pure helper (for example `src/domain/scenarioStudio.ts`) that:

- calls `buildReferenceScenario(entry.id)`;
- runs the returned project through the existing calculation engine;
- returns a small, typed, display-safe summary: total fence length, fill length, post-role counts, material lines, panel-cut status where applicable, concrete bags, and dated pricing only if deliberately included;
- never hard-codes calculated material counts in the content registry;
- has unit tests pinning the displayed summary to the existing scenario fixtures and `calculateMaterials`.

Use `examplePlannerHref` or the same sanctioned `?example=` route for the call-to-action. The CTA copy must say it loads a **hypothetical planning example** and must retain the confirmation dialog before replacing the visitor’s current plan.

#### Required page composition

Every scenario page must include:

1. an explicit “Hypothetical planning example” label above the title;
2. the practical question it answers;
3. the exact scenario assumptions;
4. a code-native plan-view diagram or a truthful visual derived from the fixture geometry—prefer the existing `PlanDiagram` where compatible; no stock image presented as field evidence;
5. a calculation-result panel derived from the shared engine;
6. “What this result means” written specifically for that scenario;
7. a clear “What this does not prove” / limitation section;
8. a confirmation-based “Open this exact example in the planner” CTA;
9. links to 2–4 canonical related guides;
10. an updated date and a link to Methodology.

The diagram must be accessible: useful SVG `title` and `desc`, an equivalent text alternative, sufficient contrast, labelled gates/runs, and no information encoded by colour alone. It must render well at phone width and in print.

Do not use planner screenshots as the only evidence. A deterministic SVG based on the fixture is better because it is inspectable and stays synchronized with its scenario.

### 2. Add a Build Readiness Audit and printable field kit

Add a public route `/build-readiness` with a server-rendered route shell and a focused client component. Add it to the header/footer only if the navigation remains clear; otherwise surface it through the Scenario Studio, “Common Fence-Planning Mistakes,” permit, and utility guides.

The audit must help a homeowner decide what to resolve before buying or digging. It is not a permit checker, survey, utility-locate service, or engineering tool.

#### Audit questions and outputs

Ask a concise set of binary / select / short-note questions:

- Do you have a boundary source you trust (survey, pins, or another authoritative record)?
- Have you found the official municipal/HOA rule source and recorded its link/date?
- Have you requested the applicable utility locate, and are all responses back?
- Have you checked private-line risks such as irrigation, landscape lighting, or other owner-installed items?
- Have you measured the gate path, swing, and obstruction clearance?
- Have you selected a fence system and read its installation instructions?
- Does the project have slope, drainage, house/structure, or access constraints that need a product-specific decision?
- Have you checked the material estimate against real product dimensions and local prices?

Group results into:

- **Ready** — evidence recorded;
- **Verify** — decision or source still needed;
- **Stop before digging/buying** — a safety or authorization prerequisite is missing.

The audit must produce a print-friendly “field kit” containing the answers, date generated, next actions, freeform notes, and links back to relevant canonical guides. It may store answers locally only if the privacy copy is updated truthfully. Do not silently transmit any answers.

Add an accessible `Print` action and use existing print conventions. Do not add an ad to the audit output or print route.

Add tests covering at least one Ready, Verify, and Stop outcome, keyboard navigation, and printed-content visibility classes.

### 3. Make thin guide pages evidence-backed instead of generic

Extend the typed guide model with a reusable sources block. Suggested types:

```ts
type GuideSource = {
  title: string;
  organization: string;
  href: string;
  note?: string;
};

type GuideBlock =
  | /* existing blocks */
  | { type: "sources"; title?: string; sources: GuideSource[] }
  | { type: "readiness_audit_cta"; label?: string };
```

Render outside links safely with `target="_blank"` and `rel="noreferrer noopener"`. Extend `contentModel.test.ts` so titles, organizations, and `http`/`https` URLs are required and all new CTA blocks render without slug-specific conditionals.

Upgrade these pages first:

1. `src/content/guides/fence-permit-and-property-line-checklist.ts`
   - Replace its current About-page CTA with the Build Readiness Audit.
   - Add an explicit “record the official link and date” workflow.
   - Add sources only for universal process guidance; do not state local legal rules.
   - Include the audit CTA and a short printable-research-record explanation.

2. `src/content/guides/mark-underground-utilities-before-digging.ts`
   - Add a source block with current official locate-service sources appropriate to the site's stated US/Canada audience. Verify current URLs at implementation time.
   - Explain the difference between a public locate response and potential private lines without inventing a universal tolerance zone.
   - Add the Build Readiness Audit CTA.

3. `src/content/guides/plan-fence-on-sloped-ground.ts`
   - Add a focused **Slope Decision Lab** using a pure calculation helper (for example `src/calc/slopeDecision.ts`) plus a typed guide block / accessible client component, following the existing `PanelModuleExplorer` architecture.
   - Inputs: horizontal run, rise, and nominal bay size. Outputs: slope length, grade, angle, and rise per nominal bay.
   - It must make the distinction between a racked system and a stepped system visible, but must never make the existing flat planner appear slope-aware or certify that a particular product can rack that far.
   - An optional product-specific rack-limit comparison may appear only when backed by a current official manufacturer source, with the product and source shown. Otherwise show the calculation and a “verify product limit” status only.
   - Represent FP-RS-04 only as a static, non-loadable limitation/comparison card; it must never claim to be a planner fixture because no slope fields exist in `FenceProject`.

4. `src/content/guides/common-fence-planning-mistakes.ts`
   - Convert it into a concise diagnostic hub that routes users to the audit and the relevant canonical guide/tool for each detected problem.
   - Do not repeat long generic explanations already covered by the linked guide.

5. `src/content/guides/fence-installation-order.ts`
   - Restructure around clearly labelled system-specific planning sequences (preassembled panels, site-built wood, chain-link) only where current official product instructions support the statement.
   - Make “follow your product manual” an actionable source/checkpoint, not a generic disclaimer.

6. `src/content/guides/fence-project-shopping-list.ts`
   - Position the existing planner print output as the primary dynamic artifact.
   - Add a clear route to the print-ready shopping list / field kit, without claiming SKU or inventory accuracy the app does not have.

Use real primary sources where a source is required. Validate every external URL at implementation time. If a primary source cannot be found or verified, remove the technical claim instead of substituting a blog or an uncited assertion.

For each new `sources` block, store a truthful `checked` / last-verified ISO date in the typed data and include it in validation. Update `estimateReadingMinutes` to account for visible source titles and notes without inflating reading time with hidden implementation data.

### 4. Strengthen truthful publisher and editorial trust

Replace the sparse content in `src/app/about/page.tsx` with a useful publisher page. Preserve the existing factual claims, and add these sections:

- **What Fence Planner is:** free local-browser planning and estimation tool; no account required.
- **What it is not:** installer, surveyor, permit authority, utility-locate service, engineer, manufacturer, or live-price/inventory service.
- **How calculations and guides are prepared:** existing documented formulas, editable assumptions, automated tests, primary sources where product/safety/permit processes are discussed, and human review of AI-assisted drafts before publication.
- **Corrections:** link visibly to `/contact`, state that corrections and source updates are welcome, and state that guide dates change only for substantive updates.
- **Advertising:** ads support the free product but remain outside the drawing canvas, core task output, and print output.

Do not invent a named editor. Make the publisher name and correction path prominent enough that a visitor can understand who is accountable: `Fence Planner, published by DoubleM`, plus `hello@doublem.ca`.

Add a separate `/editorial-policy` route only if it adds real explanatory value rather than duplicating About and Methodology. If added, include it in footer trust links and sitemap; otherwise keep this information on About/Methodology.

### 5. Make root and core tool metadata complete

The guide detail template already produces strong canonical, Open Graph, Article JSON-LD, and BreadcrumbList output. Bring the homepage and important tool routes to the same baseline without creating metadata conflicts.

- In `src/app/layout.tsx`, use the configured site origin to add a root canonical and stable website-level Open Graph data when an origin exists. Do not emit malformed or relative production canonicals.
- The client-only `src/app/fence-calculator/page.tsx` cannot export route metadata. Preserve its client behavior but move the client-only router code into a child component or use the correct Next 16 server/layout boundary so `/fence-calculator` has title, description, canonical, and Open Graph metadata.
- Add metadata for `/fence-planner`, `/examples`, `/build-readiness`, `/about`, and any new scenario detail routes. Use `metadataBase`, `absoluteUrl`, and current Next 16 conventions.
- Do not add misleading review stars, fake aggregate ratings, Product schema, price offers, or LocalBusiness schema.
- Ensure sitemap URLs are absolute and include scenario detail pages. Do not accidentally index utility-only test/demo routes.

### 6. Preserve usability and accessibility

- Keep the existing scenario-loader modal confirmation and focus handling intact.
- Every new interactive control needs a visible label, keyboard support, focus styling, and an accessible state/result summary.
- Use semantic headings in a sensible hierarchy.
- Keep the Scenario Studio and audit useful on a 320–375 px viewport and in print.
- Do not put important instructions exclusively in placeholder text, hover state, images, or colour.
- Keep `aria-live` announcements concise; do not create noisy rerender announcements.

## Explicit non-goals for this phase

- No user accounts, saved cloud projects, upload flow, or arbitrary project-share URLs.
- No claim that the planner models slope, frost-line lookup, curves, legal boundaries, structural design, or live retailer availability.
- No location-specific permit lookup database.
- No automated article expansion, bulk city pages, templated affiliate pages, fake testimonials, or AI-generated “field stories.”
- No redesign of the core planner canvas unless a small integration point is required for the field kit or scenario CTA.

## Required test and verification work

Add focused tests before claiming completion:

1. Scenario registry validity: unique slugs, every ID exists in `REFERENCE_SCENARIOS`, every scenario produces a project, and derived results use the shared calculation engine.
2. Scenario result pins for all five public scenario pages. Pin factual outputs against existing calculator fixtures; never hard-code a different display value to make copy look nicer.
3. Scenario static params, metadata, canonical URL, and sitemap coverage.
4. Guide sources validation, including valid `http`/`https` links and no missing source field.
5. Build Readiness Audit decision logic: one fixture each for Ready, Verify, and Stop; print action/content; keyboard flow; and no network transmission.
6. Existing planner scenario confirmation still requires an explicit user action before a saved plan is replaced.
7. Regression coverage for `GuideBody` typed blocks and reading-time calculation.
8. Metadata coverage for homepage and `/fence-calculator` after resolving the client/server boundary.

Run and report:

```bash
npm run test
npm run lint
npx tsc --noEmit
npm run build
```

Use a valid temporary `NEXT_PUBLIC_SITE_URL=https://fenceblueprint.com` only for local build verification if required. Do not commit a fake origin or modify unrelated production secrets.

Manually verify in a browser:

- `/examples` and all five scenario detail pages;
- a scenario CTA with a pre-existing planner project (confirmation must appear);
- `/build-readiness`, including Ready / Verify / Stop states and print preview;
- updated permit, utilities, mistakes, installation, and shopping-list guides;
- `/about`, `/methodology`, homepage, `/fence-planner`, and `/fence-calculator` metadata;
- desktop, narrow mobile, and print layouts for the Scenario Studio and audit;
- sitemap and robots output with the configured production origin.

## Completion report

Create `docs/fence-planner-publisher-value-upgrade-report.md` containing:

1. implementation summary and the exact public routes added/changed;
2. source-of-truth calculation helpers used for scenario results;
3. scenario IDs, slugs, exact derived output highlights, and stated limitations;
4. sources added or removed, including any source URL replaced after verification;
5. publisher/metadata changes;
6. test, lint, TypeScript, build, browser, mobile, and print results;
7. any deliberate scope deferrals or blockers;
8. a short release checklist for the owner: verify publisher display name if desired, deploy, submit sitemap, then apply/reapply to AdSense.

Do not report the work as an AdSense approval guarantee. The completed site should instead make a clear, evidence-backed case that its value exists independently of advertising.
