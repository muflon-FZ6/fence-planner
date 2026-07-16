"use client";

import { defaultSettings } from "@/domain/defaults";
import { fromInches, toInches } from "@/domain/units";
import type { FenceFinish, FenceType } from "@/domain/types";
import { useProject } from "@/state/projectStore";

const FINISHES: { id: FenceFinish; label: string }[] = [
  { id: "natural_cedar", label: "Natural cedar" },
  { id: "warm_brown", label: "Warm brown stain" },
  { id: "charcoal", label: "Charcoal stain" },
  { id: "white_vinyl", label: "White vinyl" },
  { id: "tan_vinyl", label: "Tan vinyl" },
  { id: "galvanized", label: "Galvanized" },
  { id: "black_chain_link", label: "Black chain link" },
];

export function SettingsPanel() {
  const { project, setFenceType, updateSettings, setUnitSystem, setName } =
    useProject();
  const s = project.settings;
  const u = project.unitSystem;

  function lengthField(
    label: string,
    inches: number,
    onChange: (inches: number) => void,
    asFeet = true,
  ) {
    return (
      <label className="block text-xs">
        <span className="text-foreground/70">{label}</span>
        <input
          type="number"
          min={0}
          step={asFeet ? 0.1 : 1}
          className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm"
          value={Number(fromInches(inches, u, asFeet).toFixed(asFeet ? 2 : 0))}
          onChange={(e) =>
            onChange(toInches(Number(e.target.value), u, asFeet))
          }
        />
      </label>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <label className="block text-xs">
        <span className="text-foreground/70">Project name</span>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
          value={project.name ?? ""}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block text-xs">
          Units
          <select
            className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
            value={project.unitSystem}
            onChange={(e) =>
              setUnitSystem(e.target.value as "imperial" | "metric")
            }
          >
            <option value="imperial">Imperial (ft)</option>
            <option value="metric">Metric (m)</option>
          </select>
        </label>
        <label className="block text-xs">
          Fence system
          <select
            className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
            value={project.fenceType}
            onChange={(e) => {
              const type = e.target.value as FenceType;
              setFenceType(type);
              updateSettings(defaultSettings(type));
            }}
          >
            <option value="panel">Preassembled panel</option>
            <option value="wood_privacy">Site-built wood privacy</option>
            <option value="chain_link">Chain link</option>
          </select>
        </label>
      </div>

      {lengthField("Fence height", s.fenceHeight, (v) =>
        updateSettings({ fenceHeight: v }),
      )}

      {project.fenceType === "panel" && (
        <>
          {lengthField("Panel width", s.panelWidth, (v) =>
            updateSettings({ panelWidth: v }),
          )}
          {lengthField("Post width", s.postWidth, (v) =>
            updateSettings({ postWidth: v, postCrossSection: v }),
            false,
          )}
          <label className="block text-xs">
            Module width mode
            <select
              className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5"
              value={s.moduleWidthMode}
              onChange={(e) =>
                updateSettings({
                  moduleWidthMode: e.target.value as "panel_only" | "includes_post",
                })
              }
            >
              <option value="panel_only">Panel only (+ post)</option>
              <option value="includes_post">Includes post</option>
            </select>
          </label>
        </>
      )}

      {project.fenceType === "wood_privacy" && (
        <>
          {lengthField("Post spacing", s.postSpacing, (v) =>
            updateSettings({ postSpacing: v }),
          )}
          <label className="block text-xs">
            Rails per span
            <input
              type="number"
              min={1}
              max={5}
              className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
              value={s.railsPerSpan}
              onChange={(e) =>
                updateSettings({ railsPerSpan: Number(e.target.value) })
              }
            />
          </label>
          {lengthField("Picket width", s.picketWidth, (v) =>
            updateSettings({ picketWidth: v }),
            false,
          )}
          {lengthField("Picket gap", s.picketGap, (v) =>
            updateSettings({ picketGap: v }),
            false,
          )}
          <label className="block text-xs">
            Board orientation
            <select
              className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
              value={s.boardOrientation}
              onChange={(e) =>
                updateSettings({
                  boardOrientation: e.target.value as "vertical" | "horizontal",
                })
              }
            >
              <option value="vertical">Vertical privacy</option>
              <option value="horizontal">Horizontal boards</option>
            </select>
          </label>
        </>
      )}

      {project.fenceType === "chain_link" && (
        <>
          {lengthField("Line post spacing", s.postSpacing, (v) =>
            updateSettings({ postSpacing: v }),
          )}
          {lengthField("Fabric roll length", s.fabricRollLength, (v) =>
            updateSettings({ fabricRollLength: v }),
          )}
          {lengthField("Top rail section", s.topRailSectionLength, (v) =>
            updateSettings({ topRailSectionLength: v }),
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-2">
        {lengthField("Hole diameter", s.holeDiameter, (v) =>
          updateSettings({ holeDiameter: v }),
          false,
        )}
        {lengthField("Hole depth", s.holeDepth, (v) =>
          updateSettings({ holeDepth: v }),
          false,
        )}
      </div>

      <label className="block text-xs">
        Waste %
        <input
          type="number"
          min={0}
          max={50}
          className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
          value={s.wastePercent}
          onChange={(e) =>
            updateSettings({ wastePercent: Number(e.target.value) })
          }
        />
      </label>

      <fieldset>
        <legend className="text-xs font-semibold">Finish</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {FINISHES.filter((f) => {
            if (project.fenceType === "chain_link")
              return f.id === "galvanized" || f.id === "black_chain_link";
            if (project.fenceType === "panel")
              return !f.id.includes("chain");
            return !f.id.includes("chain") && !f.id.includes("vinyl");
          }).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => updateSettings({ finish: f.id })}
              className={`rounded-md border px-2 py-2 text-left text-xs ${
                s.finish === f.id
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-surface"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
