import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { ConcreteCalculator } from "@/components/calculators/ConcreteCalculator";

export const metadata: Metadata = {
  title: "Concrete for Fence Posts Calculator",
  description:
    "Calculate concrete bags from hole diameter, depth, post size, post count, and bag yield — same formula as Fence Planner.",
};

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary md:text-4xl">
        Concrete for Fence Posts Calculator
      </h1>
      <p className="mt-3 text-foreground/75">
        Hole volume minus buried post volume, times post count, divided by bag
        yield — rounded up once for the whole project. Uses the same calculation
        function as the visual planner.
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-foreground/80">
        <li>Editable hole diameter and depth</li>
        <li>Actual square post face for displacement</li>
        <li>Editable bag yield (planning default 0.33 cu ft)</li>
        <li>Optional contingency/waste (off by default)</li>
      </ul>
      <p className="mt-4 text-sm text-foreground/65">
        Hole depth is an editable assumption. Frost depth is local — verify before
        digging. Enter the yield printed on your selected product; the default is
        not a brand or bag-weight fact.
      </p>

      <div className="mt-8">
        <ConcreteCalculator />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/fence-planner"
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
        >
          Open visual planner
        </Link>
        <Link
          href="/methodology"
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
        >
          Methodology
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
