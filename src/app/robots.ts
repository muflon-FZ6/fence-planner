import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  const isPreview =
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "development";

  if (isPreview && !process.env.ALLOW_PREVIEW_INDEXING) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [],
    },
    sitemap: origin ? `${origin}/sitemap.xml` : undefined,
  };
}
