"use client";

import { classifyPosts } from "@/domain/geometry";
import { styleSummary } from "@/domain/styleDefaults";
import { formatLength } from "@/domain/units";
import { useProject } from "@/state/projectStore";

export function PrintSheet() {
  const { project, materials, warnings } = useProject();
  const posts = classifyPosts(project);
  const date = new Date().toLocaleDateString();

  return (
    <div className="print-only print-sheet mx-auto max-w-[8.5in] bg-white p-6 text-black">
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
        <div className="mt-2 h-20 border border-black/30 bg-neutral-100 p-3 text-sm">
          {project.runs.length} fence lines ·{" "}
          {formatLength(materials.totalFenceLength, project.unitSystem)} total ·{" "}
          {project.gates.length} gate(s) · {posts.length} posts
        </div>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Measured plan</h2>
        <svg
          viewBox="0 0 400 200"
          className="mt-2 w-full border border-black/20"
        >
          {project.runs.map((run) => (
            <g key={run.id}>
              <line
                x1={run.start.x * 0.15 + 40}
                y1={run.start.y * 0.15 + 40}
                x2={run.end.x * 0.15 + 40}
                y2={run.end.y * 0.15 + 40}
                stroke="black"
                strokeWidth={3}
              />
              <text
                x={(run.start.x + run.end.x) * 0.075 + 40}
                y={(run.start.y + run.end.y) * 0.075 + 35}
                fontSize={10}
              >
                {formatLength(run.length, project.unitSystem)}
              </text>
            </g>
          ))}
        </svg>
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
              <th className="border border-black/40 px-2 py-1 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {materials.lines.map((line) => (
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
                <td className="border border-black/40 px-2 py-1 text-right align-top">
                  ________
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
