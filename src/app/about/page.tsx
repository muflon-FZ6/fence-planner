import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, getSiteOrigin } from "@/lib/siteUrl";

const title = "About Fence Planner";
const description =
  "Fence Planner is a free DoubleM utility for layout and materials estimates — not a surveyor, permit office, or installer. Corrections welcome.";

export const metadata: Metadata = {
  title: "About",
  description,
  ...(getSiteOrigin()
    ? {
        alternates: { canonical: "/about" },
        openGraph: {
          title,
          description,
          type: "website",
          url: absoluteUrl("/about"),
        },
      }
    : {}),
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary">{title}</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Fence Planner, published by DoubleM ·{" "}
        <a
          href="mailto:hello@doublem.ca"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          hello@doublem.ca
        </a>
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">
        What Fence Planner is
      </h2>
      <p className="mt-3 text-foreground/75">
        A free local-browser planning and materials-estimation tool. Draw or enter
        a fence layout, preview a finished look, and print a materials list — no
        account and no paid tiers.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">
        What it is not
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground/75">
        <li>Not an installer, surveyor, or engineer</li>
        <li>Not a permit authority or jurisdiction lookup</li>
        <li>Not a utility-locate service</li>
        <li>Not a manufacturer or live price/inventory service</li>
      </ul>

      <h2 className="mt-8 font-display text-2xl text-primary">
        How calculations and guides are prepared
      </h2>
      <p className="mt-3 text-foreground/75">
        Estimates use documented formulas with editable assumptions and automated
        tests. Guides cite primary sources where product, safety, or permit{" "}
        <em>processes</em> are discussed. AI may assist drafts; human review happens
        before publication. See{" "}
        <Link
          href="/methodology"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Methodology
        </Link>{" "}
        for the calculation contract and editorial notes.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">Corrections</h2>
      <p className="mt-3 text-foreground/75">
        Corrections and source updates are welcome. Contact us at{" "}
        <Link
          href="/contact"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          /contact
        </Link>{" "}
        or{" "}
        <a
          href="mailto:hello@doublem.ca"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          hello@doublem.ca
        </a>
        . Guide “Updated” dates change only for substantive edits.
      </p>

      <h2 className="mt-8 font-display text-2xl text-primary">Advertising</h2>
      <p className="mt-3 text-foreground/75">
        Display ads support the free product. Ads stay outside the drawing canvas,
        core task outputs (estimates, scenario results, readiness field kit), and
        print output so planning remains usable.
      </p>

      <p className="mt-8 text-sm text-foreground/65">
        Related tools:{" "}
        <Link href="/examples" className="underline underline-offset-2">
          Scenario Studio
        </Link>
        {" · "}
        <Link href="/build-readiness" className="underline underline-offset-2">
          Build Readiness Audit
        </Link>
        {" · "}
        <Link href="/guides" className="underline underline-offset-2">
          Guides
        </Link>
      </p>
    </article>
  );
}
