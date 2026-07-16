import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Fence Planner team.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl text-primary">Contact</h1>
      <p className="mt-4 text-foreground/75">
        Questions about the tool, content corrections, or partnership inquiries:
      </p>
      <p className="mt-4 font-semibold">hello@adoublem.example</p>
      <p className="mt-6 text-sm text-foreground/65">
        We do not provide contractor quotes, permit approvals, or site-specific
        engineering advice through this form.
      </p>
    </article>
  );
}
