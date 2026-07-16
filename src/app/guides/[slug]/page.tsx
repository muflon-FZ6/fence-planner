import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { getGuide, guides } from "@/content/guides";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-xs text-foreground/55">
        <Link href="/guides">Guides</Link> / {guide.title}
      </nav>
      <h1 className="mt-3 font-display text-3xl text-primary">{guide.title}</h1>
      <p className="mt-3 text-foreground/75">{guide.description}</p>
      <div className="prose mt-8 space-y-4 text-sm leading-relaxed text-foreground/85">
        {guide.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {guide.relatedTool && (
        <Link
          href={guide.relatedTool}
          className="mt-8 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Open related tool
        </Link>
      )}
      <AdSlot slot="guide-inline" className="mt-8" />
      <p className="mt-6 text-xs text-foreground/50">
        Educational planning content only. Not a substitute for local codes,
        surveys, or professional advice.
      </p>
    </article>
  );
}
