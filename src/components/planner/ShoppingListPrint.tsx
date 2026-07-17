"use client";

import { formatLength } from "@/domain/units";
import { useProject } from "@/state/projectStore";

/**
 * Print-only shopping list. Visible when body has class `print-shopping-list`.
 */
export function ShoppingListPrint() {
  const { project, materials } = useProject();
  const date = new Date().toLocaleDateString();

  return (
    <div className="shopping-list-print print-only mx-auto max-w-[8.5in] bg-white p-6 text-black">
      <header className="border-b border-black pb-3">
        <h1 className="font-display text-2xl">Shopping list</h1>
        <p className="text-sm">
          {project.name || "Fence plan"} · {date} ·{" "}
          {formatLength(materials.totalFenceLength, project.unitSystem)} fence ·{" "}
          {materials.posts.total} posts
        </p>
      </header>

      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-black/40 px-2 py-1.5 text-left">Item</th>
            <th className="border border-black/40 px-2 py-1.5 text-left">
              Size to buy
            </th>
            <th className="border border-black/40 px-2 py-1.5 text-right">Qty</th>
            <th className="border border-black/40 px-2 py-1.5 text-right">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {materials.lines.map((line) => (
            <tr key={line.id}>
              <td className="border border-black/40 px-2 py-1.5 align-top">
                <div className="font-medium">{line.label}</div>
                {line.note && (
                  <div className="mt-0.5 text-xs text-black/65">{line.note}</div>
                )}
              </td>
              <td className="border border-black/40 px-2 py-1.5 align-top">
                {line.spec ?? "—"}
              </td>
              <td className="border border-black/40 px-2 py-1.5 text-right align-top tabular-nums">
                {line.quantity} {line.unit}
              </td>
              <td className="border border-black/40 px-2 py-1.5 text-right align-top">
                ________
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {materials.assumptions.length > 0 && (
        <section className="mt-5 text-xs text-black/75">
          <h2 className="text-sm font-semibold text-black">Assumptions</h2>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {materials.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-6 text-[11px] text-black/55">
        Illustrative estimate from Fence Planner — confirm sizes, treatment, and
        quantities at the store. Not a structural design.
      </p>
    </div>
  );
}

/** Trigger a print that shows only the shopping list sheet. */
export function printShoppingList() {
  if (typeof window === "undefined") return;
  document.body.classList.add("print-shopping-list");
  const cleanup = () => {
    document.body.classList.remove("print-shopping-list");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  // Fallback if afterprint doesn't fire (some browsers)
  window.setTimeout(cleanup, 60_000);
  window.print();
}
