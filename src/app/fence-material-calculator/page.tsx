import type { Metadata } from "next";
import { ToolPage } from "@/components/seo/ToolPage";

export const metadata: Metadata = {
  title: "Fence Material Calculator",
  description:
    "Estimate posts, panels, rails, concrete, and gate hardware for your fence project.",
};

export default function Page() {
  return (
    <ToolPage
      title="Fence Material Calculator"
      description="Get a categorized materials list from length, corners, gates, and fence type — then refine the layout visually."
      defaultsNote="Starts in quick-estimate mode with editable assumptions for spacing, waste, and post holes."
      href="/fence-calculator"
      bullets={[
        "Posts classified by type",
        "Panels, pickets, or chain-link fabric",
        "Concrete bags from hole dimensions",
        "Gate hardware included",
      ]}
    />
  );
}
