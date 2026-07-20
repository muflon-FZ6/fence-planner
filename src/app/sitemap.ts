import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";
import { requireSiteOriginForSitemap } from "@/lib/siteUrl";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/methodology",
  "/examples",
  "/guides",
  "/fence-planner",
  "/fence-calculator",
  "/fence-material-calculator",
  "/fence-panel-calculator",
  "/fence-post-calculator",
  "/fence-gate-planner",
  "/wood-fence-calculator",
  "/privacy-fence-calculator",
  "/chain-link-fence-calculator",
  "/concrete-for-fence-posts-calculator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = requireSiteOriginForSitemap();
  // Never emit relative <loc> values — return empty until origin is configured
  // (production throws from requireSiteOriginForSitemap).
  if (!origin) return [];

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${origin}${path}`,
    changeFrequency:
      path === "/" || path === "/fence-planner" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/fence") ? 0.8 : 0.6,
  }));

  const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${origin}/guides/${g.slug}`,
    lastModified: g.updated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...guideEntries];
}
