import type { FenceSettings, FenceType } from "./types";

/** Style fields layered onto material defaults. */
export function defaultStyleFields(
  fenceType: FenceType = "panel",
): Pick<
  FenceSettings,
  | "boardOrientation"
  | "boardPattern"
  | "boardTop"
  | "hasCapRail"
  | "hasTrim"
  | "hasPictureFrame"
  | "hasKickboard"
  | "latticeTop"
  | "latticeHeight"
  | "postCap"
  | "finish"
  | "picketGap"
> {
  if (fenceType === "chain_link") {
    return {
      boardOrientation: "vertical",
      boardPattern: "spaced",
      boardTop: "flat",
      hasCapRail: false,
      hasTrim: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      latticeHeight: 18,
      postCap: "none",
      finish: "galvanized",
      picketGap: 0,
    };
  }
  if (fenceType === "panel") {
    return {
      boardOrientation: "vertical",
      boardPattern: "solid",
      boardTop: "dog_ear",
      hasCapRail: false,
      hasTrim: false,
      hasPictureFrame: false,
      hasKickboard: false,
      latticeTop: "none",
      latticeHeight: 18,
      postCap: "pyramid",
      finish: "natural_cedar",
      picketGap: 0,
    };
  }
  return {
    boardOrientation: "vertical",
    boardPattern: "solid",
    boardTop: "dog_ear",
    hasCapRail: false,
    hasTrim: false,
    hasPictureFrame: false,
    hasKickboard: false,
    latticeTop: "none",
    latticeHeight: 18,
    postCap: "none",
    finish: "natural_cedar",
    picketGap: 0,
  };
}

export function styleSummary(settings: FenceSettings, fenceType: FenceType): string {
  if (fenceType === "chain_link") return "Chain-link mesh on posts and top rail";
  const parts: string[] = [];
  if (fenceType === "panel") parts.push("Preassembled panels");
  else if (settings.boardOrientation === "horizontal") parts.push("Horizontal boards");
  else parts.push("Vertical boards");

  switch (settings.boardPattern) {
    case "board_on_board":
      parts.push("board-on-board (same-face overlap)");
      break;
    case "board_and_batten":
      parts.push("board-and-batten");
      break;
    case "wire_mesh":
      parts.push("wood frame with welded wire");
      break;
    case "shadowbox":
      parts.push("shadowbox (good neighbor)");
      break;
    case "spaced":
      parts.push("with gaps");
      break;
    default:
      parts.push("solid privacy");
  }

  const w = settings.picketWidth;
  const g = settings.picketGap;
  if (w > 0) {
    const widthLabel = Number.isInteger(w) ? `${w}"` : `${w.toFixed(1)}"`;
    parts.push(`${widthLabel} boards`);
  }
  if (g > 0.05) {
    const gapLabel = Number.isInteger(g) ? `${g}"` : `${g.toFixed(1)}"`;
    parts.push(`${gapLabel} gaps`);
  }

  const postFace = settings.postWidth;
  if (postFace > 0) {
    const postLabel = Number.isInteger(postFace)
      ? `${postFace}"`
      : `${postFace.toFixed(0)}"`;
    parts.push(`${postLabel} posts`);
  }
  const spacingFt = settings.postSpacing / 12;
  if (spacingFt > 0) {
    const spacingLabel = Number.isInteger(spacingFt)
      ? `${spacingFt}`
      : spacingFt.toFixed(1);
    parts.push(`${spacingLabel} ft on center`);
  }

  if (settings.boardTop === "dog_ear") parts.push("dog-ear tops");
  if (settings.boardTop === "pointed") parts.push("pointed tops");
  if (settings.hasPictureFrame) parts.push("picture-frame trim");
  else if (settings.hasCapRail)
    parts.push(settings.hasTrim ? "cap & trim" : "cap rail");
  if (settings.hasKickboard) parts.push("kickboard");
  if (settings.latticeTop === "open")
    parts.push(`open lattice top (${Math.round(settings.latticeHeight)}")`);
  if (settings.latticeTop === "dense")
    parts.push(`dense lattice top (${Math.round(settings.latticeHeight)}")`);
  if (settings.latticeTop === "privacy")
    parts.push(`privacy lattice top (${Math.round(settings.latticeHeight)}")`);
  if (settings.postCap === "solar") parts.push("solar post caps");
  else if (settings.postCap === "pyramid") parts.push("pyramid post caps");
  else if (settings.postCap === "flat") parts.push("flat post caps");

  return parts.join(" · ");
}
