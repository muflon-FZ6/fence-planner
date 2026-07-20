"use client";

import { PlanDiagram } from "@/canvas/plan/PlanDiagram";
import { classifyPosts } from "@/domain/geometry";
import { formatMoney, resolvePricingCountry } from "@/domain/pricingPrefs";
import { styleSummary } from "@/domain/styleDefaults";
import { formatLength } from "@/domain/units";
import { useProject } from "@/state/projectStore";

export function PrintSheet() {
  const { project, materials, priceEstimate, warnings } = useProject();
  const posts = classifyPosts(project);
  const date = new Date().toLocaleDateString();
  const country = resolvePricingCountry(project);
  const countryLabel = country === "CA" ? "Canada" : "United States";
  const pricedById = new Map(
    priceEstimate.lines.map((l) => [l.materialLineId, l]),
  );

  return (
    <div
      className="print-only print-sheet mx-auto max-w-[8.5in] bg-white p-6 text-black"
      aria-hidden="true"
    >
      <header className="border-b border-black pb-3">
        <h1 className="font-display text-2xl">
          {project.name || "Fence Project Plan"}
        </h1>
        <p className="text-sm">
          {date} · {project.unitSystem} · {project.fenceType.replace("_", " ")}
        </p>
      </header>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Fence construction style</h2>
        <p className="text-sm">
          {styleSummary(project.settings, project.fenceType)} ·{" "}
          {formatLength(project.settings.fenceHeight, project.unitSystem)} high
        </p>
        <div className="mt-2 border border-black/30 bg-neutral-100 p-3 text-sm">
          {project.runs.length} fence lines ·{" "}
          {formatLength(materials.totalFenceLength, project.unitSystem)} total ·{" "}
          {project.gates.length} gate(s) · {posts.length} posts
        </div>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Measured plan</h2>
        <PlanDiagram project={project} className="mt-2" />
        <ul className="mt-2 text-sm">
          {project.runs.map((run, i) => (
            <li key={run.id}>
              Segment {i + 1}: {formatLength(run.length, project.unitSystem)}
            </li>
          ))}
          {project.gates.map((g, i) => (
            <li key={g.id}>
              Gate {i + 1}: {formatLength(g.width, project.unitSystem)} (
              {g.gateType})
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Shopping list</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-black/40 px-2 py-1 text-left">Item</th>
              <th className="border border-black/40 px-2 py-1 text-left">
                Size to buy
              </th>
              <th className="border border-black/40 px-2 py-1 text-right">Qty</th>
              <th className="border border-black/40 px-2 py-1 text-right">
                Est. unit
              </th>
              <th className="border border-black/40 px-2 py-1 text-right">
                Est. line
              </th>
            </tr>
          </thead>
          <tbody>
            {materials.lines.map((line) => {
              const priced = pricedById.get(line.id);
              return (
                <tr key={line.id}>
                  <td className="border border-black/40 px-2 py-1 align-top">
                    <div className="font-medium">{line.label}</div>
                    {line.note && (
                      <div className="text-xs text-black/60">{line.note}</div>
                    )}
                  </td>
                  <td className="border border-black/40 px-2 py-1 align-top">
                    {line.spec ?? "—"}
                  </td>
                  <td className="border border-black/40 px-2 py-1 text-right align-top">
                    {line.quantity} {line.unit}
                  </td>
                  <td className="border border-black/40 px-2 py-1 text-right align-top tabular-nums">
                    {priced
                      ? priced.packSummary
                        ? `${priced.packSummary} · ${formatMoney(
                            priced.lineCostTypical,
                            priceEstimate.currency,
                          )}`
                        : `${formatMoney(
                            priced.unitPriceTypical,
                            priceEstimate.currency,
                          )}/${priced.priceUnit}${
                            priced.packagesToBuy != null
                              ? ` × ${priced.packagesToBuy}`
                              : ""
                          }`
                      : "—"}
                  </td>
                  <td className="border border-black/40 px-2 py-1 text-right align-top tabular-nums">
                    {priced
                      ? formatMoney(
                          priced.lineCostTypical,
                          priceEstimate.currency,
                        )
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Estimated materials cost</h2>
        <p className="mt-1 text-sm">
          {countryLabel} · {priceEstimate.currency} · snapshot {priceEstimate.asOf}
        </p>
        <div className="mt-2 border border-black/30 bg-neutral-100 p-3 text-sm">
          <p className="font-semibold">
            {formatMoney(priceEstimate.materialsLow, priceEstimate.currency)} –{" "}
            {formatMoney(priceEstimate.materialsHigh, priceEstimate.currency)}
          </p>
          <p className="mt-1">
            Typical{" "}
            {formatMoney(
              priceEstimate.materialsTypical,
              priceEstimate.currency,
            )}
          </p>
        </div>
        <p className="mt-2 text-xs text-black/70">{priceEstimate.disclaimer}</p>
      </section>

      <section className="mt-4 text-sm">
        <h2 className="text-lg font-semibold">Assumptions & warnings</h2>
        <ul className="list-disc pl-5">
          {materials.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
          {warnings.map((w) => (
            <li key={w.id}>{w.message}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 text-sm">
        <h2 className="text-lg font-semibold">Notes</h2>
        <div className="h-24 border border-black/30" />
      </section>

      <p className="mt-4 text-xs">
        Planning estimate only. Verify property boundaries, permits, utility
        locations, frost depth, and manufacturer dimensions before purchase or
        installation. This tool does not replace a contractor, engineer, or
        surveyor.
      </p>
    </div>
  );
}
