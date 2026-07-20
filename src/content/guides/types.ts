import type { ReferenceScenarioId } from "@/domain/referenceScenarios";
import type { ModuleWidthMode } from "@/domain/types";

export type GuideCalloutTone = "tip" | "warn" | "note";

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | {
      type: "callout";
      title: string;
      text: string;
      tone?: GuideCalloutTone;
    }
  | {
      type: "example";
      title: string;
      assumptions: string[];
      steps: string[];
      result: string;
    }
  | {
      type: "table";
      caption: string;
      headers: string[];
      rows: string[][];
    }
  | {
      type: "figure";
      src: string;
      alt: string;
      caption: string;
      credit?: string;
    }
  | {
      type: "formula";
      title: string;
      inputs: string[];
      steps: string[];
      rounding?: string;
      result: string;
    }
  | {
      type: "scenario";
      exampleId: ReferenceScenarioId;
      label?: string;
    }
  | {
      type: "panel_module_explorer";
      defaultRunLength: number;
      defaultEnteredWidth: number;
      defaultPostFace: number;
      defaultMode: ModuleWidthMode;
    };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** ISO date string YYYY-MM-DD — update only on substantive edits */
  updated: string;
  body: GuideBlock[];
  relatedTool?: string;
  /** Optional card/hero image under /public/guides */
  image?: string;
  /** Related guide slugs (validated against the registry) */
  relatedGuides?: string[];
};

function collectBlockText(b: GuideBlock, parts: string[]): void {
  if ("text" in b && b.text) parts.push(b.text);
  if ("title" in b && typeof b.title === "string") parts.push(b.title);
  if ("caption" in b && b.caption) parts.push(b.caption);
  if ("result" in b && b.result) parts.push(b.result);
  if ("rounding" in b && b.rounding) parts.push(b.rounding);
  if ("items" in b && Array.isArray(b.items)) {
    for (const item of b.items) {
      if (typeof item === "string") parts.push(item);
    }
  }
  if ("assumptions" in b) parts.push(...b.assumptions);
  if ("steps" in b) parts.push(...b.steps);
  if ("inputs" in b) parts.push(...b.inputs);
  if ("headers" in b) parts.push(...b.headers);
  if ("rows" in b) parts.push(...b.rows.flat());
}

export function estimateReadingMinutes(guide: Pick<Guide, "body" | "title" | "description">): number {
  const parts: string[] = [guide.title, guide.description];
  for (const b of guide.body) collectBlockText(b, parts);
  const words = parts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
