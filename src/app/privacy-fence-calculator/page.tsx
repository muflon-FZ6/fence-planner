import type { Metadata } from "next";
import { ToolPage } from "@/components/seo/ToolPage";

export const metadata: Metadata = {
  title: "Privacy Fence Calculator",
  description:
    "Plan a privacy fence with panels or pickets and a clear materials list.",
};

export default function Page() {
  return (
    <ToolPage
      title="Privacy Fence Calculator"
      description="Choose preassembled panels or site-built boards, set height and finish, and print a build-ready list."
      defaultsNote="Privacy intent defaults to a 6 ft fence in the visual planner."
      href="/fence-planner"
      bullets={[
        "Panel or wood privacy systems",
        "Height and finish previews",
        "Cut panel warnings",
        "Free printable plan",
      ]}
    />
  );
}
