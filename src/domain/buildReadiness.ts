export type ReadinessAnswer = "yes" | "no" | "unsure";

export type ReadinessQuestionId =
  | "boundary_source"
  | "official_rules"
  | "utility_locate"
  | "private_lines"
  | "gate_clearance"
  | "product_instructions"
  | "site_constraints"
  | "estimate_check";

export type ReadinessQuestion = {
  id: ReadinessQuestionId;
  prompt: string;
  help: string;
  /** Missing this → Stop before digging/buying */
  stopIfMissing: boolean;
  relatedGuides: string[];
};

export type ReadinessStatus = "ready" | "verify" | "stop";

export type ReadinessItemResult = {
  id: ReadinessQuestionId;
  status: ReadinessStatus;
  prompt: string;
  answer: ReadinessAnswer | null;
  note: string;
  relatedGuides: string[];
  nextAction: string;
};

export type ReadinessAuditResult = {
  overall: ReadinessStatus;
  items: ReadinessItemResult[];
  generatedAt: string;
};

export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  {
    id: "boundary_source",
    prompt:
      "Do you have a boundary source you trust (survey, pins, or another authoritative record)?",
    help: "Guessing from a map app or a neighbor’s fence is not enough for a dig line.",
    stopIfMissing: true,
    relatedGuides: [
      "fence-permit-and-property-line-checklist",
      "how-to-measure-for-a-new-fence",
    ],
  },
  {
    id: "official_rules",
    prompt:
      "Have you found the official municipal/HOA rule source and recorded its link and date?",
    help: "Record the page or document you used — do not rely on memory of a verbal tip.",
    stopIfMissing: true,
    relatedGuides: ["fence-permit-and-property-line-checklist"],
  },
  {
    id: "utility_locate",
    prompt:
      "Have you requested the applicable utility locate, and are all responses back?",
    help: "Public locates mark member utilities — wait for clearances before digging.",
    stopIfMissing: true,
    relatedGuides: ["mark-underground-utilities-before-digging"],
  },
  {
    id: "private_lines",
    prompt:
      "Have you checked private-line risks such as irrigation, landscape lighting, or other owner-installed items?",
    help: "Public locate tickets usually do not cover private lines on your side of the meter.",
    stopIfMissing: false,
    relatedGuides: ["mark-underground-utilities-before-digging"],
  },
  {
    id: "gate_clearance",
    prompt:
      "Have you measured the gate path, swing, and obstruction clearance?",
    help: "Opening width alone is not enough — swing arcs need clear space.",
    stopIfMissing: false,
    relatedGuides: ["measure-and-plan-a-fence-gate"],
  },
  {
    id: "product_instructions",
    prompt:
      "Have you selected a fence system and read its installation instructions?",
    help: "Panel, site-built wood, and chain-link sequences differ — follow the product you will buy.",
    stopIfMissing: false,
    relatedGuides: [
      "fence-installation-order",
      "wood-panels-vs-individual-pickets",
    ],
  },
  {
    id: "site_constraints",
    prompt:
      "Does the project have slope, drainage, house/structure, or access constraints that need a product-specific decision?",
    help: "Answer Yes if constraints exist and are still unresolved; No if none apply or you already decided with product guidance.",
    stopIfMissing: false,
    relatedGuides: [
      "plan-fence-on-sloped-ground",
      "plan-fence-around-house-or-structure",
    ],
  },
  {
    id: "estimate_check",
    prompt:
      "Have you checked the material estimate against real product dimensions and local prices?",
    help: "Planner quantities are estimates — verify face widths, bag yield, and store pricing.",
    stopIfMissing: false,
    relatedGuides: [
      "fence-project-shopping-list",
      "how-to-estimate-fence-waste",
    ],
  },
];

function statusForAnswer(
  question: ReadinessQuestion,
  answer: ReadinessAnswer | null,
): ReadinessStatus {
  if (answer === null || answer === "unsure") {
    return question.stopIfMissing ? "stop" : "verify";
  }

  // Site constraints: Yes = unresolved decision needed; No = none / already decided
  if (question.id === "site_constraints") {
    return answer === "yes" ? "verify" : "ready";
  }

  if (answer === "no") {
    return question.stopIfMissing ? "stop" : "verify";
  }
  return "ready";
}

function nextActionFor(
  question: ReadinessQuestion,
  status: ReadinessStatus,
): string {
  if (status === "ready") {
    return "Evidence recorded — keep the note/date with your field kit.";
  }
  if (status === "stop") {
    switch (question.id) {
      case "boundary_source":
        return "Stop before digging or buying line posts until you have a trusted boundary source.";
      case "official_rules":
        return "Stop until you record the official rule source link and the date you checked it.";
      case "utility_locate":
        return "Stop digging until locate responses are back and marks are understood.";
      default:
        return "Resolve this prerequisite before digging or buying.";
    }
  }
  switch (question.id) {
    case "site_constraints":
      return "Resolve the product-specific slope, structure, drainage, or access decision before purchase.";
    case "private_lines":
      return "Walk the dig line for private irrigation, lighting, and other owner-installed risks.";
    case "gate_clearance":
      return "Measure swing arcs and obstruction clearances on site.";
    case "product_instructions":
      return "Choose a system and open its current installation instructions.";
    case "estimate_check":
      return "Compare the estimate to product dimensions and local prices before you buy.";
    default:
      return "Verify this item and add a short note.";
  }
}

export type ReadinessAnswers = Partial<
  Record<ReadinessQuestionId, ReadinessAnswer>
>;
export type ReadinessNotes = Partial<Record<ReadinessQuestionId, string>>;

export function evaluateReadinessAudit(
  answers: ReadinessAnswers,
  notes: ReadinessNotes = {},
  generatedAt: string = new Date().toISOString(),
): ReadinessAuditResult {
  const items: ReadinessItemResult[] = READINESS_QUESTIONS.map((q) => {
    const answer = answers[q.id] ?? null;
    const status = statusForAnswer(q, answer);
    return {
      id: q.id,
      status,
      prompt: q.prompt,
      answer,
      note: (notes[q.id] ?? "").trim(),
      relatedGuides: q.relatedGuides,
      nextAction: nextActionFor(q, status),
    };
  });

  const overall: ReadinessStatus = items.some((i) => i.status === "stop")
    ? "stop"
    : items.some((i) => i.status === "verify")
      ? "verify"
      : "ready";

  return { overall, items, generatedAt };
}

export const READINESS_STORAGE_KEY = "fence-planner:build-readiness-v1";
