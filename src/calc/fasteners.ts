import { totalFillLength } from "@/domain/geometry";
import { feetToInches } from "@/domain/units";
import type { FenceProject, MaterialLine } from "@/domain/types";
import type { WoodPrivacyResult } from "./woodPrivacy";

export type FastenerEstimate = {
  lines: MaterialLine[];
  /** Short summary for MaterialResult.fastenersNote */
  note: string;
};

/** Apply waste %, then round up to a retail-friendly pack size. */
export function packageCount(
  raw: number,
  wastePercent: number,
  packSize = 100,
): number {
  if (raw <= 0) return 0;
  const withWaste = Math.ceil(raw * (1 + Math.max(0, wastePercent) / 100));
  const pack = withWaste < 50 ? 50 : packSize;
  return Math.ceil(withWaste / pack) * pack;
}

function piecesFromFill(fillInches: number, stockFt = 8): number {
  if (fillInches <= 0) return 0;
  return Math.max(1, Math.ceil(fillInches / feetToInches(stockFt)));
}

/**
 * Approximate store-ready fastener list.
 * Wood: catalog-style board×rail×2 and rail-to-post face screws.
 * Panel: brackets + mounting screws. Chain link: small misc allowance
 * (ties/bands are already counted as hardware).
 */
export function calculateFasteners(
  project: FenceProject,
  wood?: WoodPrivacyResult,
  panelsToBuy = 0,
): FastenerEstimate {
  const s = project.settings;
  const waste = s.wastePercent;
  const lines: MaterialLine[] = [];
  const fill = totalFillLength(project);

  if (project.fenceType === "wood_privacy" && wood) {
    const boardPieces = wood.pickets + wood.battens;
    // Two fasteners per board at each rail (catalog §8.7)
    const boardScrewsRaw = boardPieces * s.railsPerSpan * 2;
    // Two 3" screws at each rail/post bearing (2 bearings per rail)
    const railScrewsRaw = wood.rails * 4;

    let trimScrewsRaw = 0;
    if (s.hasKickboard) {
      trimScrewsRaw += piecesFromFill(fill) * 6;
    }
    if (s.hasPictureFrame) {
      // Top + bottom rails of frame, ~4 screws per 8 ft piece
      trimScrewsRaw += piecesFromFill(fill) * 2 * 4;
    }
    if (s.hasCapRail) {
      trimScrewsRaw += piecesFromFill(fill) * 4;
    }
    if (s.hasTrim && (s.hasCapRail || s.hasPictureFrame)) {
      trimScrewsRaw += piecesFromFill(fill) * 4;
    }
    if (s.latticeTop !== "none") {
      // Retainer strips / lattice to rails — rough allowance
      trimScrewsRaw += wood.spans * 8;
    }

    // Wire mesh: fencing staples into rails (approx)
    const staplesRaw =
      wood.wirePanels > 0 ? wood.wirePanels * s.railsPerSpan * 6 : 0;

    const boardQty = packageCount(boardScrewsRaw, waste);
    if (boardQty > 0) {
      lines.push({
        id: "screws_boards",
        category: "fasteners",
        label: "Board / picket screws",
        spec: "2 in exterior deck screws · HDG or stainless",
        quantity: boardQty,
        unit: "ea",
        note: `About 2 per board at each rail (~${boardScrewsRaw.toLocaleString()} before waste) · for treated lumber use coated/stainless`,
      });
    }

    const railQty = packageCount(railScrewsRaw, waste);
    if (railQty > 0) {
      lines.push({
        id: "screws_rails",
        category: "fasteners",
        label: "Rail-to-post screws",
        spec: "3 in exterior deck screws · HDG or stainless",
        quantity: railQty,
        unit: "ea",
        note: `About 2 screws at each rail end (~${railScrewsRaw.toLocaleString()} before waste)`,
      });
    }

    const trimQty = packageCount(trimScrewsRaw, waste, 50);
    if (trimQty > 0) {
      lines.push({
        id: "screws_trim",
        category: "fasteners",
        label: "Trim / cap / lattice screws",
        spec: "2-1/2 in exterior deck screws · HDG or stainless",
        quantity: trimQty,
        unit: "ea",
        note: "Kickboard, cap, picture-frame, and lattice retainers — approximate",
      });
    }

    const stapleQty = packageCount(staplesRaw, waste, 50);
    if (stapleQty > 0) {
      lines.push({
        id: "staples_wire",
        category: "fasteners",
        label: "Fence staples (for wire)",
        spec: '1 to 1-1/2 in fencing staples · galvanized',
        quantity: stapleQty,
        unit: "ea",
        note: "Wire panel to rails — confirm gauge at the store",
      });
    }
  }

  if (project.fenceType === "panel" && panelsToBuy > 0) {
    const bracketsRaw = panelsToBuy * 4;
    const bracketScrewsRaw = bracketsRaw * 3;
    lines.push({
      id: "panel_brackets",
      category: "fasteners",
      label: "Panel mounting brackets",
      spec: "Rail/panel brackets (system-matched)",
      quantity: bracketsRaw,
      unit: "ea",
      note: "About 4 per panel — match your panel manufacturer",
    });
    const screwQty = packageCount(bracketScrewsRaw, waste, 50);
    if (screwQty > 0) {
      lines.push({
        id: "screws_brackets",
        category: "fasteners",
        label: "Bracket mounting screws",
        spec: "2-1/2 to 3 in exterior screws · HDG or stainless",
        quantity: screwQty,
        unit: "ea",
        note: "Or use screws supplied with the bracket kit",
      });
    }
  }

  if (project.fenceType === "chain_link") {
    lines.push({
      id: "fasteners_misc",
      category: "fasteners",
      label: "Nuts, bolts & washers",
      spec: "Terminal-post hardware assortment",
      quantity: 1,
      unit: "kit",
      note: "Tension bands and ties are listed above — add a small bolt/nut assortment for terminals",
    });
  }

  if (project.gates.length > 0 && project.fenceType !== "chain_link") {
    // Hinges/latches are separate; add a small screw allowance for hangers
    const gateScrews = packageCount(project.gates.length * 24, waste, 50);
    if (gateScrews > 0) {
      lines.push({
        id: "screws_gates",
        category: "fasteners",
        label: "Gate hardware screws",
        spec: "2 to 3 in exterior screws · HDG or stainless",
        quantity: gateScrews,
        unit: "ea",
        note: "For hinges and latch plates — kits often include screws",
      });
    }
  }

  if (lines.length === 0) {
    return {
      lines: [
        {
          id: "fasteners",
          category: "fasteners",
          label: "Fasteners",
          quantity: 1,
          unit: "allowance",
          note: "Confirm fastener type and package size at purchase",
        },
      ],
      note: "Confirm fastener type and package size at purchase",
    };
  }

  const note = lines
    .map((l) =>
      l.unit === "kit" || l.unit === "allowance"
        ? l.label
        : `${l.quantity.toLocaleString()} ${l.spec?.split("·")[0]?.trim() ?? l.label}`,
    )
    .join("; ");

  return { lines, note };
}
