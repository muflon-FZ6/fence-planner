type AdSlotProps = {
  slot: "landing-below" | "sidebar" | "below-results" | "guide-inline" | "footer";
  className?: string;
};

const LABELS: Record<AdSlotProps["slot"], string> = {
  "landing-below": "Advertisement",
  sidebar: "Advertisement",
  "below-results": "Advertisement",
  "guide-inline": "Advertisement",
  footer: "Advertisement",
};

/** Reserved AdSense-safe placeholder — never place inside canvas or print. */
export function AdSlot({ slot, className = "" }: AdSlotProps) {
  return (
    <aside
      className={`ad-slot no-print ${className}`}
      data-ad-slot={slot}
      aria-label="Advertisement placeholder"
    >
      {LABELS[slot]}
    </aside>
  );
}
