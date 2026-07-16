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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="font-display text-xl tracking-tight text-primary md:text-2xl">
            Fence Planner
          </span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
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
          className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Start planning
        </Link>
      </div>
    </header>
  );
}
