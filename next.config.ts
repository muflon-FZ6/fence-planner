import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/guides/six-foot-vs-eight-foot-fence-sections",
        destination: "/guides/fence-post-spacing-explained",
        permanent: true,
      },
      {
        source: "/guides/handle-uneven-final-fence-section",
        destination: "/guides/how-to-calculate-fence-panels-and-posts",
        permanent: true,
      },
      {
        source: "/guides/fence-post-depth-and-frost",
        destination: "/guides/how-much-concrete-for-fence-posts",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
