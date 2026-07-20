"use client";

import { Copy, Printer } from "lucide-react";
import { printShoppingList } from "@/components/planner/ShoppingListPrint";
import { formatMoney, resolvePricingCountry } from "@/domain/pricingPrefs";
import { formatLength } from "@/domain/units";
import type { PricingCountry } from "@/domain/types";
import { track } from "@/lib/analytics";
import { useProject } from "@/state/projectStore";

export function BuildPanel({ embedded = false }: { embedded?: boolean }) {
  const {
    project,
    materials,
    priceEstimate,
    warnings,
    setHighlights,
    dismissWarning,
    highlightKeys,
    setPricingCountry,
    setPriceOverride,
    clearPriceOverride,
  } = useProject();

  const country = resolvePricingCountry(project);
  const pricedById = new Map(
    priceEstimate.lines.map((l) => [l.materialLineId, l]),
  );

  function copyList() {
    const text = materials.lines
      .map((l) => {
        const priced = pricedById.get(l.id);
        const spec = l.spec ? ` — ${l.spec}` : "";
        const note = l.note ? `\n   ${l.note}` : "";
        const cost =
          priced != null
            ? `\n   ~${formatMoney(priced.lineCostTypical, priceEstimate.currency)} typical`
            : "";
        return `${l.quantity} ${l.unit}  ${l.label}${spec}${note}${cost}`;
      })
      .join("\n");
    const totals = `\n\nMaterials estimate (${priceEstimate.currency}): ${formatMoney(priceEstimate.materialsLow, priceEstimate.currency)} – ${formatMoney(priceEstimate.materialsHigh, priceEstimate.currency)} (typical ${formatMoney(priceEstimate.materialsTypical, priceEstimate.currency)})\n${priceEstimate.disclaimer}`;
    void navigator.clipboard.writeText(text + totals);
    track("copy_material_list");
  }

  function printList() {
    track("print_shopping_list");
    printShoppingList();
  }

  function onCountry(next: PricingCountry) {
    if (next === country) return;
    setPricingCountry(next);
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto">
      <div
        className={
          embedded
            ? "rounded-lg border border-border/60 bg-surface p-3"
            : "rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-soft)]"
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {embedded ? null : (
              <h2 className="font-display text-lg text-primary">Shopping list</h2>
            )}
            <p className="text-xs text-foreground/60">
              {materials.lines.length} store-ready items — confirm stock at
              purchase
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            <button
              type="button"
              onClick={copyList}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs font-semibold transition hover:bg-surface-muted"
            >
              <Copy className="size-3.5 shrink-0" aria-hidden />
              Copy
            </button>
            <button
              type="button"
              onClick={printList}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-primary-hover"
            >
              <Printer className="size-3.5 shrink-0" aria-hidden />
              Print list
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-foreground/65">
            Materials estimate for
          </p>
          <div
            className="inline-flex rounded-md border border-border p-0.5"
            role="group"
            aria-label="Estimate country"
          >
            {(
              [
                ["US", "United States"],
                ["CA", "Canada"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={country === id}
                onClick={() => onCountry(id)}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                  country === id
                    ? "bg-primary text-white"
                    : "text-foreground/70 hover:bg-surface-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 rounded-md border border-primary/25 bg-primary-soft/50 px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            Estimated materials ({priceEstimate.currency})
          </p>
          <p className="mt-1 font-display text-xl leading-snug text-primary">
            {formatMoney(priceEstimate.materialsLow, priceEstimate.currency, {
              compact: true,
            })}
            {" – "}
            {formatMoney(priceEstimate.materialsHigh, priceEstimate.currency, {
              compact: true,
            })}
          </p>
          <p className="mt-0.5 text-xs text-foreground/65">
            Typical{" "}
            {formatMoney(
              priceEstimate.materialsTypical,
              priceEstimate.currency,
              { compact: true },
            )}{" "}
            · as of {priceEstimate.asOf}
          </p>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
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
          Qty · item · unit price · line estimate
        </p>
        <ul className="mt-1 divide-y divide-border/70">
          {materials.lines.map((line) => {
            const active = line.highlightKeys?.some((k) =>
              highlightKeys.includes(k),
            );
            const priced = pricedById.get(line.id);
            const hasOverride = Boolean(project.priceOverrides?.[line.id]);
            return (
              <li key={line.id}>
                <div
                  className={`flex w-full items-start gap-3 py-2.5 text-sm ${
                    active ? "bg-primary-soft/60" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-start gap-3 text-left transition hover:opacity-90"
                    onMouseEnter={() =>
                      setHighlights(line.highlightKeys ?? [])
                    }
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
                      <span className="font-medium leading-snug">
                        {line.label}
                      </span>
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
                      {priced?.warning && (
                        <span className="mt-0.5 block text-[11px] leading-snug text-accent-amber">
                          {priced.warning}
                        </span>
                      )}
                    </span>
                  </button>
                  {priced ? (
                    <div className="w-[7.5rem] shrink-0 space-y-1 text-right">
                      <label className="block">
                        <span className="sr-only">
                          {priced.packPlan && priced.packPlan.length > 1
                            ? `Lot price for ${line.label}`
                            : priced.packagesToBuy
                              ? `Box price for ${line.label}`
                              : `Unit price for ${line.label}`}
                        </span>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          inputMode="decimal"
                          value={
                            hasOverride
                              ? project.priceOverrides![line.id].unitPrice
                              : priced.unitPriceTypical
                          }
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") return;
                            const n = Number(raw);
                            if (Number.isFinite(n)) setPriceOverride(line.id, n);
                          }}
                          className="w-full rounded border border-border bg-surface px-1.5 py-1 text-right text-xs font-semibold tabular-nums outline-none ring-primary focus:ring-2"
                        />
                      </label>
                      <p className="text-[10px] leading-snug text-foreground/50">
                        {priced.packSummary
                          ? priced.packSummary
                          : priced.packagesToBuy != null &&
                              priced.piecesPerPackage != null
                            ? `${priced.packagesToBuy}× ${priced.priceUnit} · ${priced.piecesPerPackage} ea`
                            : `/${priced.priceUnit}`}
                      </p>
                      <p className="text-[10px] tabular-nums text-foreground/55">
                        {formatMoney(
                          priced.lineCostLow,
                          priceEstimate.currency,
                        )}
                        –
                        {formatMoney(
                          priced.lineCostHigh,
                          priceEstimate.currency,
                        )}
                      </p>
                      {hasOverride ? (
                        <button
                          type="button"
                          onClick={() => clearPriceOverride(line.id)}
                          className="text-[10px] font-semibold text-primary hover:underline"
                        >
                          Use estimate
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 border-t border-border/70 pt-3 text-[11px] leading-relaxed text-foreground/55">
          {priceEstimate.disclaimer}
        </p>

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
