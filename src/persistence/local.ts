import type { FenceProject } from "@/domain/types";

const CURRENT_KEY = "fence-planner:current";
const PROJECTS_KEY = "fence-planner:projects";
const PREFS_KEY = "fence-planner:prefs";

export type UserPrefs = {
  unitSystem: "imperial" | "metric";
  lastFenceType: FenceProject["fenceType"];
};

export function loadCurrentProject(): FenceProject | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FenceProject;
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
