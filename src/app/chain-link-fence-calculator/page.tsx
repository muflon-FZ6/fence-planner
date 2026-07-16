import type { Metadata } from "next";
import { ToolPage } from "@/components/seo/ToolPage";

export const metadata: Metadata = {
  title: "Chain-Link Fence Calculator",
  description:
    "Estimate fabric rolls, top rail, terminal posts, ties, and gate hardware.",
};

export default function Page() {
  return (
    <ToolPage
      title="Chain-Link Fence Calculator"
      description="Editable fabric roll and top-rail section lengths keep the estimate aligned with products you can buy."
      defaultsNote="Terminal posts at ends, corners, and gates; line posts on spacing."
      href="/fence-calculator"
      bullets={[
        "Fabric roll rounding",
        "Top rail sections",
        "Tension bars and brace bands",
        "Walk and drive gates",
      ]}
    />
  );
}
