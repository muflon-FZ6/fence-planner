# Fence Planner & Material Calculator
## AI Build Project Brief

**Project type:** Free, ad-supported web utility  
**Business model:** Always free to use; revenue from Google AdSense/display advertising  
**Primary audience:** Homeowners, DIY renovators, landlords, contractors, property managers  
**Owner/brand context:** A Double M free utility tool  
**Core promise:** Draw or enter a fence layout, place gates and corners, and receive a clear material estimate and printable project plan.

---

# 1. Project Summary

Build a free web-based **Fence Planner & Material Calculator** that helps users plan a fence before purchasing materials.

The tool must go beyond a basic linear-foot calculator. The winning product experience is a visual planner where users can:

- enter or draw fence runs;
- place corners, endpoints and gates;
- choose a fence system;
- see where posts and panels will fall;
- identify uneven final sections;
- calculate panels, posts, rails, pickets, concrete and hardware;
- generate a printable project summary and materials list.

The site should be easy enough for a homeowner planning a backyard fence, while still useful to contractors who want a quick preliminary estimate.

The product must remain **free forever**, require no account for core use, and be designed to generate revenue through AdSense without harming usability.

---

# 2. Product Vision

Create the clearest and most practical free fence-planning tool on the web.

The key idea is:

> **Draw the fence you intend to build, see where the posts, panels and gates will go, and get the materials list.**

The interface itself is the main value. A chat-based AI can estimate fence materials, but it cannot replace a fast visual tool that lets users adjust measurements, move gates, see short final sections and print the result.

---

# 3. Product Principles

## 3.1 Always free

The product must not include:

- subscriptions;
- paid exports;
- locked fence types;
- paid accounts;
- credit-card prompts;
- premium calculation modes;
- watermarked printouts.

All core features must remain available without payment.

## 3.2 No account required

The default workflow must work without sign-up.

Use browser local storage for:

- the current project;
- preferred units;
- last-used fence type;
- recent material settings;
- optional saved projects.

An optional import/export project file may be added later.

## 3.3 Visual first

The tool should help users understand the layout, not simply return numbers.

Every material result should be connected to the layout.

Example:

- 16 line posts;
- 4 corner posts;
- 2 gate posts;
- 18 full panels;
- 1 cut panel at 42 inches.

## 3.4 Explain assumptions

Every estimate must show the assumptions used.

Examples:

- panel width;
- post spacing;
- fence height;
- gate width;
- post-hole diameter and depth;
- concrete bag yield;
- waste percentage.

Users must be able to edit assumptions.

## 3.5 Practical, not decorative

The visual planner should be polished, but its purpose is to help users build and buy materials.

Avoid unnecessary 3D effects, animation or decorative complexity.

---

# 4. Target Users

## 4.1 Primary users

### Homeowners and DIY users

They need help estimating materials before visiting a store.

Common questions:

- How many fence panels do I need?
- How many posts do I need?
- Where should the posts go?
- Will my last section be too short?
- How much concrete is required?
- How many gates should I account for?

### Landlords and property managers

They may need quick estimates for repairs, replacements or property improvements.

### Small contractors and handymen

They may use the tool for preliminary planning or to communicate a rough material list to a client.

## 4.2 Secondary users

- real-estate investors;
- landscape designers;
- farm and acreage owners;
- community organizations;
- schools and recreational facilities.

---

# 5. Core User Problems

The product should solve these specific problems:

1. Users know the total fence length but do not know how many posts and panels are required.
2. Gates, corners and house connections change the number and type of posts.
3. The final fence section may not fit evenly.
4. Different fence systems use different spacing and material rules.
5. Users often forget rails, fasteners, concrete and gate hardware.
6. Users do not know which assumptions affect the estimate.
7. Existing calculators are often retailer-specific, overly simplistic or fragmented by fence type.
8. Users want a printable project plan they can bring to a store or job site.

---

# 6. Winning Product Formula

The product should win through the following combination:

## 6.1 Quick estimate plus visual planner

Offer two entry paths:

### Quick Estimate

For users who want a fast result.

Inputs:

- total fence length;
- number of corners;
- number of gates;
- fence type;
- standard panel width or post spacing.

### Visual Planner

For users who want a more accurate result.

Capabilities:

- draw or add straight fence runs;
- enter exact run lengths;
- connect runs;
- mark corners;
- add gates;
- connect a run to a house or existing structure;
- see post and panel placement;
- edit any segment.

The quick estimate should feed into the visual planner so users can refine the layout.

## 6.2 Results users can understand

Do not present a single unexplained total.

Group the result into:

- posts;
- panels or pickets;
- rails;
- concrete;
- gates and hardware;
- fasteners;
- waste;
- optional items.

## 6.3 Practical warnings

The tool should detect and explain common problems:

- uneven final section;
- very short panel section;
- gate wider than available space;
- gate too close to a corner;
- unsupported long span;
- zero or negative measurements;
- unusual post spacing;
- insufficient concrete-hole depth input;
- high waste caused by layout.

## 6.4 Printable output

The free printable result is a key product feature.

The printout should include:

- project name;
- date;
- unit system;
- fence diagram;
- segment measurements;
- gate locations and widths;
- fence configuration;
- material totals;
- assumptions;
- warnings;
- blank price fields;
- notes area;
- disclaimer.

---

# 7. Supported Fence Types

## 7.1 MVP fence systems

Start with three systems.

### A. Preassembled panel fence

Examples:

- wood privacy panels;
- vinyl panels;
- decorative panels.

Inputs:

- panel width;
- fence height;
- post width;
- gap allowance;
- gate count and width.

Outputs:

- full panels;
- cut panel requirement;
- line posts;
- corner posts;
- end posts;
- gate posts;
- concrete;
- gate hardware;
- fasteners.

### B. Site-built wood privacy fence

Inputs:

- post spacing;
- number of horizontal rails;
- picket width;
- picket gap;
- fence height;
- board length;
- gate count and width.

Outputs:

- posts;
- rails;
- pickets;
- concrete;
- rail brackets or fasteners;
- gate posts;
- gate framing allowance;
- waste.

### C. Chain-link fence

Inputs:

- line-post spacing;
- terminal posts;
- gate widths;
- fabric roll length;
- top rail length;
- tension-wire option;
- fence height.

Outputs:

- line posts;
- terminal/end/corner/gate posts;
- fabric rolls;
- top rail sections;
- tension bars;
- brace bands;
- ties;
- gate hardware;
- concrete.

## 7.2 Future fence systems

Add only after the MVP is stable:

- horizontal-board fence;
- picket fence;
- split-rail fence;
- farm wire fence;
- welded-wire fence;
- aluminum ornamental fence;
- custom post-and-rail fence.

---

# 8. UX Flow

## Step 1: Start a project

Fields:

- project name, optional;
- measurement system: imperial or metric;
- quick estimate or visual planner;
- fence type.

Primary CTA:

> Start Planning

Do not require an account.

## Step 2: Define the layout

### Quick mode

Inputs:

- total length;
- corners;
- endpoints;
- gates;
- house-connected ends.

Show a small preview.

### Visual mode

Users should be able to:

- add a fence run;
- drag endpoints;
- select a segment;
- enter exact length;
- rotate or reposition the segment;
- connect runs;
- convert a joint into a corner;
- add a gate to a selected segment;
- delete a run or gate;
- undo and redo.

Each run should display its length.

## Step 3: Configure the fence

Show only the inputs relevant to the selected fence type.

Use sensible defaults but make every default visible and editable.

Example defaults for a preassembled panel fence:

- panel width: 8 ft;
- post width: 4 in;
- fence height: 6 ft;
- post-hole diameter: 12 in;
- post-hole depth: 36 in;
- concrete bag yield: editable;
- waste allowance: 5%.

## Step 4: Review the layout

Display:

- all fence runs;
- corners;
- gate openings;
- post positions;
- full panels;
- partial panels;
- labels and measurements.

Warnings should appear inline and in a summary panel.

## Step 5: Review materials

Display a categorized list with quantities and calculation notes.

Example:

**Posts — 24 total**

- 16 line posts;
- 4 corner posts;
- 2 end posts;
- 2 gate posts.

**Panels — 19 total**

- 18 full panels;
- 1 panel cut to 42 inches.

## Step 6: Print or save

Actions:

- print project;
- save as PDF through browser printing;
- copy material list;
- save locally;
- reset project;
- duplicate project.

No paid upsell.

---

# 9. UI Requirements

## 9.1 General design

The interface should feel:

- practical;
- modern;
- trustworthy;
- clean;
- easy to scan;
- usable on desktop and tablet;
- functional on mobile.

Avoid making it look like contractor enterprise software.

## 9.2 Desktop layout

Recommended structure:

- left panel: steps and configuration;
- centre: visual fence canvas;
- right panel: live material estimate and warnings.

Allow panels to collapse.

## 9.3 Mobile layout

Use a step-by-step flow:

1. layout;
2. configuration;
3. preview;
4. materials;
5. print.

The canvas should support pinch-to-zoom and touch-friendly handles.

## 9.4 Visual language

Use:

- simple top-down line drawings;
- clear post markers;
- labelled gates;
- distinct line-post, corner-post, end-post and gate-post symbols;
- visible full and partial panel spans;
- accessible contrast;
- patterns or labels in addition to colour.

## 9.5 Controls

Use:

- numeric fields with unit labels;
- increment/decrement controls where useful;
- sliders only for broad estimates, not precision measurements;
- tooltips for technical terms;
- clear reset and undo;
- immediate validation.

## 9.6 Accessibility

Meet WCAG 2.2 AA where practical.

Requirements:

- keyboard operability;
- focus states;
- text alternatives;
- colour-independent warnings;
- labelled controls;
- readable print output;
- touch targets of appropriate size;
- support for browser zoom.

---

# 10. Calculation Logic

The AI build agent must isolate all calculation logic from the UI.

Create testable calculation modules for each fence type.

## 10.1 General layout concepts

Each project contains:

- fence runs;
- joints;
- endpoints;
- corners;
- gates;
- structure-connected endpoints;
- fence type;
- material settings.

Each fence run has:

- start point;
- end point;
- length;
- gate openings;
- fence configuration;
- optional notes.

## 10.2 Post classification

Possible post types:

- line post;
- corner post;
- end post;
- gate post;
- terminal post;
- house-connected endpoint;
- shared post between connected segments.

Do not double-count shared posts.

## 10.3 Panel calculation

For a panel-based fence:

1. Calculate usable fence length after subtracting gate openings.
2. Divide each uninterrupted run by configured panel module width.
3. Calculate full panels.
4. Calculate remainder.
5. Flag any partial panel.
6. Add waste allowance only where appropriate.
7. Do not treat gates as panels.

The tool should show whether the module width includes the post or represents panel-only width.

This setting must be explicit.

## 10.4 Site-built fence calculation

For each run:

1. subtract gate openings;
2. determine number of spans based on post spacing;
3. determine posts required;
4. multiply spans by rails per span;
5. calculate total picket coverage;
6. calculate picket count from picket width plus gap;
7. account for partial pickets and waste.

## 10.5 Concrete calculation

Inputs:

- hole diameter;
- hole depth;
- post cross-section;
- number of concreted posts;
- bag yield.

Formula:

1. calculate cylindrical hole volume;
2. subtract buried post volume;
3. multiply by number of posts;
4. convert to selected units;
5. divide by bag yield;
6. round up to whole bags;
7. optionally add waste percentage.

Show the calculation assumptions.

## 10.6 Gate calculations

For every gate:

- subtract gate opening from fence-fill material;
- add appropriate gate posts;
- add hinge set;
- add latch set;
- add drop rod for double gates where applicable;
- add gate frame allowance;
- identify whether the gate shares terminal posts.

## 10.7 Chain-link calculation

At minimum, account for:

- fabric length;
- roll count;
- top rail;
- line posts;
- terminal posts;
- gate posts;
- ties;
- tension bars;
- brace bands;
- concrete;
- gate hardware.

Use editable material coefficients rather than hard-coding every supplier system.

## 10.8 Waste allowance

Waste must be:

- visible;
- editable;
- applied intentionally;
- not silently added to all categories.

Examples:

- panels: optional;
- pickets: recommended;
- rails: recommended;
- concrete: optional;
- gate hardware: no percentage waste.

## 10.9 Rounding rules

Define and document rounding.

Examples:

- posts: round up;
- full panels: round up only when a cut panel requires purchasing another panel;
- concrete bags: round up;
- fasteners: round up to package quantity only if package size is known;
- fabric rolls: round up.

---

# 11. Data Model

Suggested project structure:

```ts
type UnitSystem = "imperial" | "metric";

type FenceType =
  | "panel"
  | "wood_privacy"
  | "chain_link";

type Point = {
  x: number;
  y: number;
};

type FenceRun = {
  id: string;
  start: Point;
  end: Point;
  length: number;
  gateIds: string[];
  notes?: string;
};

type Gate = {
  id: string;
  runId: string;
  offsetFromRunStart: number;
  width: number;
  gateType: "single" | "double";
};

type Joint = {
  id: string;
  connectedRunIds: string[];
  type: "corner" | "straight" | "end" | "structure_connection";
};

type FenceSettings = {
  panelWidth?: number;
  postSpacing?: number;
  postWidth?: number;
  fenceHeight: number;
  railsPerSpan?: number;
  picketWidth?: number;
  picketGap?: number;
  holeDiameter: number;
  holeDepth: number;
  concreteBagYield: number;
  wastePercent: number;
};

type FenceProject = {
  id: string;
  name?: string;
  unitSystem: UnitSystem;
  fenceType: FenceType;
  runs: FenceRun[];
  gates: Gate[];
  joints: Joint[];
  settings: FenceSettings;
  createdAt: string;
  updatedAt: string;
};
```

This is conceptual. The build agent may refine it, but the separation between geometry, configuration and materials must remain clear.

---

# 12. MVP Scope

The MVP must include:

## Core planning

- imperial and metric units;
- quick estimate mode;
- visual layout mode;
- straight fence runs;
- connected runs and corners;
- gates;
- editable measurements;
- undo and redo;
- local save.

## Fence systems

- preassembled panel fence;
- site-built wood privacy fence;
- chain-link fence.

## Results

- post count by type;
- panel, picket or fabric quantities;
- rail quantities;
- concrete bags;
- gate hardware;
- fastener allowance;
- waste;
- warnings;
- printable summary.

## Content and trust

- homepage;
- primary tool page;
- how-it-works page;
- methodology/assumptions page;
- About;
- Contact;
- Privacy Policy;
- Terms;
- disclaimer.

## AdSense readiness

- responsive ad-safe layout;
- no ads inside controls;
- no ads that resemble tool buttons;
- guide/article section;
- sufficient original content before AdSense application.

---

# 13. Out of Scope for MVP

Do not build these initially:

- live product prices;
- retailer inventory integrations;
- contractor lead generation;
- code-compliance certification;
- permit lookup by address;
- underground utility lookup;
- 3D property modelling;
- satellite imagery;
- automatic lot-boundary detection;
- user accounts;
- social login;
- paid features;
- structural engineering calculations;
- automated contractor quotes.

---

# 14. Future Features

Potential phase-two features:

- project comparison;
- cost-estimate fields entered by user;
- price per panel, post, rail and concrete bag;
- printable shopping checklist;
- section-by-section installation order;
- slope/stair-step planning;
- stepped versus racked fence comparison;
- custom material profiles;
- project import/export;
- multiple saved local projects;
- SVG or image export;
- simple property/background image import;
- accessibility improvements based on user testing.

---

# 15. SEO & Traffic Strategy

## 15.1 Core traffic principle

The site should become a complete fence-planning resource with the calculator at the centre.

Do not create thin, near-duplicate pages.

Each search page must offer:

- relevant calculator configuration;
- original explanation;
- diagrams;
- examples;
- common mistakes;
- links into the full planner.

## 15.2 Core tool pages

Recommended pages:

- `/fence-calculator`
- `/fence-planner`
- `/fence-material-calculator`
- `/fence-panel-calculator`
- `/fence-post-calculator`
- `/wood-fence-calculator`
- `/privacy-fence-calculator`
- `/chain-link-fence-calculator`
- `/concrete-for-fence-posts-calculator`
- `/fence-gate-planner`

## 15.3 Guide section

Create a guide hub:

> **Fence Planning Guides**

Initial guide topics:

1. How to Measure for a New Fence  
2. How to Calculate Fence Panels and Posts  
3. Fence Post Spacing Explained  
4. How Much Concrete Does Each Fence Post Need?  
5. How to Plan Fence Corners and End Posts  
6. How to Measure and Plan a Fence Gate  
7. Wood Panels vs Individual Pickets  
8. Six-Foot vs Eight-Foot Fence Sections  
9. How to Handle an Uneven Final Fence Section  
10. How to Plan a Fence on Sloped Ground  
11. Privacy Fence Materials Checklist  
12. Chain-Link Fence Materials Checklist  
13. Fence Installation Order  
14. Common Fence-Planning Mistakes  
15. Fence Permit and Property-Line Checklist  
16. How to Mark Underground Utilities Before Digging  
17. Fence Project Shopping List  
18. Fence Post Depth and Frost Considerations  
19. How to Estimate Fence Waste  
20. How to Plan a Fence Around a House or Existing Structure

## 15.4 Worked-example pages

Create a limited number of high-quality examples:

- 50-foot straight privacy fence;
- 100-foot backyard fence with one gate;
- L-shaped fence with two corners;
- U-shaped yard fence with a double gate;
- 150-foot chain-link fence;
- panel fence with an uneven last section.

Each example should include:

- assumptions;
- diagram;
- material calculation;
- warnings;
- link to open a similar configuration in the planner.

## 15.5 Structured data

Where appropriate, add:

- WebApplication schema;
- FAQ schema only for visible FAQs;
- BreadcrumbList schema;
- Article schema for guides.

Do not misuse structured data.

---

# 16. AdSense Strategy

## 16.1 Revenue model

The tool remains free. Revenue comes from display advertising.

## 16.2 Ad placement rules

Good placements:

- below the introductory content;
- right rail on desktop;
- below the generated result;
- between guide sections;
- article sidebar;
- page footer.

Avoid:

- ads inside the drawing canvas;
- ads between measurement fields;
- ads beside primary action buttons;
- sticky ads covering the planner;
- layouts that cause accidental clicks;
- excessive ad density;
- ads in print output.

## 16.3 Page-view strategy

Encourage legitimate multi-page sessions through:

- related material calculators;
- guide links;
- worked examples;
- fence-type pages;
- printable shopping list;
- concrete calculator;
- gate-planning guide.

Do not artificially split content into unnecessary pages.

---

# 17. Content Quality & AdSense Approval

Before applying for AdSense, the site should include:

- a fully working tool;
- at least 15–20 substantial guides;
- several worked examples;
- About page;
- Contact page;
- Privacy Policy;
- Terms;
- methodology page;
- safety and accuracy disclaimer;
- clear navigation;
- no placeholders;
- no broken links;
- mobile usability;
- reasonable page speed;
- original diagrams and explanations.

The site must feel like a useful fence-planning publication with a tool, not a thin calculator wrapped in ads.

---

# 18. Safety, Accuracy & Legal Notes

The calculator provides planning estimates only.

The site must clearly state:

- users must verify property boundaries;
- users must check local permits, bylaws and codes;
- users must contact utility-marking services before digging;
- frost depth varies by location;
- wind load, soil, slope and structural conditions affect installation;
- the tool does not replace a contractor, engineer, surveyor or local authority;
- product dimensions and installation systems vary by manufacturer;
- users should verify actual purchased product dimensions.

Location-dependent advice must not be presented as universal.

---

# 19. Technical Recommendations

The build agent should use the existing project stack if one already exists.

If building from scratch, a suitable implementation may use:

- React or Next.js;
- TypeScript;
- responsive CSS/Tailwind;
- SVG or HTML Canvas for the planner;
- browser local storage;
- print-specific CSS;
- modular calculation engine;
- unit tests for formulas;
- no backend required for MVP.

## 19.1 Architecture principles

Separate:

1. geometry and layout;
2. fence configuration;
3. material calculation;
4. warnings and validation;
5. UI state;
6. persistence;
7. printing.

Do not embed calculation formulas directly inside UI components.

## 19.2 Performance

Target:

- fast initial load;
- immediate calculation updates;
- no unnecessary third-party libraries;
- lazy-load guide content or heavy assets;
- responsive canvas;
- stable layout around ad slots.

## 19.3 Privacy

For the no-account MVP:

- store projects locally;
- do not collect names or addresses;
- do not require email;
- do not upload layouts to a server unless explicitly added later;
- explain local storage in the privacy policy.

---

# 20. Analytics

Track product usage without collecting unnecessary personal data.

Suggested events:

- `start_project`;
- `select_fence_type`;
- `choose_quick_mode`;
- `choose_visual_mode`;
- `add_fence_run`;
- `add_gate`;
- `calculate_materials`;
- `view_warning`;
- `print_project`;
- `copy_material_list`;
- `open_guide`;
- `switch_units`;
- `save_local_project`.

Analytics should help identify:

- where users abandon;
- most-used fence types;
- most common warnings;
- print usage;
- guide-to-tool conversion.

---

# 21. Acceptance Criteria

The MVP is complete when:

1. A user can create a fence project without an account.
2. A user can choose imperial or metric units.
3. A user can create one or more straight fence runs.
4. Connected runs can form corners without duplicate posts.
5. Gates can be placed within a fence run.
6. Gate width is excluded from fence-fill material.
7. The tool classifies posts by type.
8. Panel-based estimates show full and partial sections.
9. Site-built wood estimates calculate posts, rails and pickets.
10. Chain-link estimates calculate fabric, rails and posts.
11. Concrete calculation is based on editable hole and post dimensions.
12. All assumptions are visible.
13. Warnings explain uneven or impractical sections.
14. Results update immediately after input changes.
15. The project can be printed cleanly.
16. Projects can be saved locally.
17. The site is usable on desktop, tablet and mobile.
18. Keyboard and screen-reader basics are supported.
19. No feature is placed behind a paywall.
20. Ad placements do not interfere with the tool.
21. Core trust pages and launch guides exist.
22. Calculation logic has automated tests.

---

# 22. Required Test Scenarios

The AI build agent must test at least the following:

## Panel fence

- 80-foot straight run using 8-foot panels;
- 84-foot run creating a partial final panel;
- L-shaped fence with one shared corner post;
- U-shaped fence with two shared corner posts;
- one 4-foot gate;
- one 10-foot double gate;
- gate located near a corner;
- two gates in one run.

## Site-built wood fence

- 100 feet at 8-foot post spacing;
- 100 feet at 6-foot post spacing;
- three rails per span;
- pickets with no gap;
- pickets with a configured gap;
- final uneven span;
- waste percentage change.

## Chain link

- straight run with two terminal posts;
- L-shaped run with one corner terminal;
- one walk gate;
- one double drive gate;
- fabric roll rounding;
- top rail rounding.

## Concrete

- post volume subtraction;
- metric conversion;
- imperial conversion;
- multiple bag-yield values;
- zero or invalid hole dimensions;
- rounding to whole bags.

## Persistence and print

- save/reload local project;
- reset project;
- print layout on Letter and A4;
- print without ads or interactive controls.

---

# 23. Recommended Launch Order

## Phase 1: Core engine

- project data model;
- unit conversion;
- calculation modules;
- test suite.

## Phase 2: Quick estimate

- fastest working path;
- core result cards;
- assumptions panel.

## Phase 3: Visual planner

- line drawing;
- connected segments;
- gates;
- post/panel visualization;
- warnings.

## Phase 4: Print and persistence

- printable project sheet;
- local saving;
- copy material list.

## Phase 5: Content and SEO

- home page;
- tool pages;
- methodology;
- trust pages;
- guide hub;
- launch guides;
- worked examples.

## Phase 6: AdSense preparation

- stable ad slots;
- mobile review;
- policy review;
- page-speed review;
- final content audit.

---

# 24. AI Build Instruction

Use this brief as the product source of truth.

Before coding:

1. inspect the existing repository and stack;
2. identify reusable components and conventions;
3. create a concise implementation plan;
4. preserve existing working functionality;
5. implement the calculation engine before visual polish;
6. write tests for formulas and edge cases;
7. avoid inventing paid features or user accounts;
8. do not add external APIs unless necessary;
9. keep the core tool free and usable without registration;
10. document assumptions and unresolved questions in the project README.

When ambiguity exists, prioritize:

1. calculation transparency;
2. ease of use;
3. reliable print output;
4. mobile usability;
5. low maintenance;
6. AdSense-safe design.

---

# 25. Definition of Success

The project is successful when a homeowner can arrive from search, draw or enter a fence layout, understand the resulting post and material placement, print a useful shopping list, and leave feeling more confident about planning the project.

Commercially, success means:

- the tool earns organic search traffic;
- visitors use multiple related pages;
- guides support both SEO and user trust;
- users return during project planning;
- AdSense can be integrated without degrading the product;
- the site remains inexpensive and low-maintenance;
- all functionality remains free.
