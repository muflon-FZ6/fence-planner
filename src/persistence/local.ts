import { defaultSettings } from "@/domain/defaults";
import { defaultPricingCountry } from "@/domain/pricingPrefs";
import type { FenceProject, FenceSettings } from "@/domain/types";

const CURRENT_KEY = "fence-planner:current";
const PROJECTS_KEY = "fence-planner:projects";
const PREFS_KEY = "fence-planner:prefs";

export type UserPrefs = {
  unitSystem: "imperial" | "metric";
  lastFenceType: FenceProject["fenceType"];
};

function normalizeProject(project: FenceProject): FenceProject {
  const base = defaultSettings(project.fenceType);
  const prev = project.settings ?? ({} as FenceSettings);
  const settings: FenceSettings = {
    ...base,
    ...prev,
    boardPattern:
      prev.boardPattern ??
      ((prev.picketGap ?? 0) > 0.5 ? "spaced" : "solid"),
    boardTop: prev.boardTop ?? base.boardTop,
    hasCapRail: prev.hasCapRail ?? base.hasCapRail,
    hasTrim: prev.hasTrim ?? base.hasTrim,
    hasPictureFrame: prev.hasPictureFrame ?? base.hasPictureFrame,
    hasKickboard: prev.hasKickboard ?? base.hasKickboard,
    latticeTop: prev.latticeTop ?? base.latticeTop,
    latticeHeight: resolveLatticeHeight(prev, base),
    postCap: prev.postCap ?? base.postCap,
  };
  return {
    ...project,
    settings,
    pricingCountry:
      project.pricingCountry ?? defaultPricingCountry(project.unitSystem),
    priceOverrides: project.priceOverrides ?? {},
  };
}

function resolveLatticeHeight(
  prev: FenceSettings,
  base: FenceSettings,
): number {
  if (typeof prev.latticeHeight === "number" && prev.latticeHeight > 0) {
    return prev.latticeHeight;
  }
  // Migrate older ratio-based saves into inches.
  if (typeof prev.latticeHeightRatio === "number" && prev.latticeHeightRatio > 0) {
    const fenceH = prev.fenceHeight ?? base.fenceHeight;
    return Math.round(prev.latticeHeightRatio * fenceH);
  }
  return base.latticeHeight;
}

export function loadCurrentProject(): FenceProject | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    if (!raw) return null;
    return normalizeProject(JSON.parse(raw) as FenceProject);
  } catch {
    return null;
  }
}

export function saveCurrentProject(project: FenceProject): void {
  if (typeof window === "undefined") return;
  const updated = { ...project, updatedAt: new Date().toISOString() };
  localStorage.setItem(CURRENT_KEY, JSON.stringify(updated));
  upsertNamedProject(updated);
}

export function clearCurrentProject(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_KEY);
}

export function loadNamedProjects(): FenceProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FenceProject[];
  } catch {
    return [];
  }
}

function upsertNamedProject(project: FenceProject): void {
  const list = loadNamedProjects().filter((p) => p.id !== project.id);
  list.unshift(project);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(list.slice(0, 20)));
}

export function loadPrefs(): UserPrefs {
  if (typeof window === "undefined") {
    return { unitSystem: "imperial", lastFenceType: "panel" };
  }
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { unitSystem: "imperial", lastFenceType: "panel" };
    return JSON.parse(raw) as UserPrefs;
  } catch {
    return { unitSystem: "imperial", lastFenceType: "panel" };
  }
}

export function savePrefs(prefs: UserPrefs): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function duplicateProject(project: FenceProject): FenceProject {
  return {
    ...structuredClone(project),
    id: crypto.randomUUID(),
    name: project.name ? `${project.name} (copy)` : "Copy of fence plan",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
