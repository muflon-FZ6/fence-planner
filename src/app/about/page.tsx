import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Fence Planner, a free A Double M utility tool.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary">About Fence Planner</h1>
      <p className="mt-4 text-foreground/75">
        Fence Planner & Material Calculator is a free A Double M utility. Draw or
        enter a fence layout, preview a finished look, and print a materials
        list — no account and no paid tiers.
      </p>
      <p className="mt-4 text-foreground/75">
        The product is supported by display advertising. Ads are kept outside the
        drawing canvas and print output so the planning experience stays usable.
      </p>
      <p className="mt-4 text-sm text-foreground/65">
        We built this because homeowners deserve a clearer answer than a single
        unexplained total — and because a visual layout beats a chat guess when
        you need to buy panels and posts.
      </p>
    </article>
  );
}
