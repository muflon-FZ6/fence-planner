import { feetToInches } from "./units";
import type {
  ConstructionStyleId,
  FenceSettings,
  FenceType,
} from "./types";

export type ConstructionStyle = {
  id: ConstructionStyleId;
  title: string;
  blurb: string;
  fenceType: FenceType;
  settings: Partial<FenceSettings>;
};

/** North American starter looks — store-bought lumber / construction store. */
export const CONSTRUCTION_STYLES: ConstructionStyle[] = [
  {
    id: "board_to_board",
    title: "Side-by-side solid",
    blurb: "Most common backyard fence: vertical boards tight edge-to-edge.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "solid",
      boardTop: "dog_ear",
      picketGap: 0,
      hasCapRail: false,
      hasTrim: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "none",
      finish: "natural_cedar",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "board_on_board",
    title: "Board-on-board",
    blurb:
      "Base boards with cover boards over the gaps on the same face — stays private as wood shrinks.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "board_on_board",
      boardTop: "flat",
      picketGap: 1,
      hasCapRail: true,
      hasTrim: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "pyramid",
      finish: "natural_cedar",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "shadowbox",
    title: "Shadowbox (good neighbor)",
    blurb: "Boards alternate on opposite faces — privacy + airflow, finished both ways.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "shadowbox",
      boardTop: "dog_ear",
      picketGap: 2.5,
      hasCapRail: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "none",
      finish: "warm_brown",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "board_and_batten",
    title: "Board-and-batten",
    blurb: "Wide vertical boards with narrow battens covering the joints.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "board_and_batten",
      boardTop: "flat",
      picketGap: 0,
      picketWidth: 5.5,
      hasCapRail: true,
      hasTrim: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "pyramid",
      finish: "natural_cedar",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "stockade",
    title: "Stockade",
    blurb: "Solid vertical boards with pointed or dog-ear tops — classic stockade look.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "solid",
      boardTop: "pointed",
      picketGap: 0,
      hasCapRail: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "none",
      finish: "natural_cedar",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "horizontal_modern",
    title: "Horizontal modern",
    blurb: "Side-to-side boards, tight together — clean contemporary privacy.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "horizontal",
      boardPattern: "solid",
      boardTop: "flat",
      picketGap: 0,
      postSpacing: feetToInches(6),
      hasCapRail: true,
      hasTrim: true,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "flat",
      finish: "charcoal",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "horizontal_spaced",
    title: "Horizontal with gaps",
    blurb: "Horizontal slats with open spacing — airy modern boundary.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "horizontal",
      boardPattern: "spaced",
      boardTop: "flat",
      picketGap: 1.5,
      postSpacing: feetToInches(6),
      hasCapRail: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "flat",
      finish: "charcoal",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "lattice_top",
    title: "Privacy lattice top",
    blurb:
      "Solid lower fence with thicker privacy lattice up top — smaller see-through openings.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "solid",
      boardTop: "flat",
      picketGap: 0,
      hasCapRail: true,
      hasTrim: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "privacy",
      latticeHeight: 18,
      postCap: "pyramid",
      finish: "natural_cedar",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "cap_and_trim",
    title: "Cap & trim privacy",
    blurb: "Solid boards finished with a top cap and front trim for a polished edge.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "solid",
      boardTop: "flat",
      picketGap: 0,
      hasCapRail: true,
      hasTrim: true,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "pyramid",
      finish: "warm_brown",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "panel_privacy",
    title: "Preassembled panels",
    blurb: "Factory panels between posts — fast to install, classic privacy.",
    fenceType: "panel",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "solid",
      boardTop: "dog_ear",
      hasCapRail: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "pyramid",
      finish: "natural_cedar",
      fenceHeight: feetToInches(6),
    },
  },
  {
    id: "picket_spaced",
    title: "Spaced picket",
    blurb: "Vertical boards with gaps — friendly, open yard definition.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "spaced",
      boardTop: "dog_ear",
      picketGap: 2,
      hasCapRail: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "none",
      finish: "natural_cedar",
      fenceHeight: feetToInches(4),
    },
  },
  {
    id: "wood_wire",
    title: "Wood & welded wire",
    blurb:
      "Wood posts and rails with welded-wire mesh — garden and pet-friendly, open look.",
    fenceType: "wood_privacy",
    settings: {
      boardOrientation: "vertical",
      boardPattern: "wire_mesh",
      boardTop: "flat",
      picketGap: 0,
      railsPerSpan: 2,
      hasCapRail: false,
      hasTrim: false,
      hasPictureFrame: false,
      hasKickboard: true,
      latticeTop: "none",
      postCap: "flat",
      finish: "natural_cedar",
      fenceHeight: feetToInches(4),
      postSpacing: feetToInches(8),
    },
  },
  {
    id: "chain_link",
    title: "Chain link",
    blurb: "Wire mesh, posts, and top rail — open property boundary.",
    fenceType: "chain_link",
    settings: {
      boardPattern: "spaced",
      boardTop: "flat",
      hasCapRail: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      postCap: "none",
      finish: "galvanized",
      fenceHeight: feetToInches(4),
    },
  },
];

export function matchConstructionStyle(
  fenceType: FenceType,
  settings: FenceSettings,
): ConstructionStyleId {
  if (fenceType === "chain_link") return "chain_link";
  if (fenceType === "panel") return "panel_privacy";
  if (settings.boardPattern === "wire_mesh") return "wood_wire";
  if (settings.boardPattern === "board_and_batten") return "board_and_batten";
  if (settings.latticeTop !== "none") return "lattice_top";
  if (settings.hasCapRail && settings.hasTrim) return "cap_and_trim";
  if (settings.boardPattern === "board_on_board") return "board_on_board";
  if (settings.boardPattern === "shadowbox") return "shadowbox";
  if (settings.boardOrientation === "horizontal") {
    return settings.boardPattern === "spaced" || settings.picketGap > 0.5
      ? "horizontal_spaced"
      : "horizontal_modern";
  }
  if (settings.boardTop === "pointed") return "stockade";
  if (settings.boardPattern === "spaced" || settings.picketGap > 0.5)
    return "picket_spaced";
  return "board_to_board";
}
