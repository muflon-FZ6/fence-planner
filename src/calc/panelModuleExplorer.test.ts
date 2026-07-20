import { describe, expect, it } from "vitest";
import { computePanelModuleExplorer } from "./panelModuleExplorer";
import { calculatePanels } from "./panel";
import { buildFpRs01 } from "./fixtures/referenceScenarios";
import { classifyPosts } from "@/domain/geometry";

describe("panel module explorer model", () => {
  it("matches calculatePanels for FP-RS-01", () => {
    const explorer = computePanelModuleExplorer({
      runLengthIn: 960,
      enteredWidthIn: 96,
      postFaceIn: 4,
      mode: "panel_only",
    });
    const panels = calculatePanels(buildFpRs01());
    expect(explorer.repeatingPitch).toBe(100);
    expect(explorer.fullPanels).toBe(panels.fullPanels);
    expect(explorer.panelsToBuy).toBe(panels.totalPanelsToBuy);
    expect(explorer.partialBay?.pitchRemainder).toBeCloseTo(60);
    expect(explorer.partialBay?.clearPanelSpace).toBeCloseTo(56);
    expect(explorer.partialBay?.status).toBe("valid");
    expect(explorer.postsIsolatedRun).toBe(classifyPosts(buildFpRs01()).length);
  });

  it("exact multiple has no partial bay", () => {
    const explorer = computePanelModuleExplorer({
      runLengthIn: 1000,
      enteredWidthIn: 96,
      postFaceIn: 4,
      mode: "panel_only",
    });
    expect(explorer.fullPanels).toBe(10);
    expect(explorer.partialBay).toBeNull();
    expect(explorer.panelsToBuy).toBe(10);
    expect(explorer.postsIsolatedRun).toBe(11);
  });

  it("includes_post uses entered value as pitch", () => {
    const explorer = computePanelModuleExplorer({
      runLengthIn: 960,
      enteredWidthIn: 100,
      postFaceIn: 4,
      mode: "includes_post",
    });
    expect(explorer.repeatingPitch).toBe(100);
    expect(explorer.partialBay?.clearPanelSpace).toBeCloseTo(56);
  });

  it("impossible clear opening surfaces no_usable status", () => {
    const explorer = computePanelModuleExplorer({
      runLengthIn: 904.1,
      enteredWidthIn: 96,
      postFaceIn: 4,
      mode: "panel_only",
    });
    expect(explorer.partialBay?.status).toBe("no_usable_clear_opening");
    expect(explorer.repeatingPitch).toBe(100);
  });
});
