type AdSlotProps = {
  slot: "landing-below" | "sidebar" | "below-results" | "guide-inline" | "footer";
  className?: string;
};

/**
 * Ad placement hook. Renders nothing until ads are explicitly enabled —
 * labeled empty "Advertisement" placeholders violate AdSense policy.
 * Set NEXT_PUBLIC_ADS_ENABLED=true only after real AdSense (or equivalent)
 * units are wired in.
 */
export function AdSlot({ slot, className = "" }: AdSlotProps) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") {
    return null;
  }

  return (
    <aside
      className={`ad-slot no-print ${className}`}
      data-ad-slot={slot}
      aria-label="Advertisement"
    />
  );
}
