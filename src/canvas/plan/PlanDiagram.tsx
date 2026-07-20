"use client";

import { useMemo } from "react";
import { classifyPosts, moduleWidth, pointAlongRun } from "@/domain/geometry";
import { planGridInches } from "@/domain/snap";
import { formatLength } from "@/domain/units";
import type { FenceProject } from "@/domain/types";

type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

function contentBounds(project: FenceProject, grid: number): Bounds {
  const pts = project.runs.flatMap((r) => [r.start, r.end]);
  if (!pts.length) {
    return {
      minX: -grid * 2,
      minY: -grid * 2,
      maxX: grid * 24,
      maxY: grid * 16,
    };
  }
  const margin = grid * 4;
  return {
    minX: Math.min(...pts.map((p) => p.x)) - margin,
    minY: Math.min(...pts.map((p) => p.y)) - margin,
    maxX: Math.max(...pts.map((p) => p.x)) + margin,
    maxY: Math.max(...pts.map((p) => p.y)) + margin,
  };
}

function buildGridLines(bounds: Bounds, grid: number) {
  const lines: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    major: boolean;
  }[] = [];
  const startX = Math.floor(bounds.minX / grid) * grid;
  const startY = Math.floor(bounds.minY / grid) * grid;
  for (let x = startX; x <= bounds.maxX; x += grid) {
    lines.push({
      x1: x,
      y1: bounds.minY,
      x2: x,
      y2: bounds.maxY,
      major: Math.round(x / grid) % 5 === 0,
    });
  }
  for (let y = startY; y <= bounds.maxY; y += grid) {
    lines.push({
      x1: bounds.minX,
      y1: y,
      x2: bounds.maxX,
      y2: y,
      major: Math.round(y / grid) % 5 === 0,
    });
  }
  return lines;
}

/** Static top-down plan (grid, runs, posts, gates) for print / read-only views. */
export function PlanDiagram({
  project,
  className = "",
}: {
  project: FenceProject;
  className?: string;
}) {
  const grid = planGridInches(project.unitSystem);
  const bounds = useMemo(
    () => contentBounds(project, grid),
    [project, grid],
  );
  const width = bounds.maxX - bounds.minX;
  const height = Math.max(bounds.maxY - bounds.minY, grid * 8);
  const gridLines = useMemo(
    () => buildGridLines(bounds, grid),
    [bounds, grid],
  );
  const posts = useMemo(() => classifyPosts(project), [project]);
  const mod = moduleWidth(project);
  const gridLabel =
    project.unitSystem === "imperial" ? "1 ft grid" : "0.5 m grid";
  const labelSize = Math.max(14, grid * 0.65);
  const strokeScale = Math.max(8, grid * 0.55);

  return (
    <div className={className}>
      <svg
        viewBox={`${bounds.minX} ${bounds.minY} ${width} ${height}`}
        className="w-full border border-black/25 bg-[#f3f0e8]"
        role="img"
        aria-label="Top-down measured fence plan"
      >
        {gridLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={
              line.major ? "rgba(42,111,122,0.22)" : "rgba(42,111,122,0.1)"
            }
            strokeWidth={line.major ? 2 : 1}
          />
        ))}

        {project.runs.map((run) => (
          <g key={run.id}>
            <line
              x1={run.start.x}
              y1={run.start.y}
              x2={run.end.x}
              y2={run.end.y}
              stroke="#2a6f7a"
              strokeWidth={strokeScale}
              strokeLinecap="round"
            />
            {project.fenceType === "panel" &&
              mod > 0 &&
              Array.from({ length: Math.floor(run.length / mod) }).map(
                (_, i) => {
                  const p = pointAlongRun(run, (i + 1) * mod);
                  return (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={Math.max(3, grid * 0.2)}
                      fill="#c4a574"
                      opacity={0.85}
                    />
                  );
                },
              )}
            <text
              x={(run.start.x + run.end.x) / 2}
              y={(run.start.y + run.end.y) / 2 - grid * 0.9}
              textAnchor="middle"
              fontSize={labelSize}
              fill="#1a1a1a"
              fontWeight={600}
            >
              {formatLength(run.length, project.unitSystem)}
            </text>
            {[run.start, run.end].map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={Math.max(8, grid * 0.3)}
                fill="#faf8f4"
                stroke="#2a6f7a"
                strokeWidth={2.5}
              />
            ))}
          </g>
        ))}

        {project.gates.map((gate) => {
          const run = project.runs.find((r) => r.id === gate.runId);
          if (!run) return null;
          const a = pointAlongRun(run, gate.offsetFromRunStart);
          const b = pointAlongRun(
            run,
            gate.offsetFromRunStart + gate.width,
          );
          return (
            <g key={gate.id}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#c47a2a"
                strokeWidth={strokeScale * 1.1}
                strokeDasharray={`${grid * 0.7} ${grid * 0.45}`}
              />
              <text
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 + grid * 1.2}
                textAnchor="middle"
                fontSize={Math.max(12, grid * 0.5)}
                fill="#c47a2a"
                fontWeight={700}
              >
                GATE · {formatLength(gate.width, project.unitSystem)}
              </text>
            </g>
          );
        })}

        {posts.map((post) => {
          const colors: Record<string, string> = {
            line: "#2a6f7a",
            corner: "#1f4d56",
            end: "#8b5a2b",
            gate: "#c47a2a",
            terminal: "#1f4d56",
            structure: "#222222",
          };
          const fill = colors[post.type] ?? "#2a6f7a";
          if (post.type === "corner" || post.type === "terminal") {
            const s = Math.max(10, grid * 0.45);
            return (
              <rect
                key={post.id}
                x={post.point.x - s / 2}
                y={post.point.y - s / 2}
                width={s}
                height={s}
                fill={fill}
                transform={`rotate(45 ${post.point.x} ${post.point.y})`}
              />
            );
          }
          return (
            <circle
              key={post.id}
              cx={post.point.x}
              cy={post.point.y}
              r={post.type === "gate" ? Math.max(7, grid * 0.35) : Math.max(5, grid * 0.28)}
              fill={fill}
              stroke="#faf8f4"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Scale note in corner (screen units ≈ inches) */}
        <text
          x={bounds.minX + grid * 0.6}
          y={bounds.maxY - grid * 0.5}
          fontSize={Math.max(11, grid * 0.45)}
          fill="rgba(26,26,26,0.55)"
        >
          {gridLabel}
        </text>
      </svg>
    </div>
  );
}
