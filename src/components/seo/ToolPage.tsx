import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";

type ToolPageProps = {
  title: string;
  description: string;
  defaultsNote: string;
  href: string;
  bullets: string[];
};

export function ToolPage({
  title,
  description,
  defaultsNote,
  href,
  bullets,
}: ToolPageProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary md:text-4xl">{title}</h1>
      <p className="mt-3 text-foreground/75">{description}</p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-foreground/80">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-foreground/65">{defaultsNote}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={href}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Open calculator
        </Link>
        <Link
          href="/fence-planner"
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
        >
          Open visual planner
        </Link>
      </div>
      <AdSlot slot="below-results" className="mt-8" />
      <p className="mt-6 text-xs text-foreground/50">
        Planning estimates only. Verify product dimensions, permits, and site
        conditions before building.
      </p>
    </article>
  );
}
