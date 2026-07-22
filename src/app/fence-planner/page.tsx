import type { Metadata } from "next";
import { FencePlannerClient } from "@/components/planner/FencePlannerClient";
import { absoluteUrl, getSiteOrigin } from "@/lib/siteUrl";

const title = "Visual Fence Planner";
const description =
  "Draw your fence layout, preview styles, and print a materials list — free in your browser, no account required.";

export const metadata: Metadata = {
  title,
  description,
  ...(getSiteOrigin()
    ? {
        alternates: { canonical: "/fence-planner" },
        openGraph: {
          title,
          description,
          type: "website",
          url: absoluteUrl("/fence-planner"),
        },
      }
    : {}),
};

export default function FencePlannerPage() {
  return <FencePlannerClient />;
}
