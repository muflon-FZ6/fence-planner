import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { GuideExampleCta } from "@/components/planner/ExampleLoader";
import { PanelModuleExplorer } from "@/components/guides/PanelModuleExplorer";
import { SlopeDecisionLab } from "@/components/guides/SlopeDecisionLab";
import type { GuideBlock, GuideCalloutTone } from "@/content/guides/types";

const calloutStyles: Record<GuideCalloutTone, string> = {
  tip: "border-accent-teal/40 bg-[#eef7f3]",
  warn: "border-amber-500/40 bg-amber-50",
  note: "border-border bg-[#f6f3ec]",
};

function renderBlock(block: GuideBlock, key: string): ReactNode {
  switch (block.type) {
    case "p":
      return (
        <p key={key} className="text-foreground/85">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2
          key={key}
          className="font-display pt-4 text-2xl text-primary first:pt-0"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={key} className="pt-2 text-lg font-semibold text-foreground">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul key={key} className="list-disc space-y-2 pl-5 marker:text-primary">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol
          key={key}
          className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-primary"
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "callout": {
      const tone = block.tone ?? "note";
      return (
        <aside
          key={key}
          className={`rounded-lg border px-4 py-3 ${calloutStyles[tone]}`}
        >
          <p className="text-sm font-semibold text-foreground">{block.title}</p>
          <p className="mt-1 text-sm text-foreground/80">{block.text}</p>
        </aside>
      );
    }
    case "example":
      return (
        <figure
          key={key}
          className="rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)]"
        >
          <figcaption className="font-display text-lg text-primary">
            {block.title}
          </figcaption>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-foreground/55">
            Assumptions
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {block.assumptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-foreground/55">
            Steps
          </p>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
            {block.steps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="mt-4 rounded-md bg-[#eef7f3] px-3 py-2 text-sm font-medium text-primary">
            {block.result}
          </p>
        </figure>
      );
    case "table":
      return (
        <figure key={key} className="overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse text-sm">
            <caption className="mb-2 text-left text-sm font-semibold text-foreground">
              {block.caption}
            </caption>
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="border border-border bg-surface-muted px-2 py-1.5 text-left font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={`${ri}-${ci}`}
                      className="border border-border px-2 py-1.5"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      );
    case "figure":
      return (
        <figure
          key={key}
          className="overflow-hidden rounded-xl border border-border"
        >
          <Image
            src={block.src}
            alt={block.alt}
            width={960}
            height={540}
            className="h-auto w-full object-contain bg-[#faf8f4]"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <figcaption className="border-t border-border px-3 py-2 text-sm text-foreground/70">
            {block.caption}
            {block.credit ? (
              <span className="mt-1 block text-xs text-foreground/50">
                {block.credit}
              </span>
            ) : null}
          </figcaption>
        </figure>
      );
    case "panel_module_explorer":
      return (
        <div key={key}>
          <PanelModuleExplorer
            defaultRunLength={block.defaultRunLength}
            defaultEnteredWidth={block.defaultEnteredWidth}
            defaultPostFace={block.defaultPostFace}
            defaultMode={block.defaultMode}
          />
        </div>
      );
    case "slope_decision_lab":
      return (
        <div key={key}>
          <SlopeDecisionLab
            defaultHorizontalFeet={block.defaultHorizontalFeet}
            defaultRiseInches={block.defaultRiseInches}
            defaultBayFeet={block.defaultBayFeet}
          />
        </div>
      );
    case "formula":
      return (
        <figure
          key={key}
          className="rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)]"
        >
          <figcaption className="font-display text-lg text-primary">
            {block.title}
          </figcaption>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-foreground/55">
            Inputs
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {block.inputs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-foreground/55">
            Formula steps
          </p>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
            {block.steps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          {block.rounding ? (
            <p className="mt-3 text-sm text-foreground/70">
              <span className="font-semibold">Rounding: </span>
              {block.rounding}
            </p>
          ) : null}
          <p className="mt-4 rounded-md bg-[#eef7f3] px-3 py-2 text-sm font-medium text-primary">
            {block.result}
          </p>
        </figure>
      );
    case "scenario":
      return (
        <div key={key}>
          <GuideExampleCta exampleId={block.exampleId} label={block.label} />
        </div>
      );
    case "sources":
      return (
        <section
          key={key}
          className="rounded-xl border border-border bg-surface p-4"
          aria-label={block.title ?? "Sources"}
        >
          <h3 className="font-display text-lg text-primary">
            {block.title ?? "Sources"}
          </h3>
          <ul className="mt-3 space-y-3 text-sm">
            {block.sources.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {s.title}
                </a>
                <span className="text-foreground/70">
                  {" "}
                  — {s.organization}
                </span>
                <span className="mt-0.5 block text-xs text-foreground/50">
                  Checked {s.checked}
                </span>
                {s.note ? (
                  <span className="mt-1 block text-foreground/75">{s.note}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      );
    case "readiness_audit_cta":
      return (
        <p key={key} className="not-prose mt-2">
          <Link
            href="/build-readiness"
            className="inline-flex rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {block.label ?? "Open the Build Readiness Audit"}
          </Link>
          <span className="mt-2 block text-xs text-foreground/55">
            Printable field kit — answers stay in your browser.
          </span>
        </p>
      );
    default:
      return null;
  }
}

export function GuideBody({ body }: { body: GuideBlock[] }) {
  return (
    <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-foreground/85">
      {body.map((block, index) => renderBlock(block, `${block.type}-${index}`))}
    </div>
  );
}

export function RelatedGuides({
  slugs,
  titles,
}: {
  slugs: string[];
  titles: Record<string, string>;
}) {
  if (!slugs.length) return null;
  return (
    <nav className="mt-10 border-t border-border pt-6" aria-label="Related guides">
      <h2 className="font-display text-xl text-primary">Related guides</h2>
      <ul className="mt-3 space-y-2">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={`/guides/${slug}`}
              className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
            >
              {titles[slug] ?? slug}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
