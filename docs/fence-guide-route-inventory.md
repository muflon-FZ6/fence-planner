# Fence Planner — Guide Route Inventory

Status: live codebase inventory  
Date: 2026-07-17  
Scope: App Router routes, guide content sourcing, SEO surfaces, navigation, ads, related tools, redirects, print paths

---

## 1. Framework and App Router structure

| Item | Value |
|---|---|
| Framework | **Next.js `16.2.10`** (`package.json`) |
| React | `19.2.4` |
| Router | **App Router** only (`src/app/`) |
| Config | `next.config.ts` — Turbopack root only; **no** `redirects`, `rewrites`, or `headers` |
| Middleware | **None** (`middleware.ts` not present) |
| Root layout | `src/app/layout.tsx` — wraps all pages with `SiteHeader` + `SiteFooter` |
| Global CSS | `src/app/globals.css` |

### App routes (exact paths)

| Route | File |
|---|---|
| `/` | `src/app/page.tsx` |
| `/about` | `src/app/about/page.tsx` |
| `/contact` | `src/app/contact/page.tsx` |
| `/privacy` | `src/app/privacy/page.tsx` |
| `/terms` | `src/app/terms/page.tsx` |
| `/methodology` | `src/app/methodology/page.tsx` |
| `/examples` | `src/app/examples/page.tsx` |
| `/guides` | `src/app/guides/page.tsx` |
| `/guides/[slug]` | `src/app/guides/[slug]/page.tsx` |
| `/fence-planner` | `src/app/fence-planner/page.tsx` |
| `/fence-calculator` | `src/app/fence-calculator/page.tsx` |
| `/fence-material-calculator` | `src/app/fence-material-calculator/page.tsx` |
| `/fence-panel-calculator` | `src/app/fence-panel-calculator/page.tsx` |
| `/fence-post-calculator` | `src/app/fence-post-calculator/page.tsx` |
| `/fence-gate-planner` | `src/app/fence-gate-planner/page.tsx` |
| `/wood-fence-calculator` | `src/app/wood-fence-calculator/page.tsx` |
| `/privacy-fence-calculator` | `src/app/privacy-fence-calculator/page.tsx` |
| `/chain-link-fence-calculator` | `src/app/chain-link-fence-calculator/page.tsx` |
| `/concrete-for-fence-posts-calculator` | `src/app/concrete-for-fence-posts-calculator/page.tsx` |

No `src/pages/` directory. No route groups or parallel routes under `src/app/`.

---

## 2. Guide routes under `src/app/guides/`

| Path | Role |
|---|---|
| `src/app/guides/page.tsx` | Index at `/guides` — lists all guides from `guides` array |
| `src/app/guides/[slug]/page.tsx` | Article at `/guides/{slug}` |

Dynamic route behavior:

- `generateStaticParams()` → one param per entry in `guides`
- Unknown slug → `notFound()`
- Rendering: `GuideBody` for structured blocks; optional hero `Image` when `guide.image` is set

Public URL pattern: `/guides/{slug}`

---

## 3. How guides are sourced (`src/content/guides/`)

| Piece | Path / behavior |
|---|---|
| Registry | `src/content/guides/index.ts` — exports `guides: Guide[]` and `getGuide(slug)` |
| Type | `src/content/guides/types.ts` — `Guide`, `GuideBlock`, `GuideCalloutTone` |
| Articles | One module per guide: `src/content/guides/{slug}.ts` (kebab-case matching slug) |
| Body renderer | `src/components/guides/GuideBody.tsx` |

`Guide` fields:

| Field | Type | Notes |
|---|---|---|
| `slug` | `string` | Route segment |
| `title` | `string` | H1 + metadata title |
| `description` | `string` | Lead + metadata description |
| `readingMinutes` | `number` | Shown on index cards and article |
| `updated` | `string` | ISO `YYYY-MM-DD`; shown as “Updated …” |
| `body` | `GuideBlock[]` | `p`, `h2`, `h3`, `ul`, `ol`, `callout`, `example` |
| `relatedTool?` | `string` | Absolute path string (e.g. `/fence-planner`) |
| `image?` | `string` | Public path under `/guides/*.webp` |

Images present in `public/guides/` (6 of 20):

- `how-to-measure-for-a-new-fence.webp`
- `how-to-calculate-fence-panels-and-posts.webp`
- `fence-post-spacing-explained.webp`
- `how-much-concrete-for-fence-posts.webp`
- `plan-fence-corners-and-end-posts.webp`
- `measure-and-plan-a-fence-gate.webp`

No related-guide graph: articles do not link to other guides; only breadcrumb to `/guides`, optional related-tool CTA, and Methodology link.

---

## 4. Metadata, reading times, dates, JSON-LD

### Root metadata (`src/app/layout.tsx`)

- `title.default`: `"Fence Planner & Material Calculator | Free"`
- `title.template`: `"%s | Fence Planner"`
- `description`: site-wide default
- **No** `metadataBase`, **no** `alternates.canonical`, **no** `robots` field

### Guides index (`src/app/guides/page.tsx`)

- `title`: `"Fence Planning Guides"`
- `description`: guides hub blurb
- Cards show `readingMinutes` only (not `updated`)

### Guide article (`src/app/guides/[slug]/page.tsx`)

| Surface | Implementation |
|---|---|
| Metadata | `generateMetadata` → `{ title: guide.title, description: guide.description }` (template → `"{title} \| Fence Planner"`) |
| Visible meta | `{readingMinutes} min read · Updated {updated}` |
| JSON-LD | Inline `<script type="application/ld+json">` `Article`: `headline`, `description`, `dateModified` only — **no** `datePublished`, `author`, `image`, `mainEntityOfPage`, or `publisher` |
| Canonical | **Not set** |
| Robots | **Not set** (inherits crawlable default) |

All 20 guides currently use `updated: "2026-07-17"`.

---

## 5. Sitemap, robots, canonical handling

| Mechanism | Status |
|---|---|
| `src/app/sitemap.ts` / `sitemap.xml` | **Absent** |
| `src/app/robots.ts` / `public/robots.txt` | **Absent** |
| `metadataBase` | **Absent** |
| Per-page `alternates.canonical` | **Absent** |
| `next.config` redirects/rewrites | **None** |

Implication: no first-party sitemap/robots/canonical contract in repo; indexability relies on crawler discovery of linked routes.

---

## 6. Navigation links to guides

| Location | File | Links |
|---|---|---|
| Header | `src/components/site/SiteHeader.tsx` | `/guides` (“Guides”) |
| Footer | `src/components/site/SiteFooter.tsx` | `/guides` (“Planning guides”) under Tools |
| Home | `src/app/page.tsx` | First **6** guides as cards (`guides.slice(0, 6)` → `/guides/{slug}`); “View all guides →” → `/guides` |
| Guide article | `src/app/guides/[slug]/page.tsx` | Breadcrumb → `/guides`; related tool CTA when set |
| Header (other) | Same | Planner, Calculator, Examples, Methodology — not individual guide slugs |

Mobile: header nav is `md:flex` hidden on small screens; CTA is `/fence-planner` only (no mobile Guides link in header).

---

## 7. AdSlot usage on guide pages

Component: `src/components/ads/AdSlot.tsx`  
Slots: `landing-below` \| `sidebar` \| `below-results` \| `guide-inline` \| `footer`  
Always `no-print`; placeholder copy “Advertisement”; `data-ad-slot={slot}`.

| Page | Slot | Placement |
|---|---|---|
| `/guides` | `guide-inline` | Below intro, above grid (`className="my-6"`) |
| `/guides/[slug]` | `guide-inline` | After `GuideBody`, before related-tool CTA (`className="mt-10"`) |
| All pages (via footer) | `footer` | `SiteFooter` — every guide page also gets footer ad |

Guide pages do **not** use `sidebar`, `landing-below`, or `below-results`.

---

## 8. Related tool pages (existence)

All `relatedTool` targets resolve to existing `src/app/.../page.tsx` routes. **No 404-potential missing relatedTool paths.**

| Route | Exists | Implementation notes |
|---|---|---|
| `/fence-planner` | Yes | Full `Workspace` planner (client, `ssr: false`) |
| `/fence-calculator` | Yes | Live `QuickEstimate` |
| `/fence-material-calculator` | Yes | SEO `ToolPage` → CTA to `/fence-calculator` |
| `/fence-panel-calculator` | Yes | SEO `ToolPage` → `/fence-calculator` |
| `/fence-post-calculator` | Yes | SEO `ToolPage` → `/fence-calculator` |
| `/fence-gate-planner` | Yes | SEO `ToolPage` → `/fence-planner` |
| `/wood-fence-calculator` | Yes | SEO `ToolPage` → `/fence-calculator` |
| `/privacy-fence-calculator` | Yes | SEO `ToolPage` → `/fence-planner` |
| `/chain-link-fence-calculator` | Yes | SEO `ToolPage` → `/fence-calculator` |
| `/concrete-for-fence-posts-calculator` | Yes | SEO `ToolPage` → `/fence-calculator` |
| `/about` | Yes | Trust page (used by permit guide) |

`ToolPage`: `src/components/seo/ToolPage.tsx` — marketing shell + `AdSlot slot="below-results"`.

---

## 9. Redirects

| Kind | Finding |
|---|---|
| `next.config.ts` `redirects` | None |
| `middleware` redirects | None |
| In-app `redirect()` / `permanentRedirect()` for guides | None found |
| Legacy `/guides` paths | N/A — single dynamic slug map from index |

---

## 10. Printable output code paths

Print is **planner/calculator UI only**, not guide articles.

| Path | Role |
|---|---|
| `src/components/planner/PrintSheet.tsx` | Full plan print sheet (`.print-only.print-sheet`) |
| `src/components/planner/ShoppingListPrint.tsx` | Shopping-list sheet + `printShoppingList()` |
| `src/components/planner/Workspace.tsx` | Mounts both; “Print plan” / stage “Print” → `window.print()` + `track("print_project")` |
| `src/components/planner/BuildPanel.tsx` | “Print list” → `printShoppingList()` + `track("print_shopping_list")` |
| `src/app/globals.css` | `@media print` rules: hide `.no-print`; show `.print-only`; body class `print-shopping-list` toggles which sheet prints |
| `src/lib/analytics.ts` | Events `print_project`, `print_shopping_list` |

Guides mention printing in copy but have **no** print stylesheet or download path of their own.

---

## 11. Slug reconciliation: index vs expected list

Expected list from `docs/CURSOR_PHASE_1_HANDOFF.md` (20 slugs).

| # | Expected slug | In `guides` index | Match |
|---|---|---|---|
| 1 | `how-to-measure-for-a-new-fence` | Yes (order 1) | Exact |
| 2 | `how-to-calculate-fence-panels-and-posts` | Yes | Exact |
| 3 | `fence-post-spacing-explained` | Yes | Exact |
| 4 | `how-much-concrete-for-fence-posts` | Yes | Exact |
| 5 | `plan-fence-corners-and-end-posts` | Yes | Exact |
| 6 | `measure-and-plan-a-fence-gate` | Yes | Exact |
| 7 | `wood-panels-vs-individual-pickets` | Yes | Exact |
| 8 | `six-foot-vs-eight-foot-fence-sections` | Yes | Exact |
| 9 | `handle-uneven-final-fence-section` | Yes | Exact |
| 10 | `plan-fence-on-sloped-ground` | Yes | Exact |
| 11 | `privacy-fence-materials-checklist` | Yes | Exact |
| 12 | `chain-link-fence-materials-checklist` | Yes | Exact |
| 13 | `fence-installation-order` | Yes | Exact |
| 14 | `common-fence-planning-mistakes` | Yes | Exact |
| 15 | `fence-permit-and-property-line-checklist` | Yes | Exact |
| 16 | `mark-underground-utilities-before-digging` | Yes | Exact |
| 17 | `fence-project-shopping-list` | Yes | Exact |
| 18 | `fence-post-depth-and-frost` | Yes | Exact |
| 19 | `how-to-estimate-fence-waste` | Yes | Exact |
| 20 | `plan-fence-around-house-or-structure` | Yes | Exact |

**Result:** 20/20 present. No extra index entries. No missing expected slugs.

---

## 12. Per-guide inventory

Shared for all rows unless noted:

- **Rendering:** `src/app/guides/[slug]/page.tsx` + `src/components/guides/GuideBody.tsx`
- **Indexability:** crawlable by default; no canonical; not listed in a site sitemap (none exists)
- **Status:** Live (exported in `guides` array; statically params-generated)
- **Inbound:** `/guides` index, home (first 6 only), header/footer hub links
- **Outbound:** related tool CTA; `/methodology` disclaimer link

| # | Title | Slug / URL | Source file | Related tool | Tool exists | Read | Updated | Image |
|---|---|---|---|---|---|---|---|---|
| 1 | How to Measure for a New Fence | `/guides/how-to-measure-for-a-new-fence` | `src/content/guides/how-to-measure-for-a-new-fence.ts` | `/fence-planner` | Yes | 9 | 2026-07-17 | Yes |
| 2 | How to Calculate Fence Panels and Posts | `/guides/how-to-calculate-fence-panels-and-posts` | `src/content/guides/how-to-calculate-fence-panels-and-posts.ts` | `/fence-panel-calculator` | Yes | 10 | 2026-07-17 | Yes |
| 3 | Fence Post Spacing Explained | `/guides/fence-post-spacing-explained` | `src/content/guides/fence-post-spacing-explained.ts` | `/fence-post-calculator` | Yes | 8 | 2026-07-17 | Yes |
| 4 | How Much Concrete Does Each Fence Post Need? | `/guides/how-much-concrete-for-fence-posts` | `src/content/guides/how-much-concrete-for-fence-posts.ts` | `/concrete-for-fence-posts-calculator` | Yes | 9 | 2026-07-17 | Yes |
| 5 | How to Plan Fence Corners and End Posts | `/guides/plan-fence-corners-and-end-posts` | `src/content/guides/plan-fence-corners-and-end-posts.ts` | `/fence-planner` | Yes | 8 | 2026-07-17 | Yes |
| 6 | How to Measure and Plan a Fence Gate | `/guides/measure-and-plan-a-fence-gate` | `src/content/guides/measure-and-plan-a-fence-gate.ts` | `/fence-gate-planner` | Yes | 9 | 2026-07-17 | Yes |
| 7 | Wood Panels vs Individual Pickets | `/guides/wood-panels-vs-individual-pickets` | `src/content/guides/wood-panels-vs-individual-pickets.ts` | `/wood-fence-calculator` | Yes | 9 | 2026-07-17 | No |
| 8 | Six-Foot vs Eight-Foot Fence Sections | `/guides/six-foot-vs-eight-foot-fence-sections` | `src/content/guides/six-foot-vs-eight-foot-fence-sections.ts` | `/fence-panel-calculator` | Yes | 8 | 2026-07-17 | No |
| 9 | How to Handle an Uneven Final Fence Section | `/guides/handle-uneven-final-fence-section` | `src/content/guides/handle-uneven-final-fence-section.ts` | `/fence-planner` | Yes | 8 | 2026-07-17 | No |
| 10 | How to Plan a Fence on Sloped Ground | `/guides/plan-fence-on-sloped-ground` | `src/content/guides/plan-fence-on-sloped-ground.ts` | `/fence-planner` | Yes | 9 | 2026-07-17 | No |
| 11 | Privacy Fence Materials Checklist | `/guides/privacy-fence-materials-checklist` | `src/content/guides/privacy-fence-materials-checklist.ts` | `/privacy-fence-calculator` | Yes | 8 | 2026-07-17 | No |
| 12 | Chain-Link Fence Materials Checklist | `/guides/chain-link-fence-materials-checklist` | `src/content/guides/chain-link-fence-materials-checklist.ts` | `/chain-link-fence-calculator` | Yes | 8 | 2026-07-17 | No |
| 13 | Fence Installation Order | `/guides/fence-installation-order` | `src/content/guides/fence-installation-order.ts` | `/fence-planner` | Yes | 8 | 2026-07-17 | No |
| 14 | Common Fence-Planning Mistakes | `/guides/common-fence-planning-mistakes` | `src/content/guides/common-fence-planning-mistakes.ts` | `/fence-planner` | Yes | 9 | 2026-07-17 | No |
| 15 | Fence Permit and Property-Line Checklist | `/guides/fence-permit-and-property-line-checklist` | `src/content/guides/fence-permit-and-property-line-checklist.ts` | `/about` | Yes | 8 | 2026-07-17 | No |
| 16 | How to Mark Underground Utilities Before Digging | `/guides/mark-underground-utilities-before-digging` | `src/content/guides/mark-underground-utilities-before-digging.ts` | `/fence-planner` | Yes | 7 | 2026-07-17 | No |
| 17 | Fence Project Shopping List | `/guides/fence-project-shopping-list` | `src/content/guides/fence-project-shopping-list.ts` | `/fence-material-calculator` | Yes | 7 | 2026-07-17 | No |
| 18 | Fence Post Depth and Frost Considerations | `/guides/fence-post-depth-and-frost` | `src/content/guides/fence-post-depth-and-frost.ts` | `/concrete-for-fence-posts-calculator` | Yes | 8 | 2026-07-17 | No |
| 19 | How to Estimate Fence Waste | `/guides/how-to-estimate-fence-waste` | `src/content/guides/how-to-estimate-fence-waste.ts` | `/fence-calculator` | Yes | 8 | 2026-07-17 | No |
| 20 | How to Plan a Fence Around a House or Existing Structure | `/guides/plan-fence-around-house-or-structure` | `src/content/guides/plan-fence-around-house-or-structure.ts` | `/fence-planner` | Yes | 9 | 2026-07-17 | No |

### relatedTool 404 risk

**None.** Every `relatedTool` path has a matching App Router page.

Note: several related tools are thin SEO landing pages (`ToolPage`) that deep-link into `/fence-calculator` or `/fence-planner`, not standalone calculators.

---

## 13. Gaps / follow-ups (inventory only)

1. No `sitemap` / `robots` / `metadataBase` / canonical URLs.
2. Article JSON-LD is minimal (`headline`, `description`, `dateModified` only).
3. 14/20 guides lack `image` (and thus no hero on article/index cards).
4. Home surfaces only the first 6 guides.
5. No cross-guide related-article links.
6. Print pipelines live only in the planner workspace, not on guide pages.
