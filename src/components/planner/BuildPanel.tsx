"use client";

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
      .map((l) => `${l.label}: ${l.quantity} ${l.unit}${l.note ? ` (${l.note})` : ""}`)
      .join("\n");
    void navigator.clipboard.writeText(text);
    track("copy_material_list");
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto">
      <div className="rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-soft)]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-lg text-primary">Build</h2>
            <p className="text-xs text-foreground/60">
              Live materials from your layout
            </p>
          </div>
          <button
            type="button"
            onClick={copyList}
            className="rounded-md border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-muted"
          >
            Copy list
          </button>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-foreground/55">Total length</dt>
            <dd className="font-semibold">
              {formatLength(materials.totalFenceLength, project.unitSystem)}
            </dd>
          </div>
          <div>
            <dt className="text-foreground/55">Fill length</dt>
            <dd className="font-semibold">
              {formatLength(materials.fillLength, project.unitSystem)}
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
        </dl>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w) => (
            <div
              key={w.id}
              className={`rounded-lg border px-3 py-2 text-sm ${
                w.severity === "error"
                  ? "border-danger/40 bg-danger/10"
                  : w.severity === "warning"
                    ? "border-warning/40 bg-warning/10"
                    : "border-border bg-surface-muted"
              }`}
              role="status"
            >
              <p className="font-medium">{w.message}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {w.actions?.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="rounded border border-border bg-surface px-2 py-0.5 text-xs font-semibold"
                    onClick={() => {
                      if (a.kind === "dismiss" || a.kind === "accept_cut") {
                        dismissWarning(w.id);
                      } else {
                        dismissWarning(w.id);
                      }
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

      <div className="rounded-lg border border-border bg-surface p-3">
        <h3 className="text-sm font-semibold">Materials</h3>
        <ul className="mt-2 divide-y divide-border/70">
          {materials.lines.map((line) => {
            const active = line.highlightKeys?.some((k) =>
              highlightKeys.includes(k),
            );
            return (
              <li key={line.id}>
                <button
                  type="button"
                  className={`flex w-full items-start justify-between gap-2 py-2 text-left text-sm transition ${
                    active ? "bg-primary-soft/60" : "hover:bg-surface-muted/70"
                  }`}
                  onMouseEnter={() => setHighlights(line.highlightKeys ?? [])}
                  onMouseLeave={() => setHighlights([])}
                  onFocus={() => setHighlights(line.highlightKeys ?? [])}
                  onBlur={() => setHighlights([])}
                >
                  <span>
                    <span className="font-medium">{line.label}</span>
                    {line.note && (
                      <span className="mt-0.5 block text-xs text-foreground/55">
                        {line.note}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {line.quantity} {line.unit}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-surface-muted/60 p-3 text-xs text-foreground/70">
        <p className="font-semibold text-foreground">Assumptions</p>
        <ul className="mt-1 list-disc space-y-1 pl-4">
          {materials.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
