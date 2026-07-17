# Fence Planner & Material Calculator
## Interactive UI / Experience Design Brief

**Document purpose:** Define the visual, interaction and emotional design direction for the Fence Planner & Material Calculator.  
**Companion document:** `fence_planner_material_calculator_project_brief.md`  
**Product model:** Always free, no account required, supported by AdSense  
**Primary design objective:** Help users *see and believe in the finished project* before they calculate or purchase materials.

---

# 1. Design Challenge

Most fence calculators behave like spreadsheets:

- enter total length;
- choose a panel width;
- press Calculate;
- receive a number.

That solves arithmetic, but it does not solve the larger emotional and practical problem.

A homeowner is not really buying 18 panels and 22 posts. They are imagining:

- a private backyard;
- a safe place for children or pets;
- a finished outdoor room;
- a clean property boundary;
- a more attractive home;
- a gate that works where they need it;
- confidence that the project will look intentional.

The interface must therefore support two needs at the same time:

1. **Planning confidence** — measurements, layout, posts, gates and materials are understandable.
2. **Project imagination** — the user can envision the finished fence in a recognizable outdoor space.

The product should feel less like a calculator with a diagram and more like a lightweight, approachable outdoor-design studio.

---

# 2. Core Experience Idea

## Plan it accurately. See it finished.

The product should be built around two synchronized views:

### Plan View

A top-down, measurement-focused workspace for drawing fence runs, placing gates and editing dimensions.

### Dream View

A live pseudo-3D representation of the same project showing the fence around a yard, beside a house or along a property line.

The two views must always remain connected.

When the user changes a measurement in Plan View, Dream View updates immediately. When the user changes a style, height or colour in Dream View, the quantities and layout update in Plan View.

This synchronized relationship is the primary differentiator.

---

# 3. Experience Promise

The user should be able to say:

> “I can see what my yard could look like, I understand how the fence fits, and I know what materials I need.”

The experience should produce four feelings:

- **Possibility:** “This could transform my yard.”
- **Control:** “I can change it and make it fit.”
- **Clarity:** “I understand why these materials are required.”
- **Readiness:** “I can take this plan to a store or begin the project.”

---

# 4. Design Principles

## 4.1 Show the outcome early

Do not make the user complete a long form before seeing anything.

As soon as the user selects a basic yard shape and fence type, create a visual scene. Use sensible defaults and let the user refine them.

The first meaningful visual result should appear within the first 20–30 seconds of use.

## 4.2 Every field should have a visual consequence

Avoid isolated form controls.

Examples:

- changing fence height raises or lowers the fence in Dream View;
- changing panel width changes post spacing in Plan View;
- adding a gate creates a visible opening and swing direction;
- changing colour updates the scene immediately;
- changing the yard dimensions alters scale and proportions;
- changing from vertical privacy boards to horizontal boards transforms the full scene.

## 4.3 Progressive fidelity

Begin simple and become more detailed as the user continues.

1. rough yard shape;
2. fence line;
3. fence style;
4. gates and corners;
5. colours and finishes;
6. detailed material plan;
7. print-ready result.

Do not ask for every technical assumption upfront.

## 4.4 Visualize uncertainty honestly

Dream View is an illustrative planning aid, not an architectural rendering.

The design must clearly distinguish:

- exact project measurements;
- estimated visual context;
- user-selected style options;
- assumptions about terrain and surroundings.

Do not imply photorealistic accuracy when the tool does not have property survey or elevation data.

## 4.5 Delight without slowing the user down

Use motion and polish to make the tool engaging, but never make animation mandatory or lengthy.

Animations should clarify change, not decorate the screen.

## 4.6 Make the project feel owned

Use the user's project name, dimensions, choices and visual scene throughout the experience.

The output should feel like *their yard plan*, not a generic calculation.

---

# 5. Recommended Product Experience

## Stage 1: “What are you creating?”

Begin with visual project cards rather than a form.

Suggested project intents:

- More backyard privacy
- Keep pets or children safe
- Replace an existing fence
- Define a property boundary
- Add a gate or enclosed area
- Plan a pool or garden enclosure
- Create a modern outdoor space
- Just calculate materials

These choices do not need to change the engineering logic dramatically. Their purpose is to establish context, select useful defaults and make the experience feel personal.

Example:

- “More privacy” defaults to a 6-foot privacy fence.
- “Pet-safe yard” highlights gaps and gate security.
- “Modern outdoor space” opens style options such as horizontal boards.
- “Just calculate materials” enters a faster utility mode.

## Stage 2: Choose or sketch the space

Offer three approachable starting methods:

### A. Simple yard shape

Visual presets:

- straight run;
- L-shaped;
- U-shaped backyard;
- rectangular enclosure;
- side-yard enclosure;
- custom shape.

### B. Enter measurements

For users with measurements already available.

### C. Sketch it

Let the user draw connected fence runs directly on the canvas, then type exact dimensions.

Future enhancement:

### D. Trace over a property image

Allow users to upload an aerial screenshot, survey image or yard photo and trace fence lines over it. The image remains local in the browser where possible.

This is not required for the first release, but the architecture should not prevent it.

## Stage 3: Build the fence line

Plan View becomes the primary interaction surface.

Users can:

- add and drag fence runs;
- snap to common angles;
- enter exact lengths;
- join runs;
- create corners;
- attach endpoints to a simplified house footprint;
- place gates;
- choose gate swing direction;
- identify existing fence sections;
- mark sections that will remain open;
- undo and redo.

Dream View should update continuously beside or behind the plan.

## Stage 4: Choose the look

Use highly visual style cards rather than technical dropdowns.

Each style card should show a small rendered fence sample and plain-language description.

Examples:

- Classic vertical privacy
- Modern horizontal boards
- Friendly picket
- Clean vinyl privacy
- Open chain link
- Decorative metal
- Split rail

MVP may support only the systems defined in the product brief, but unsupported styles can remain hidden until calculation logic exists.

After selecting a style, allow users to adjust:

- fence height;
- board or panel orientation;
- colour or finish;
- post cap style;
- gap openness;
- top profile;
- gate style.

These controls should update the preview immediately.

## Stage 5: Personalize the scene

The scene does not need to become a landscaping application. Provide a small number of context controls that improve imagination.

Suggested controls:

- house position: left, centre, right or none;
- house exterior tone: light, brick, dark, neutral;
- ground: grass, gravel, patio or mixed;
- yard size impression: narrow, average, wide;
- daylight: morning, midday, evening;
- viewpoint: yard, house, street or neighbour side;
- optional context objects: tree, shed, patio, pool outline, garden bed.

These items are visual context only and must not affect material calculations unless explicitly connected to the fence geometry.

## Stage 6: Review the project

Combine aspiration and practicality.

The review should show:

- a strong hero preview of the finished scene;
- top-down layout;
- total length;
- gates and openings;
- panel/post placement;
- material summary;
- warnings;
- assumptions;
- alternative options worth comparing.

The user should be able to switch between “Looks” and “Build” without losing context.

## Stage 7: Print and take action

Free outputs:

- visual project summary;
- measured plan view;
- materials list;
- gate schedule;
- warnings and assumptions;
- blank pricing columns;
- notes section.

The printable result should include one aspirational image at the top, followed by practical drawings and quantities.

---

# 6. Key Interface Concept: Plan / Dream / Build

Use three primary modes within one workspace.

## 6.1 Plan

Purpose: define geometry.

Contains:

- top-down canvas;
- dimension labels;
- gates;
- posts;
- corners;
- snapping guides;
- editing controls.

## 6.2 Dream

Purpose: see the finished result.

Contains:

- pseudo-3D yard scene;
- camera controls;
- style and finish controls;
- daylight controls;
- before/after comparison;
- visibility/privacy visualization.

## 6.3 Build

Purpose: understand materials and execution.

Contains:

- material totals;
- segment-by-segment quantities;
- post classifications;
- concrete estimate;
- gate hardware;
- warnings;
- print and copy actions.

On desktop, these can be tabs or coordinated panels. On mobile, they become clear sequential stages.

---

# 7. Pseudo-3D Visualization Strategy

## 7.1 Recommended visual approach

Use a lightweight 2.5D or simplified 3D scene rather than pursuing photorealism.

The scene should resemble a polished home-improvement configurator:

- recognizable house massing;
- grass or ground plane;
- fence posts and panels with depth;
- sunlight and soft shadows;
- simple sky or environmental backdrop;
- camera perspective;
- clean, slightly stylized materials.

This is enough to help users understand height, enclosure, gate placement and aesthetic direction.

## 7.2 Rendering implementation options

### Preferred scalable approach: Three.js / React Three Fiber

Best when the development team can support a lightweight WebGL experience.

Advantages:

- real camera movement;
- reusable fence segment geometry;
- realistic gate opening;
- lighting and shadows;
- smooth style changes;
- future ability to import terrain or images.

Requirements:

- lazy-load the 3D module;
- use low-poly assets;
- avoid large textures;
- provide a non-WebGL fallback;
- cap device pixel ratio on low-powered devices;
- reduce motion when requested.

### Simpler MVP approach: SVG / Canvas isometric view

Generate each fence run as a 2.5D isometric strip with extruded posts and panels.

Advantages:

- faster to build;
- easier print export;
- strong browser support;
- lower device requirements;
- deterministic visual output.

The product can begin with an isometric renderer and move to full 3D later.

## 7.3 Geometry rules

The visual renderer must use the same project geometry as the calculator.

Do not create a disconnected decorative preview.

Fence runs, gate widths, post spacing and fence height must come from shared project data.

## 7.4 Camera presets

Include simple camera buttons:

- From the house
- From the yard
- From the street
- From the neighbour side
- Top-down
- Walk the fence

“Walk the fence” may animate the camera slowly along the perimeter or move through selectable viewpoints. It should stop immediately when the user interacts.

## 7.5 Gate interaction

The user should be able to click or tap a gate to open and close it.

This helps users understand:

- swing direction;
- obstruction conflicts;
- passage width;
- whether a double gate is appropriate.

Gate motion should be brief and functional.

---

# 8. Visualization Features That Sell the Dream

## 8.1 Before / after slider

Show the same yard with and without the proposed fence.

This is particularly effective in Dream View and in the final print/share image.

The “before” state can be a simple open yard rather than an actual photo.

## 8.2 Style comparison

Allow users to compare two fence options side by side.

Examples:

- 6-foot vertical privacy vs 6-foot horizontal privacy;
- wood vs vinyl appearance;
- natural wood vs dark stain;
- 4-foot vs 6-foot height;
- single gate vs double gate.

The comparison should show both visual impact and material differences.

## 8.3 Privacy view

Add an optional visualization that illustrates approximate sight blocking.

Possible treatments:

- translucent eye-level plane;
- simplified human silhouettes;
- visibility gradient through fence gaps;
- “more open / more private” indicator.

This is not a legal or security guarantee. It is a visual comparison tool.

## 8.4 Height context

Place a simple adult silhouette, child silhouette, dog silhouette, patio chair or standard door near the fence for scale.

Users should be able to toggle context objects off.

## 8.5 Daylight and mood

Offer three lightweight presets:

- Bright day
- Warm evening
- Neutral overcast

The evening setting can make the finished yard feel aspirational, but the default should remain bright and easy to evaluate.

## 8.6 Material finish swatches

Use larger, tactile swatches with realistic but lightweight material treatments:

- natural cedar;
- warm brown stain;
- charcoal stain;
- white vinyl;
- tan vinyl;
- galvanized metal;
- black chain link.

Avoid tiny colour dots with no context.

## 8.7 Project story strip

As the user works, show a small visual progression:

1. Open yard
2. Fence line placed
3. Style selected
4. Gates added
5. Build plan ready

This gives a sense of momentum and completion.

## 8.8 Celebrate completion

When the project is ready, transition to a polished “Your fence plan is ready” state with:

- the best preview image;
- total fence length;
- chosen style;
- number of gates;
- material summary;
- print plan button.

Do not use confetti or game-like rewards. The tone should be satisfying and capable.

---

# 9. Desktop UI Layout

## 9.1 Immersive workspace

Recommended desktop structure:

### Top bar

- project name;
- units;
- undo/redo;
- save status;
- help;
- print.

### Left rail

Step-based design controls:

1. Space
2. Layout
3. Fence style
4. Gates
5. Finish
6. Review

The rail can collapse to icons.

### Main canvas

The largest region of the page.

Provide a prominent segmented control:

- Plan
- Dream
- Split

**Split** shows Plan View and Dream View together.

### Right inspector

Contextual panel based on the selected object:

- selected fence run;
- gate;
- fence style;
- material setting;
- warning.

At the bottom, show a compact live summary:

- total length;
- estimated posts;
- estimated panels;
- gates;
- warnings.

## 9.2 Focus mode

Allow the user to expand Dream View or Plan View to full-screen within the page.

The editor controls remain accessible as floating, collapsible panels.

---

# 10. Mobile UI Layout

Do not shrink the desktop interface into a narrow screen.

Use an intentional mobile workflow.

## Mobile stages

1. Choose project intent
2. Select yard shape
3. Enter measurements
4. Place gates
5. Choose fence style
6. View finished yard
7. Review materials
8. Print or save

## Mobile canvas behaviour

- pinch to zoom;
- two-finger pan where required;
- large draggable endpoints;
- tap segment to edit exact length;
- bottom-sheet inspectors;
- clear Done action after each edit;
- easy return to Dream View.

On small screens, Dream View should be a prominent full-width scene, not a tiny thumbnail above form fields.

---

# 11. Interaction Details

## 11.1 Drawing fence runs

- Click or tap to place the first point.
- Move pointer to preview the run.
- Click or tap again to place endpoint.
- Continue drawing connected runs.
- Snap to 0°, 45° and 90° by default.
- Show live length while drawing.
- Allow exact numeric entry immediately after placement.

## 11.2 Selecting and editing

When a segment is selected:

- emphasize the segment in both Plan and Dream views;
- show length and configuration;
- expose Add Gate, Split Segment and Delete actions;
- show the material contribution of that segment.

## 11.3 Linking visuals to materials

Hovering or selecting a result item should highlight the relevant geometry.

Examples:

- selecting “corner posts” highlights corner posts;
- selecting “cut panel” highlights the affected final section;
- selecting “gate posts” highlights both gate posts;
- selecting a concrete quantity highlights all concreted posts.

Likewise, selecting a fence segment should filter the material panel to show that segment's contribution.

## 11.4 Warning interactions

Warnings must be visual and actionable.

Example:

> Final section is only 22 inches wide.

Actions:

- distribute the difference across the run;
- move the nearest gate;
- allow a cut panel;
- change panel width;
- dismiss with explanation.

Where possible, preview the correction before applying it.

## 11.5 Undo and recovery

The user must feel safe experimenting.

Include:

- undo and redo;
- automatic local save;
- restore last session;
- reset with confirmation;
- duplicate before trying an alternative.

---

# 12. Visual Design Direction

## 12.1 Brand personality

The design should feel:

- optimistic;
- capable;
- outdoors-oriented;
- approachable;
- visually polished;
- neutral rather than retailer-specific;
- trustworthy without feeling corporate.

## 12.2 Overall aesthetic

Think:

- modern home-improvement editorial;
- calm outdoor-design software;
- warm residential architecture imagery;
- precise diagrams paired with aspirational scenes.

Avoid:

- industrial CAD styling;
- dark contractor dashboards;
- cartoonish game visuals;
- excessive gradients;
- generic SaaS purple;
- hardware-store promotional design.

## 12.3 Colour system

Suggested direction:

- deep evergreen or blue-green for primary actions;
- warm natural wood and sand tones;
- soft sky and grass neutrals in scenes;
- amber for attention and gate markers;
- red reserved for serious errors;
- cool blue or teal for measured geometry.

The tool must remain usable in grayscale and for colour-vision differences.

## 12.4 Typography

Use a highly readable sans-serif with:

- clear numeric forms;
- strong distinction between feet/inches or metric units;
- compact labels in the planner;
- expressive but restrained headings.

Dimensions and quantities should use tabular numerals where available.

## 12.5 Iconography

Use simple line or filled icons for:

- run;
- corner;
- post;
- gate;
- house connection;
- material;
- warning;
- view/camera;
- print.

Icons must support labels rather than replace them.

---

# 13. Recommended Key Screens

## Screen 1: Landing / immediate start

Hero should show an interactive fence scene—not a stock photograph.

Suggested headline:

> See your fence before you build it.

Supporting line:

> Draw the layout, explore styles, place gates and get the complete material plan—free.

Primary action:

> Start My Fence Plan

Secondary action:

> Calculate Materials Only

Below the hero, show a three-step visual explanation:

1. Draw your space
2. See the finished fence
3. Print the build plan

## Screen 2: Yard shape selection

Large visual cards with miniature plan and perspective views.

## Screen 3: Split workspace

Top-down plan on the left or upper region; pseudo-3D dream scene on the right or lower region.

## Screen 4: Style studio

Large scene plus visual material/style cards.

## Screen 5: Gate editor

Selected gate with width, type and swing direction; animated opening preview.

## Screen 6: Compare options

Side-by-side scenes and material deltas.

## Screen 7: Build summary

Visual scene, measured layout, material quantities and warnings.

## Screen 8: Print preview

Clean, professional and useful at a store or job site.

---

# 14. Visual Content for Guide Pages

The guide section should reinforce the same visual identity.

Every major guide should include original diagrams or interactive examples.

Examples:

- fence-post spacing visualizer;
- gate swing diagram;
- full panel vs cut panel example;
- corner-post and end-post comparison;
- privacy-height comparison;
- slope: stepped vs racked illustration;
- concrete-hole diagram;
- before/after fence-style comparison;
- fence layout examples for common yards.

Guide diagrams should link into preconfigured tool states where useful.

---

# 15. AdSense Integration Without Breaking the Dream

The immersive planner must remain the focus.

## Acceptable ad areas

- below the landing-page introduction;
- beside supporting guide content;
- below the completed result;
- between guide sections;
- desktop rail outside the editor;
- footer.

## Prohibited or discouraged areas

- inside the Plan or Dream canvas;
- between style swatches;
- beside drawing or gate controls;
- overlaying the scene;
- inside print output;
- positions that look like material recommendations;
- placements that cause layout shifts while editing.

Reserve ad space before loading ads to maintain visual stability.

The tool's dream-building experience is commercially important because it increases engagement, return visits and trust. Ads must never make it feel like a low-quality calculator page.

---

# 16. Performance and Fallback Requirements

The visual experience must not make the site slow or inaccessible.

## Requirements

- lazy-load Dream View after the core planner is usable;
- show a polished skeleton or isometric placeholder while loading;
- use low-poly geometry;
- reuse instanced posts and panels where possible;
- avoid high-resolution environmental textures;
- compress all assets;
- preserve state if the 3D renderer fails;
- provide Plan View and static perspective fallback;
- allow users to disable shadows or motion;
- respect `prefers-reduced-motion`;
- target smooth interaction on mainstream phones and laptops.

If full 3D cannot meet performance targets, choose the isometric SVG/Canvas approach rather than delivering a sluggish experience.

---

# 17. Accessibility Requirements

The aspirational experience must remain inclusive.

- Every visual edit must also be possible through labelled numeric controls.
- The project cannot depend only on drag-and-drop.
- Plan geometry must have a structured list representation.
- Dream View needs a textual project description.
- Warnings must be announced to assistive technologies.
- View changes must not trap focus.
- Camera motion must be optional.
- Colour swatches require names.
- Measurements and units must be explicit.
- Keyboard users must be able to select, move, resize and delete runs and gates.

Example generated description:

> U-shaped backyard fence, 142 feet total, six feet high, one four-foot gate on the right-side run, natural wood vertical privacy style.

---

# 18. MVP Design Scope

The first release should deliver a convincing visual experience without becoming a full landscape-design system.

## Required for MVP

- Plan View with accurate connected runs;
- synchronized pseudo-3D or isometric Dream View;
- house and ground context presets;
- supported fence styles from the product brief;
- fence height and finish controls;
- gate placement and opening preview;
- camera presets;
- full/partial panel visualization;
- material quantities linked to the drawing;
- final visual project summary;
- responsive desktop/tablet/mobile behaviour;
- print layout with one perspective image;
- non-3D fallback.

## Optional for MVP if technically feasible

- before/after slider;
- style comparison;
- daylight presets;
- human/pet scale silhouettes;
- “walk the fence” camera.

## Future enhancements

- trace over property image;
- import aerial or survey image;
- basic slope/elevation input;
- photo-based yard background;
- richer landscape context;
- AR preview;
- advanced shadow/privacy simulation;
- shareable project links;
- saved local project gallery.

---

# 19. Design Acceptance Criteria

The experience is successful when:

1. A new user sees a recognizable yard and fence concept within 30 seconds.
2. Plan View and Dream View use the same geometry and remain synchronized.
3. Changing fence height, style, finish or gate placement updates the visual scene immediately.
4. The user can understand scale through context objects or viewpoints.
5. The user can see where full and partial fence sections occur.
6. Gates can be opened visually to understand swing direction and access.
7. The user can compare at least two design options without rebuilding the project.
8. Material totals can highlight the related parts of the drawing.
9. Warnings are visible in the layout and offer corrective actions.
10. The product remains useful if the 3D renderer is unavailable.
11. Mobile users receive a deliberate staged experience, not a compressed desktop editor.
12. The final output includes both an aspirational view and an accurate plan.
13. Ads never interrupt drawing, styling or visualization.
14. The visual experience remains performant on mainstream devices.
15. All core functionality remains free and available without registration.

---

# 20. AI Design and Build Instructions

Use this design brief together with the primary project brief.

Before implementation:

1. inspect the existing project stack and component system;
2. confirm whether SVG/Canvas isometric rendering or WebGL is the most responsible MVP approach;
3. prototype the synchronized Plan/Dream geometry before building decorative UI;
4. define the design tokens and scene style;
5. create low-fidelity interaction wireframes for desktop and mobile;
6. validate drawing, gate placement and camera controls;
7. build a small visual prototype with one fence run, one corner and one gate;
8. test performance on mobile before expanding scene detail.

During implementation:

- treat project geometry as the single source of truth;
- do not maintain separate visual and calculation layouts;
- prioritize instant feedback;
- keep controls contextual;
- avoid forcing users through unnecessary steps;
- keep advanced technical settings available but secondary;
- use sensible visual defaults;
- make experimentation reversible;
- document all rendering assumptions;
- do not add paid features or sign-up requirements.

When choosing between visual spectacle and useful clarity, choose useful clarity.

When choosing between photorealism and speed, choose a stylized, responsive visualization.

When choosing between more controls and easier understanding, reveal controls progressively.

---

# 21. Final Creative Direction

The defining experience should be:

> A homeowner sketches a few lines, chooses a fence style, and immediately sees their open yard become a finished, private outdoor space. They move a gate, change the height, compare two looks and watch the plan update. Only then do they review the posts, panels and concrete required to make it real.

The calculator answers **how much**.

The planner answers **where it goes**.

The visual experience answers **why the project is worth doing**.
