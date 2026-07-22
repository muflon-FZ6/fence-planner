import type { Metadata } from "next";
import { FenceCalculatorClient } from "@/components/planner/FenceCalculatorClient";
import { absoluteUrl, getSiteOrigin } from "@/lib/siteUrl";

const title = "Fence Material Calculator";
const description =
  "Enter run lengths for a fast materials estimate, then open the visual planner when you need a layout.";

export const metadata: Metadata = {
  title,
  description,
  ...(getSiteOrigin()
    ? {
        alternates: { canonical: "/fence-calculator" },
        openGraph: {
          title,
          description,
          type: "website",
          url: absoluteUrl("/fence-calculator"),
        },
      }
    : {}),
};

export default function FenceCalculatorPage() {
  return <FenceCalculatorClient />;
}
