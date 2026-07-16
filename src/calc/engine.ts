import { calculateChainLink } from "./chainLink";
import { calculateConcreteBags } from "./concrete";
import { calculateGateHardware } from "./gates";
import { calculatePanels } from "./panel";
import { calculateWoodPrivacy } from "./woodPrivacy";
import {
  classifyPosts,
  moduleWidth,
  totalFillLength,
  totalRunLength,
} from "@/domain/geometry";
import { formatLength, formatSmallLength, inchesToFeet } from "@/domain/units";
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

  // Posts
  lines.push({
    id: "posts_total",
    category: "posts",
    label: "Posts (total)",
    quantity: posts.total,
    unit: "ea",
    highlightKeys: ["post:all"],
  });
  if (posts.line)
    lines.push({
      id: "posts_line",
      category: "posts",
      label: "Line posts",
      quantity: posts.line,
      unit: "ea",
      highlightKeys: ["post:line"],
    });
  if (posts.corner)
    lines.push({
      id: "posts_corner",
      category: "posts",
      label: "Corner posts",
      quantity: posts.corner,
      unit: "ea",
      highlightKeys: ["post:corner"],
    });
  if (posts.end)
    lines.push({
      id: "posts_end",
      category: "posts",
      label: "End posts",
      quantity: posts.end,
      unit: "ea",
      highlightKeys: ["post:end"],
    });
  if (posts.gate)
    lines.push({
      id: "posts_gate",
      category: "posts",
      label: "Gate posts",
      quantity: posts.gate,
      unit: "ea",
      highlightKeys: ["post:gate"],
    });
  if (posts.terminal)
    lines.push({
      id: "posts_terminal",
      category: "posts",
      label: "Terminal posts",
      quantity: posts.terminal,
      unit: "ea",
      highlightKeys: ["post:terminal"],
    });
  if (posts.structure)
    lines.push({
      id: "posts_structure",
      category: "posts",
      label: "House/structure connections",
      quantity: posts.structure,
      unit: "ea",
      note: "May use brackets instead of full posts",
      highlightKeys: ["post:structure"],
    });

  let panels = undefined;
  let pickets = undefined;
  let rails = undefined;
  let fabricRolls = undefined;
  let fabricLength = undefined;
  let topRailSections = undefined;

  if (project.fenceType === "panel") {
    panels = calculatePanels(project);
    const mod = moduleWidth(project);
    assumptions.push(
      `Panel module: ${formatLength(project.settings.panelWidth, units)} (${project.settings.moduleWidthMode === "includes_post" ? "includes post" : "panel only + post"}) → ${formatLength(mod, units)} on center`,
    );
    lines.push({
      id: "panels_full",
      category: "panels",
      label: "Full panels",
      quantity: panels.fullPanels,
      unit: "ea",
      highlightKeys: ["panel:full"],
    });
    for (const cut of panels.cutPanels) {
      lines.push({
        id: `panels_cut_${cut.runId}_${Math.round(cut.length)}`,
        category: "panels",
        label: `Cut panel (${formatSmallLength(cut.length, units)})`,
        quantity: 1,
        unit: "ea",
        note: "Purchase one panel and cut to fit",
        highlightKeys: [`run:${cut.runId}`, "panel:cut"],
      });
    }
    lines.push({
      id: "panels_buy",
      category: "panels",
      label: "Panels to purchase",
      quantity: panels.totalPanelsToBuy,
      unit: "ea",
    });
  }

  if (project.fenceType === "wood_privacy") {
    const wood = calculateWoodPrivacy(project);
    pickets = wood.pickets;
    rails = wood.rails;
    assumptions.push(
      `Post spacing: ${formatLength(project.settings.postSpacing, units)}`,
    );
    assumptions.push(`Rails per span: ${project.settings.railsPerSpan}`);
    assumptions.push(
      `Picket: ${formatSmallLength(project.settings.picketWidth, units)} wide, ${formatSmallLength(project.settings.picketGap, units)} gap`,
    );
    lines.push({
      id: "rails",
      category: "rails",
      label: "Rails",
      quantity: wood.rails,
      unit: "ea",
      highlightKeys: ["rails"],
    });
    lines.push({
      id: "pickets",
      category: "pickets",
      label: "Pickets / boards",
      quantity: wood.pickets,
      unit: "ea",
      highlightKeys: ["pickets"],
    });
  }

  if (project.fenceType === "chain_link") {
    const cl = calculateChainLink(project);
    // Refine tension bar count from terminals
    cl.tensionBars = Math.max(2, posts.terminal);
    cl.braceBands = cl.tensionBars * 2 + (project.settings.tensionWire ? project.runs.length : 0);
    fabricRolls = cl.fabricRolls;
    fabricLength = cl.fabricLength;
    topRailSections = cl.topRailSections;
    assumptions.push(
      `Fabric roll length: ${formatLength(project.settings.fabricRollLength, units)}`,
    );
    assumptions.push(
      `Top rail section: ${formatLength(project.settings.topRailSectionLength, units)}`,
    );
    lines.push({
      id: "fabric",
      category: "fabric",
      label: "Fabric rolls",
      quantity: cl.fabricRolls,
      unit: "rolls",
      note: `${formatLength(cl.fabricLength, units)} total fabric`,
      highlightKeys: ["fabric"],
    });
    lines.push({
      id: "top_rail",
      category: "rails",
      label: "Top rail sections",
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
    quantity: concrete.bags,
    unit: "bags",
    note: `${concretedPosts} posts concreted; bag yield ${inchesToFeet(Math.cbrt(project.settings.concreteBagYield)).toFixed(2)} ft³ equiv.`,
    highlightKeys: ["post:all"],
  });

  if (gateHw.gateCount > 0) {
    lines.push({
      id: "hinges",
      category: "gates",
      label: "Hinge sets",
      quantity: gateHw.hingeSets,
      unit: "sets",
      highlightKeys: project.gates.map((g) => `gate:${g.id}`),
    });
    lines.push({
      id: "latches",
      category: "gates",
      label: "Latch sets",
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

  const fastenersNote =
    project.fenceType === "wood_privacy"
      ? "Allow screws/nails for rails and pickets; verify package counts at purchase."
      : project.fenceType === "panel"
        ? "Allow brackets or fasteners per manufacturer panel system."
        : "Include tension bands, nuts, and washers per terminal post.";

  lines.push({
    id: "fasteners",
    category: "fasteners",
    label: "Fasteners / brackets",
    quantity: 1,
    unit: "allowance",
    note: fastenersNote,
  });

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
    fastenersNote,
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
      if (lineItem.id === "posts_total")
        return { ...lineItem, quantity: posts.total };
      if (lineItem.id === "posts_line") return { ...lineItem, quantity: posts.line };
      if (lineItem.id === "posts_corner")
        return { ...lineItem, quantity: posts.corner };
      if (lineItem.id === "posts_end") return { ...lineItem, quantity: posts.end };
      if (lineItem.id === "posts_gate") return { ...lineItem, quantity: posts.gate };
      if (lineItem.id === "posts_terminal")
        return { ...lineItem, quantity: posts.terminal };
      if (lineItem.id === "concrete")
        return { ...lineItem, quantity: concrete.bags };
      return lineItem;
    }),
  };
}
