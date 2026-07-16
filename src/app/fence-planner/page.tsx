"use client";

import { Suspense } from "react";
import { ProjectProvider } from "@/state/projectStore";
import { Workspace } from "@/components/planner/Workspace";

export default function FencePlannerPage() {
  return (
    <ProjectProvider>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-foreground/60">
            Loading planner…
          </div>
        }
      >
        <Workspace />
      </Suspense>
    </ProjectProvider>
  );
}
