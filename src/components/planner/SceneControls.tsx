"use client";

import { useProject } from "@/state/projectStore";
import type { SceneContext } from "@/domain/types";

export function SceneControls() {
  const { project, setProject } = useProject();
  const scene = project.scene;

  function patch(partial: Partial<SceneContext>) {
    setProject({ ...project, scene: { ...scene, ...partial } }, false);
  }

  return (
    <div className="space-y-2 text-xs">
      <p className="font-semibold text-sm">Scene context</p>
      <p className="text-foreground/55">
        Visual only — does not change material quantities.
      </p>
      <label className="block">
        House
        <select
          className="mt-1 w-full rounded border border-border px-2 py-1"
          value={scene.housePosition}
          onChange={(e) =>
            patch({
              housePosition: e.target.value as SceneContext["housePosition"],
            })
          }
        >
          <option value="center">Center</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="none">None</option>
        </select>
      </label>
      <label className="block">
        Ground
        <select
          className="mt-1 w-full rounded border border-border px-2 py-1"
          value={scene.ground}
          onChange={(e) =>
            patch({ ground: e.target.value as SceneContext["ground"] })
          }
        >
          <option value="grass">Grass</option>
          <option value="gravel">Gravel</option>
          <option value="patio">Patio</option>
          <option value="mixed">Mixed</option>
        </select>
      </label>
      <label className="block">
        Daylight
        <select
          className="mt-1 w-full rounded border border-border px-2 py-1"
          value={scene.daylight}
          onChange={(e) =>
            patch({ daylight: e.target.value as SceneContext["daylight"] })
          }
        >
          <option value="morning">Morning</option>
          <option value="midday">Bright day</option>
          <option value="evening">Warm evening</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={scene.showSilhouette}
          onChange={(e) => patch({ showSilhouette: e.target.checked })}
        />
        Scale silhouette
      </label>
    </div>
  );
}
