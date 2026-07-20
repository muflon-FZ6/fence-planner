import type { FenceProject, PricingCountry, UnitSystem } from "@/domain/types";

export function defaultPricingCountry(unitSystem: UnitSystem): PricingCountry {
  return unitSystem === "metric" ? "CA" : "US";
}

export function resolvePricingCountry(project: FenceProject): PricingCountry {
  return project.pricingCountry ?? defaultPricingCountry(project.unitSystem);
}

export function formatMoney(
  amount: number,
  currency: "USD" | "CAD",
  opts?: { compact?: boolean },
): string {
  const maxFrac = opts?.compact
    ? amount >= 100
      ? 0
      : 2
    : amount >= 1000
      ? 0
      : 2;
  return new Intl.NumberFormat(currency === "CAD" ? "en-CA" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: maxFrac === 0 ? 0 : 2,
  }).format(amount);
}
