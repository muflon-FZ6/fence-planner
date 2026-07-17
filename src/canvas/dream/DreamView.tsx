"use client";

import { useEffect, useMemo, useState } from "react";
import { classifyPosts, pointAlongRun } from "@/domain/geometry";
import { inchesToFeet } from "@/domain/units";
import type { FenceFinish, FenceProject } from "@/domain/types";
import { useProject } from "@/state/projectStore";

const FINISH_COLORS: Record<FenceFinish, string> = {
  natural_cedar: "#b07a45",
  warm_brown: "#6e4220",
  charcoal: "#3a3a3a",
  white_vinyl: "#f4f1ea",
  tan_vinyl: "#d2b48c",
  galvanized: "#9aa0a6",
  black_chain_link: "#2b2b2b",
};

/** Isometric projection helpers */
function iso(x: number, y: number, z = 0) {
  return {
    x: (x - y) * 0.86,
    y: (x + y) * 0.5 - z,
  };
}

function DreamFallback({ project }: { project: FenceProject }) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-lg border border-border bg-sky/40 p-6 text-center">
      <p className="font-display text-xl text-primary">Dream View unavailable</p>
      <p className="mt-2 max-w-sm text-sm text-foreground/70">
        Plan View and materials still work. Your geometry is preserved.
      </p>
      <p className="mt-4 text-sm">
        {project.runs.length} runs ·{" "}
        {inchesToFeet(project.settings.fenceHeight).toFixed(0)} ft high ·{" "}
        {project.gates.length} gate{project.gates.length === 1 ? "" : "s"}
      </p>
      <p className="mt-2 max-w-md text-xs text-foreground/60">
        {dreamDescription(project)}
      </p>
    </div>
  );
}

type DreamViewProps = {
  fallback?: boolean;
  /** Frozen plan snapshot for on-demand preview (not live). */
  snapshot?: FenceProject | null;
  subtitle?: string;
};

export function DreamView({
  fallback = false,
  snapshot = null,
  subtitle,
}: DreamViewProps) {
  const live = useProject();
  const [preview, setPreview] = useState<FenceProject | null>(null);

  useEffect(() => {
    setPreview(snapshot ? structuredClone(snapshot) : null);
  }, [snapshot]);

  const project = preview ?? live.project;
  const selectedRunId = preview ? null : live.selectedRunId;

  function toggleGate(gateId: string) {
    if (preview) {
      setPreview({
        ...preview,
        gates: preview.gates.map((g) =>
          g.id === gateId ? { ...g, swingOpen: !g.swingOpen } : g,
        ),
      });
      return;
    }
    const gate = live.project.gates.find((g) => g.id === gateId);
    if (gate) live.updateGate(gateId, { swingOpen: !gate.swingOpen });
  }

  const posts = useMemo(() => classifyPosts(project), [project]);
  const height = Math.max(24, project.settings.fenceHeight * 0.35);
  const color = FINISH_COLORS[project.settings.finish] ?? "#b07a45";

  const groundTone =
    project.scene.ground === "gravel"
      ? "#c4b89a"
      : project.scene.ground === "patio"
        ? "#b8b0a4"
        : project.scene.ground === "mixed"
          ? "#8fa87a"
          : "#6f9b6a";

  const skyTone =
    project.scene.daylight === "evening"
      ? "#f0c9a0"
      : project.scene.daylight === "morning"
        ? "#d8e8f0"
        : "#c5d9e3";

  const bounds = useMemo(() => {
    const pts = project.runs.flatMap((r) => [r.start, r.end]);
    if (!pts.length) return { minX: 0, minY: 0, maxX: 400, maxY: 300, cx: 200, cy: 150 };
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return {
      minX,
      maxX,
      minY,
      maxY,
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
    };
  }, [project.runs]);

  const scale = 0.55;
  const origin = { x: 280, y: 220 };

  function worldToIso(x: number, y: number, z = 0) {
    const nx = (x - bounds.cx) * scale;
    const ny = (y - bounds.cy) * scale;
    const p = iso(nx, ny, z);
    return { x: origin.x + p.x, y: origin.y + p.y };
  }

  if (fallback) {
    return <DreamFallback project={project} />;
  }

  return (
      <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-soft)] animate-soft-rise">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 text-sm">
          <span className="font-medium text-primary">
            {preview ? "Dream preview" : "Dream View"}
          </span>
          <span className="text-xs text-foreground/55">
            {subtitle ??
              (preview
                ? "Rendered from your plan — illustrative only"
                : "Illustrative — not a survey rendering")}
          </span>
        </div>
        <svg
          viewBox="0 0 560 360"
          className="h-full w-full"
          role="img"
          aria-label={dreamDescription(project)}
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={skyTone} />
              <stop offset="100%" stopColor="#f6f3ec" />
            </linearGradient>
          </defs>
          <rect width="560" height="360" fill="url(#sky)" />
          {/* Ground plane */}
          <polygon
            points="80,240 280,320 480,240 280,160"
            fill={groundTone}
            opacity={0.9}
          />
          {/* House massing */}
          {project.scene.housePosition !== "none" && (
            <g opacity={0.95}>
              <polygon
                points={
                  project.scene.housePosition === "left"
                    ? "120,150 200,110 240,150 160,190"
                    : project.scene.housePosition === "right"
                      ? "320,150 400,110 440,150 360,190"
                      : "220,140 300,100 340,140 260,180"
                }
                fill={
                  project.scene.houseTone === "brick"
                    ? "#a45a45"
                    : project.scene.houseTone === "dark"
                      ? "#3d3d3d"
                      : project.scene.houseTone === "light"
                        ? "#f0ebe3"
                        : "#d9d0c4"
                }
              />
              <polygon
                points={
                  project.scene.housePosition === "center"
                    ? "220,140 300,100 340,140 260,180"
                    : project.scene.housePosition === "left"
                      ? "120,150 200,110 240,150 160,190"
                      : "320,150 400,110 440,150 360,190"
                }
                fill="none"
                stroke="rgba(0,0,0,0.15)"
              />
            </g>
          )}

          {/* Fence runs as extruded boards */}
          {project.runs.map((run) => {
            const a = worldToIso(run.start.x, run.start.y, 0);
            const b = worldToIso(run.end.x, run.end.y, 0);
            const aTop = worldToIso(run.start.x, run.start.y, height);
            const bTop = worldToIso(run.end.x, run.end.y, height);
            const selected = selectedRunId === run.id;
            const isChain = project.fenceType === "chain_link";
            return (
              <g key={run.id} opacity={selected ? 1 : 0.92}>
                <polygon
                  points={`${a.x},${a.y} ${b.x},${b.y} ${bTop.x},${bTop.y} ${aTop.x},${aTop.y}`}
                  fill={color}
                  stroke={selected ? "var(--primary)" : "rgba(0,0,0,0.2)"}
                  strokeWidth={selected ? 2 : 1}
                  opacity={isChain ? 0.55 : 0.95}
                />
                {!isChain &&
                  project.settings.boardOrientation === "horizontal" &&
                  [0.25, 0.5, 0.75].map((t) => {
                    const y1 = a.y + (aTop.y - a.y) * t;
                    const y2 = b.y + (bTop.y - b.y) * t;
                    const x1 = a.x + (aTop.x - a.x) * t;
                    const x2 = b.x + (bTop.x - b.x) * t;
                    return (
                      <line
                        key={t}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(0,0,0,0.12)"
                        strokeWidth={1}
                      />
                    );
                  })}
              </g>
            );
          })}

          {/* Gates */}
          {project.gates.map((gate) => {
            const run = project.runs.find((r) => r.id === gate.runId);
            if (!run) return null;
            const open = gate.swingOpen ? 0.35 : 0;
            const a = pointAlongRun(run, gate.offsetFromRunStart);
            const b = pointAlongRun(
              run,
              gate.offsetFromRunStart + gate.width * (1 - open),
            );
            const pa = worldToIso(a.x, a.y, 0);
            const pb = worldToIso(b.x + (open ? 20 : 0), b.y, 0);
            const paTop = worldToIso(a.x, a.y, height * 0.9);
            const pbTop = worldToIso(b.x + (open ? 20 : 0), b.y, height * 0.9);
            return (
              <g
                key={gate.id}
                className="cursor-pointer"
                onClick={() =>
                  toggleGate(gate.id)
                }
              >
                <polygon
                  points={`${pa.x},${pa.y} ${pb.x},${pb.y} ${pbTop.x},${pbTop.y} ${paTop.x},${paTop.y}`}
                  fill="var(--accent-amber)"
                  opacity={0.85}
                />
              </g>
            );
          })}

          {/* Posts */}
          {posts.map((post) => {
            const base = worldToIso(post.point.x, post.point.y, 0);
            const top = worldToIso(post.point.x, post.point.y, height);
            return (
              <line
                key={post.id}
                x1={base.x}
                y1={base.y}
                x2={top.x}
                y2={top.y}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth={3}
                strokeLinecap="round"
              />
            );
          })}

          {project.scene.showSilhouette && (
            <g opacity={0.35} transform="translate(420, 200)">
              <ellipse cx="0" cy="40" rx="12" ry="4" fill="#1c2420" />
              <rect x="-8" y="0" width="16" height="40" rx="6" fill="#1c2420" />
              <circle cx="0" cy="-8" r="8" fill="#1c2420" />
            </g>
          )}
        </svg>
      </div>
  );
}

function dreamDescription(project: {
  runs: { length: number }[];
  gates: unknown[];
  settings: { fenceHeight: number; finish: string };
  fenceType: string;
}): string {
  const total = project.runs.reduce((s, r) => s + r.length, 0);
  return `${project.fenceType.replace("_", " ")} fence, ${inchesToFeet(total).toFixed(0)} feet total, ${inchesToFeet(project.settings.fenceHeight).toFixed(0)} feet high, ${project.gates.length} gates, ${project.settings.finish.replace("_", " ")} finish.`;
}

export type DreamRenderer = {
  render: typeof DreamView;
};
