"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { calculateMaterials } from "@/calc/engine";
import { createEmptyProject, cryptoRandomId } from "@/domain/defaults";
import {
  distance,
  rebuildJoints,
  syncRunLengths,
} from "@/domain/geometry";
import type {
  FenceProject,
  FenceRun,
  FenceType,
  Gate,
  MaterialResult,
  Point,
  ProjectIntent,
  ProjectWarning,
} from "@/domain/types";
import { track } from "@/lib/analytics";
import {
  duplicateProject,
  loadCurrentProject,
  saveCurrentProject,
  savePrefs,
} from "@/persistence/local";
import { validateProject } from "@/warnings/validate";

const MAX_HISTORY = 50;

type State = {
  project: FenceProject;
  past: FenceProject[];
  future: FenceProject[];
  selectedRunId: string | null;
  selectedGateId: string | null;
  highlightKeys: string[];
  dismissedWarnings: string[];
  hydrated: boolean;
};

type Action =
  | { type: "HYDRATE"; project: FenceProject }
  | { type: "SET_PROJECT"; project: FenceProject; pushHistory?: boolean }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SELECT_RUN"; id: string | null }
  | { type: "SELECT_GATE"; id: string | null }
  | { type: "SET_HIGHLIGHTS"; keys: string[] }
  | { type: "DISMISS_WARNING"; id: string };

function clone(p: FenceProject): FenceProject {
  return structuredClone(p);
}

function withJoints(project: FenceProject): FenceProject {
  const runs = syncRunLengths(project.runs);
  return {
    ...project,
    runs,
    joints: rebuildJoints({ ...project, runs }),
    updatedAt: new Date().toISOString(),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, project: action.project, hydrated: true };
    case "SET_PROJECT": {
      const next = withJoints(action.project);
      if (action.pushHistory === false) {
        return { ...state, project: next };
      }
      return {
        ...state,
        project: next,
        past: [...state.past, clone(state.project)].slice(-MAX_HISTORY),
        future: [],
      };
    }
    case "UNDO": {
      if (!state.past.length) return state;
      const previous = state.past[state.past.length - 1];
      return {
        ...state,
        project: previous,
        past: state.past.slice(0, -1),
        future: [clone(state.project), ...state.future].slice(0, MAX_HISTORY),
      };
    }
    case "REDO": {
      if (!state.future.length) return state;
      const next = state.future[0];
      return {
        ...state,
        project: next,
        past: [...state.past, clone(state.project)].slice(-MAX_HISTORY),
        future: state.future.slice(1),
      };
    }
    case "SELECT_RUN":
      return { ...state, selectedRunId: action.id, selectedGateId: null };
    case "SELECT_GATE":
      return { ...state, selectedGateId: action.id };
    case "SET_HIGHLIGHTS":
      return { ...state, highlightKeys: action.keys };
    case "DISMISS_WARNING":
      return {
        ...state,
        dismissedWarnings: [...state.dismissedWarnings, action.id],
      };
    default:
      return state;
  }
}

type ProjectContextValue = {
  project: FenceProject;
  materials: MaterialResult;
  warnings: ProjectWarning[];
  selectedRunId: string | null;
  selectedGateId: string | null;
  highlightKeys: string[];
  hydrated: boolean;
  canUndo: boolean;
  canRedo: boolean;
  setProject: (project: FenceProject, pushHistory?: boolean) => void;
  updateSettings: (partial: Partial<FenceProject["settings"]>) => void;
  setFenceType: (type: FenceType) => void;
  setUnitSystem: (unit: FenceProject["unitSystem"]) => void;
  setName: (name: string) => void;
  setIntent: (intent: ProjectIntent) => void;
  addRun: (start: Point, end: Point) => void;
  updateRun: (id: string, patch: Partial<FenceRun>) => void;
  deleteRun: (id: string) => void;
  addGate: (runId: string, offset: number, width: number, gateType?: Gate["gateType"]) => void;
  updateGate: (id: string, patch: Partial<Gate>) => void;
  deleteGate: (id: string) => void;
  selectRun: (id: string | null) => void;
  selectGate: (id: string | null) => void;
  setHighlights: (keys: string[]) => void;
  dismissWarning: (id: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  duplicate: () => void;
  replaceWith: (project: FenceProject) => void;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: FenceProject;
}) {
  const [state, dispatch] = useReducer(reducer, {
    project: initial ?? createEmptyProject({ name: "My Fence Plan" }),
    past: [],
    future: [],
    selectedRunId: null,
    selectedGateId: null,
    highlightKeys: [],
    dismissedWarnings: [],
    hydrated: Boolean(initial),
  });

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initial) return;
    const saved = loadCurrentProject();
    if (saved) {
      dispatch({ type: "HYDRATE", project: saved });
    } else {
      dispatch({ type: "HYDRATE", project: state.project });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveCurrentProject(state.project);
      savePrefs({
        unitSystem: state.project.unitSystem,
        lastFenceType: state.project.fenceType,
      });
      track("save_local_project");
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state.project, state.hydrated]);

  const materials = useMemo(
    () => calculateMaterials(state.project),
    [state.project],
  );

  const warnings = useMemo(() => {
    return validateProject(state.project).filter(
      (w) => !state.dismissedWarnings.includes(w.id),
    );
  }, [state.project, state.dismissedWarnings]);

  const setProject = useCallback((project: FenceProject, pushHistory = true) => {
    dispatch({ type: "SET_PROJECT", project, pushHistory });
  }, []);

  const value: ProjectContextValue = {
    project: state.project,
    materials,
    warnings,
    selectedRunId: state.selectedRunId,
    selectedGateId: state.selectedGateId,
    highlightKeys: state.highlightKeys,
    hydrated: state.hydrated,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    setProject,
    updateSettings: (partial) =>
      setProject({
        ...state.project,
        settings: { ...state.project.settings, ...partial },
      }),
    setFenceType: (type) => {
      track("select_fence_type", { type });
      setProject({ ...state.project, fenceType: type });
    },
    setUnitSystem: (unitSystem) => {
      track("switch_units", { unitSystem });
      setProject({ ...state.project, unitSystem });
    },
    setName: (name) => setProject({ ...state.project, name }, false),
    setIntent: (intent) => setProject({ ...state.project, intent }),
    addRun: (start, end) => {
      const run: FenceRun = {
        id: cryptoRandomId(),
        start,
        end,
        length: distance(start, end),
        gateIds: [],
      };
      track("add_fence_run");
      setProject({ ...state.project, runs: [...state.project.runs, run] });
    },
    updateRun: (id, patch) => {
      setProject({
        ...state.project,
        runs: state.project.runs.map((r) =>
          r.id === id ? { ...r, ...patch } : r,
        ),
      });
    },
    deleteRun: (id) => {
      setProject({
        ...state.project,
        runs: state.project.runs.filter((r) => r.id !== id),
        gates: state.project.gates.filter((g) => g.runId !== id),
      });
    },
    addGate: (runId, offset, width, gateType = "single") => {
      const gate: Gate = {
        id: cryptoRandomId(),
        runId,
        offsetFromRunStart: offset,
        width,
        gateType,
        swingDirection: "out",
      };
      track("add_gate");
      setProject({
        ...state.project,
        gates: [...state.project.gates, gate],
        runs: state.project.runs.map((r) =>
          r.id === runId ? { ...r, gateIds: [...r.gateIds, gate.id] } : r,
        ),
      });
    },
    updateGate: (id, patch) => {
      setProject({
        ...state.project,
        gates: state.project.gates.map((g) =>
          g.id === id ? { ...g, ...patch } : g,
        ),
      });
    },
    deleteGate: (id) => {
      setProject({
        ...state.project,
        gates: state.project.gates.filter((g) => g.id !== id),
        runs: state.project.runs.map((r) => ({
          ...r,
          gateIds: r.gateIds.filter((gid) => gid !== id),
        })),
      });
    },
    selectRun: (id) => dispatch({ type: "SELECT_RUN", id }),
    selectGate: (id) => dispatch({ type: "SELECT_GATE", id }),
    setHighlights: (keys) => dispatch({ type: "SET_HIGHLIGHTS", keys }),
    dismissWarning: (id) => dispatch({ type: "DISMISS_WARNING", id }),
    undo: () => dispatch({ type: "UNDO" }),
    redo: () => dispatch({ type: "REDO" }),
    reset: () => {
      if (typeof window !== "undefined" && !window.confirm("Reset this project?"))
        return;
      setProject(createEmptyProject({ name: "My Fence Plan" }));
    },
    duplicate: () => {
      setProject(duplicateProject(state.project));
    },
    replaceWith: (project) => {
      track("start_project");
      dispatch({
        type: "SET_PROJECT",
        project: withJoints(project),
        pushHistory: true,
      });
    },
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}
