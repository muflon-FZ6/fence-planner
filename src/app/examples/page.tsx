import type { Metadata } from "next";
import Link from "next/link";
import { scenarioStudioEntries } from "@/content/scenarioStudio";
import { absoluteUrl, getSiteOrigin } from "@/lib/siteUrl";

const title = "Reference Scenario Studio";
const description =
  "Hypothetical planning examples backed by Fence Planner’s tested fixtures and shared materials calculator — not customer projects.";

export const metadata: Metadata = {
  title,
  description,
  ...(getSiteOrigin()
    ? {
        alternates: { canonical: "/examples" },
        openGraph: {
          title,
          description,
          type: "website",
          url: absoluteUrl("/examples"),
        },
      }
    : {}),
};

export default function ExamplesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary">{title}</h1>
      <p className="mt-3 max-w-3xl text-foreground/70">
        Each scenario is a reproducible fixture the planner can load after you
        confirm. Results come from the same calculation engine as the live tool —
        not stock photos or invented field stories.
      </p>
      <p className="mt-3 text-sm text-foreground/60">
        Looking for a pre-dig checklist? Try the{" "}
        <Link
          href="/build-readiness"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Build Readiness Audit
        </Link>
        .
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {scenarioStudioEntries.map((entry) => (
          <article
            key={entry.slug}
            className="flex flex-col rounded-lg border border-border bg-surface p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Hypothetical planning example
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold leading-[1.2]">
              <Link
                href={`/examples/${entry.slug}`}
                className="text-primary hover:underline"
              >
                {entry.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-foreground/70">{entry.description}</p>
            <p className="mt-3 text-sm text-foreground/80">
              <span className="font-semibold">Question: </span>
              {entry.question}
            </p>
            <Link
              href={`/examples/${entry.slug}`}
              className="mt-4 inline-block text-sm font-semibold text-primary"
            >
              Open scenario →
            </Link>
          </article>
        ))}
      </div>

      <aside className="mt-10 rounded-xl border border-border bg-[#f6f3ec] p-4 text-sm text-foreground/75">
        <p className="font-semibold text-foreground">Not modeled here</p>
        <p className="mt-2">
          Stepped vs racked slope (FP-RS-04) has no planner fixture because the
          current project model has no slope fields. See the{" "}
          <Link
            href="/guides/plan-fence-on-sloped-ground"
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            slope guide
          </Link>{" "}
          for a decision lab that stays honest about that limit.
        </p>
      </aside>
    </div>
  );
}
