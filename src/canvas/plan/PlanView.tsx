"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Magnet,
  PenLine,
  Redo2,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { classifyPosts, moduleWidth, pointAlongRun } from "@/domain/geometry";
import {
  planGridInches,
  snapPointToGrid,
  snapSegment,
  snapToNearbyPoint,
} from "@/domain/snap";
import { formatLength } from "@/domain/units";
import type { Point } from "@/domain/types";
import { useProject } from "@/state/projectStore";

type DrawMode = "idle" | "drawing";

export function PlanView() {
  const {
    project,
    selectedRunId,
    selectedGateId,
    highlightKeys,
    selectRun,
    selectGate,
    addRun,
    updateRun,
    deleteRun,
    deleteGate,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useProject();
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<DrawMode>("idle");
  const [draftStart, setDraftStart] = useState<Point | null>(null);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(true);

  const grid = planGridInches(project.unitSystem);
  const minDrawLength = snapEnabled ? grid : grid * 0.25;
  const existingEnds = useMemo(
    () => project.runs.flatMap((r) => [r.start, r.end]),
    [project.runs],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "Escape" && mode === "drawing") {
        setMode("idle");
        setDraftStart(null);
        setCursor(null);
        return;
      }

      if (e.key.toLowerCase() === "s" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setSnapEnabled((on) => !on);
        return;
      }

      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        if (selectedGateId) {
          e.preventDefault();
          deleteGate(selectedGateId);
          return;
        }
        if (selectedRunId) {
          e.preventDefault();
          deleteRun(selectedRunId);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    mode,
    selectedRunId,
    selectedGateId,
    deleteRun,
    deleteGate,
    undo,
    redo,
  ]);

  /**
   * Stable planning pad (~60×40 ft imperial). Do not re-fit/zoom when the first
   * run is drawn — only expand if geometry grows past the pad.
   */
  const bounds = useMemo(() => {
    const pad = {
      minX: -grid * 2,
      minY: -grid * 2,
      maxX: grid * 52,
      maxY: grid * 36,
    };
    const pts = project.runs.flatMap((r) => [r.start, r.end]);
    if (!pts.length) return pad;

    const margin = grid * 6;
    const content = {
      minX: Math.min(...pts.map((p) => p.x)) - margin,
      minY: Math.min(...pts.map((p) => p.y)) - margin,
      maxX: Math.max(...pts.map((p) => p.x)) + margin,
      maxY: Math.max(...pts.map((p) => p.y)) + margin,
    };
    return {
      minX: Math.min(pad.minX, content.minX),
      minY: Math.min(pad.minY, content.minY),
      maxX: Math.max(pad.maxX, content.maxX),
      maxY: Math.max(pad.maxY, content.maxY),
    };
  }, [project.runs, grid]);

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const posts = useMemo(() => classifyPosts(project), [project]);
  const mod = moduleWidth(project);

  /** Map pointer → world inches using the SVG CTM (respects viewBox letterboxing). */
  function clientToWorld(e: { clientX: number; clientY: number }): Point {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const inv = ctm.inverse();
    return {
      x: inv.a * e.clientX + inv.c * e.clientY + inv.e,
      y: inv.b * e.clientX + inv.d * e.clientY + inv.f,
    };
  }

  function refinePoint(raw: Point, exclude?: Point): Point {
    if (!snapEnabled) return raw;
    const onGrid = snapPointToGrid(raw, grid);
    const candidates = exclude
      ? existingEnds.filter(
          (p) => !(Math.abs(p.x - exclude.x) < 0.1 && Math.abs(p.y - exclude.y) < 0.1),
        )
      : existingEnds;
    return snapToNearbyPoint(onGrid, candidates, grid * 1.25);
  }

  function placeSegmentEnd(start: Point, rawEnd: Point): { end: Point; length: number } {
    const refined = refinePoint(rawEnd, start);
    if (!snapEnabled) {
      const length = Math.hypot(refined.x - start.x, refined.y - start.y);
      return { end: refined, length };
    }
    return snapSegment(start, refined, grid);
  }

  function cancelDrawing() {
    setMode("idle");
    setDraftStart(null);
    setCursor(null);
  }

  function onPointerDown(e: React.PointerEvent) {
    if ((e.target as Element).closest("[data-run],[data-gate],[data-handle]"))
      return;
    if (mode !== "drawing") return;

    const raw = clientToWorld(e);
    if (!draftStart) {
      const start = refinePoint(raw);
      setDraftStart(start);
      setCursor(start);
      return;
    }

    const { end, length } = placeSegmentEnd(draftStart, raw);
    if (length >= minDrawLength) {
      addRun(draftStart, end);
    }
    cancelDrawing();
  }

  function onPointerMove(e: React.PointerEvent) {
    if (mode !== "drawing" || !draftStart) return;
    const { end } = placeSegmentEnd(draftStart, clientToWorld(e));
    setCursor(end);
  }

  const draftEnd = cursor;
  const draftLength =
    draftStart && draftEnd
      ? Math.hypot(draftEnd.x - draftStart.x, draftEnd.y - draftStart.y)
      : 0;

  const gridLabel =
    project.unitSystem === "imperial" ? "1 ft grid" : "0.5 m grid";
  const hint =
    mode !== "drawing"
      ? selectedRunId
        ? "Line selected — Delete removes it, or Undo (⌘Z / Ctrl+Z) to reverse your last change."
        : snapEnabled
          ? `Snap on (${gridLabel}, 15°). Toggle Snap off for freehand. Press S to toggle.`
          : "Snap off — freehand drawing. Toggle Snap on for grid and angle assist. Press S to toggle."
      : !draftStart
        ? snapEnabled
          ? `Click to place the start (snaps to ${gridLabel}).`
          : "Click to place the start (freehand)."
        : `Click to place the end · ${formatLength(draftLength, project.unitSystem)} · Esc cancels`;

  // Grid lines for the visible pad
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
    const startX = Math.floor(bounds.minX / grid) * grid;
    const startY = Math.floor(bounds.minY / grid) * grid;
    for (let x = startX; x <= bounds.maxX; x += grid) {
      const major = Math.round(x / grid) % 5 === 0;
      lines.push({
        x1: x,
        y1: bounds.minY,
        x2: x,
        y2: bounds.maxY,
        major,
      });
    }
    for (let y = startY; y <= bounds.maxY; y += grid) {
      const major = Math.round(y / grid) % 5 === 0;
      lines.push({
        x1: bounds.minX,
        y1: y,
        x2: bounds.maxX,
        y2: y,
        major,
      });
    }
    return lines;
  }, [bounds, grid]);

  return (
    <div className="flex h-[min(58vh,560px)] min-h-[280px] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-soft)] lg:h-[min(70vh,720px)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 text-sm">
        <span className="font-medium text-accent-teal">Plan View</span>
        <div className="flex max-w-full flex-wrap items-center gap-2">
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold ${
              mode === "drawing"
                ? "bg-primary text-white"
                : "bg-surface-muted text-foreground"
            }`}
            aria-pressed={mode === "drawing"}
            title="Draw a straight fence segment by clicking two points"
            onClick={() => {
              if (mode === "drawing") {
                cancelDrawing();
              } else {
                setMode("drawing");
                setDraftStart(null);
                setCursor(null);
              }
            }}
          >
            {mode === "drawing" ? (
              <X className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <PenLine className="size-3.5 shrink-0" aria-hidden />
            )}
            {mode === "drawing" ? "Cancel drawing" : "Add fence line"}
          </button>
          <button
            type="button"
            disabled={!canUndo}
            onClick={undo}
            className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-xs font-semibold disabled:opacity-40"
            title="Undo (⌘Z / Ctrl+Z)"
          >
            <Undo2 className="size-3.5 shrink-0" aria-hidden />
            Undo
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={redo}
            className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-xs font-semibold disabled:opacity-40"
            title="Redo"
          >
            <Redo2 className="size-3.5 shrink-0" aria-hidden />
            Redo
          </button>
          <button
            type="button"
            disabled={!selectedRunId && !selectedGateId}
            onClick={() => {
              if (selectedGateId) deleteGate(selectedGateId);
              else if (selectedRunId) deleteRun(selectedRunId);
            }}
            className="inline-flex items-center gap-1.5 rounded border border-danger/40 bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger disabled:opacity-40"
            title="Delete selected line or gate (Delete / Backspace)"
          >
            <Trash2 className="size-3.5 shrink-0" aria-hidden />
            Delete
          </button>
          <button
            type="button"
            aria-pressed={snapEnabled}
            onClick={() => setSnapEnabled((on) => !on)}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold ${
              snapEnabled
                ? "bg-accent-teal/15 text-accent-teal ring-1 ring-accent-teal/40"
                : "border border-border bg-surface text-foreground/70"
            }`}
            title={
              snapEnabled
                ? `Snap on: ${gridLabel} and 15° angles (press S)`
                : "Snap off: freehand placement (press S)"
            }
          >
            <Magnet className="size-3.5 shrink-0" aria-hidden />
            Snap {snapEnabled ? "on" : "off"}
          </button>
          <span className="text-xs text-foreground/55">
            {snapEnabled ? `${gridLabel} · 15°` : "Freehand"}
          </span>
        </div>
      </div>
      <p
        className={`border-b border-border px-3 py-1.5 text-xs ${
          mode === "drawing"
            ? "bg-primary-soft text-primary"
            : "bg-surface-muted/60 text-foreground/70"
        }`}
        role="status"
      >
        {hint}
      </p>
      <div
        className={`relative flex-1 overflow-hidden ${
          mode === "drawing" ? "cursor-crosshair" : ""
        }`}
      >
        <svg
          ref={svgRef}
          viewBox={`${bounds.minX} ${bounds.minY} ${width} ${height}`}
          className="h-full w-full touch-none bg-[#f3f0e8]"
          role="img"
          aria-label="Top-down fence plan. Use Add fence line, then click start and end points."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          {gridLines.map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={
                snapEnabled
                  ? line.major
                    ? "rgba(42,111,122,0.18)"
                    : "rgba(42,111,122,0.08)"
                  : line.major
                    ? "rgba(42,111,122,0.08)"
                    : "rgba(42,111,122,0.03)"
              }
              strokeWidth={line.major ? 2 : 1}
            />
          ))}

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
                  stroke={
                    selected || highlighted
                      ? "var(--primary)"
                      : "var(--accent-teal)"
                  }
                  strokeWidth={selected ? 14 : 10}
                  strokeLinecap="round"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectRun(run.id);
                  }}
                />
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
                        r={4}
                        fill="var(--sand)"
                        opacity={0.75}
                      />
                    );
                  })}
                <text
                  x={(run.start.x + run.end.x) / 2}
                  y={(run.start.y + run.end.y) / 2 - 14}
                  textAnchor="middle"
                  fontSize={Math.max(14, grid * 0.7)}
                  fill="var(--foreground)"
                  className="pointer-events-none select-none"
                  fontWeight={600}
                >
                  {formatLength(run.length, project.unitSystem)}
                </text>
                {[run.start, run.end].map((pt, idx) => (
                  <circle
                    key={idx}
                    data-handle
                    cx={pt.x}
                    cy={pt.y}
                    r={Math.max(10, grid * 0.35)}
                    fill="var(--surface)"
                    stroke="var(--accent-teal)"
                    strokeWidth={3}
                    className="cursor-move"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      selectRun(run.id);
                      const fixed = idx === 0 ? run.end : run.start;
                      const move = (ev: PointerEvent) => {
                        const { end } = placeSegmentEnd(fixed, clientToWorld(ev));
                        // When dragging start, invert: fixed is end
                        if (idx === 0) {
                          updateRun(run.id, { start: end, end: fixed });
                        } else {
                          updateRun(run.id, { start: fixed, end });
                        }
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
                  strokeWidth={12}
                  strokeDasharray="10 8"
                />
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 + 20}
                  textAnchor="middle"
                  fontSize={Math.max(12, grid * 0.55)}
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
            const r = post.type === "gate" ? 8 : 6;
            if (post.type === "corner" || post.type === "terminal") {
              return (
                <rect
                  key={post.id}
                  x={post.point.x - 7}
                  y={post.point.y - 7}
                  width={14}
                  height={14}
                  fill={colors[post.type]}
                  stroke={hl ? "#000" : "none"}
                  strokeWidth={hl ? 2 : 0}
                  transform={`rotate(45 ${post.point.x} ${post.point.y})`}
                />
              );
            }
            return (
              <circle
                key={post.id}
                cx={post.point.x}
                cy={post.point.y}
                r={r}
                fill={colors[post.type] ?? "var(--accent-teal)"}
                stroke={hl ? "#000" : "var(--surface)"}
                strokeWidth={hl ? 2 : 1}
              />
            );
          })}

          {mode === "drawing" && draftStart && draftEnd && draftLength >= grid && (
            <g>
              <line
                x1={draftStart.x}
                y1={draftStart.y}
                x2={draftEnd.x}
                y2={draftEnd.y}
                stroke="var(--primary)"
                strokeWidth={10}
                strokeDasharray="14 10"
                strokeLinecap="round"
              />
              <text
                x={(draftStart.x + draftEnd.x) / 2}
                y={(draftStart.y + draftEnd.y) / 2 - 16}
                textAnchor="middle"
                fontSize={Math.max(16, grid * 0.75)}
                fill="var(--primary)"
                fontWeight={700}
              >
                {formatLength(draftLength, project.unitSystem)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
