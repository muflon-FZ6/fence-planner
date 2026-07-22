"use client";

import { useRouter } from "next/navigation";
import { QuickEstimate } from "@/components/planner/QuickEstimate";

export function FenceCalculatorClient() {
  const router = useRouter();
  return (
    <div className="px-4 py-8 md:px-6">
      <QuickEstimate onOpenPlanner={() => router.push("/fence-planner")} />
    </div>
  );
}
