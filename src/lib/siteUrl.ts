/**
 * Site URL configuration for canonicals, sitemap, and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in the host environment
 * (e.g. Hostinger Node.js app → https://fenceblueprint.com).
 * Do not guess a production domain in code.
 */
export function getSiteOrigin(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function absoluteUrl(path: string): string | undefined {
  const origin = getSiteOrigin();
  if (!origin) return undefined;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}

/**
 * Absolute origin required for sitemap `<loc>` values.
 * Production builds fail fast when NEXT_PUBLIC_SITE_URL is missing.
 * Local/dev/preview may return undefined so the route can emit an empty sitemap
 * rather than relative URLs.
 */
export function requireSiteOriginForSitemap(): string | undefined {
  const origin = getSiteOrigin();
  const isProd =
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV !== "preview";

  if (!origin && isProd) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set to an absolute https origin for production sitemap generation (e.g. https://fenceblueprint.com).",
    );
  }
  return origin;
}
