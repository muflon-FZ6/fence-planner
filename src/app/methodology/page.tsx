import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology & Assumptions",
  description:
    "How Fence Planner calculates posts, panels, rails, fabric, concrete, and waste.",
};

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 prose-sm">
      <h1 className="font-display text-3xl text-primary">Methodology & assumptions</h1>
      <p className="mt-4 text-foreground/75">
        All calculations are transparent and editable. Internal measurements are
        stored in inches and converted for display.
      </p>
      <h2 className="mt-8 font-display text-xl text-primary">Posts</h2>
      <p className="mt-2 text-sm text-foreground/80">
        Posts are classified from geometry: line, corner, end, gate, terminal,
        and structure connections. Shared joints are counted once.
      </p>
      <h2 className="mt-6 font-display text-xl text-primary">Panels</h2>
      <p className="mt-2 text-sm text-foreground/80">
        Fill length excludes gates. Each segment is divided by the module width
        (panel-only + post, or includes-post). Remainders become cut panels.
      </p>
      <h2 className="mt-6 font-display text-xl text-primary">Wood privacy</h2>
      <p className="mt-2 text-sm text-foreground/80">
        Spans come from post spacing; rails = spans × rails per span; pickets
        from picket width + gap along fill length. Waste applies only where enabled.
      </p>
      <h2 className="mt-6 font-display text-xl text-primary">Chain link</h2>
      <p className="mt-2 text-sm text-foreground/80">
        Fabric and top rail round up to whole sections. Hardware coefficients
        (ties, tension bars, brace bands) are editable defaults.
      </p>
      <h2 className="mt-6 font-display text-xl text-primary">Concrete</h2>
      <p className="mt-2 text-sm text-foreground/80">
        Cylinder hole volume minus buried square post volume, times concreted
        posts, divided by bag yield, rounded up.
      </p>
      <h2 className="mt-6 font-display text-xl text-primary">Disclaimer</h2>
      <p className="mt-2 text-sm text-foreground/80">
        Results are planning estimates. Manufacturer systems, soil, frost, wind,
        slope, and local codes can change real requirements.
      </p>
    </article>
  );
}
