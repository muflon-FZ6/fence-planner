import type { Metadata } from "next";
import { ToolPage } from "@/components/seo/ToolPage";

export const metadata: Metadata = {
  title: "Concrete for Fence Posts Calculator",
  description:
    "Calculate concrete bags from hole diameter, depth, post size, and post count.",
};

export default function Page() {
  return (
    <ToolPage
      title="Concrete for Fence Posts Calculator"
      description="Hole volume minus buried post volume, times post count, divided by bag yield — always rounded up."
      defaultsNote="Hole depth is an editable assumption. Frost depth is local — verify before digging."
      href="/fence-calculator"
      bullets={[
        "Cylindrical hole volume",
        "Post volume subtraction",
        "Editable bag yield",
        "Optional waste percentage",
      ]}
    />
  );
}
