import Link from "next/link";

const links = [
  { href: "/fence-planner", label: "Planner" },
  { href: "/fence-calculator", label: "Calculator" },
  { href: "/guides", label: "Guides" },
  { href: "/examples", label: "Examples" },
  { href: "/methodology", label: "Methodology" },
];

export function SiteHeader() {
  return (
    <header className="no-print border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:gap-4 md:px-6">
        <Link
          href="/"
          className="group flex min-w-0 flex-1 flex-col leading-tight sm:flex-none"
        >
          <span className="font-display text-lg tracking-tight text-primary sm:text-xl md:text-2xl">
            Fence Planner
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.14em] text-foreground/55 sm:block">
            A Double M free utility
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-foreground/75 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/fence-planner"
          className="shrink-0 rounded-md bg-primary px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover sm:px-3 sm:text-sm"
        >
          <span className="sm:hidden">Plan</span>
          <span className="hidden sm:inline">Start planning</span>
        </Link>
      </div>
    </header>
  );
}
