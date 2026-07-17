"use client";

import dynamic from "next/dynamic";
import { ProjectProvider } from "@/state/projectStore";

function PlannerLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-foreground/60">
      Restoring your local project…
    </div>
  );
}

/** localStorage-backed planner — skip SSR so server HTML cannot disagree with the client. */
const Workspace = dynamic(
  () =>
    import("@/components/planner/Workspace").then((module) => module.Workspace),
  { ssr: false, loading: () => <PlannerLoading /> },
);

export default function FencePlannerPage() {
  return (
    <ProjectProvider>
      <Workspace />
    </ProjectProvider>
  );
}
