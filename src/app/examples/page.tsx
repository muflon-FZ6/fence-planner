import type { Metadata } from "next";
import Link from "next/link";
import { examples } from "@/content/examples";

export const metadata: Metadata = {
  title: "Worked Fence Examples",
  description:
    "Sample fence layouts with assumptions, material highlights, and links into the planner.",
};

export default function ExamplesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary">Worked examples</h1>
      <p className="mt-3 text-foreground/70">
        High-quality sample projects — open a similar configuration in the
        planner to customize.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {examples.map((ex) => (
          <article
            key={ex.slug}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <h2 className="font-display text-2xl font-semibold leading-[1.2]">
              {ex.title}
            </h2>
            <p className="mt-2 text-sm text-foreground/70">{ex.summary}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-foreground/50">
              Assumptions
            </p>
            <ul className="mt-1 list-disc pl-4 text-sm text-foreground/75">
              {ex.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-foreground/50">
              Highlights
            </p>
            <ul className="mt-1 list-disc pl-4 text-sm text-foreground/75">
              {ex.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <Link
              href={`/fence-planner?${ex.plannerQuery}`}
              className="mt-4 inline-block text-sm font-semibold text-primary"
            >
              Open in planner →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
