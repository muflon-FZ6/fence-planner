import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Fence Planner.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 space-y-4 text-sm text-foreground/80">
      <h1 className="font-display text-3xl text-primary">Terms of Use</h1>
      <p>
        Fence Planner provides planning estimates only. By using the site you
        agree that results are informational and may be inaccurate for your
        conditions.
      </p>
      <p>You are responsible for:</p>
      <ul className="list-disc pl-5">
        <li>Verifying property boundaries</li>
        <li>Checking permits, bylaws, and codes</li>
        <li>Contacting utility-marking services before digging</li>
        <li>Confirming manufacturer dimensions and installation systems</li>
        <li>Hiring qualified professionals when needed</li>
      </ul>
      <p>
        The tool does not replace a contractor, engineer, surveyor, or local
        authority. The service remains free; do not rely on it for structural
        design or legal compliance.
      </p>
    </article>
  );
}
