import type { Metadata } from "next";
import Link from "next/link";
import { BuildReadinessAudit } from "@/components/readiness/BuildReadinessAudit";
import { absoluteUrl, getSiteOrigin } from "@/lib/siteUrl";

const title = "Build Readiness Audit";
const description =
  "A printable homeowner checklist to decide what to resolve before buying materials or digging fence posts — not a permit or utility-locate service.";

export const metadata: Metadata = {
  title,
  description,
  ...(getSiteOrigin()
    ? {
        alternates: { canonical: "/build-readiness" },
        openGraph: {
          title,
          description,
          type: "website",
          url: absoluteUrl("/build-readiness"),
        },
      }
    : {}),
};

export default function BuildReadinessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary">{title}</h1>
      <p className="mt-3 text-foreground/75">{description}</p>
      <p className="mt-3 text-sm text-foreground/65">
        Fence Planner is not a surveyor, permit authority, utility-locate bureau,
        or engineer. Use this audit to record your own sources and next actions.
        See{" "}
        <Link href="/about" className="font-semibold text-primary underline-offset-2 hover:underline">
          About
        </Link>{" "}
        and{" "}
        <Link
          href="/methodology"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Methodology
        </Link>
        .
      </p>
      <div className="mt-8">
        <BuildReadinessAudit />
      </div>
    </div>
  );
}
