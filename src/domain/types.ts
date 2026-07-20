export type UnitSystem = "imperial" | "metric";

export type FenceType = "panel" | "wood_privacy" | "chain_link";

export type Point = {
  x: number;
  y: number;
};

export type FenceRun = {
  id: string;
  start: Point;
  end: Point;
  /** Length in project base units (inches or mm, stored as inches internally). */
  length: number;
  gateIds: string[];
  notes?: string;
};

export type GateType = "single" | "double";

export type Gate = {
  id: string;
  runId: string;
  /** Offset from run start along the run, same units as length. */
  offsetFromRunStart: number;
  width: number;
  gateType: GateType;
  /** Degrees; 0 = opens toward positive perpendicular. */
  swingDirection: "in" | "out";
  swingOpen?: boolean;
};

export type JointType =
  | "corner"
  | "straight"
  | "end"
  | "structure_connection";

export type Joint = {
  id: string;
  point: Point;
  connectedRunIds: string[];
  type: JointType;
};

export type PostType =
  | "line"
  | "corner"
  | "end"
  | "gate"
  | "terminal"
  | "structure";

export type ModuleWidthMode = "panel_only" | "includes_post";

export type FenceSettings = {
  /** Panel width as entered. Pitch depends on moduleWidthMode. */
  panelWidth: number;
  moduleWidthMode: ModuleWidthMode;
  /** On-center spacing for wood / chain-link line posts. */
  postSpacing: number;
  postWidth: number;
  /** Square post face for volume subtraction; same as postWidth for square posts. */
  postCrossSection: number;
  fenceHeight: number;
  railsPerSpan: number;
  picketWidth: number;
  picketGap: number;
  holeDiameter: number;
  holeDepth: number;
  /** Cubic inches (or mm³) of concrete per bag, stored in cubic inches. */
  concreteBagYield: number;
  wastePercent: number;
  applyWasteToPanels: boolean;
  applyWasteToPickets: boolean;
  applyWasteToRails: boolean;
  applyWasteToConcrete: boolean;
  /** Chain-link */
  fabricRollLength: number;
  topRailSectionLength: number;
  tensionWire: boolean;
  tiesPerFoot: number;
  finish: FenceFinish;
  /** Placeholder for future wood-texture chips (same id space as finish for now). */
  finishTexture?: string;
  boardOrientation: "vertical" | "horizontal";
  /**
   * How boards join in the bay (NA wood-fence patterns, store-bought lumber).
   * solid = side-by-side privacy (one face)
   * spaced = deliberate gaps
   * shadowbox = alternating faces (good neighbor)
   * board_on_board = base + cover boards on the same face
   * board_and_batten = wide base boards + narrow joint battens
   * wire_mesh = wood post-and-rail frame with welded-wire infill
   */
  boardPattern:
    | "solid"
    | "spaced"
    | "shadowbox"
    | "board_on_board"
    | "board_and_batten"
    | "wire_mesh";
  /** Top profile of each board/picket. */
  boardTop: "flat" | "dog_ear" | "pointed";
  /** Horizontal cap board across the top of the bay. */
  hasCapRail: boolean;
  /** Vertical trim under the cap (cap-and-trim look). */
  hasTrim: boolean;
  /** Full perimeter trim around each bay (picture-frame look). */
  hasPictureFrame: boolean;
  /** Replaceable ground-contact board at the bottom of the bay. */
  hasKickboard: boolean;
  /** Decorative lattice section on top of the solid fence. */
  latticeTop: "none" | "open" | "dense" | "privacy";
  /** Lattice topper height in inches (commonly 12–24). */
  latticeHeight: number;
  /**
   * @deprecated Prefer latticeHeight. Kept for older saved projects during migrate.
   */
  latticeHeightRatio?: number;
  /** Decorative / functional post top. */
  postCap: "none" | "flat" | "pyramid" | "solar";
};

/** Named starter looks for the style builder. */
export type ConstructionStyleId =
  | "panel_privacy"
  | "board_to_board"
  | "board_on_board"
  | "shadowbox"
  | "stockade"
  | "board_and_batten"
  | "horizontal_modern"
  | "horizontal_spaced"
  | "lattice_top"
  | "cap_and_trim"
  | "picket_spaced"
  | "wood_wire"
  | "chain_link";

export type FenceFinish =
  | "natural_cedar"
  | "warm_brown"
  | "charcoal"
  | "white_vinyl"
  | "tan_vinyl"
  | "galvanized"
  | "black_chain_link";

export type SceneContext = {
  housePosition: "left" | "center" | "right" | "none";
  houseTone: "light" | "brick" | "dark" | "neutral";
  ground: "grass" | "gravel" | "patio" | "mixed";
  yardSize: "narrow" | "average" | "wide";
  daylight: "morning" | "midday" | "evening";
  viewpoint: "yard" | "house" | "street" | "neighbor" | "top";
  showSilhouette: boolean;
};

export type ProjectIntent =
  | "privacy"
  | "pets"
  | "replace"
  | "boundary"
  | "gate_area"
  | "pool_garden"
  | "modern"
  | "calculate";

/** Materials cost estimate geography (Phase B). */
export type PricingCountry = "US" | "CA";

export type ProjectPriceOverride = {
  unitPrice: number;
  updatedAt: string;
  note?: string;
};

export type FenceProject = {
  id: string;
  name?: string;
  unitSystem: UnitSystem;
  fenceType: FenceType;
  intent?: ProjectIntent;
  /** Last starter look applied; "custom" once the user tweaks style options. */
  stylePresetId?: ConstructionStyleId | "custom";
  runs: FenceRun[];
  gates: Gate[];
  joints: Joint[];
  settings: FenceSettings;
  scene: SceneContext;
  /** US or Canada materials estimate; defaults from unit system when unset. */
  pricingCountry?: PricingCountry;
  /** Per shopping-list line unit-price overrides (local currency). */
  priceOverrides?: Record<string, ProjectPriceOverride>;
  createdAt: string;
  updatedAt: string;
};

export type MaterialLine = {
  id: string;
  category:
    | "posts"
    | "panels"
    | "pickets"
    | "rails"
    | "fabric"
    | "concrete"
    | "gates"
    | "hardware"
    | "fasteners"
    | "waste"
    | "optional";
  /** Human item name, e.g. "Fence boards". */
  label: string;
  /**
   * Store-ready size / SKU wording, e.g. "1x6 x 6 ft (about 5.5 in face)".
   * Shown prominently on the shopping list.
   */
  spec?: string;
  /**
   * Optional pricing catalog key (e.g. wood.post.pt.4x4.12.ground).
   * When set, materials estimates use this spec instead of the line id alone.
   */
  pricingSpecId?: string;
  quantity: number;
  unit: string;
  note?: string;
  /** Geometry highlight keys: run ids, post types, gate ids. */
  highlightKeys?: string[];
};

export type PostCount = {
  line: number;
  corner: number;
  end: number;
  gate: number;
  terminal: number;
  structure: number;
  total: number;
};

export type PanelCutStatus =
  | "valid"
  | "short"
  | "no_usable_clear_opening";

export type PanelCut = {
  /** Center-to-center pitch remainder after full modules (inches). */
  pitchRemainder: number;
  /**
   * Clear space between facing post faces for that final bay (inches).
   * For equal square posts: pitchRemainder − postWidth.
   * Not a guaranteed field-fit cut — product clearance still applies.
   */
  clearPanelSpace: number;
  /** Validity from calculated clear space (not centerline pitch). */
  status: PanelCutStatus;
  runId: string;
  /** Fill-segment start offset along the run (inches). */
  segmentStartOffset: number;
};

export type PanelBreakdown = {
  fullPanels: number;
  cutPanels: PanelCut[];
  totalPanelsToBuy: number;
};

export type MaterialResult = {
  posts: PostCount;
  panels?: PanelBreakdown;
  pickets?: number;
  rails?: number;
  fabricRolls?: number;
  fabricLength?: number;
  topRailSections?: number;
  concreteBags: number;
  hingeSets: number;
  latchSets: number;
  dropRods: number;
  fastenersNote: string;
  lines: MaterialLine[];
  assumptions: string[];
  totalFenceLength: number;
  fillLength: number;
};

export type WarningSeverity = "info" | "warning" | "error";

export type ProjectWarning = {
  id: string;
  severity: WarningSeverity;
  message: string;
  runId?: string;
  gateId?: string;
  actions?: WarningAction[];
};

export type WarningAction = {
  id: string;
  label: string;
  kind:
    | "accept_cut"
    | "change_panel_width"
    | "move_gate"
    | "dismiss"
    | "distribute";
};
