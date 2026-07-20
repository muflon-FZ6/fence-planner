"use client";

import { IntentIllustration } from "@/components/planner/IntentIllustration";
import { projectFromIntent } from "@/domain/presets";
import type { ProjectIntent } from "@/domain/types";
import { track } from "@/lib/analytics";
import { useProject } from "@/state/projectStore";

const SCENARIOS: {
  id: ProjectIntent;
  title: string;
  blurb: string;
  templateNote: string;
}[] = [
  {
    id: "privacy",
    title: "More backyard privacy",
    blurb: "Tall wood panels around a U-shaped yard.",
    templateNote: "6 ft privacy · U-shaped layout",
  },
  {
    id: "pets",
    title: "Keep pets or children safe",
    blurb: "Enclosed yard with a walk gate and solid boards.",
    templateNote: "Enclosed yard · single gate",
  },
  {
    id: "replace",
    title: "Replace an existing fence",
    blurb: "Practical L-shaped layout ready to remeasure.",
    templateNote: "L-shape · panel system",
  },
  {
    id: "boundary",
    title: "Define a property boundary",
    blurb: "Straight run with chain-link defaults.",
    templateNote: "Straight run · chain link",
  },
  {
    id: "gate_area",
    title: "Add a gate or enclosed area",
    blurb: "U-shaped yard with a wide double gate opening.",
    templateNote: "U-shape · double gate",
  },
  {
    id: "pool_garden",
    title: "Pool or garden enclosure",
    blurb: "Full enclosure with patio context and a gate.",
    templateNote: "Rectangle · enclosure",
  },
  {
    id: "modern",
    title: "Modern outdoor space",
    blurb: "Horizontal boards, darker finish, clean lines.",
    templateNote: "Horizontal wood · charcoal",
  },
  {
    id: "calculate",
    title: "Just calculate materials",
    blurb: "Skip the drawing board — enter lengths for a fast list.",
    templateNote: "Quick estimate mode",
  },
];

export function Onboarding({
  onDone,
  onQuick,
}: {
  onDone: () => void;
  onQuick: () => void;
}) {
  const { project, replaceWith } = useProject();

  function startScenario(intent: ProjectIntent) {
    track("start_project", { intent });

    if (intent === "calculate") {
      onQuick();
      return;
    }

    const next = projectFromIntent(intent, {
      unitSystem: project.unitSystem,
      name: project.name?.trim() || undefined,
    });
    replaceWith(next);
    track("choose_visual_mode", { intent, template: "intent" });
    onDone();
  }

  return (
    <div className="animate-fade-up mx-auto max-w-5xl space-y-8">
      <div>
        <h2 className="font-display text-2xl text-primary md:text-3xl">
          What are you creating?
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-foreground/70">
          Pick a backyard scenario. Each card starts a ready-made layout you can
          edit — rename the plan anytime from the toolbar above. Posts, gates,
          and materials update immediately.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SCENARIOS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => startScenario(item.id)}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <div className="aspect-[5/3] overflow-hidden border-b border-border">
              <IntentIllustration intent={item.id} />
            </div>
            <div className="flex flex-1 flex-col p-3">
              <p className="font-semibold text-sm leading-snug group-hover:text-primary">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-foreground/65">{item.blurb}</p>
              <p className="mt-auto pt-3 text-[11px] font-semibold uppercase tracking-wide text-accent-teal">
                {item.templateNote}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
