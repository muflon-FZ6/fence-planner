import { describe, expect, it } from "vitest";
import { guides, estimateReadingMinutes, getGuide } from "@/content/guides";
import type { GuideBlock } from "@/content/guides/types";
import {
  REFERENCE_SCENARIOS,
  buildReferenceScenario,
} from "@/domain/referenceScenarios";

describe("guide content model & discovery", () => {
  it("supports evidence block shapes without slug-specific renderer branches", () => {
    const blocks: GuideBlock[] = [
      {
        type: "table",
        caption: "Sample comparison",
        headers: ["Setting", "Value"],
        rows: [["Module", "100 in"]],
      },
      {
        type: "figure",
        src: "/guides/how-to-measure-for-a-new-fence-v2.webp",
        alt: "Measuring a fence line",
        caption: "Plan measurement along the centerline.",
        credit: "Illustrative asset",
      },
      {
        type: "formula",
        title: "Concrete bags",
        inputs: ["4 posts", "12 in × 36 in hole", "4 in face", "0.33 cu ft yield"],
        steps: ["Hole − post", "× posts", "÷ yield"],
        rounding: "One project-level ceiling",
        result: "25 bags",
      },
      {
        type: "scenario",
        exampleId: "fp-rs-01-straight-panel-run",
        label: "Load FP-RS-01",
      },
      {
        type: "panel_module_explorer",
        defaultRunLength: 960,
        defaultEnteredWidth: 96,
        defaultPostFace: 4,
        defaultMode: "panel_only",
      },
    ];
    expect(blocks).toHaveLength(5);
    expect(
      estimateReadingMinutes({ title: "t", description: "d", body: blocks }),
    ).toBeGreaterThan(0);
  });

  it("validates related guide slugs when present", () => {
    for (const g of guides) {
      for (const related of g.relatedGuides ?? []) {
        expect(
          getGuide(related),
          `missing related ${related} from ${g.slug}`,
        ).toBeTruthy();
      }
    }
  });

  it("validates table and figure fields for every guide", () => {
    for (const g of guides) {
      for (const block of g.body) {
        if (block.type === "table") {
          expect(block.caption.trim().length).toBeGreaterThan(0);
          expect(block.headers.length).toBeGreaterThan(0);
          for (const row of block.rows) {
            expect(
              row.length,
              `table row length in ${g.slug}`,
            ).toBe(block.headers.length);
          }
        }
        if (block.type === "figure") {
          expect(block.alt.trim().length, `figure alt in ${g.slug}`).toBeGreaterThan(
            0,
          );
          expect(block.caption.trim().length).toBeGreaterThan(0);
          expect(block.src.trim().length).toBeGreaterThan(0);
          expect(
            block.src.startsWith("/guides/"),
            `figure src must be /guides/… in ${g.slug}: ${block.src}`,
          ).toBe(true);
        }
      }
    }
  });

  it("builds every supported predefined example", () => {
    for (const meta of REFERENCE_SCENARIOS) {
      const project = buildReferenceScenario(meta.id);
      expect(project, meta.id).not.toBeNull();
      expect(project!.id).toBeTruthy();
    }
  });

  it("validates every guide scenario block against the reference registry", () => {
    const registered = new Set(REFERENCE_SCENARIOS.map((s) => s.id));
    for (const g of guides) {
      for (const block of g.body) {
        if (block.type !== "scenario") continue;
        expect(
          registered.has(block.exampleId),
          `unknown scenario ${block.exampleId} in ${g.slug}`,
        ).toBe(true);
        const meta = REFERENCE_SCENARIOS.find((s) => s.id === block.exampleId);
        expect(meta?.hasPlannerState, block.exampleId).toBe(true);
      }
    }
  });
});
