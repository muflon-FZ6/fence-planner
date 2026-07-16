import type { Metadata } from "next";
import { ToolPage } from "@/components/seo/ToolPage";

export const metadata: Metadata = {
  title: "Wood Fence Calculator",
  description:
    "Estimate posts, rails, and pickets for site-built wood privacy fences.",
};

export default function Page() {
  return (
    <ToolPage
      title="Wood Fence Calculator"
      description="Site-built wood privacy estimates with editable post spacing, rails per span, picket width, and gaps."
      defaultsNote="Waste can be applied to pickets and rails without silently inflating every category."
      href="/fence-calculator"
      bullets={[
        "Spans from post spacing",
        "Rails per span",
        "Picket count with gap",
        "Gate framing hardware",
      ]}
    />
  );
}
