import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

const RETIRED = [
  {
    source: "/guides/six-foot-vs-eight-foot-fence-sections",
    destination: "/guides/fence-post-spacing-explained",
  },
  {
    source: "/guides/handle-uneven-final-fence-section",
    destination: "/guides/how-to-calculate-fence-panels-and-posts",
  },
  {
    source: "/guides/fence-post-depth-and-frost",
    destination: "/guides/how-much-concrete-for-fence-posts",
  },
] as const;

describe("Phase 2B permanent guide redirects", () => {
  it("configures three permanent redirects without chains", async () => {
    const redirects = await nextConfig.redirects!();
    for (const expected of RETIRED) {
      const match = redirects.find((r) => r.source === expected.source);
      expect(match, expected.source).toBeTruthy();
      expect(match!.destination).toBe(expected.destination);
      expect(match!.permanent).toBe(true);
    }
    // No chain: destinations are not also sources
    const sources = new Set(redirects.map((r) => r.source));
    for (const expected of RETIRED) {
      expect(sources.has(expected.destination)).toBe(false);
    }
  });
});
