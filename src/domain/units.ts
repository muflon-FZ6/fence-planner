import type { UnitSystem } from "./types";

/** Internal storage is always inches. */

export const INCHES_PER_FOOT = 12;
export const MM_PER_INCH = 25.4;
export const CUBIC_INCHES_PER_CUBIC_FOOT = 1728;
export const LITERS_PER_CUBIC_INCH = 0.0163871;

export function feetToInches(ft: number): number {
  return ft * INCHES_PER_FOOT;
}

export function inchesToFeet(inches: number): number {
  return inches / INCHES_PER_FOOT;
}

export function mmToInches(mm: number): number {
  return mm / MM_PER_INCH;
}

export function inchesToMm(inches: number): number {
  return inches * MM_PER_INCH;
}

export function metersToInches(m: number): number {
  return mmToInches(m * 1000);
}

export function inchesToMeters(inches: number): number {
  return inchesToMm(inches) / 1000;
}

/** Convert a display length in the user's unit system into inches. */
export function toInches(value: number, unitSystem: UnitSystem, asFeet = true): number {
  if (unitSystem === "imperial") {
    return asFeet ? feetToInches(value) : value;
  }
  return asFeet ? metersToInches(value) : mmToInches(value);
}

/** Convert inches to a display length (feet or meters). */
export function fromInches(inches: number, unitSystem: UnitSystem, asFeet = true): number {
  if (unitSystem === "imperial") {
    return asFeet ? inchesToFeet(inches) : inches;
  }
  return asFeet ? inchesToMeters(inches) : inchesToMm(inches);
}

export function lengthLabel(unitSystem: UnitSystem): string {
  return unitSystem === "imperial" ? "ft" : "m";
}

export function smallLengthLabel(unitSystem: UnitSystem): string {
  return unitSystem === "imperial" ? "in" : "mm";
}

export function formatLength(
  inches: number,
  unitSystem: UnitSystem,
  digits = 1,
): string {
  const value = fromInches(inches, unitSystem, true);
  const unit = lengthLabel(unitSystem);
  return `${value.toFixed(digits)} ${unit}`;
}

export function formatSmallLength(
  inches: number,
  unitSystem: UnitSystem,
  digits = 0,
): string {
  const value = fromInches(inches, unitSystem, false);
  const unit = smallLengthLabel(unitSystem);
  return `${value.toFixed(digits)} ${unit}`;
}

/** Typical 50 lb bag yield ≈ 0.33 cubic feet. */
export const DEFAULT_BAG_YIELD_CU_IN = 0.33 * CUBIC_INCHES_PER_CUBIC_FOOT;
