import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology & Assumptions",
  description:
    "How Fence Planner measures runs, calculates panels and posts, estimates concrete, and produces planning materials lists.",
};

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary md:text-4xl">
        Methodology & assumptions
      </h1>
      <p className="mt-4 text-foreground/75">
        Fence Planner is a free planning and materials-estimation tool. It is not
        a fence installer, engineer, surveyor, permit office, utility-locate
        service, or product manufacturer. Results are planning estimates you can
        reproduce from documented formulas and editable settings.
      </p>

      <h2 className="mt-10 font-display text-2xl text-primary">
        How this guide content is prepared
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        Calculator behavior is traced to source code and covered by automated
        tests. Official sources are cited when a guide discusses permits,
        utilities, or product requirements. Hypothetical reference examples are
        labeled as such. AI assistance may be used for drafting; claims and
        calculations require human review against the live tool before
        publication. Attribution:{" "}
        <Link href="/about" className="font-semibold text-primary underline-offset-2 hover:underline">
          Fence Planner
        </Link>
        .
      </p>

      <h2 className="mt-10 font-display text-2xl text-primary">
        Plan run length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        <strong>Plan run length</strong> is measured along the proposed fence
        centerline between endpoint markers on the plan. It is not a legal
        survey boundary and not an outside-to-outside installed dimension.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">
        Panel modules and pitch
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        Two stored modes are available:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
        <li>
          <strong>Panel itself</strong> (<code>panel_only</code>, default):
          entered width is the panel; calculated pitch = panel width + post
          face (default 96 in + 4 in = 100 in).
        </li>
        <li>
          <strong>Complete module</strong> (<code>includes_post</code>): entered
          width is already the repeating pitch.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        The planner shows the calculated pitch beside these controls. Fill is
        divided per gate-free segment. When a remainder above 0.5 in creates a
        cut bay, the shopping list reports both the{" "}
        <strong>pitch remainder</strong> (center-to-center distance left after
        full modules) and the <strong>calculated clear panel space</strong>{" "}
        (pitch remainder minus one full post face for equal square posts). That
        clear space is not a guaranteed field cut width — product fitting
        allowance still applies. Cut bays are still purchased as whole stock
        panels.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">
        Gates and fill
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        <strong>Planned gate opening width</strong> is removed from fence fill
        and splits a run into fill segments. It is not modeled as leaf width,
        kit width, or guaranteed finished clear passage. Swing direction is
        visual in Dream View only.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">
        Posts and shared joints
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        Posts are classified from geometry: line, corner, end, gate, terminal
        (chain-link), and structure. Shared joints are counted once. When roles
        coincide, priority is gate &gt; corner &gt; end &gt; structure &gt;
        terminal &gt; line.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        For panel systems, every purchased bay has posts at both ends. If a cut
        remainder creates an extra bay, a post is placed at the last full-module
        boundary before that cut (for example, at 900 in on a 960 in run with a
        100 in module).
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        Structure connections exist in project data and exclude a purchased /
        concreted post, but Plan View does not yet provide a control to create
        them interactively.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">
        Wood and chain-link spacing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        Site-built wood and chain-link use editable <strong>on-center</strong>{" "}
        post spacing (defaults 8 ft wood, 10 ft chain-link).
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">Concrete</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        Volume per post = cylindrical hole − square post displacement. Project
        total is rounded up once to whole bags. Hole diameter, depth, post face,
        and bag yield are editable in the planner and on the{" "}
        <Link
          href="/concrete-for-fence-posts-calculator"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          concrete calculator
        </Link>
        . The 0.33 cu ft value is a <strong>planning default</strong> — enter the
        yield printed on your product. Optional concrete waste is off by default.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">Waste</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        Default waste percentage is 5%. By default it applies to pickets/rails
        (and related wood fill) and not to panels or concrete. Fastener pack
        rounding may still use the waste percentage. This is not a cutting-stock
        optimizer.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">
        Materials cost estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        After quantities are calculated, Fence Planner can show an{" "}
        <strong>indicative materials cost range</strong> for the United States
        (USD) or Canada (CAD). Totals use dated retail observations and
        substitution / conversion fallbacks when an exact local SKU is missing.
        Currencies are never mixed. You can override any unit price; your
        override wins. Estimates exclude tax, delivery, labor, permits, tool
        rental, and site work unless you add them. They are{" "}
        <strong>not live retailer quotes</strong> or inventory checks—confirm
        prices at your store before buying. Freshness labels and match warnings
        appear in the shopping list when a price is approximate, converted, or
        stale.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">Chain-link</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        Calculated: fabric fill after gates, fabric rolls, top-rail sections,
        ties, line and terminal posts, tension-wire flag, estimated tension bars
        / brace bands, and gate hardware. Not a complete fittings catalog (for
        example loop-cap and brace-rail SKUs are not fully modeled).
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">
        What the tool does not do
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
        <li>Slope / stepped / racked geometry</li>
        <li>Curves</li>
        <li>Frost-line lookup</li>
        <li>Utility locate or digging clearance</li>
        <li>Legal property boundaries</li>
        <li>Structural engineering</li>
        <li>
          Live store quotes or real-time retailer inventory (regional estimate
          bands only)
        </li>
        <li>Arbitrary user share URLs (predefined example loaders only)</li>
      </ul>

      <h2 className="mt-8 font-display text-2xl text-primary">
        Reference scenarios
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        Predefined hypothetical examples (FP-RS-01, 02, 03, 05, 06) can be loaded
        from the planner with an explicit confirmation. They never overwrite your
        plan merely because a URL was opened. Slope scenario FP-RS-04 is not
        representable. Scenarios are covered by automated tests.
      </p>

      <p className="mt-10 text-xs text-foreground/50">
        See also the{" "}
        <Link href="/guides" className="underline underline-offset-2">
          planning guides
        </Link>{" "}
        and{" "}
        <Link href="/about" className="underline underline-offset-2">
          About
        </Link>
        .
      </p>
    </article>
  );
}
