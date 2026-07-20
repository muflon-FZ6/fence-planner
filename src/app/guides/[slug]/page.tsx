import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { GuideBody, RelatedGuides } from "@/components/guides/GuideBody";
import {
  estimateReadingMinutes,
  getGuide,
  guides,
} from "@/content/guides";
import { absoluteUrl, getSiteOrigin } from "@/lib/siteUrl";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const canonicalPath = `/guides/${slug}`;
  const origin = getSiteOrigin();
  return {
    title: guide.title,
    description: guide.description,
    alternates: origin
      ? { canonical: canonicalPath }
      : undefined,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: absoluteUrl(canonicalPath),
      images: guide.image ? [guide.image] : undefined,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const readingMinutes = estimateReadingMinutes(guide);
  const pageUrl = absoluteUrl(`/guides/${slug}`);
  const related = (guide.relatedGuides ?? []).filter((s) =>
    guides.some((g) => g.slug === s),
  );
  const relatedTitles = Object.fromEntries(
    guides.map((g) => [g.slug, g.title]),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updated,
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
    image: guide.image ? absoluteUrl(guide.image) : undefined,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Guides",
        item: absoluteUrl("/guides"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: guide.title,
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
        <Link href="/guides">Guides</Link>
        <span aria-hidden> / </span>
        <span>{guide.title}</span>
      </nav>
      <h1 className="mt-3 font-display text-3xl text-primary md:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-lg text-foreground/75">{guide.description}</p>
      <p className="mt-2 text-xs text-foreground/50">
        By{" "}
        <Link href="/about" className="underline underline-offset-2">
          Fence Planner
        </Link>
        {" · "}
        {readingMinutes} min read · Updated {guide.updated}
      </p>
      {guide.image ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <Image
            src={guide.image}
            alt=""
            width={960}
            height={540}
            className="h-auto w-full object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <GuideBody body={guide.body} />

      <RelatedGuides slugs={related} titles={relatedTitles} />

      <AdSlot slot="guide-inline" className="mt-10" />

      {guide.relatedTool && (
        <Link
          href={guide.relatedTool}
          className="mt-8 inline-block rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Open related tool
        </Link>
      )}

      <p className="mt-8 text-xs leading-relaxed text-foreground/50">
        Educational planning content only. Not a substitute for local codes,
        surveys, engineering, or professional advice. See{" "}
        <Link href="/methodology" className="underline underline-offset-2">
          Methodology
        </Link>{" "}
        for how this guide was prepared and how the calculator works.
      </p>
    </article>
  );
}
