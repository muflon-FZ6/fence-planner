import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScenarioPlanVisual } from "@/components/examples/ScenarioPlanVisual";
import { RelatedGuides } from "@/components/guides/GuideBody";
import {
  getScenarioStudioEntry,
  scenarioStudioEntries,
} from "@/content/scenarioStudio";
import { guides } from "@/content/guides";
import { buildScenarioStudioSummary } from "@/domain/scenarioStudio";
import {
  REFERENCE_EXAMPLE_NOTICE,
  examplePlannerHref,
} from "@/domain/referenceScenarios";
import { absoluteUrl, getSiteOrigin } from "@/lib/siteUrl";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return scenarioStudioEntries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getScenarioStudioEntry(slug);
  if (!entry) return {};
  const canonicalPath = `/examples/${slug}`;
  const origin = getSiteOrigin();
  return {
    title: entry.title,
    description: entry.description,
    alternates: origin ? { canonical: canonicalPath } : undefined,
    openGraph: {
      title: entry.title,
      description: entry.description,
      type: "article",
      url: absoluteUrl(canonicalPath),
    },
  };
}

export default async function ScenarioStudioDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getScenarioStudioEntry(slug);
  if (!entry) notFound();

  const summary = buildScenarioStudioSummary(entry.id);
  const pageUrl = absoluteUrl(`/examples/${slug}`);
  const related = entry.relatedGuides.filter((s) =>
    guides.some((g) => g.slug === s),
  );
  const relatedTitles = Object.fromEntries(
    guides.map((g) => [g.slug, g.title]),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    dateModified: entry.updated,
    author: {
      "@type": "Organization",
      name: "Fence Planner",
      url: absoluteUrl("/about") ?? undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "Fence Planner",
      url: getSiteOrigin(),
    },
    mainEntityOfPage: pageUrl,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Examples",
        item: absoluteUrl("/examples"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: entry.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <nav className="text-xs text-foreground/55" aria-label="Breadcrumb">
        <Link href="/examples">Examples</Link>
        <span aria-hidden> / </span>
        <span>{entry.title}</span>
      </nav>

      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-800">
        Hypothetical planning example
      </p>
      <h1 className="mt-2 font-display text-3xl text-primary md:text-4xl">
        {entry.title}
      </h1>
      <p className="mt-3 text-lg text-foreground/75">{entry.description}</p>
      <p className="mt-2 text-xs text-foreground/50">
        Updated {entry.updated} ·{" "}
        <Link href="/methodology" className="underline underline-offset-2">
          Methodology
        </Link>
      </p>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-primary">
          Question this answers
        </h2>
        <p className="mt-2 text-foreground/85">{entry.question}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-primary">Assumptions</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground/85">
          {entry.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <p className="mt-3 rounded-md bg-[#f6f3ec] px-3 py-2 text-xs leading-relaxed text-foreground/70">
          {REFERENCE_EXAMPLE_NOTICE}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-primary">Plan view</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Deterministic diagram from the same fixture the planner loads — not a
          photo of a finished job.
        </p>
        <div className="mt-4">
          <ScenarioPlanVisual
            project={summary.project}
            textAlternative={entry.heroAlt}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-primary">
          Calculator result
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          Derived with the shared materials engine — not hard-coded in this page.
        </p>
        <ul className="mt-4 space-y-2 rounded-xl border border-border bg-surface p-4 text-sm text-foreground/85">
          {summary.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="font-semibold text-primary" aria-hidden>
                ·
              </span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse text-sm">
            <caption className="mb-2 text-left text-sm font-semibold">
              Material lines from the estimate
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="border border-border bg-surface-muted px-2 py-1.5 text-left"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="border border-border bg-surface-muted px-2 py-1.5 text-left"
                >
                  Qty
                </th>
                <th
                  scope="col"
                  className="border border-border bg-surface-muted px-2 py-1.5 text-left"
                >
                  Unit
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.materialLines.map((line) => (
                <tr key={line.id}>
                  <td className="border border-border px-2 py-1.5">
                    {line.label}
                    {line.spec ? (
                      <span className="mt-0.5 block text-xs text-foreground/55">
                        {line.spec}
                      </span>
                    ) : null}
                  </td>
                  <td className="border border-border px-2 py-1.5">
                    {line.quantity}
                  </td>
                  <td className="border border-border px-2 py-1.5">
                    {line.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-primary">
          What this result means
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground/85">
          {entry.whatItMeans.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h3 className="mt-6 text-lg font-semibold">What this scenario shows</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-foreground/85">
          {entry.whatItShows.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-amber-500/40 bg-amber-50 p-4">
        <h2 className="font-display text-xl text-primary">
          What this does not prove
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/85">
          {entry.limitations.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-display text-xl text-primary">
          Open this exact example in the planner
        </h2>
        <p className="mt-2 text-sm text-foreground/75">
          Loads a <strong>hypothetical planning example</strong>. If you already
          have a plan in this browser, you will be asked to confirm before
          anything is replaced.
        </p>
        <Link
          href={examplePlannerHref(entry.id)}
          className="mt-4 inline-flex rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Open in planner
        </Link>
      </section>

      <RelatedGuides slugs={related} titles={relatedTitles} />

      <p className="mt-10 text-xs text-foreground/55">
        Calculations follow{" "}
        <Link href="/methodology" className="underline underline-offset-2">
          published methodology
        </Link>
        . Corrections welcome via{" "}
        <Link href="/contact" className="underline underline-offset-2">
          contact
        </Link>
        .
      </p>
    </article>
  );
}
