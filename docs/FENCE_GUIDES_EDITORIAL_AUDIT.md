# Fence Planner Guides — Prioritized Editorial Audit

Audit date: 2026-07-17  
Scope: all 20 articles in `ALL_GUIDES_CONTENT_REVIEW.md`  
Criteria: originality, usefulness, internal duplication, factual credibility, and Google AdSense low-value-content risk

## Executive verdict

**Do not treat the current batch as an AdSense fix by itself.** The articles are organized, readable, focused on one topic, and often tied to the Fence Planner tools. Those are meaningful strengths. However, in their current form the portfolio still has a **medium-high low-value-content risk** because it reads like a coordinated batch of AI-generated summaries rather than 20 independently researched resources.

The central distinction is:

- **The wording appears mostly original.** Exact-phrase spot checks on several distinctive sentences found no clear indexed verbatim source, and there is little exact sentence-level copying between the 20 articles.
- **The information is not yet original enough.** Most pages rearrange common fence-planning advice. They contain no named accountable author or reviewer, almost no citations, no documented calculation methodology or reproducible tool tests, and few examples that fully show their inputs and outputs.

Google does not ban AI-assisted content. It asks whether the result is accurate, useful, people-first, original, and demonstrably valuable. Google also warns that generating many pages without added value can violate its scaled-content policy. AdSense separately disallows ads on low-value pages and on copied or automatically generated pages without meaningful review or curation.

**Recommended launch shape:** consolidate the 20 pages to roughly **13–15 stronger canonical guides**, correct the technical issues below, and add a small set of genuinely original assets shared intelligently across the cluster. Do not keep all 20 merely to increase page count.

## What Google’s current guidance actually requires

There is no official minimum article length and no magic originality percentage. The applicable standards are qualitative:

1. AdSense says publisher content must be valuable and the focal point of the page; low-value or automatically generated content without manual review or curation can lose ad serving.  
   [Google-served ads on screens without publisher-content](https://support.google.com/publisherpolicies/answer/11112688?hl=en)

2. AdSense prohibits copied, lightly rewritten, or embedded content that lacks added commentary, curation, or other substantial value.  
   [Google-served ads on screens with replicated content](https://support.google.com/publisherpolicies/answer/11190248?hl=en)

3. Search guidance asks whether a page provides original information, research, analysis, or first-hand expertise; whether it goes beyond the obvious; and whether it offers substantial value compared with competing results. It also recommends clear authorship and explaining how substantially automated content was created.  
   [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

4. AI use is allowed, but publishing many AI-generated pages without added value may be scaled-content abuse.  
   [Google’s guidance on generative AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) · [Spam policies: scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies)

5. Google’s current AI-search guidance explicitly favors non-commodity, expert-led content with unique viewpoints and high-quality supporting images or video over generic summaries of common knowledge.  
   [Google’s guide to optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

6. Ad density still matters at page level: ads and paid promotions must not exceed publisher content.  
   [More ads or paid promotional material than publisher-content](https://support.google.com/publisherpolicies/answer/11169917?hl=en)

This audit therefore treats “originality” as **original contribution**, not merely different phrasing.

## Portfolio-level findings

### What is already good

- The site has a coherent topical focus rather than unrelated SEO articles.
- The guides repeatedly connect advice to working planner/calculator features. If those tools behave exactly as described, this is a defensible source of original value.
- Safety caveats around surveys, permits, utilities, frost, soil, and manufacturer instructions are directionally responsible.
- The prose is clear, scannable, and generally free of keyword stuffing.
- Several topics answer real pre-purchase questions: concrete volume, gate planning, slope, utilities, and property-line constraints.

Fence Planner is a free software planning tool, not a fencing contractor. It does **not** need to claim installation experience or invent customer projects. Its strongest evidence of expertise should instead be transparent methodology, reproducible reference scenarios, calculation tests, clearly stated limitations, authoritative sources, and outputs that users can verify in the live tool.

### What creates the low-value signal

1. **The portfolio is formulaic.** Nearly every page follows the same introduction → bullets → “worked example” → assumptions → steps → slogan-like result → checklist pattern. Several headings literally read “Worked example: Worked example.” Two articles contain “Bag bags.”

2. **The examples often stop before doing the useful work.** For instance, the spacing article compares 6 ft and 8 ft spacing but never states the resulting post counts. The gate example describes segment math but never shows the actual number of full and cut panels. Multiple results are conclusions such as “choose intentionally,” not calculations a reader can verify.

3. **Reading-time metadata is not credible.** The articles contain approximately 341–1,046 words but claim 7–10 minute reading times. At roughly 225 words per minute, they are closer to 2–5 minutes. Length itself is not the problem; inflated metadata makes the batch look mechanically produced and weakens trust.

4. **The same concepts recur across too many URLs.** Runs, gate subtraction, shared corners, module width, cut panels, post spacing, and planner warnings are repeated in Articles 1, 2, 3, 5, 6, 8, 9, 14, and 20. The text is not copied verbatim, but the search intent and informational payload overlap.

5. **Product expertise is asserted indirectly, not demonstrated.** There are no named accountable authors or technical reviewers, calculation contracts, reproducible tool scenarios, product data sheets, test methodology, or revision notes.

6. **Tool claims are unverified within the content.** References to Plan View, Dream View, presets, warning thresholds, module modes, defaults, and material rules add value only if the live tools exactly match them. Every such statement needs a product/content QA pass.

7. **Generic AI hero images will not fix this.** A realistic generated image can improve presentation, but it does not explain or validate the tool. Original diagrams, verified planner screenshots, reproducible examples, and downloadable outputs carry much more editorial weight.

## Highest-priority actions

### P0 — Correct before publication or AdSense resubmission

1. **Technically validate the core math in Articles 2 and 4.** Define exactly how a run is measured, how endpoint post widths are handled, what “panel-only” and “includes-post” mean, and whether nominal or actual post dimensions are used. Add unit-tested examples with diagrams.

2. **Fix the invalid example in Article 9.** Moving a gate on a side run does not change the remainder on a separate back run. Put the gate on the same fill segment, change an endpoint, or use a redistribution example that actually changes the arithmetic.

3. **Rewrite the slope measurement advice in Article 10.** Ground-path distance may make sense for a racked/follow-the-grade system, but stepped level panels are governed by horizontal span between posts. The article currently treats one measurement method as broadly correct.

4. **Make Article 13 system-specific.** Installation order varies. Some panel systems are installed one post and one panel at a time, while other systems establish terminal posts first. “Follow mix guidance and your judgment” is too loose for cure/loading advice.

5. **Strengthen utility guidance in Article 16.** Require confirmation that every notified utility has responded, following the locate paperwork, and obeying the applicable tolerance zone—not merely moving a post away from the painted line. Marks indicate an approximate facility location, not a precise safe boundary.  
   [Ontario One Call homeowner guidance](https://ontarioonecall.ca/homeowners/) · [U.S. 811 guidance](https://call811.com/) · [Common Ground Alliance tolerance-zone guidance](https://bestpractices.commongroundalliance.com/Portals/1/Best%20Practices%20Guide%20Version%2021%20PDF%20Download.pdf)

6. **Remove unsafe ambiguity in Article 18.** Replace “rocky sites may force shallower or alternate details” with advice to obtain an approved alternate design or local professional/inspector guidance. Rock does not automatically justify ignoring frost or embedment requirements.

7. **Treat house attachments in Article 20 as an exception requiring a verified detail.** Attaching a wind-loaded fence to siding, trim, masonry veneer, or an unknown wall assembly can create structural and water-management problems. A freestanding end post may be safer. Refer to the wall and fence manufacturers or a qualified professional.

8. **Correct all visible production errors and metadata.** Remove duplicate “Worked example” labels, fix “Bag bags,” recalculate reading times, and verify that update dates reflect real substantive edits.

### P1 — Consolidate overlapping pages

- **Merge Article 8 into Article 3.** “Six-Foot vs Eight-Foot Fence Sections” is a subsection of post spacing, not a separate strong search intent.
- **Merge Article 18 into Article 4** unless Article 18 becomes a genuinely localized frost-depth resource with authoritative sources and jurisdiction selection.
- **Merge Article 17 into Articles 11 and 12**, or replace it with a dynamic printable shopping-list output. As a 341-word generic list, it is the clearest low-value page in the set.
- **Either merge Article 9 into Article 2 or make it a true remainder optimizer.** The current text alone is not distinct enough.
- **Turn Article 14 into a hub/checkup tool.** It should summarize and diagnose, then link to canonical guides, rather than repeat their explanations.
- Consider combining the overlapping structural planning portions of Articles 5 and 20 while keeping a separate, narrower guide for building-adjacent clearances if it includes verified service-clearance and attachment details.

### P2 — Add original evidence before adding more pages

Build a suite of clearly labeled, reproducible Fence Planner reference scenarios. Each scenario should declare every input, show the tool output, expose the relevant formula or rule, state the limitation, and offer a “Load this example” action:

- an 80 ft straight privacy-fence run for panel/module and endpoint math;
- a U-shaped layout with shared corners, house-side endpoints, and one gate;
- an uneven final bay with a gate on the same run so users can see the remainder change;
- a sloped run comparing stepped and racked measurement methods;
- a concrete example with explicit post cross-section, hole dimensions, bag yield, and rounding;
- a chain-link layout with terminals, line posts, fabric, top rail, and bottom restraint.

These are not presented as customer projects or construction experience. Their originality comes from being transparent, testable demonstrations of the free tool’s own behavior. A small set of rigorous reference scenarios would add more defensible value than 20 additional generic articles.

## Article-by-article audit

Risk refers to the current page’s risk of looking low-value, duplicative, or insufficiently credible—not a prediction of a specific Google decision.

| # | Article | Current value | Risk | Recommended disposition |
|---:|---|---|---|---|
| 1 | How to Measure for a New Fence | Good field-planning structure; useful warning that planning measurements are not a survey | Medium | **Keep and deepen** |
| 2 | How to Calculate Fence Panels and Posts | Core topic with strong tool relevance, but the measurement/module model is underspecified | High | **Major technical rewrite** |
| 3 | Fence Post Spacing Explained | Useful concept, but examples do not show exact counts and overlap Article 8 | Medium | **Keep as canonical; absorb #8** |
| 4 | How Much Concrete Does Each Fence Post Need? | Strongest calculation opportunity; current defaults can mislead without bag and dimension context | High | **Major technical rewrite** |
| 5 | How to Plan Fence Corners and End Posts | Helpful classification framework; needs diagrams and sourced system details | Medium | **Keep and deepen** |
| 6 | How to Measure and Plan a Fence Gate | Useful everyday intent; generic width ranges and post rules need product/site context | Medium | **Keep and deepen** |
| 7 | Wood Panels vs Individual Pickets | Clear comparison but currently commodity advice | Medium | **Keep with a reproducible tool comparison** |
| 8 | Six-Foot vs Eight-Foot Fence Sections | Repeats #3 with less detail | High | **Merge into #3; redirect** |
| 9 | How to Handle an Uneven Final Fence Section | Distinct practical pain point, but the worked example is logically wrong | High | **Rewrite as tool or merge into #2** |
| 10 | How to Plan a Fence on Sloped Ground | High user value; measurement advice is too broad and can produce wrong quantities | High | **Major technical rewrite** |
| 11 | Privacy Fence Materials Checklist | Useful as a printable artifact; weak as a standalone generic article | High | **Convert to dynamic checklist; combine with #17** |
| 12 | Chain-Link Fence Materials Checklist | More distinct than #11; incomplete system detail | Medium | **Keep and expand** |
| 13 | Fence Installation Order | Useful intent but overgeneralizes across incompatible systems | High | **Rewrite by fence system** |
| 14 | Common Fence-Planning Mistakes | Useful hub, but largely summarizes eight other guides | Medium-high | **Make an interactive audit/hub** |
| 15 | Fence Permit and Property-Line Checklist | Important, cautious, and distinct; currently lacks authoritative links/localization | Low-medium | **Keep; source and localize** |
| 16 | How to Mark Underground Utilities Before Digging | Important and distinct safety content; incomplete locate/tolerance-zone workflow | Medium | **Keep; correct and source** |
| 17 | Fence Project Shopping List | Thinnest and most duplicative page | High | **Merge or replace with downloadable tool** |
| 18 | Fence Post Depth and Frost Considerations | Important but heavily overlaps #4 and contains risky phrasing | High | **Merge into #4 or localize substantially** |
| 19 | How to Estimate Fence Waste | The category-specific rule is a potentially original tool feature; the 5% default is weakly supported | Medium | **Keep only with transparent calculations/data** |
| 20 | How to Plan a Fence Around a House or Existing Structure | Useful niche; casual attachment guidance creates structural/water risk | High | **Major technical rewrite** |

## Concrete weaknesses and fixes by article

### 1. How to Measure for a New Fence

**Strength:** Run-by-run measuring, temporary markers, gates, obstacles, and survey caveats are useful. The corrected hero-image concept should show a proposed line with flags/stakes—no installed posts.

**Weaknesses:** The article repeats gate, corner, slope, and structure material found elsewhere. “Measure along the ground” needs a cross-reference to the corrected stepped-versus-racked method. The worked example still does not show the resulting post or panel counts.

**Original addition:** A downloadable field worksheet plus one annotated, hypothetical overhead layout with start/end markers, gate flags, obstacles, and the resulting Plan View. Label it as a reproducible reference scenario, not a completed project.

### 2. How to Calculate Fence Panels and Posts

**Strength:** This should be the flagship guide because it explains the site’s core calculation.

**Weaknesses:** It does not define whether a run length is outside-to-outside, center-to-center, or clear between endpoints. The “8 ft panel + 4 in post = 100 in” example is a planner convention, not a safe universal default. Nominal wood 4×4 posts are commonly smaller in actual cross-section. Product instructions can specify different center-to-center dimensions; one manufacturer example specifies 96 in center-to-center for certain 8 ft panels.  
   [Example manufacturer installation dimensions](https://www.homedepot.com/catalog/pdfImages/2b/2b52026f-c093-42bf-9f6a-70125197ccdc.pdf)

The 80 ft example calculates panel purchases but does not show the complete post count or reconcile endpoint widths. That leaves the reader unable to independently validate the tool.

**Fix:** Add a dimensioned diagram for each module mode, state the measurement convention, use actual product dimensions, and show every line of a complete calculation. Publish calculator test cases with expected outputs.

### 3. Fence Post Spacing Explained

**Strength:** Correctly separates on-center spacing from clear opening and notes that manufacturer guidance wins.

**Weaknesses:** The 96 ft example avoids the exact useful result: 12 spans/13 endpoint-inclusive posts at 8 ft versus 16 spans/17 posts at 6 ft for a simple isolated straight run, before gates or shared endpoints. “Common” spacings are planning ranges, not structural prescriptions.

**Fix:** Add exact counts, diagrams, wind/height caveats, and product-specific examples. Absorb Article 8.

### 4. How Much Concrete Does Each Fence Post Need?

**Strength:** The cylinder-minus-post formula and project-level rounding are useful and more original than a generic “bags per post” article.

**Weaknesses:** A 4×4 is treated as a full 4 in square, bag yield is presented as 0.33 ft³ without tying it to a bag size/product, and all post roles appear to use one hole specification. Official product calculators use specified bag sizes and note that yields are approximate.  
   [QUIKRETE concrete/post calculator](https://www.quikrete.com/calculator/main.asp)

**Fix:** Let users select actual post cross-section, hole diameter/depth by post role, bag weight, stated bag yield, and contingency. Show both theoretical volume and purchase rounding in a dimensioned interactive cross-section, then test the results against published product yields.

### 5. How to Plan Fence Corners and End Posts

**Strength:** The classification vocabulary and shared-corner logic are useful.

**Weaknesses:** Statements about heavier posts, bracing, and a gate being “too close” to a corner are broad. Chain-link terminal assemblies have specific components and conditions.

**Fix:** Add original plan-view topology diagrams and a component callout for wood versus chain-link corners. Cite a manufacturer/specification where technical details are given.

### 6. How to Measure and Plan a Fence Gate

**Strength:** Clear opening, traffic needs, swing, and subtraction from fill are good planning concepts.

**Weaknesses:** Width ranges are generic; “two posts per gate” has exceptions when a gate shares a verified structural terminal; the worked example does not calculate its two panel segments. Gate leaf size, hinge/latch allowances, frame weight, and anti-sag strategy are product-specific.

**Fix:** Add a gate-opening worksheet with measured equipment width, desired clearance, hinge/latch allowance, swing envelope, slope, and the exact panel result on both sides.

### 7. Wood Panels vs Individual Pickets

**Strength:** The two build methods genuinely produce different bills of materials.

**Weaknesses:** The current comparison could have been written without testing either method. It lacks cost, labor, cut, weight, repair, and availability evidence.

**Fix:** Run the same declared reference layout through both modes, disclose every setting, show the two complete bills of materials, and explain exactly what changed. If example product data is used, identify the product and date checked; live pricing is optional and should not be invented.

### 8. Six-Foot vs Eight-Foot Fence Sections

**Weakness:** This is essentially a shorter version of Article 3.

**Action:** Merge its useful remainder discussion into Article 3 and redirect the URL. Keep “section length” clearly separate from fence height.

### 9. How to Handle an Uneven Final Fence Section

**Strength:** Remainder aesthetics are a real planning problem.

**Critical error:** The example says to shift a gate on a side run to improve a back-run remainder. Moving a same-width gate elsewhere on a different run does not change the back run’s length or remainder.

**Fix:** Use a gate on the same fill segment, change the endpoint, or show legal redistribution across site-built bays. Best outcome: an interactive remainder optimizer that visualizes cut width as gate position or bay size changes.

### 10. How to Plan a Fence on Sloped Ground

**Strength:** Stepped versus racked is a valuable distinction.

**Critical issue:** The article recommends ground-path distance as the usual materials length without separating systems. A racked fence may follow the slope, but level stepped panels use horizontal post-to-post spans. A manufacturer may also impose a maximum rack amount; one installation guide, for example, limits a particular panel to 9 in of rack over 8 ft.  
   [Example rack-limit installation guide](https://www.homedepot.com/catalog/pdfImages/11/11772be5-7fea-40a8-aa08-ae0a0ef801e2.pdf)

**Fix:** Show rise, horizontal run, slope length, rack limit, step drop, and measurement method in one original diagram/calculator. Do not let the flat-run calculator imply it has modeled grade when it has not.

### 11. Privacy Fence Materials Checklist

**Weaknesses:** This is only about 400 words, repeats Article 17, gives no quantities, and contains “Bag bags.” It is a checklist outline rather than a complete guide.

**Fix:** Convert it to a dynamic, printable materials sheet populated from the user’s saved plan. Include product/SKU, nominal and actual dimensions, quantity, pack rounding, price, checked status, and substitution notes.

### 12. Chain-Link Fence Materials Checklist

**Strength:** It correctly distinguishes fabric, line posts, terminals, rail, and tension hardware.

**Weaknesses:** Bottom tension wire or rail is buried inside a fittings bullet rather than treated as a visible system decision. Tie quantities and bracing rules are left vague. The Chain Link Fence Manufacturers Institute identifies terminal posts, top rail, tension bars/bands, fittings, and bottom tension wire/rail as system components; its specifications provide spacing details for ties and tension wire.  
   [CLFMI chain-link parts](https://chainlinkinfo.org/chain-link-fence-parts/) · [CLFMI specification](https://chainlinkinfo.org/wp-content/uploads/2017/06/32-31-13revised-March-2017.pdf)

**Fix:** Add a dimensioned component diagram and calculate ties, tension bars, bands, brace assemblies, caps, wire/rail, and roll splices from the layout and chosen product standard.

### 13. Fence Installation Order

**Strength:** Permits, locates, layout, and stable gate posts belong before finishing work.

**Critical issue:** The sequence is presented too universally. Some systems instruct installers to set one post and one panel at a time, while others establish terminals before line posts. Cure/loading time must follow the exact concrete and fence-system instructions.  
   [Example post-and-panel installation sequence](https://www.homedepot.com/catalog/pdfImages/68/68971a4f-366d-4fe1-b94d-0147b5f93318.pdf)

**Fix:** Publish separate sequences for preassembled wood, site-built wood, vinyl/metal panel systems, and chain-link. Label the page planning guidance, not an installation standard.

### 14. Common Fence-Planning Mistakes

**Strength:** A concise pre-checkout audit can be useful.

**Weakness:** It repeats the core lesson from at least eight guides.

**Fix:** Make it a form that asks eight questions, flags risks, and deep-links users to the relevant canonical guide with their planner settings preserved.

### 15. Fence Permit and Property-Line Checklist

**Strength:** This is distinct, responsible, and likely valuable.

**Weaknesses:** It has no jurisdiction-specific official links, no date-sensitive research method, and the related `/about` link is not useful. Pool-barrier rules and easements are high-consequence areas.

**Fix:** Add a location selector or an official-resource worksheet: municipality, zoning/bylaw URL, permit office, HOA, survey source, pool rules, easements, date checked, and contact notes. Do not summarize local law without a source and review date.

### 16. How to Mark Underground Utilities Before Digging

**Strength:** This is one of the strongest topics because it is safety-critical and distinct from material math.

**Weaknesses:** “Wait for marks” is incomplete. Users must confirm all notified owners have responded, follow paperwork and locate instructions, account for private lines, preserve marks, and respect the local tolerance zone. A painted mark is approximate.

**Fix:** Link users by country/region to [U.S. 811](https://call811.com/) or Canada’s [Click Before You Dig](https://www.clickbeforeyoudig.com/). Add an original tolerance-zone diagram and a status checklist. For Ontario readers, Ontario One Call says fence projects require a locate request at least five business days before digging and identifies several private lines that require a private locator.  
   [Ontario One Call](https://ontarioonecall.ca/homeowners/)

### 17. Fence Project Shopping List

**Weakness:** At about 341 words, this is the thinnest page and substantially duplicates Articles 11 and 12. “Add hardware last” is a workflow preference, not meaningful guidance.

**Action:** Merge it into the material-specific checklists or make the URL the landing page for a genuinely useful generated shopping list. Do not preserve it merely as another indexable article.

### 18. Fence Post Depth and Frost Considerations

**Strength:** It correctly says a 36 in default is not universal.

**Weaknesses:** It duplicates Article 4 and gives no authoritative local method. “Rocky sites may force shallower” is unsafe without requiring an approved alternate design. It also contains “Bag bags.”

**Action:** Merge into Article 4, or rebuild it as a sourced local-research workflow with inspector/municipal/manufacturer references and explicit limits.

### 19. How to Estimate Fence Waste

**Strength:** Category-specific waste rather than one blanket percentage is a meaningful calculator design choice.

**Weaknesses:** “5% is reasonable” is unsupported; rails are often better handled through stock-length optimization than a percentage; and rounded concrete bags do not necessarily cover irregular/oversized holes.

**Fix:** Call 5% a visible editable house default, not an industry truth. Add a sensitivity table and use data from completed projects: planned, bought, installed, damaged/rejected, returned, and left over.

### 20. How to Plan a Fence Around a House or Existing Structure

**Strength:** Service access, gate swing, short returns, and obstacles are useful, distinct concerns.

**Critical issue:** The article makes bracketed building attachment sound like a normal material-saving choice. The wall must be structurally suitable, the attachment must manage water, and siding/trim/masonry veneer may not be an acceptable load path. AC and vent clearances must come from the equipment and applicable rules.

**Fix:** Prefer a freestanding end-post option in the main example. Present attachment only with a verified manufacturer/structural detail. Add a measured side-yard plan showing service zones around actual equipment.

## Original visuals and tools with the highest editorial return

Prioritize assets that expose decisions or calculations, not generic finished-fence photography.

| Priority | Original asset | Guides improved | Why it adds defensible value |
|---:|---|---|---|
| 1 | **Reproducible reference-scenario suite** with declared inputs, planner states, formulas, expected outputs, and limitations | All; especially 1, 2, 4, 6, 10, 19 | Demonstrates the tool’s methodology without pretending to be a contractor |
| 2 | **Panel/module dimension visualizer** with outside/center/clear measurement modes | 2, 3, 6, 8, 9 | Resolves the portfolio’s biggest calculation ambiguity |
| 3 | **Remainder optimizer** that moves a gate or changes spacing and redraws bays | 2, 3, 6, 8, 9, 14 | Creates functionality that a generic article cannot copy cheaply |
| 4 | **Concrete cross-section calculator** with hole, post, bag size/yield, role, and rounding | 4, 18, 19 | Turns a risky rule of thumb into transparent math |
| 5 | **Stepped-versus-racked slope lab** showing rise, horizontal run, slope length, rack limit, and post exposure | 10 | Corrects a real technical weakness and gives unique visual value |
| 6 | **Fence-joint topology diagram** for line/end/corner/gate/terminal/structure nodes | 1, 2, 5, 6, 12, 20 | Makes shared-post logic immediately understandable |
| 7 | **Dynamic printable shopping list** generated from a saved plan | 11, 12, 17, 19 | Converts thin checklist pages into useful publisher-created content |
| 8 | **Utility-locate workflow and tolerance-zone diagram** with regional official links | 13, 16 | Adds safety value and authoritative context |
| 9 | **Permit/property research worksheet** with source URL and date checked | 15 | Useful without pretending to give universal legal rules |

### Image guidance

- Use original field photos only if they are naturally available; they are not required for a software planning tool.
- Use clean diagrams for geometry, slope, hole volume, and shared posts.
- Use actual planner screenshots only when they match the live interface and show a meaningful state.
- AI-generated hero images may be used for atmosphere, but they should not substitute for evidence. Review every image for physically possible construction.
- For “How to Measure for a New Fence,” show temporary flags/stakes and a proposed line before construction. Do **not** show measuring between installed permanent posts.

## Recommended canonical content map

One sensible consolidation would be:

1. Measure and map a new fence
2. Calculate panels, posts, gates, and remainder bays
3. Fence post spacing and 6 ft vs 8 ft sections
4. Concrete, post depth, frost, and bag calculations
5. Corners, ends, terminals, and structure-adjacent planning
6. Measure and plan a gate
7. Panels vs site-built pickets
8. Fence on sloped ground
9. Privacy-fence dynamic materials checklist
10. Chain-link dynamic materials checklist
11. Installation order by fence system
12. Planning mistakes interactive audit
13. Permit, property line, and easement checklist
14. Utility-locate and safe-digging workflow
15. Fence waste and stock-length optimization

Article 17 becomes a tool landing state, not a generic article. Article 14 becomes an interactive hub. Articles 8 and 18 are absorbed into their stronger canonical parents.

## Editorial standards to apply before publishing

Every retained guide should have:

- a real byline and accurate author/reviewer bio;
- a concise disclosure of AI assistance where readers would reasonably ask how the content was produced;
- a named accountable human editor; identify a separate technical reviewer only where that review actually occurred;
- at least one original contribution: reproducible scenario, original diagram, interactive calculation, verified tool output, or derived dataset;
- authoritative citations for safety, legal, manufacturer, and product-specific claims;
- a complete worked example whose input and output can be independently checked;
- verified agreement with the live planner/calculator;
- truthful reading time and revision date;
- a clear boundary between planning estimates and product/code/engineering requirements;
- fewer, purposeful ad placements so content remains the focal point.

## Final recommendation

The batch is a useful **draft knowledge base**, not yet a strong set of finished publisher pages. The right move is not to make every article longer. It is to:

1. correct the math and safety issues;
2. merge the overlapping intents;
3. prove the site’s tools with reproducible examples and transparent calculations;
4. add authorship, review, sources, and creation context;
5. replace generic imagery with original evidence and interactive assets.

After those changes, the cluster could become materially valuable because the underlying planner can provide something generic fence blogs do not: a visual, testable connection between yard geometry and a complete materials list. That product-specific evidence—not AI-written volume—is the best path out of low-value-content risk.
