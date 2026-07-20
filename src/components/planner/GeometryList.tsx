"use client";

import { planGridInches, snapLength } from "@/domain/snap";
import { formatLength, fromInches, toInches } from "@/domain/units";
import { useProject } from "@/state/projectStore";

/** Accessible structured list of runs and gates — not drag-only. */
export function GeometryList() {
  const {
    project,
    selectedRunId,
    selectRun,
    updateRun,
    deleteRun,
    addGate,
    updateGate,
    deleteGate,
    selectedGateId,
    selectGate,
  } = useProject();

  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold">Runs & gates</h3>
      {project.runs.length === 0 && (
        <p className="text-foreground/60">No runs yet. Draw on the plan or pick a yard shape.</p>
      )}
      <ul className="space-y-2">
        {project.runs.map((run, index) => (
          <li
            key={run.id}
            className={`rounded-md border p-2 ${
              selectedRunId === run.id
                ? "border-primary bg-primary-soft/40"
                : "border-border bg-surface"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="font-medium"
                onClick={() => selectRun(run.id)}
              >
                Run {index + 1}
              </button>
              <button
                type="button"
                className="text-xs text-danger"
                onClick={() => deleteRun(run.id)}
              >
                Delete
              </button>
            </div>
            <label className="mt-2 flex flex-col gap-1 text-xs">
              <span className="font-medium">
                Plan run length ({project.unitSystem === "imperial" ? "ft" : "m"})
              </span>
              <span className="text-[11px] leading-snug text-foreground/55">
                Measured along the proposed fence centerline between endpoint
                markers. Not a survey boundary or outside-to-outside installed
                dimension.
              </span>
              <input
                type="number"
                min={1}
                step={1}
                className="w-24 rounded border border-border bg-surface px-2 py-1"
                value={Number(
                  fromInches(run.length, project.unitSystem).toFixed(0),
                )}
                onChange={(e) => {
                  const display = Number(e.target.value);
                  if (!Number.isFinite(display) || display <= 0) return;
                  const grid = planGridInches(project.unitSystem);
                  const newLen = snapLength(
                    toInches(display, project.unitSystem),
                    grid,
                  );
                  const scale = run.length > 0 ? newLen / run.length : 1;
                  updateRun(run.id, {
                    end: {
                      x: run.start.x + (run.end.x - run.start.x) * scale,
                      y: run.start.y + (run.end.y - run.start.y) * scale,
                    },
                    length: newLen,
                  });
                }}
              />
            </label>
            <p className="mt-1 text-xs text-foreground/55">
              {formatLength(run.length, project.unitSystem)}
            </p>
            <button
              type="button"
              className="mt-2 rounded border border-border px-2 py-1 text-xs font-semibold"
              onClick={() =>
                addGate(
                  run.id,
                  Math.max(12, run.length * 0.3),
                  project.unitSystem === "imperial" ? 48 : 1000,
                )
              }
            >
              Add gate
            </button>
            {project.gates
              .filter((g) => g.runId === run.id)
              .map((gate) => (
                <div
                  key={gate.id}
                  className={`mt-2 rounded border p-2 ${
                    selectedGateId === gate.id
                      ? "border-accent-amber"
                      : "border-border"
                  }`}
                >
                  <button
                    type="button"
                    className="text-xs font-semibold text-accent-amber"
                    onClick={() => selectGate(gate.id)}
                  >
                    Gate ({gate.gateType})
                  </button>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <label className="text-[11px]">
                      Planned gate opening width
                      <input
                        type="number"
                        min={1}
                        step={1}
                        className="mt-0.5 w-full rounded border border-border px-1 py-0.5"
                        value={Number(
                          fromInches(gate.width, project.unitSystem).toFixed(0),
                        )}
                        onChange={(e) => {
                          const grid = planGridInches(project.unitSystem);
                          updateGate(gate.id, {
                            width: snapLength(
                              toInches(Number(e.target.value), project.unitSystem),
                              grid,
                            ),
                          });
                        }}
                      />
                      <span className="mt-0.5 block text-[10px] leading-snug text-foreground/50">
                        Removed from fence fill. Not leaf, kit, or finished clear
                        passage.
                      </span>
                    </label>
                    <label className="text-[11px]">
                      Type
                      <select
                        className="mt-0.5 w-full rounded border border-border px-1 py-0.5"
                        value={gate.gateType}
                        onChange={(e) =>
                          updateGate(gate.id, {
                            gateType: e.target.value as "single" | "double",
                          })
                        }
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                      </select>
                    </label>
                  </div>
                  <button
                    type="button"
                    className="mt-1 text-[11px] text-danger"
                    onClick={() => deleteGate(gate.id)}
                  >
                    Remove gate
                  </button>
                </div>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
