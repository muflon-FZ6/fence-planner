import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { guides } from "@/content/guides";

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
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "linear-gradient(160deg, #dceee4 0%, #f6f3ec 45%, #e8dcc8 100%)",
          }}
        />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center md:px-6 md:py-20">
          <div className="animate-fade-up">
            <p className="font-display text-4xl leading-tight text-primary md:text-6xl">
              Fence Planner
            </p>
            <h1 className="mt-3 font-display text-2xl text-foreground md:text-3xl">
              See your fence before you build it.
            </h1>
            <p className="mt-4 max-w-md text-foreground/75">
              Draw the layout, explore styles, place gates and get the complete
              material plan—free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/fence-planner"
                className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Start My Fence Plan
              </Link>
              <Link
                href="/fence-calculator"
                className="rounded-md border border-border bg-surface px-5 py-3 text-sm font-semibold"
              >
                Calculate Materials Only
              </Link>
            </div>
          </div>
          <div className="animate-soft-rise rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)]">
            <HeroScene />
            <ol className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-foreground/80">
              <li>1. Draw your space</li>
              <li>2. See the finished fence</li>
              <li>3. Print the build plan</li>
            </ol>
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
              className="rounded-lg border border-border bg-surface p-4 transition hover:border-primary"
            >
              <h3 className="font-semibold">{guide.title}</h3>
              <p className="mt-2 text-sm text-foreground/65">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
        <Link
          href="/guides"
          className="mt-6 inline-block text-sm font-semibold text-primary"
        >
          View all guides →
        </Link>
      </section>
    </div>
  );
}

function HeroScene() {
  return (
    <svg viewBox="0 0 480 260" className="w-full" role="img" aria-label="Illustrated backyard fence scene">
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c5d9e3" />
          <stop offset="100%" stopColor="#f6f3ec" />
        </linearGradient>
      </defs>
      <rect width="480" height="260" fill="url(#heroSky)" rx="12" />
      <polygon points="40,180 240,240 440,180 240,120" fill="#6f9b6a" />
      <polygon points="180,90 260,50 300,90 220,130" fill="#d9d0c4" />
      <polygon points="80,170 200,200 200,120 80,95" fill="#b07a45" />
      <polygon points="200,200 360,170 360,100 200,120" fill="#8b5e34" />
      <rect x="250" y="145" width="36" height="40" fill="#c47b1a" opacity="0.9" />
      <text x="24" y="36" fill="#1f5c45" fontSize="14" fontFamily="var(--font-fraunces)">
        Interactive preview
      </text>
    </svg>
  );
}
