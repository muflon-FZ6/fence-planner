import type { Metadata } from "next";
import { ToolPage } from "@/components/seo/ToolPage";

export const metadata: Metadata = {
  title: "Fence Panel Calculator",
  description:
    "Calculate full panels, cut panels, and posts for preassembled panel fences.",
};

export default function Page() {
  return (
    <ToolPage
      title="Fence Panel Calculator"
      description="Divide each run into full panels and cut sections after subtracting gates. See where short final bays appear."
      defaultsNote="Defaults to 8 ft panel width with explicit panel-only vs includes-post module mode."
      href="/fence-calculator"
      bullets={[
        "Full vs cut panel breakdown",
        "Gate openings excluded from fill",
        "Corner posts not double-counted",
        "Printable shopping list",
      ]}
    />
  );
}
