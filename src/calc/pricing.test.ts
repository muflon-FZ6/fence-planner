import { describe, expect, it } from "vitest";
import { calculateMaterials } from "@/calc/engine";
import {
  estimateProjectMaterialsCost,
  formatPackPlan,
  listMappedCalculatorLineIds,
  planRetailPacks,
  PRICING_DISCLAIMER,
  selectRetailPackSize,
} from "@/calc/pricing";
import { MATERIAL_SPECS } from "@/content/pricing/materialSpecs";
import { PRICE_OBSERVATIONS, SNAPSHOT_AS_OF } from "@/content/pricing/observations";
import { buildReferenceScenario } from "@/domain/referenceScenarios";

const NOW = new Date(`${SNAPSHOT_AS_OF}T18:00:00Z`);

describe("pricing Phase A seed", () => {
  it("maps core calculator line ids to material specs", () => {
    const mapped = new Set(listMappedCalculatorLineIds());
    for (const id of [
      "posts_buy",
      "panels_buy",
      "rails",
      "pickets",
      "concrete",
      "fabric",
      "hinges",
      "latches",
      "screws_boards",
      "panel_brackets",
    ]) {
      expect(mapped.has(id), id).toBe(true);
    }
  });

  it("keeps every observation pointed at a known material spec", () => {
    const specIds = new Set(MATERIAL_SPECS.map((s) => s.id));
    for (const o of PRICE_OBSERVATIONS) {
      expect(specIds.has(o.materialSpecId), o.id).toBe(true);
      expect(o.normalizedUnitPrice).toBeGreaterThan(0);
      expect(["USD", "CAD"]).toContain(o.currency);
    }
  });
});

describe("estimateProjectMaterialsCost", () => {
  it("prices a straight panel run in USD without blank lines", () => {
    const project = buildReferenceScenario("fp-rs-01-straight-panel-run");
    expect(project).not.toBeNull();
    const materials = calculateMaterials(project!);
    const estimate = estimateProjectMaterialsCost({
      lines: materials.lines,
      country: "US",
      now: NOW,
    });

    expect(estimate.currency).toBe("USD");
    expect(estimate.materialsTypical).toBeGreaterThan(0);
    expect(estimate.materialsLow).toBeLessThanOrEqual(estimate.materialsTypical);
    expect(estimate.materialsHigh).toBeGreaterThanOrEqual(
      estimate.materialsTypical,
    );
    expect(estimate.disclaimer).toBe(PRICING_DISCLAIMER);

    for (const line of estimate.lines) {
      expect(line.unitPriceTypical).toBeGreaterThan(0);
      expect(line.lineCostTypical).toBeGreaterThan(0);
      expect(line.materialSpecId).toBeTruthy();
    }
  });

  it("prices the same panel run in CAD with Canadian observations", () => {
    const project = buildReferenceScenario("fp-rs-01-straight-panel-run");
    const materials = calculateMaterials(project!);
    const estimate = estimateProjectMaterialsCost({
      lines: materials.lines,
      country: "CA",
      now: NOW,
    });

    expect(estimate.currency).toBe("CAD");
    expect(estimate.materialsTypical).toBeGreaterThan(0);

    const posts = estimate.lines.find((l) => l.materialLineId === "posts_buy");
    expect(posts).toBeTruthy();
    expect(posts!.matchQuality).toBe("exact");
    // Default hole depth makes stock length 10–12 ft for common heights
    expect(posts!.unitPriceTypical).toBeGreaterThanOrEqual(9);
    expect(posts!.materialSpecId).toMatch(/wood\.post\.pt\.4x4\.(8|10|12)\.ground/);
  });

  it("prices longer posts higher than shorter posts", () => {
    const base = {
      category: "posts" as const,
      label: "Fence posts",
      quantity: 10,
      unit: "ea",
    };
    const eight = estimateProjectMaterialsCost({
      lines: [
        {
          ...base,
          id: "posts_buy",
          pricingSpecId: "wood.post.pt.4x4.8.ground",
          spec: "4x4 x 8 ft ground-contact",
        },
      ],
      country: "CA",
      now: NOW,
    });
    const twelve = estimateProjectMaterialsCost({
      lines: [
        {
          ...base,
          id: "posts_buy",
          pricingSpecId: "wood.post.pt.4x4.12.ground",
          spec: "4x4 x 12 ft ground-contact",
        },
      ],
      country: "CA",
      now: NOW,
    });

    expect(eight.lines[0].materialSpecId).toBe("wood.post.pt.4x4.8.ground");
    expect(twelve.lines[0].materialSpecId).toBe("wood.post.pt.4x4.12.ground");
    expect(twelve.lines[0].unitPriceTypical).toBeGreaterThan(
      eight.lines[0].unitPriceTypical,
    );
    expect(twelve.materialsTypical).toBeGreaterThan(eight.materialsTypical);
  });

  it("prices a chain-link layout without blank mapped lines", () => {
    const project = buildReferenceScenario("fp-rs-06-chain-link-system");
    const materials = calculateMaterials(project!);
    const estimate = estimateProjectMaterialsCost({
      lines: materials.lines,
      country: "US",
      now: NOW,
    });

    expect(estimate.materialsTypical).toBeGreaterThan(0);
    const fabric = estimate.lines.find((l) => l.materialLineId === "fabric");
    expect(fabric?.unitPriceTypical).toBeGreaterThan(0);
  });

  it("lets user overrides win over seed bands", () => {
    const estimate = estimateProjectMaterialsCost({
      lines: [
        {
          id: "posts_buy",
          category: "posts",
          label: "Fence posts",
          quantity: 10,
          unit: "ea",
        },
      ],
      country: "US",
      now: NOW,
      overrides: [
        {
          materialLineId: "posts_buy",
          unitPrice: 20,
          currency: "USD",
        },
      ],
    });

    expect(estimate.lines[0].matchQuality).toBe("user_override");
    expect(estimate.lines[0].unitPriceTypical).toBe(20);
    expect(estimate.materialsTypical).toBe(200);
  });

  it("selects the smallest screw pack that covers the need", () => {
    expect(selectRetailPackSize(50, [100, 500, 1000, 2500])).toBe(100);
    expect(selectRetailPackSize(400, [100, 500, 1000, 2500])).toBe(500);
    expect(selectRetailPackSize(800, [100, 500, 1000, 2500])).toBe(1000);
  });

  it("plans mixed packs to avoid buying two oversized boxes", () => {
    const offers = [
      { pieces: 100, price: 18 },
      { pieces: 500, price: 36 },
      { pieces: 1000, price: 53 },
      { pieces: 2500, price: 95 },
    ];
    expect(formatPackPlan(planRetailPacks(50, offers))).toBe("1×100");
    expect(formatPackPlan(planRetailPacks(400, offers))).toBe("1×500");
    expect(formatPackPlan(planRetailPacks(2900, offers))).toBe(
      "1×2500 + 1×500",
    );
    // Not 2×2500
    expect(planRetailPacks(2900, offers)).toEqual([
      { pieces: 2500, count: 1 },
      { pieces: 500, count: 1 },
    ]);
  });

  it("prices ~400 rail screws as one 500-ct box, not a 1000-ct", () => {
    const estimate = estimateProjectMaterialsCost({
      lines: [
        {
          id: "screws_rails",
          category: "fasteners",
          label: "Rail-to-post screws",
          quantity: 400,
          unit: "ea",
        },
      ],
      country: "CA",
      now: NOW,
    });

    const line = estimate.lines[0];
    expect(line.priceUnit).toBe("box");
    expect(line.packSummary).toBe("1×500");
    expect(line.piecesPerPackage).toBe(500);
    expect(line.packagesToBuy).toBe(1);
    expect(line.unitPriceTypical).toBeGreaterThanOrEqual(25);
    expect(line.unitPriceTypical).toBeLessThanOrEqual(55);
    expect(line.lineCostTypical).toBe(line.unitPriceTypical);
  });

  it("prices ~50 gate screws as one 100-ct box", () => {
    const estimate = estimateProjectMaterialsCost({
      lines: [
        {
          id: "screws_gates",
          category: "fasteners",
          label: "Gate hardware screws",
          quantity: 50,
          unit: "ea",
        },
      ],
      country: "CA",
      now: NOW,
    });

    const line = estimate.lines[0];
    expect(line.packSummary).toBe("1×100");
    expect(line.piecesPerPackage).toBe(100);
    expect(line.packagesToBuy).toBe(1);
    expect(line.lineCostTypical).toBe(line.unitPriceTypical);
    expect(line.unitPriceTypical).toBeLessThan(30);
  });

  it("mixes a 2500 box with a smaller top-up instead of two 2500 boxes", () => {
    const estimate = estimateProjectMaterialsCost({
      lines: [
        {
          id: "screws_boards",
          category: "fasteners",
          label: "Board / picket screws",
          quantity: 2900,
          unit: "ea",
        },
      ],
      country: "CA",
      now: NOW,
    });

    const line = estimate.lines[0];
    expect(line.packSummary).toBe("1×2500 + 1×500");
    expect(line.packagesToBuy).toBe(2);
    expect(line.packPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ pieces: 2500, count: 1 }),
        expect.objectContaining({ pieces: 500, count: 1 }),
      ]),
    );
    // Cheaper than two contractor boxes at the 2500-ct price
    const twoLarge =
      2 *
      (line.packPlan!.find((p) => p.pieces === 2500)?.unitPriceTypical ?? 0);
    expect(line.lineCostTypical).toBeLessThan(twoLarge);
  });

  it("never mixes currencies in one estimate", () => {
    const project = buildReferenceScenario("fp-rs-05-concrete-bag-yield");
    const materials = calculateMaterials(project!);
    const us = estimateProjectMaterialsCost({
      lines: materials.lines,
      country: "US",
      now: NOW,
    });
    const ca = estimateProjectMaterialsCost({
      lines: materials.lines,
      country: "CA",
      now: NOW,
    });
    expect(us.currency).toBe("USD");
    expect(ca.currency).toBe("CAD");
    expect(us.materialsTypical).not.toBe(ca.materialsTypical);
  });
});
