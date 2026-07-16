"use client";

import { intentDefaults } from "@/domain/defaults";
import {
  projectFromYardShape,
  type YardShape,
} from "@/domain/presets";
import type { ProjectIntent } from "@/domain/types";
import { track } from "@/lib/analytics";
import { useProject } from "@/state/projectStore";

const INTENTS: { id: ProjectIntent; title: string; blurb: string }[] = [
  { id: "privacy", title: "More backyard privacy", blurb: "Defaults to a 6 ft privacy fence." },
  { id: "pets", title: "Keep pets or children safe", blurb: "Highlights solid gaps and gates." },
  { id: "replace", title: "Replace an existing fence", blurb: "Start from a practical layout." },
  { id: "boundary", title: "Define a property boundary", blurb: "Opens chain-link friendly defaults." },
  { id: "gate_area", title: "Add a gate or enclosed area", blurb: "Ready for gate placement." },
  { id: "pool_garden", title: "Pool or garden enclosure", blurb: "Enclosure-minded defaults." },
  { id: "modern", title: "Modern outdoor space", blurb: "Horizontal boards, darker finish." },
  { id: "calculate", title: "Just calculate materials", blurb: "Skip ahead to quick numbers." },
];

const SHAPES: { id: YardShape; title: string }[] = [
  { id: "straight", title: "Straight run" },
  { id: "l_shape", title: "L-shaped" },
  { id: "u_shape", title: "U-shaped backyard" },
  { id: "rectangle", title: "Rectangular enclosure" },
  { id: "side_yard", title: "Side-yard" },
  { id: "custom", title: "Custom (draw)" },
];

export function Onboarding({
  onDone,
  onQuick,
}: {
  onDone: () => void;
  onQuick: () => void;
}) {
  const { project, setIntent, replaceWith, updateSettings, setFenceType } =
    useProject();

  function chooseIntent(intent: ProjectIntent) {
    setIntent(intent);
    track("start_project", { intent });
    if (intent === "calculate") {
      onQuick();
      return;
    }
    const defaults = intentDefaults(intent);
    if (defaults.fenceType) setFenceType(defaults.fenceType);
    if (defaults.settings) updateSettings(defaults.settings);
  }

  function chooseShape(shape: YardShape) {
    if (shape === "custom") {
      onDone();
      track("choose_visual_mode");
      return;
    }
    const next = projectFromYardShape(shape, {
      fenceType: project.fenceType,
      intent: project.intent,
      unitSystem: project.unitSystem,
      name: project.name ?? "My Fence Plan",
    });
    replaceWith(next);
    track("choose_visual_mode", { shape });
    onDone();
  }

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h2 className="font-display text-2xl text-primary md:text-3xl">
          What are you creating?
        </h2>
        <p className="mt-1 text-sm text-foreground/70">
          Pick an intent for useful defaults — you can change everything later.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INTENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => chooseIntent(item.id)}
              className={`rounded-lg border p-3 text-left transition hover:border-primary ${
                project.intent === item.id
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-surface"
              }`}
            >
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="mt-1 text-xs text-foreground/60">{item.blurb}</p>
            </button>
          ))}
        </div>
      </div>

      {project.intent && project.intent !== "calculate" && (
        <div className="animate-fade-up">
          <h2 className="font-display text-2xl text-primary">
            Choose your space
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            Start from a yard shape — the Dream View appears immediately.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {SHAPES.map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => chooseShape(shape.id)}
                className="rounded-lg border border-border bg-surface p-4 text-left font-semibold transition hover:border-primary hover:bg-primary-soft/40"
              >
                {shape.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
