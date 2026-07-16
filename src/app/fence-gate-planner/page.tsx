import type { Metadata } from "next";
import { ToolPage } from "@/components/seo/ToolPage";

export const metadata: Metadata = {
  title: "Fence Gate Planner",
  description:
    "Place gates on a fence run, set width and swing, and include hardware in your materials list.",
};

export default function Page() {
  return (
    <ToolPage
      title="Fence Gate Planner"
      description="Gates change posts, fill materials, and hardware. Plan openings on the layout before you buy."
      defaultsNote="Single gates get hinge and latch sets; double gates also include a drop rod."
      href="/fence-planner"
      bullets={[
        "Place gates on selected runs",
        "Single and double gate types",
        "Swing preview in Dream View",
        "Warnings when gates sit too close to corners",
      ]}
    />
  );
}
