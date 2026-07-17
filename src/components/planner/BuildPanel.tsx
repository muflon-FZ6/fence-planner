"use client";

import { printShoppingList } from "@/components/planner/ShoppingListPrint";
import { formatLength } from "@/domain/units";
import { track } from "@/lib/analytics";
import { useProject } from "@/state/projectStore";

export function BuildPanel() {
  const {
    project,
    materials,
    warnings,
    setHighlights,
    dismissWarning,
    highlightKeys,
  } = useProject();

  function copyList() {
    const text = materials.lines
      .map((l) => {
        const spec = l.spec ? ` — ${l.spec}` : "";
        const note = l.note ? `\n   ${l.note}` : "";
        return `${l.quantity} ${l.unit}  ${l.label}${spec}${note}`;
      })
      .join("\n");
    void navigator.clipboard.writeText(text);
    track("copy_material_list");
  }

  function printList() {
    track("print_shopping_list");
    printShoppingList();
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto">
      <div className="rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-soft)]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-lg text-primary">Shopping list</h2>
            <p className="text-xs text-foreground/60">
              {materials.lines.length} store-ready items — confirm stock at
              purchase
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            <button
              type="button"
              onClick={copyList}
              className="rounded-md border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-muted"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={printList}
              className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Print list
            </button>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-foreground/55">Fence length</dt>
            <dd className="font-semibold">
              {formatLength(materials.totalFenceLength, project.unitSystem)}
            </dd>
          </div>
          <div>
            <dt className="text-foreground/55">Posts</dt>
            <dd className="font-semibold">{materials.posts.total}</dd>
          </div>
          <div>
            <dt className="text-foreground/55">Concrete</dt>
            <dd className="font-semibold">{materials.concreteBags} bags</dd>
          </div>
          <div>
            <dt className="text-foreground/55">Gates</dt>
            <dd className="font-semibold">{project.gates.length}</dd>
          </div>
        </dl>

        <p className="mt-4 border-t border-border/70 pt-3 text-[11px] text-foreground/55">
          Qty · what to ask for · size to buy
        </p>
        <ul className="mt-1 divide-y divide-border/70">
          {materials.lines.map((line) => {
            const active = line.highlightKeys?.some((k) =>
              highlightKeys.includes(k),
            );
            return (
              <li key={line.id}>
                <button
                  type="button"
                  className={`flex w-full items-start gap-3 py-2.5 text-left text-sm transition ${
                    active ? "bg-primary-soft/60" : "hover:bg-surface-muted/70"
                  }`}
                  onMouseEnter={() => setHighlights(line.highlightKeys ?? [])}
                  onMouseLeave={() => setHighlights([])}
                  onFocus={() => setHighlights(line.highlightKeys ?? [])}
                  onBlur={() => setHighlights([])}
                >
                  <span className="w-14 shrink-0 pt-0.5 text-right font-semibold tabular-nums leading-snug">
                    {line.quantity}
                    <span className="block text-[10px] font-medium text-foreground/50">
                      {line.unit}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-medium leading-snug">{line.label}</span>
                    {line.spec && (
                      <span className="mt-0.5 block text-xs font-semibold text-primary">
                        {line.spec}
                      </span>
                    )}
                    {line.note && (
                      <span className="mt-0.5 block text-[11px] leading-snug text-foreground/55">
                        {line.note}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {materials.assumptions.length > 0 && (
          <div className="mt-3 border-t border-border/70 pt-3 text-xs text-foreground/70">
            <p className="font-semibold text-foreground">Assumptions</p>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {materials.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {warnings.length > 0 && (
        <div className="space-y-2">
          <p className="px-0.5 text-xs font-semibold uppercase tracking-wide text-foreground/50">
            Quick tips
          </p>
          {warnings.map((w) => (
            <div
              key={w.id}
              className={`rounded-lg border px-3 py-2.5 text-sm ${
                w.severity === "error"
                  ? "border-danger/40 bg-danger/10"
                  : w.severity === "warning"
                    ? "border-accent-amber/35 bg-accent-amber/10"
                    : "border-border bg-surface"
              }`}
              role="status"
            >
              <p className="leading-snug text-foreground/85">{w.message}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  w.actions ?? [
                    { id: "ok", label: "Got it", kind: "dismiss" as const },
                  ]
                ).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="rounded border border-border bg-surface px-2.5 py-1 text-xs font-semibold"
                    onClick={() => {
                      dismissWarning(w.id);
                      track("view_warning", { id: w.id, action: a.kind });
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
