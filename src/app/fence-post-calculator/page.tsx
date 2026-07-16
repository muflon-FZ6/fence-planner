import type { Metadata } from "next";
import { ToolPage } from "@/components/seo/ToolPage";

export const metadata: Metadata = {
  title: "Fence Post Calculator",
  description:
    "Count line, corner, end, and gate posts for panel, wood, or chain-link fences.",
};

export default function Page() {
  return (
    <ToolPage
      title="Fence Post Calculator"
      description="Post counts depend on spacing, corners, ends, and gates — not just total length."
      defaultsNote="Use quick estimate for abstract counts or the planner for shared corner geometry."
      href="/fence-calculator"
      bullets={[
        "Line, corner, end, and gate posts",
        "Shared joints counted once",
        "Concrete linked to concreted posts",
        "Visual post markers in Plan View",
      ]}
    />
  );
}
