import { calculateChainLink } from "./chainLink";
import { calculateConcreteBags } from "./concrete";
import { calculateFasteners } from "./fasteners";
import { calculateGateHardware } from "./gates";
import {
  battenSpecLabel,
  boardFaceLabel,
  boardNominal,
  boardStockFeet,
  boardTopLabel,
  capRailSpecLabel,
  kickboardSpecLabel,
  latticeSpecLabel,
  panelSpecLabel,
  postNominal,
  postSpecLabel,
  postStockFeet,
  railSpecLabel,
  trimSpecLabel,
} from "./lumberSpec";
import { calculatePanels } from "./panel";
import {
  calculateWoodPrivacy,
  type WoodPrivacyResult,
} from "./woodPrivacy";
import {
  classifyPosts,
  moduleWidth,
  totalFillLength,
  totalRunLength,
} from "@/domain/geometry";
import {
  feetToInches,
  formatLength,
  formatSmallLength,
  inchesToFeet,
} from "@/domain/units";
import type {
  FenceProject,
  MaterialLine,
  MaterialResult,
  PostCount,
} from "@/domain/types";

function emptyPostCount(): PostCount {
  return {
    line: 0,
    corner: 0,
    end: 0,
    gate: 0,
    terminal: 0,
    structure: 0,
    total: 0,
  };
}

function tallyPosts(project: FenceProject): PostCount {
  const posts = classifyPosts(project);
  const count = emptyPostCount();
  for (const p of posts) {
    count[p.type] += 1;
    count.total += 1;
  }
  return count;
}

export function calculateMaterials(project: FenceProject): MaterialResult {
  const posts = tallyPosts(project);
  const gateHw = calculateGateHardware(project);
  const totalFenceLength = totalRunLength(project);
  const fillLength = totalFillLength(project);
  const concretedPosts = posts.total - posts.structure;
  const concrete = calculateConcreteBags(Math.max(0, concretedPosts), project.settings);

  const lines: MaterialLine[] = [];
  const assumptions: string[] = [];
  const units = project.unitSystem;

  assumptions.push(`Fence type: ${project.fenceType.replace("_", " ")}`);
  assumptions.push(`Fence height: ${formatLength(project.settings.fenceHeight, units)}`);
  assumptions.push(
    `Post hole: ${formatSmallLength(project.settings.holeDiameter, units)} diameter × ${formatSmallLength(project.settings.holeDepth, units)} deep`,
  );
  assumptions.push(`Waste allowance: ${project.settings.wastePercent}%`);

  const s = project.settings;
  const postFace = postNominal(s.postWidth);
  const postLenFt = postStockFeet(s);
  const postBuyQty = Math.max(0, posts.total - posts.structure);
  const roleBits = [
    posts.line ? `${posts.line} line` : null,
    posts.corner ? `${posts.corner} corner` : null,
    posts.end ? `${posts.end} end` : null,
    posts.gate ? `${posts.gate} gate` : null,
    posts.terminal ? `${posts.terminal} terminal` : null,
  ].filter(Boolean);

  // Posts — one buy line with full dimensional spec
  if (postBuyQty > 0) {
    lines.push({
      id: "posts_buy",
      category: "posts",
      label: `${postFace} fence posts`,
      spec: postSpecLabel(s),
      quantity: postBuyQty,
      unit: "ea",
      note: [
        roleBits.length ? `Roles: ${roleBits.join(", ")}` : null,
        `Hole ${formatSmallLength(s.holeDiameter, units)} dia × ${formatSmallLength(s.holeDepth, units)} deep`,
        "Buy ground-contact rated (UC4A / CSA UC4.1)",
      ]
        .filter(Boolean)
        .join(" · "),
      highlightKeys: ["post:all"],
    });
  }
  if (posts.structure) {
    lines.push({
      id: "posts_structure",
      category: "posts",
      label: "House / structure connections",
      spec: "Wall brackets or ledger (no full post)",
      quantity: posts.structure,
      unit: "ea",
      note: "May use brackets instead of full posts",
      highlightKeys: ["post:structure"],
    });
  }
  assumptions.push(
    `Posts: ${postFace} x ${postLenFt} ft (height + hole depth, rounded to stock)`,
  );

  let panels = undefined;
  let pickets = undefined;
  let rails = undefined;
  let fabricRolls = undefined;
  let fabricLength = undefined;
  let topRailSections = undefined;
  let wood: WoodPrivacyResult | undefined;

  if (project.fenceType === "panel") {
    panels = calculatePanels(project);
    const mod = moduleWidth(project);
    assumptions.push(
      `Panel module: ${formatLength(s.panelWidth, units)} (${s.moduleWidthMode === "includes_post" ? "includes post" : "panel only + post"}) → ${formatLength(mod, units)} on center`,
    );
    lines.push({
      id: "panels_buy",
      category: "panels",
      label: "Wood fence panels",
      spec: panelSpecLabel(s, units),
      quantity: panels.totalPanelsToBuy,
      unit: "ea",
      note:
        panels.cutPanels.length > 0
          ? `${panels.fullPanels} full + ${panels.cutPanels.length} cut-to-fit`
          : `${panels.fullPanels} full panels`,
      highlightKeys: ["panel:full"],
    });
    for (const cut of panels.cutPanels) {
      lines.push({
        id: `panels_cut_${cut.runId}_${Math.round(cut.length)}`,
        category: "panels",
        label: "Cut panel (from stock panel)",
        spec: `Trim to ${formatSmallLength(cut.length, units)} wide`,
        quantity: 1,
        unit: "ea",
        note: "Included in panels to purchase above",
        highlightKeys: [`run:${cut.runId}`, "panel:cut"],
      });
    }
  }

  if (project.fenceType === "wood_privacy") {
    wood = calculateWoodPrivacy(project);
    pickets = wood.pickets;
    rails = wood.rails;
    const boardLenFt = boardStockFeet(s);
    assumptions.push(
      `Post spacing: ${formatLength(s.postSpacing, units)} on center`,
    );
    assumptions.push(`Rails per span: ${s.railsPerSpan}`);
    if (s.boardPattern === "wire_mesh") {
      assumptions.push("Wood frame with welded-wire mesh infill");
    } else {
      assumptions.push(
        `Boards: ${boardNominal(s.picketWidth)} / ${formatSmallLength(s.picketWidth, units)} face, ${formatSmallLength(s.picketGap, units)} gaps (including to posts)`,
      );
    }

    if (wood.rails > 0) {
      lines.push({
        id: "rails",
        category: "rails",
        label: "Backer rails / stringers",
        spec: railSpecLabel(),
        quantity: wood.rails,
        unit: "ea",
        note: `${s.railsPerSpan} rails per bay · pressure-treated or cedar`,
        highlightKeys: ["rails"],
      });
    }

    if (wood.wirePanels > 0) {
      const bayW = formatLength(
        Math.max(0, s.postSpacing - s.postWidth),
        units,
      );
      const bayH = formatLength(s.fenceHeight, units);
      lines.push({
        id: "wire_panels",
        category: "panels",
        label: "Welded-wire / hog-wire panels",
        spec: `About ${bayH} H × ${bayW} W per bay`,
        quantity: wood.wirePanels,
        unit: "panels",
        note: "Confirm gauge and grid opening at the store",
        highlightKeys: ["pickets"],
      });
    } else if (wood.pickets > 0) {
      const patternNote =
        s.boardPattern === "board_on_board"
          ? "Board-on-board (base + cover courses)"
          : s.boardPattern === "shadowbox"
            ? "Shadowbox / good-neighbor"
            : s.boardPattern === "board_and_batten"
              ? "Board-and-batten base course"
              : s.boardPattern === "spaced"
                ? "Spaced pickets"
                : "Side-by-side solid";
      lines.push({
        id: "pickets",
        category: "pickets",
        label:
          s.boardPattern === "board_and_batten"
            ? "Base fence boards"
            : "Fence boards / pickets",
        spec: `${boardNominal(s.picketWidth)} x ${boardLenFt} ft · ${boardFaceLabel(s.picketWidth, units)}`,
        quantity: wood.pickets,
        unit: "ea",
        note: [
          patternNote,
          boardTopLabel(s.boardTop),
          wood.cutBoards > 0
            ? `${wood.cutBoards} ripped narrower to keep bay gaps even`
            : null,
        ]
          .filter(Boolean)
          .join(" · "),
        highlightKeys: ["pickets"],
      });
    }
    if (wood.battens > 0) {
      lines.push({
        id: "battens",
        category: "pickets",
        label: "Battens",
        spec: battenSpecLabel(boardLenFt),
        quantity: wood.battens,
        unit: "ea",
        note: "Narrow strips covering board joints",
        highlightKeys: ["pickets"],
      });
    }
  }

  if (project.fenceType === "chain_link") {
    const cl = calculateChainLink(project);
    cl.tensionBars = Math.max(2, posts.terminal);
    cl.braceBands =
      cl.tensionBars * 2 + (s.tensionWire ? project.runs.length : 0);
    fabricRolls = cl.fabricRolls;
    fabricLength = cl.fabricLength;
    topRailSections = cl.topRailSections;
    assumptions.push(
      `Fabric roll length: ${formatLength(s.fabricRollLength, units)}`,
    );
    assumptions.push(
      `Top rail section: ${formatLength(s.topRailSectionLength, units)}`,
    );
    lines.push({
      id: "fabric",
      category: "fabric",
      label: "Chain-link fabric",
      spec: `${formatLength(s.fenceHeight, units)} tall · ${formatLength(s.fabricRollLength, units)} rolls`,
      quantity: cl.fabricRolls,
      unit: "rolls",
      note: `${formatLength(cl.fabricLength, units)} total fabric needed`,
      highlightKeys: ["fabric"],
    });
    lines.push({
      id: "top_rail",
      category: "rails",
      label: "Top rail sections",
      spec: `${formatLength(s.topRailSectionLength, units)} sections`,
      quantity: cl.topRailSections,
      unit: "ea",
      highlightKeys: ["rails"],
    });
    lines.push({
      id: "ties",
      category: "hardware",
      label: "Fence ties",
      quantity: cl.ties,
      unit: "ea",
    });
    lines.push({
      id: "tension_bars",
      category: "hardware",
      label: "Tension bars",
      quantity: cl.tensionBars,
      unit: "ea",
    });
    lines.push({
      id: "brace_bands",
      category: "hardware",
      label: "Brace bands",
      quantity: cl.braceBands,
      unit: "ea",
    });
  }

  lines.push({
    id: "concrete",
    category: "concrete",
    label: "Concrete bags",
    spec: `${formatSmallLength(s.holeDiameter, units)} × ${formatSmallLength(s.holeDepth, units)} holes`,
    quantity: concrete.bags,
    unit: "bags",
    note: `${concretedPosts} posts · confirm bag yield on the product`,
    highlightKeys: ["post:all"],
  });

  if (gateHw.gateCount > 0) {
    lines.push({
      id: "hinges",
      category: "gates",
      label: "Gate hinge sets",
      quantity: gateHw.hingeSets,
      unit: "sets",
      highlightKeys: project.gates.map((g) => `gate:${g.id}`),
    });
    lines.push({
      id: "latches",
      category: "gates",
      label: "Gate latch sets",
      quantity: gateHw.latchSets,
      unit: "sets",
      highlightKeys: project.gates.map((g) => `gate:${g.id}`),
    });
    if (gateHw.dropRods > 0) {
      lines.push({
        id: "drop_rods",
        category: "gates",
        label: "Drop rods",
        quantity: gateHw.dropRods,
        unit: "ea",
      });
    }
  }

  // Style accessories with dimensional specs
  if (project.fenceType !== "chain_link") {
    if (s.postCap !== "none" && posts.total > 0) {
      lines.push({
        id: "post_caps",
        category: "optional",
        label:
          s.postCap === "solar"
            ? "Solar / light post caps"
            : s.postCap === "pyramid"
              ? "Pyramid post caps"
              : "Flat post caps",
        spec: `Sized for ${postFace} posts`,
        quantity: posts.total,
        unit: "ea",
        note: "Match actual post face at the store",
      });
    }
    if (s.hasPictureFrame && project.runs.length > 0) {
      const bays = Math.max(
        1,
        Math.ceil(totalFillLength(project) / s.postSpacing),
      );
      lines.push({
        id: "picture_frame",
        category: "optional",
        label: "Picture-frame trim",
        spec: trimSpecLabel(),
        quantity: bays * 4,
        unit: "ea",
        note: "Top, bottom, and two sides per bay",
      });
    } else if (s.hasCapRail && project.runs.length > 0) {
      const capQty = Math.max(
        1,
        Math.ceil(totalFenceLength / feetToInches(8)),
      );
      lines.push({
        id: "cap_rail",
        category: "optional",
        label: "Cap rail",
        spec: capRailSpecLabel(),
        quantity: capQty,
        unit: "ea",
        note: "Laid flat across the top of each bay",
      });
      if (s.hasTrim) {
        lines.push({
          id: "cap_trim",
          category: "optional",
          label: "Fascia / trim under cap",
          spec: trimSpecLabel(),
          quantity: capQty,
          unit: "ea",
        });
      }
    }
    if (s.hasKickboard && project.runs.length > 0) {
      lines.push({
        id: "kickboard",
        category: "optional",
        label: "Kickboards (rot boards)",
        spec: kickboardSpecLabel(),
        quantity: Math.max(
          1,
          Math.ceil(totalFillLength(project) / feetToInches(8)),
        ),
        unit: "ea",
        note: "Ground-contact board at the bottom of each bay",
      });
    }
    if (s.latticeTop !== "none") {
      lines.push({
        id: "lattice",
        category: "optional",
        label: "Lattice topper",
        spec: latticeSpecLabel(s, units),
        quantity: Math.max(
          1,
          Math.ceil(totalFillLength(project) / feetToInches(8)),
        ),
        unit: "panels",
        note: "Cut strips from 4×8 sheets; add 1x2/2x2 retainers as needed",
      });
    }
  }

  const fasteners = calculateFasteners(
    project,
    wood,
    panels?.totalPanelsToBuy ?? 0,
  );
  lines.push(...fasteners.lines);
  assumptions.push(
    "Fasteners are approximate (package-rounded); confirm for treated lumber and local code",
  );

  return {
    posts,
    panels,
    pickets,
    rails,
    fabricRolls,
    fabricLength,
    topRailSections,
    concreteBags: concrete.bags,
    hingeSets: gateHw.hingeSets,
    latchSets: gateHw.latchSets,
    dropRods: gateHw.dropRods,
    fastenersNote: fasteners.note,
    lines,
    assumptions,
    totalFenceLength,
    fillLength,
  };
}

/** Quick estimate from abstract counts (no geometry). */
export function calculateQuickEstimate(input: {
  project: FenceProject;
  totalLength: number;
  corners: number;
  endpoints: number;
  gates: { width: number; gateType: "single" | "double" }[];
  structureEnds?: number;
}): MaterialResult {
  const { totalLength, corners, endpoints, gates, structureEnds = 0 } = input;
  // Build a synthetic straight-run project for fill/panel math
  const synthetic: FenceProject = {
    ...input.project,
    runs: [
      {
        id: "quick_run",
        start: { x: 0, y: 0 },
        end: { x: totalLength, y: 0 },
        length: totalLength,
        gateIds: gates.map((_, i) => `qg_${i}`),
      },
    ],
    gates: gates.map((g, i) => ({
      id: `qg_${i}`,
      runId: "quick_run",
      offsetFromRunStart: Math.min(
        totalLength * 0.2 + i * (g.width + 24),
        Math.max(0, totalLength - g.width),
      ),
      width: g.width,
      gateType: g.gateType,
      swingDirection: "out" as const,
    })),
    joints: [],
  };

  const result = calculateMaterials(synthetic);

  // Override post counts with quick formula (shared corners once)
  const gatePosts = gates.length * 2;
  let line = 0;
  if (input.project.fenceType === "panel") {
    const mod = moduleWidth(synthetic);
    const fill = Math.max(0, totalLength - gates.reduce((s, g) => s + g.width, 0));
    line = mod > 0 ? Math.max(0, Math.floor(fill / mod) - 1) : 0;
  } else {
    const spacing = input.project.settings.postSpacing;
    const fill = Math.max(0, totalLength - gates.reduce((s, g) => s + g.width, 0));
    line = spacing > 0 ? Math.max(0, Math.floor(fill / spacing) - 1) : 0;
  }

  const posts: PostCount = {
    line,
    corner: corners,
    end: endpoints,
    gate: input.project.fenceType === "chain_link" ? 0 : gatePosts,
    terminal:
      input.project.fenceType === "chain_link"
        ? endpoints + corners + gatePosts
        : 0,
    structure: structureEnds,
    total: 0,
  };
  posts.total =
    posts.line +
    posts.corner +
    posts.end +
    posts.gate +
    posts.terminal +
    posts.structure;

  const concrete = calculateConcreteBags(
    posts.total - posts.structure,
    input.project.settings,
  );

  return {
    ...result,
    posts,
    concreteBags: concrete.bags,
    totalFenceLength: totalLength,
    fillLength: Math.max(
      0,
      totalLength - gates.reduce((s, g) => s + g.width, 0),
    ),
    lines: result.lines.map((lineItem) => {
      if (lineItem.id === "posts_buy")
        return {
          ...lineItem,
          quantity: Math.max(0, posts.total - posts.structure),
        };
      if (lineItem.id === "concrete")
        return { ...lineItem, quantity: concrete.bags };
      return lineItem;
    }),
  };
}
