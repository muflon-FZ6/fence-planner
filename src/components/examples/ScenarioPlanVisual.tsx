"use client";

import { PlanDiagram } from "@/canvas/plan/PlanDiagram";
import type { FenceProject } from "@/domain/types";

/** Client boundary wrapper so scenario pages can render PlanDiagram. */
export function ScenarioPlanVisual({
  project,
  textAlternative,
}: {
  project: FenceProject;
  textAlternative: string;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-surface">
      <PlanDiagram project={project} className="print:break-inside-avoid" />
      <figcaption className="border-t border-border px-3 py-2 text-sm text-foreground/70">
        {textAlternative}
      </figcaption>
    </figure>
  );
}
