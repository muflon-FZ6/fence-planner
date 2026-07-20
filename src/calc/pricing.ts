import {
  findSpecForMaterialLine,
  MATERIAL_SPECS,
} from "@/content/pricing/materialSpecs";
import {
  PRICE_OBSERVATIONS,
  SNAPSHOT_AS_OF,
  USD_TO_CAD_RATE,
  USD_TO_CAD_RATE_DATE,
} from "@/content/pricing/observations";
import type {
  MaterialSpec,
  PackPlanEntry,
  PricedMaterialLine,
  PriceFreshness,
  PriceMatchQuality,
  PriceObservation,
  PricingCountry,
  PricingCurrency,
  ProjectPriceEstimate,
  UserPriceOverride,
} from "@/content/pricing/types";
import type { MaterialLine } from "@/domain/types";

export const PRICING_DISCLAIMER =
  "Indicative materials estimate, not a retailer quote. Prices vary by store, region, species, grade, treatment, package size, promotion, delivery method, and availability. Tax, delivery, tool rental, removal, labor, permits, and site work are excluded unless you add them.";

const STALE_MS = 90 * 24 * 60 * 60 * 1000;
const INDICATIVE_MS = 30 * 24 * 60 * 60 * 1000;

function currencyForCountry(country: PricingCountry): PricingCurrency {
  return country === "CA" ? "CAD" : "USD";
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function freshnessOf(observedAt: string, now: Date): PriceFreshness {
  const age = now.getTime() - new Date(observedAt).getTime();
  if (age <= INDICATIVE_MS) return "fresh";
  if (age <= STALE_MS) return "indicative";
  return "stale";
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const w = idx - lo;
  return sorted[lo] * (1 - w) + sorted[hi] * w;
}

function bandFromPrices(prices: number[]): {
  low: number;
  typical: number;
  high: number;
} {
  const sorted = [...prices].sort((a, b) => a - b);
  if (sorted.length === 0) return { low: 0, typical: 0, high: 0 };
  if (sorted.length === 1) {
    const v = sorted[0];
    return { low: v, typical: v, high: v };
  }
  if (sorted.length < 5) {
    return {
      low: sorted[0],
      typical: percentile(sorted, 0.5),
      high: sorted[sorted.length - 1],
    };
  }
  return {
    low: percentile(sorted, 0.2),
    typical: percentile(sorted, 0.5),
    high: percentile(sorted, 0.8),
  };
}

function eligibleObservations(
  specId: string,
  country: PricingCountry,
  now: Date,
  opts?: { allowSubstitute?: boolean; allowCatalog?: boolean },
): PriceObservation[] {
  return PRICE_OBSERVATIONS.filter((o) => {
    if (o.materialSpecId !== specId) return false;
    if (o.country !== country) return false;
    if (o.stockStatus === "unavailable") return false;
    if (freshnessOf(o.observedAt, now) === "stale") return false;
    if (o.isSubstitute && !opts?.allowSubstitute) return false;
    if (o.stockStatus === "catalog" && !opts?.allowCatalog) return false;
    return true;
  });
}

type ResolvedBand = {
  low: number;
  typical: number;
  high: number;
  matchQuality: PriceMatchQuality;
  freshness: PriceFreshness;
  sampleCount: number;
  asOf: string | null;
  warning?: string;
  /** Pieces per priced package when the spec uses bulk-box pricing. */
  piecesPerPackage?: number;
};

/**
 * Pick the smallest retail pack that covers `quantity` in a single box.
 * Prefer {@link planRetailPacks} when minimizing cost across mixed sizes.
 */
export function selectRetailPackSize(
  quantity: number,
  packSizes: number[],
): number {
  const packs = [
    ...new Set(packSizes.filter((p) => Number.isFinite(p) && p > 0)),
  ].sort((a, b) => a - b);
  if (packs.length === 0) return Math.max(1, Math.ceil(quantity));
  const fit = packs.find((p) => p >= quantity);
  return fit ?? packs[packs.length - 1];
}

export type PackPriceOffer = {
  pieces: number;
  price: number;
};

/**
 * Minimum-cost mix of retail packs covering at least `quantity` pieces.
 * Example: 2900 with packs 100/500/1000/2500 → 1×2500 + 1×500 (not 2×2500).
 */
export function planRetailPacks(
  quantity: number,
  offers: PackPriceOffer[],
): { pieces: number; count: number }[] {
  const need = Math.max(0, Math.ceil(quantity));
  const packs = [
    ...new Map(
      offers
        .filter((o) => o.pieces > 0 && Number.isFinite(o.price) && o.price >= 0)
        .map((o) => [o.pieces, o] as const),
    ).values(),
  ].sort((a, b) => b.pieces - a.pieces);

  if (need <= 0) return [];
  if (packs.length === 0) {
    return [{ pieces: Math.max(1, need), count: 1 }];
  }

  type Node = { cost: number; boxes: number; choice: number };
  const memo = new Map<number, Node>();

  function solve(remaining: number): Node {
    if (remaining <= 0) return { cost: 0, boxes: 0, choice: 0 };
    const hit = memo.get(remaining);
    if (hit) return hit;

    let best: Node = {
      cost: Number.POSITIVE_INFINITY,
      boxes: Number.POSITIVE_INFINITY,
      choice: packs[0].pieces,
    };

    for (const offer of packs) {
      const next = solve(remaining - offer.pieces);
      const cost = offer.price + next.cost;
      const boxes = 1 + next.boxes;
      const betterCost = cost < best.cost - 1e-9;
      const betterBoxes =
        Math.abs(cost - best.cost) <= 1e-9 && boxes < best.boxes;
      const betterLargerPack =
        Math.abs(cost - best.cost) <= 1e-9 &&
        boxes === best.boxes &&
        offer.pieces > best.choice;
      if (betterCost || betterBoxes || betterLargerPack) {
        best = { cost, boxes, choice: offer.pieces };
      }
    }

    memo.set(remaining, best);
    return best;
  }

  solve(need);

  const counts = new Map<number, number>();
  let remaining = need;
  while (remaining > 0) {
    const node = memo.get(remaining);
    if (!node || node.choice <= 0) break;
    counts.set(node.choice, (counts.get(node.choice) ?? 0) + 1);
    remaining -= node.choice;
  }

  return [...counts.entries()]
    .map(([pieces, count]) => ({ pieces, count }))
    .sort((a, b) => b.pieces - a.pieces);
}

export function formatPackPlan(
  plan: { pieces: number; count: number }[],
): string {
  return plan
    .filter((p) => p.count > 0)
    .sort((a, b) => b.pieces - a.pieces)
    .map((p) => `${p.count}×${p.pieces}`)
    .join(" + ");
}

function availablePackSizes(
  spec: MaterialSpec,
  country: PricingCountry,
  now: Date,
): number[] {
  const fromSpec = spec.packageSizes?.length
    ? spec.packageSizes
    : [spec.packageQuantity];
  // Only local-market pack counts — don't import U.S. 453-ct SKUs into Canada, etc.
  const fromObs = eligibleObservations(spec.id, country, now, {
    allowSubstitute: true,
    allowCatalog: true,
  })
    .map((o) => o.piecesPerPackage)
    .filter((p): p is number => typeof p === "number" && p > 0);

  return [...new Set([...fromSpec, ...fromObs])].sort((a, b) => a - b);
}

/**
 * For bulk fasteners, observations may be 100-ct, 500-ct, or 2500-ct packs.
 * Compare on a per-piece basis, then scale to the chosen buy pack.
 */
function observationPriceForPack(
  o: PriceObservation,
  spec: MaterialSpec,
  packagePieces: number,
): number {
  if (!spec.pricePerPackage) return o.normalizedUnitPrice;
  const pieces = Math.max(1, o.piecesPerPackage ?? spec.packageQuantity);
  const perPiece = o.normalizedUnitPrice / pieces;
  return perPiece * Math.max(1, packagePieces);
}

function bandFromObservations(
  obs: PriceObservation[],
  spec: MaterialSpec,
  packagePieces?: number,
): { low: number; typical: number; high: number } {
  const target = packagePieces ?? spec.packageQuantity;
  if (spec.pricePerPackage && packagePieces) {
    // Prefer shelf prices for the same pack count (100 vs 500 vs 1000).
    const samePack = obs.filter((o) => o.piecesPerPackage === packagePieces);
    if (samePack.length > 0) {
      return bandFromPrices(samePack.map((o) => o.normalizedUnitPrice));
    }
  }
  return bandFromPrices(
    obs.map((o) => observationPriceForPack(o, spec, target)),
  );
}

function resolveBand(
  spec: MaterialSpec,
  country: PricingCountry,
  now: Date,
  packagePieces?: number,
): ResolvedBand {
  const currency = currencyForCountry(country);
  const piecesPerPackage = spec.pricePerPackage
    ? Math.max(1, packagePieces ?? spec.packageQuantity)
    : undefined;
  const targetPieces = piecesPerPackage ?? spec.packageQuantity;

  // 1–2. Exact local observations (in-stock / orderable).
  // Packaged fasteners also use catalog pack sizes so 100/500/1000 tiers resolve.
  const exact = eligibleObservations(spec.id, country, now, {
    allowCatalog: Boolean(spec.pricePerPackage),
  });
  if (exact.length > 0) {
    const band = bandFromObservations(exact, spec, targetPieces);
    const freshest = exact.reduce((a, b) =>
      a.observedAt >= b.observedAt ? a : b,
    );
    return {
      low: roundMoney(band.low),
      typical: roundMoney(band.typical),
      high: roundMoney(band.high),
      matchQuality: exact.length === 1 ? "exact" : "exact",
      freshness: freshnessOf(freshest.observedAt, now),
      sampleCount: exact.length,
      asOf: freshest.observedAt.slice(0, 10),
      warning:
        exact.length === 1
          ? "Single-store reference — not a multi-store market range"
          : undefined,
      piecesPerPackage,
    };
  }

  // 3. Local substitute
  const subs = eligibleObservations(spec.id, country, now, {
    allowSubstitute: true,
  });
  if (subs.length > 0) {
    const band = bandFromObservations(subs, spec, targetPieces);
    const freshest = subs.reduce((a, b) =>
      a.observedAt >= b.observedAt ? a : b,
    );
    return {
      low: roundMoney(band.low),
      typical: roundMoney(band.typical),
      high: roundMoney(band.high),
      matchQuality: "substitute",
      freshness: freshnessOf(freshest.observedAt, now),
      sampleCount: subs.length,
      asOf: freshest.observedAt.slice(0, 10),
      warning:
        freshest.substituteNote ??
        "Approximate substitute band — dimensional or gauge difference",
      piecesPerPackage,
    };
  }

  // 4. Local catalog (not presently stocked online)
  const catalog = eligibleObservations(spec.id, country, now, {
    allowSubstitute: true,
    allowCatalog: true,
  });
  if (catalog.length > 0) {
    const band = bandFromObservations(catalog, spec, targetPieces);
    const freshest = catalog.reduce((a, b) =>
      a.observedAt >= b.observedAt ? a : b,
    );
    return {
      low: roundMoney(band.low),
      typical: roundMoney(band.typical),
      high: roundMoney(band.high),
      matchQuality: catalog.some((o) => o.isSubstitute)
        ? "substitute"
        : "exact",
      freshness: freshnessOf(freshest.observedAt, now),
      sampleCount: catalog.length,
      asOf: freshest.observedAt.slice(0, 10),
      warning: "Catalog reference — confirm local stock",
      piecesPerPackage,
    };
  }

  // 5. For Canada: convert U.S. regular price
  if (country === "CA") {
    const usExact = eligibleObservations(spec.id, "US", now, {
      allowSubstitute: true,
      allowCatalog: true,
    });
    if (usExact.length > 0) {
      const usTypical = bandFromObservations(
        usExact,
        spec,
        targetPieces,
      ).typical;
      const converted = usTypical * USD_TO_CAD_RATE;
      return {
        low: roundMoney(converted * 0.9),
        typical: roundMoney(converted),
        high: roundMoney(converted * 1.2),
        matchQuality: "converted_us_reference",
        freshness: "indicative",
        sampleCount: usExact.length,
        asOf: USD_TO_CAD_RATE_DATE,
        warning: `Converted U.S. reference (1 USD = ${USD_TO_CAD_RATE} CAD on ${USD_TO_CAD_RATE_DATE}) — low confidence; replace with a local price when available`,
        piecesPerPackage,
      };
    }
  }

  // 6. Category allowance (scaled to chosen pack size)
  const baseAllowance = spec.allowance?.[currency] ?? spec.allowance?.USD ?? 0;
  const allowance = spec.pricePerPackage
    ? (baseAllowance / Math.max(1, spec.packageQuantity)) * targetPieces
    : baseAllowance;
  return {
    low: roundMoney(allowance * 0.85),
    typical: roundMoney(allowance),
    high: roundMoney(allowance * 1.25),
    matchQuality: "allowance",
    freshness: "indicative",
    sampleCount: 0,
    asOf: SNAPSHOT_AS_OF,
    warning: "Category allowance — no dated observation for this item",
    piecesPerPackage,
  };
}

function priceUnitLabel(spec: MaterialSpec | undefined, lineUnit: string): string {
  if (spec?.pricePerPackage) {
    return spec.baseUnit === "box" ? "box" : spec.baseUnit;
  }
  return lineUnit;
}

function buildPackPlan(
  spec: MaterialSpec,
  country: PricingCountry,
  now: Date,
  quantity: number,
): PackPlanEntry[] {
  const sizes = availablePackSizes(spec, country, now);
  const offers: PackPriceOffer[] = sizes.map((pieces) => {
    const band = resolveBand(spec, country, now, pieces);
    return { pieces, price: Math.max(0.01, band.typical) };
  });
  const raw = planRetailPacks(quantity, offers);
  return raw.map((entry) => {
    const band = resolveBand(spec, country, now, entry.pieces);
    return {
      pieces: entry.pieces,
      count: entry.count,
      unitPriceLow: band.low,
      unitPriceTypical: band.typical,
      unitPriceHigh: band.high,
    };
  });
}

function sumPackPlan(
  plan: PackPlanEntry[],
  key: "unitPriceLow" | "unitPriceTypical" | "unitPriceHigh",
): number {
  return roundMoney(plan.reduce((s, p) => s + p.count * p[key], 0));
}

export function estimateProjectMaterialsCost(input: {
  lines: MaterialLine[];
  country: PricingCountry;
  overrides?: UserPriceOverride[];
  now?: Date;
}): ProjectPriceEstimate {
  const now = input.now ?? new Date(`${SNAPSHOT_AS_OF}T18:00:00Z`);
  const currency = currencyForCountry(input.country);
  const overrideMap = new Map(
    (input.overrides ?? [])
      .filter((o) => o.currency === currency)
      .map((o) => [o.materialLineId, o]),
  );

  const priced: PricedMaterialLine[] = [];

  for (const line of input.lines) {
    if (line.quantity <= 0) continue;

    const spec = findSpecForMaterialLine(line);
    const packPlan =
      spec?.pricePerPackage
        ? buildPackPlan(spec, input.country, now, line.quantity)
        : undefined;
    const packSummary = packPlan?.length
      ? formatPackPlan(packPlan)
      : undefined;
    const totalBoxes = packPlan?.reduce((s, p) => s + p.count, 0);
    const singlePack =
      packPlan?.length === 1 ? packPlan[0] : undefined;
    const override = overrideMap.get(line.id);

    if (override) {
      const unit = override.unitPrice;
      // Single pack size: override is per box. Mixed plan: override is lot total.
      const mixed = Boolean(packPlan && packPlan.length > 1);
      const buyQty = mixed ? 1 : (totalBoxes ?? line.quantity);
      priced.push({
        materialLineId: line.id,
        materialSpecId: spec?.id ?? null,
        quantity: line.quantity,
        unit: line.unit,
        currency,
        priceUnit: mixed ? "lot" : priceUnitLabel(spec, line.unit),
        unitPriceLow: unit,
        unitPriceTypical: unit,
        unitPriceHigh: unit,
        lineCostLow: roundMoney(buyQty * unit),
        lineCostTypical: roundMoney(buyQty * unit),
        lineCostHigh: roundMoney(buyQty * unit),
        packagesToBuy: totalBoxes,
        piecesPerPackage: singlePack?.pieces,
        packPlan,
        packSummary,
        matchQuality: "user_override",
        freshness: "fresh",
        sampleCount: 1,
        asOf: SNAPSHOT_AS_OF,
      });
      continue;
    }

    if (!spec) {
      priced.push({
        materialLineId: line.id,
        materialSpecId: null,
        quantity: line.quantity,
        unit: line.unit,
        currency,
        priceUnit: line.unit,
        unitPriceLow: 0,
        unitPriceTypical: 0,
        unitPriceHigh: 0,
        lineCostLow: 0,
        lineCostTypical: 0,
        lineCostHigh: 0,
        matchQuality: "allowance",
        freshness: "indicative",
        sampleCount: 0,
        asOf: SNAPSHOT_AS_OF,
        warning: "No pricing key mapped for this line yet",
      });
      continue;
    }

    if (packPlan && packPlan.length > 0) {
      const lineLow = sumPackPlan(packPlan, "unitPriceLow");
      const lineTypical = sumPackPlan(packPlan, "unitPriceTypical");
      const lineHigh = sumPackPlan(packPlan, "unitPriceHigh");
      const mixed = packPlan.length > 1;
      const primaryBand = resolveBand(
        spec,
        input.country,
        now,
        singlePack?.pieces ?? packPlan[0].pieces,
      );
      priced.push({
        materialLineId: line.id,
        materialSpecId: spec.id,
        quantity: line.quantity,
        unit: line.unit,
        currency,
        priceUnit: mixed ? "lot" : priceUnitLabel(spec, line.unit),
        unitPriceLow: mixed ? lineLow : singlePack!.unitPriceLow,
        unitPriceTypical: mixed ? lineTypical : singlePack!.unitPriceTypical,
        unitPriceHigh: mixed ? lineHigh : singlePack!.unitPriceHigh,
        lineCostLow: lineLow,
        lineCostTypical: lineTypical,
        lineCostHigh: lineHigh,
        packagesToBuy: totalBoxes,
        piecesPerPackage: singlePack?.pieces,
        packPlan,
        packSummary,
        matchQuality: primaryBand.matchQuality,
        freshness: primaryBand.freshness,
        sampleCount: primaryBand.sampleCount,
        asOf: primaryBand.asOf,
        warning: primaryBand.warning,
      });
      continue;
    }

    const band = resolveBand(spec, input.country, now);
    priced.push({
      materialLineId: line.id,
      materialSpecId: spec.id,
      quantity: line.quantity,
      unit: line.unit,
      currency,
      priceUnit: priceUnitLabel(spec, line.unit),
      unitPriceLow: roundMoney(band.low),
      unitPriceTypical: roundMoney(band.typical),
      unitPriceHigh: roundMoney(band.high),
      lineCostLow: roundMoney(line.quantity * band.low),
      lineCostTypical: roundMoney(line.quantity * band.typical),
      lineCostHigh: roundMoney(line.quantity * band.high),
      matchQuality: band.matchQuality,
      freshness: band.freshness,
      sampleCount: band.sampleCount,
      asOf: band.asOf,
      warning: band.warning,
    });
  }

  const sum = (key: "lineCostLow" | "lineCostTypical" | "lineCostHigh") =>
    roundMoney(priced.reduce((s, l) => s + l[key], 0));

  return {
    country: input.country,
    currency,
    asOf: SNAPSHOT_AS_OF,
    lines: priced,
    materialsLow: sum("lineCostLow"),
    materialsTypical: sum("lineCostTypical"),
    materialsHigh: sum("lineCostHigh"),
    disclaimer: PRICING_DISCLAIMER,
  };
}

/** Stable calculator line ids covered by the pricing seed. */
export function listMappedCalculatorLineIds(): string[] {
  return MATERIAL_SPECS.flatMap((s) => s.calculatorLineIds);
}
