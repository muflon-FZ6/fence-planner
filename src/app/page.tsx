import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { guides, estimateReadingMinutes } from "@/content/guides";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fence Planner & Material Calculator",
    applicationCategory: "UtilitiesApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Draw a fence layout, preview styles, and get a free material estimate.",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-border">
        {/* Soft organic wash — matches banner art */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#f7f4ee]" aria-hidden />
        <div
          className="pointer-events-none absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#d7ebe0]/70 blur-3xl md:h-[36rem] md:w-[36rem]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -right-20 h-[22rem] w-[22rem] rounded-full bg-[#e2efe8]/55 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[18%] left-[38%] hidden h-px w-[28%] rotate-[-8deg] bg-gradient-to-r from-transparent via-border to-transparent md:block"
          aria-hidden
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-12 md:px-6 md:py-16 lg:py-20">
          <div className="animate-fade-up relative z-10">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              <FenceMark className="size-4 shrink-0 text-primary" />
              Measure. Plan. Build.
            </p>
            <p className="mt-4 font-display text-5xl leading-[1.05] tracking-tight text-primary md:text-6xl lg:text-7xl">
              Fence Planner
            </p>
            <h1 className="mt-4 max-w-lg font-display text-2xl leading-snug text-foreground md:text-3xl">
              See your fence before you build it.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground/70">
              Draw the layout, explore styles, place gates and get the complete
              material plan—plus a regional cost estimate for the US and
              Canada—free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/fence-planner"
                className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(31,92,69,0.22)] transition hover:bg-primary-hover"
              >
                Start My Fence Plan
              </Link>
              <Link
                href="/fence-calculator"
                className="rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground/85 shadow-[0_4px_14px_rgba(28,36,32,0.06)] transition hover:border-primary/35 hover:bg-surface-muted"
              >
                Calculate Materials Only
              </Link>
            </div>
            <p className="mt-10 text-sm text-foreground/45">
              A better build starts with a better measurement.
            </p>
          </div>

          <div className="animate-soft-rise relative mx-auto w-full max-w-xl md:max-w-none">
            <div className="relative overflow-hidden rounded-[1.35rem] border-[6px] border-white bg-surface shadow-[0_22px_50px_rgba(28,36,32,0.14)] ring-1 ring-black/5">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/hero/fence-build-scene.png"
                  alt="Backyard fence under construction with a site plan on a workbench"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 52vw"
                />
              </div>
              <div className="absolute bottom-4 right-4 max-w-[13.5rem] rounded-xl bg-white/95 px-3.5 py-3 shadow-[0_10px_24px_rgba(28,36,32,0.12)] backdrop-blur-sm sm:bottom-5 sm:right-5 sm:max-w-[15rem] sm:px-4 sm:py-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  Build-ready
                </p>
                <p className="mt-1 font-display text-base leading-snug text-primary sm:text-lg">
                  Start with a clear plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <AdSlot slot="landing-below" />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <h2 className="font-display text-2xl text-primary">
          Fence planning guides
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Practical explainers that connect measurements to materials — not thin
          keyword pages.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.slice(0, 6).map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:border-primary"
            >
              {guide.image ? (
                <div className="aspect-[16/9] overflow-hidden border-b border-border">
                  <Image
                    src={guide.image}
                    alt=""
                    width={640}
                    height={360}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
        <Link
          href="/guides"
          className="mt-6 inline-block text-sm font-semibold text-primary transition hover:text-primary-hover"
        >
          View all guides →
        </Link>
      </section>
    </div>
  );
}

function FenceMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M1 14.5V4.5M5.5 14.5V2.5M10 14.5V4.5M14.5 14.5V2.5M19 14.5V4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M1 7h18M1 11h18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
