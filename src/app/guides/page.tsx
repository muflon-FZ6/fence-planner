import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { guides } from "@/content/guides";

export const metadata: Metadata = {
  title: "Fence Planning Guides",
  description:
    "Original guides on measuring, posts, panels, concrete, gates, and common planning mistakes.",
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary md:text-4xl">
        Fence Planning Guides
      </h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Practical explanations that connect to the free planner — diagrams in
        words, assumptions called out, and links into working tool states.
      </p>
      <AdSlot slot="guide-inline" className="my-6" />
      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="rounded-lg border border-border bg-surface p-4 hover:border-primary"
          >
            <h2 className="font-semibold">{guide.title}</h2>
            <p className="mt-2 text-sm text-foreground/65">{guide.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
