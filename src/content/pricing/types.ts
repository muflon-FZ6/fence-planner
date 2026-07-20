/** Pricing geography for materials estimates (Phase A: country only). */
export type PricingCountry = "US" | "CA";

export type PricingCurrency = "USD" | "CAD";

export type PriceMatchQuality =
  | "exact"
  | "substitute"
  | "converted_us_reference"
  | "allowance"
  | "user_override";

export type PriceFreshness = "fresh" | "indicative" | "stale";

export type StockStatus =
  | "in_stock"
  | "orderable"
  | "catalog"
  | "unavailable"
  | "unknown";

export type MaterialSpec = {
  id: string;
  /** Calculator MaterialLine.id values this spec can price. */
  calculatorLineIds: string[];
  /** Prefix match for dynamic ids (e.g. panels_cut_). */
  calculatorLinePrefixes?: string[];
  category: string;
  fenceSystem: "wood" | "panel" | "chain_link" | "shared";
  name: string;
  nominalSize?: string;
  baseUnit: "each" | "bag" | "box" | "roll" | "kit" | "panel";
  /**
   * Default / fallback pieces per retail package.
   * When pricePerPackage is true and packageSizes is set, the estimator
   * picks the smallest available pack that covers the line quantity.
   */
  packageQuantity: number;
  /**
   * Retail pack counts commonly sold for this item (e.g. [100, 500, 1000, 2500]).
   * Merged with observation piecesPerPackage values at estimate time.
   */
  packageSizes?: number[];
  /**
   * Price observations are package prices (with piecesPerPackage).
   * Line cost = packagesToBuy × chosen-pack price.
   */
  pricePerPackage?: boolean;
  substitutionGroup?: string;
  /** Category allowance when no observation exists (per priced unit / package). */
  allowance?: { USD: number; CAD: number };
};

export type PriceObservation = {
  id: string;
  materialSpecId: string;
  observedAt: string;
  country: PricingCountry;
  region?: string;
  currency: PricingCurrency;
  regularPrice: number;
  salePrice?: number;
  bulkPrice?: number;
  bulkMinQuantity?: number;
  /**
   * Price used in bands: per calculator unit, or per retail package when the
   * material spec has pricePerPackage.
   */
  normalizedUnitPrice: number;
  /** Pieces in the priced package (fastener boxes). Overrides spec default. */
  piecesPerPackage?: number;
  stockStatus: StockStatus;
  retailer: string;
  title?: string;
  sourceUrl?: string;
  collectionMethod: "manual" | "retailer_feed" | "approved_crawler";
  confidence: "high" | "medium" | "low";
  /** When true, used as Canadian substitute (dimensional/gauge difference). */
  isSubstitute?: boolean;
  substituteNote?: string;
};

export type UserPriceOverride = {
  materialLineId: string;
  unitPrice: number;
  currency: PricingCurrency;
  note?: string;
};

/** One retail pack size in a purchase plan (e.g. 1×2500 + 1×500). */
export type PackPlanEntry = {
  pieces: number;
  count: number;
  unitPriceLow: number;
  unitPriceTypical: number;
  unitPriceHigh: number;
};

export type PricedMaterialLine = {
  materialLineId: string;
  materialSpecId: string | null;
  quantity: number;
  unit: string;
  currency: PricingCurrency;
  /** Priced unit: usually "each"; "box" when using bulk fastener packs. */
  priceUnit: string;
  unitPriceLow: number;
  unitPriceTypical: number;
  unitPriceHigh: number;
  lineCostLow: number;
  lineCostTypical: number;
  lineCostHigh: number;
  /** Set when cost is calculated from retail packages. */
  packagesToBuy?: number;
  piecesPerPackage?: number;
  /** Cost-minimizing mix of pack sizes, when pricePerPackage applies. */
  packPlan?: PackPlanEntry[];
  /** Human summary, e.g. "1×2500 + 1×500". */
  packSummary?: string;
  matchQuality: PriceMatchQuality;
  freshness: PriceFreshness;
  sampleCount: number;
  asOf: string | null;
  warning?: string;
};

export type ProjectPriceEstimate = {
  country: PricingCountry;
  currency: PricingCurrency;
  asOf: string;
  lines: PricedMaterialLine[];
  materialsLow: number;
  materialsTypical: number;
  materialsHigh: number;
  disclaimer: string;
};
