import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy practices for Fence Planner.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 space-y-4 text-sm text-foreground/80">
      <h1 className="font-display text-3xl text-primary">Privacy Policy</h1>
      <p>
        Fence Planner is designed to work without an account. Fence layouts,
        preferences, and optional Build Readiness Audit answers are stored in your
        browser’s local storage on your device. They are not uploaded to our
        servers.
      </p>
      <p>
        If advertising (such as Google AdSense) is enabled, third-party partners
        may use cookies or similar technologies as described in their policies.
        Analytics events, when present, are used to understand product usage
        without collecting unnecessary personal data.
      </p>
      <p>
        Contact:{" "}
        <a href="mailto:hello@doublem.ca" className="text-primary hover:underline">
          hello@doublem.ca
        </a>
      </p>
    </article>
  );
}
