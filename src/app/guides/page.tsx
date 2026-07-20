import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { guides, estimateReadingMinutes } from "@/content/guides";

export const metadata: Metadata = {
  title: "Fence planning, without the contractor talk",
  description:
    "Start with your yard, privacy needs, and gates. Practical fence guides for a first plan—plus what still needs a local or product-specific check.",
};

const BROWSE_ROWS: { question: string; start: string; href: string }[] = [
  {
    question: "Where can my fence go?",
    start: "Permit and property-line checklist, then utility locating",
    href: "/guides/fence-permit-and-property-line-checklist",
  },
  {
    question: "What should I measure?",
    start: "How to measure for a new fence",
    href: "/guides/how-to-measure-for-a-new-fence",
  },
  {
    question: "How many posts and panels might I need?",
    start: "Panels and posts, then post spacing",
    href: "/guides/how-to-calculate-fence-panels-and-posts",
  },
  {
    question: "Where should the gate and corners go?",
    start: "Gate planning, then corners and end posts",
    href: "/guides/measure-and-plan-a-fence-gate",
  },
  {
    question: "What should I buy?",
    start: "Concrete, materials checklists, waste, and shopping list",
    href: "/guides/fence-project-shopping-list",
  },
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary md:text-4xl">
        Fence planning, without the contractor talk
      </h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        You do not need to know every fence term before you begin. Start with the
        shape of your yard, the kind of privacy or enclosure you want, and the
        places people need to pass through. These guides help you make a sensible
        first plan, understand what the calculator can estimate, and know what
        still needs a local or product-specific check.
      </p>

      <section className="mt-8 max-w-3xl">
        <h2 className="font-display text-xl text-primary">
          Browse by the question you have
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse text-sm">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="border border-border bg-surface-muted px-3 py-2 text-left font-semibold"
                >
                  If you are wondering…
                </th>
                <th
                  scope="col"
                  className="border border-border bg-surface-muted px-3 py-2 text-left font-semibold"
                >
                  Start here
                </th>
              </tr>
            </thead>
            <tbody>
              {BROWSE_ROWS.map((row) => (
                <tr key={row.question}>
                  <td className="border border-border px-3 py-2 align-top">
                    {row.question}
                  </td>
                  <td className="border border-border px-3 py-2 align-top">
                    <Link
                      href={row.href}
                      className="font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      {row.start}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot slot="guide-inline" className="my-8" />

      <h2 className="font-display text-xl text-primary">All guides</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface hover:border-primary"
          >
            {guide.image ? (
              <div className="aspect-[16/9] overflow-hidden border-b border-border">
                <Image
                  src={guide.image}
                  alt=""
                  width={640}
                  height={360}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            ) : null}
            <div className="p-6">
              <h3 className="font-display text-2xl font-semibold leading-[1.2]">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/65">
                {guide.description}
              </p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-foreground/45">
                {estimateReadingMinutes(guide)} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
