"use client";

import { useMemo, useRef, useState } from "react";
import { classifyPosts, moduleWidth, pointAlongRun } from "@/domain/geometry";
import { formatLength } from "@/domain/units";
import { useProject } from "@/state/projectStore";

type DrawMode = "idle" | "drawing";

function snapPoint(
  from: { x: number; y: number } | null,
  to: { x: number; y: number },
  snapAngles = true,
): { x: number; y: number } {
  if (!from || !snapAngles) return to;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return to;
  const angle = Math.atan2(dy, dx);
  const step = Math.PI / 4;
  const snapped = Math.round(angle / step) * step;
  return {
    x: from.x + Math.cos(snapped) * dist,
    y: from.y + Math.sin(snapped) * dist,
  };
}

export function PlanView() {
  const {
    project,
    selectedRunId,
    highlightKeys,
    selectRun,
    selectGate,
    addRun,
    updateRun,
  } = useProject();
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<DrawMode>("idle");
  const [draftStart, setDraftStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const bounds = useMemo(() => {
    const pts = project.runs.flatMap((r) => [r.start, r.end]);
    if (!pts.length) return { minX: -50, minY: -50, maxX: 600, maxY: 400 };
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const pad = 80;
    return {
      minX: Math.min(...xs) - pad,
      minY: Math.min(...ys) - pad,
      maxX: Math.max(...xs) + pad,
      maxY: Math.max(...ys) + pad,
    };
  }, [project.runs]);

  const width = Math.max(400, bounds.maxX - bounds.minX);
  const height = Math.max(300, bounds.maxY - bounds.minY);
  const posts = useMemo(() => classifyPosts(project), [project]);
  const mod = moduleWidth(project);

  function clientToWorld(e: React.PointerEvent): { x: number; y: number } {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x =
      ((e.clientX - rect.left) / rect.width) * width + bounds.minX;
    const y =
      ((e.clientY - rect.top) / rect.height) * height + bounds.minY;
    return { x, y };
  }

  function onPointerDown(e: React.PointerEvent) {
    if ((e.target as Element).closest("[data-run],[data-gate],[data-handle]"))
      return;
    const p = clientToWorld(e);
    if (mode === "idle") {
      setMode("drawing");
      setDraftStart(p);
      setCursor(p);
    } else if (mode === "drawing" && draftStart) {
      const end = snapPoint(draftStart, p);
      if (Math.hypot(end.x - draftStart.x, end.y - draftStart.y) > 12) {
        addRun(draftStart, end);
      }
      setMode("idle");
      setDraftStart(null);
      setCursor(null);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (mode !== "drawing" || !draftStart) return;
    setCursor(snapPoint(draftStart, clientToWorld(e)));
  }

  const draftEnd = cursor;

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-lg border border-border bg-surface shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 text-sm">
        <span className="font-medium text-accent-teal">Plan View</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded px-2 py-1 text-xs font-semibold ${
              mode === "drawing"
                ? "bg-primary text-white"
                : "bg-surface-muted text-foreground"
            }`}
            onClick={() => {
              setMode((m) => (m === "drawing" ? "idle" : "drawing"));
              setDraftStart(null);
            }}
          >
            {mode === "drawing" ? "Drawing…" : "Draw run"}
          </button>
          <span className="text-xs text-foreground/55">Snap: 45°</span>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden bg-[linear-gradient(to_right,rgba(42,111,122,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(42,111,122,0.06)_1px,transparent_1px)] bg-size-[24px_24px]">
        <svg
          ref={svgRef}
          viewBox={`${bounds.minX} ${bounds.minY} ${width} ${height}`}
          className="h-full w-full touch-none"
          role="img"
          aria-label="Top-down fence plan"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          {project.runs.map((run) => {
            const selected = selectedRunId === run.id;
            const highlighted =
              highlightKeys.includes(`run:${run.id}`) ||
              highlightKeys.includes("panel:cut") ||
              highlightKeys.includes("panel:full");
            return (
              <g key={run.id} data-run={run.id}>
                <line
                  x1={run.start.x}
                  y1={run.start.y}
                  x2={run.end.x}
                  y2={run.end.y}
                  stroke={selected || highlighted ? "var(--primary)" : "var(--accent-teal)"}
                  strokeWidth={selected ? 10 : 7}
                  strokeLinecap="round"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectRun(run.id);
                  }}
                />
                {/* Panel ticks */}
                {project.fenceType === "panel" &&
                  mod > 0 &&
                  Array.from({
                    length: Math.floor(run.length / mod),
                  }).map((_, i) => {
                    const p = pointAlongRun(run, (i + 1) * mod);
                    return (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={3}
                        fill="var(--sand)"
                        opacity={0.7}
                      />
                    );
                  })}
                <text
                  x={(run.start.x + run.end.x) / 2}
                  y={(run.start.y + run.end.y) / 2 - 12}
                  textAnchor="middle"
                  fontSize={14}
                  fill="var(--foreground)"
                  className="pointer-events-none select-none"
                >
                  {formatLength(run.length, project.unitSystem)}
                </text>
                {/* End handles */}
                {[run.start, run.end].map((pt, idx) => (
                  <circle
                    key={idx}
                    data-handle
                    cx={pt.x}
                    cy={pt.y}
                    r={8}
                    fill="var(--surface)"
                    stroke="var(--accent-teal)"
                    strokeWidth={2}
                    className="cursor-move"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      selectRun(run.id);
                      const move = (ev: PointerEvent) => {
                        const svg = svgRef.current;
                        if (!svg) return;
                        const rect = svg.getBoundingClientRect();
                        const x =
                          ((ev.clientX - rect.left) / rect.width) * width +
                          bounds.minX;
                        const y =
                          ((ev.clientY - rect.top) / rect.height) * height +
                          bounds.minY;
                        if (idx === 0) updateRun(run.id, { start: { x, y } });
                        else updateRun(run.id, { end: { x, y } });
                      };
                      const up = () => {
                        window.removeEventListener("pointermove", move);
                        window.removeEventListener("pointerup", up);
                      };
                      window.addEventListener("pointermove", move);
                      window.addEventListener("pointerup", up);
                    }}
                  />
                ))}
              </g>
            );
          })}

          {project.gates.map((gate) => {
            const run = project.runs.find((r) => r.id === gate.runId);
            if (!run) return null;
            const a = pointAlongRun(run, gate.offsetFromRunStart);
            const b = pointAlongRun(run, gate.offsetFromRunStart + gate.width);
            return (
              <g
                key={gate.id}
                data-gate={gate.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  selectGate(gate.id);
                  selectRun(run.id);
                }}
              >
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--accent-amber)"
                  strokeWidth={10}
                  strokeDasharray="8 6"
                />
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 + 18}
                  textAnchor="middle"
                  fontSize={12}
                  fill="var(--accent-amber)"
                  fontWeight={700}
                >
                  GATE
                </text>
              </g>
            );
          })}

          {posts.map((post) => {
            const hl =
              highlightKeys.includes(`post:${post.type}`) ||
              highlightKeys.includes("post:all");
            const colors: Record<string, string> = {
              line: "var(--accent-teal)",
              corner: "var(--primary)",
              end: "var(--wood)",
              gate: "var(--accent-amber)",
              terminal: "var(--primary)",
              structure: "var(--foreground)",
            };
            const shape =
              post.type === "corner" || post.type === "terminal" ? (
                <rect
                  x={post.point.x - 6}
                  y={post.point.y - 6}
                  width={12}
                  height={12}
                  fill={colors[post.type]}
                  stroke={hl ? "#000" : "none"}
                  strokeWidth={hl ? 2 : 0}
                  transform={`rotate(45 ${post.point.x} ${post.point.y})`}
                />
              ) : (
                <circle
                  cx={post.point.x}
                  cy={post.point.y}
                  r={post.type === "gate" ? 7 : 5}
                  fill={colors[post.type] ?? "var(--accent-teal)"}
                  stroke={hl ? "#000" : "var(--surface)"}
                  strokeWidth={hl ? 2 : 1}
                />
              );
            return <g key={post.id}>{shape}</g>;
          })}

          {mode === "drawing" && draftStart && draftEnd && (
            <line
              x1={draftStart.x}
              y1={draftStart.y}
              x2={draftEnd.x}
              y2={draftEnd.y}
              stroke="var(--primary)"
              strokeWidth={6}
              strokeDasharray="10 8"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
