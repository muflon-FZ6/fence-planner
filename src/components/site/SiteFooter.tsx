import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <AdSlot slot="footer" className="mb-8" />
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="flex items-center gap-2.5 font-display text-lg text-primary">
              <Image
                src="/brand/fence-planner-logo.png"
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-lg"
              />
              Fence Planner
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              Free fence layout and material estimates. Planning aid only — verify
              boundaries, permits, and product dimensions before you build.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Tools</p>
            <ul className="mt-2 space-y-1 text-foreground/70">
              <li>
                <Link href="/fence-planner">Visual planner</Link>
              </li>
              <li>
                <Link href="/fence-calculator">Material calculator</Link>
              </li>
              <li>
                <Link href="/guides">Planning guides</Link>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Trust</p>
            <ul className="mt-2 space-y-1 text-foreground/70">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-xs text-foreground/50">
          © {new Date().getFullYear()} DoubleM. Always free. Estimates only.
        </p>
      </div>
    </footer>
  );
}
