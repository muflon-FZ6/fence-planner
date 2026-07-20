import type { FenceProject, FenceRun, Gate, Joint, Point, PostType } from "./types";
import { cryptoRandomId } from "./defaults";

export function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function runLengthFromPoints(run: Pick<FenceRun, "start" | "end">): number {
  return distance(run.start, run.end);
}

export function pointAlongRun(run: FenceRun, offset: number): Point {
  const len = run.length || distance(run.start, run.end);
  if (len === 0) return { ...run.start };
  const t = Math.min(1, Math.max(0, offset / len));
  return {
    x: run.start.x + (run.end.x - run.start.x) * t,
    y: run.start.y + (run.end.y - run.start.y) * t,
  };
}

export function pointsEqual(a: Point, b: Point, epsilon = 0.5): boolean {
  return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
}

export function totalRunLength(project: FenceProject): number {
  return project.runs.reduce((sum, r) => sum + r.length, 0);
}

export function totalGateWidth(project: FenceProject, runId?: string): number {
  return project.gates
    .filter((g) => (runId ? g.runId === runId : true))
    .reduce((sum, g) => sum + g.width, 0);
}

export function fillLengthForRun(project: FenceProject, run: FenceRun): number {
  return Math.max(0, run.length - totalGateWidth(project, run.id));
}

export function totalFillLength(project: FenceProject): number {
  return project.runs.reduce((sum, r) => sum + fillLengthForRun(project, r), 0);
}

/** Angle between two vectors at a joint (degrees). */
export function jointAngleDegrees(
  from: Point,
  joint: Point,
  to: Point,
): number {
  const v1 = { x: from.x - joint.x, y: from.y - joint.y };
  const v2 = { x: to.x - joint.x, y: to.y - joint.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
  if (mag === 0) return 180;
  const cos = Math.min(1, Math.max(-1, dot / mag));
  return (Math.acos(cos) * 180) / Math.PI;
}

export type ClassifiedPost = {
  id: string;
  type: PostType;
  point: Point;
  runIds: string[];
  gateId?: string;
};

const CORNER_ANGLE_THRESHOLD = 150;

/**
 * Classify posts from runs, gates, and joints without double-counting shared ends.
 */
export function classifyPosts(project: FenceProject): ClassifiedPost[] {
  const posts: ClassifiedPost[] = [];
  const usedKeys = new Set<string>();

  const keyFor = (p: Point) => `${Math.round(p.x * 10)}_${Math.round(p.y * 10)}`;

  const addPost = (post: ClassifiedPost) => {
    const key = keyFor(post.point);
    if (usedKeys.has(key)) {
      const existing = posts.find((x) => keyFor(x.point) === key);
      if (existing) {
        // Promote priority: gate > corner > end > structure > terminal > line
        const rank: Record<PostType, number> = {
          gate: 6,
          corner: 5,
          end: 4,
          structure: 3,
          terminal: 2,
          line: 1,
        };
        if (rank[post.type] > rank[existing.type]) {
          existing.type = post.type;
        }
        existing.runIds = Array.from(new Set([...existing.runIds, ...post.runIds]));
        if (post.gateId) existing.gateId = post.gateId;
      }
      return;
    }
    usedKeys.add(key);
    posts.push(post);
  };

  // Gate posts first
  for (const gate of project.gates) {
    const run = project.runs.find((r) => r.id === gate.runId);
    if (!run) continue;
    const start = pointAlongRun(run, gate.offsetFromRunStart);
    const end = pointAlongRun(run, gate.offsetFromRunStart + gate.width);
    addPost({
      id: cryptoRandomId(),
      type: project.fenceType === "chain_link" ? "terminal" : "gate",
      point: start,
      runIds: [run.id],
      gateId: gate.id,
    });
    addPost({
      id: cryptoRandomId(),
      type: project.fenceType === "chain_link" ? "terminal" : "gate",
      point: end,
      runIds: [run.id],
      gateId: gate.id,
    });
  }

  // Endpoint / joint posts
  for (const run of project.runs) {
    for (const endpoint of [run.start, run.end] as const) {
      const connected = project.runs.filter(
        (r) =>
          r.id !== run.id &&
          (pointsEqual(r.start, endpoint) || pointsEqual(r.end, endpoint)),
      );
      const joint = project.joints.find((j) => pointsEqual(j.point, endpoint));
      let type: PostType = "end";

      if (joint?.type === "structure_connection") {
        type = "structure";
      } else if (connected.length > 0) {
        const other = connected[0];
        const otherEnd = pointsEqual(other.start, endpoint) ? other.end : other.start;
        const thisOther = pointsEqual(run.start, endpoint) ? run.end : run.start;
        const angle = jointAngleDegrees(thisOther, endpoint, otherEnd);
        type =
          angle < CORNER_ANGLE_THRESHOLD
            ? project.fenceType === "chain_link"
              ? "terminal"
              : "corner"
            : project.fenceType === "chain_link"
              ? "line"
              : "end";
        if (angle >= CORNER_ANGLE_THRESHOLD && project.fenceType !== "chain_link") {
          // Straight connection — still one shared post, treat as line/end shared
          type = "line";
        }
      } else if (project.fenceType === "chain_link") {
        type = "terminal";
      }

      addPost({
        id: cryptoRandomId(),
        type,
        point: endpoint,
        runIds: [run.id, ...connected.map((c) => c.id)],
      });
    }
  }

  // Line posts along fill segments.
  // Panel cut-bay rule: every purchased bay needs posts at both ends. When a
  // remainder > 0.5 in creates a cut bay, also place a post at the last
  // full-module boundary (e.g. 900 in on a 960 in / 100 in module run).
  // Exact multiples keep the final boundary as the segment endpoint only.
  const CUT_REMAINDER_EPSILON_IN = 0.5;
  const spacing =
    project.fenceType === "panel"
      ? moduleWidth(project)
      : project.settings.postSpacing;

  for (const run of project.runs) {
    const segments = fillSegments(project, run);
    for (const seg of segments) {
      if (seg.length <= 0 || spacing <= 0) continue;
      const full = Math.max(0, Math.floor(seg.length / spacing));
      const remainder = seg.length - full * spacing;
      const hasCutBay = remainder > CUT_REMAINDER_EPSILON_IN;
      // hasCutBay: place i = 1..full (includes last full-module mark)
      // exact: place i = 1..full-1 (final mark is the endpoint)
      const lastInternalIndex = hasCutBay ? full : full - 1;
      for (let i = 1; i <= lastInternalIndex; i++) {
        const offset = seg.startOffset + i * spacing;
        // Avoid placing on gate posts (dedupe/promote also handles coincidence)
        if (isNearGatePost(project, run, offset)) continue;
        addPost({
          id: cryptoRandomId(),
          type: "line",
          point: pointAlongRun(run, offset),
          runIds: [run.id],
        });
      }
    }
  }

  return posts;
}

export function moduleWidth(project: FenceProject): number {
  const { panelWidth, postWidth, moduleWidthMode } = project.settings;
  if (moduleWidthMode === "includes_post") return panelWidth;
  return panelWidth + postWidth;
}

export type FillSegment = {
  runId: string;
  startOffset: number;
  endOffset: number;
  length: number;
};

export function fillSegments(project: FenceProject, run: FenceRun): FillSegment[] {
  const gates = project.gates
    .filter((g) => g.runId === run.id)
    .slice()
    .sort((a, b) => a.offsetFromRunStart - b.offsetFromRunStart);

  const segments: FillSegment[] = [];
  let cursor = 0;
  for (const gate of gates) {
    const gateStart = Math.max(0, Math.min(run.length, gate.offsetFromRunStart));
    const gateEnd = Math.max(
      gateStart,
      Math.min(run.length, gate.offsetFromRunStart + gate.width),
    );
    if (gateStart > cursor) {
      segments.push({
        runId: run.id,
        startOffset: cursor,
        endOffset: gateStart,
        length: gateStart - cursor,
      });
    }
    cursor = gateEnd;
  }
  if (cursor < run.length) {
    segments.push({
      runId: run.id,
      startOffset: cursor,
      endOffset: run.length,
      length: run.length - cursor,
    });
  }
  return segments;
}

function isNearGatePost(
  project: FenceProject,
  run: FenceRun,
  offset: number,
  epsilon = 2,
): boolean {
  return project.gates.some((g) => {
    if (g.runId !== run.id) return false;
    return (
      Math.abs(g.offsetFromRunStart - offset) < epsilon ||
      Math.abs(g.offsetFromRunStart + g.width - offset) < epsilon
    );
  });
}

export function rebuildJoints(project: FenceProject): Joint[] {
  const joints: Joint[] = [];
  const seen = new Set<string>();

  for (const run of project.runs) {
    for (const point of [run.start, run.end]) {
      const key = `${Math.round(point.x * 10)}_${Math.round(point.y * 10)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const connected = project.runs.filter(
        (r) => pointsEqual(r.start, point) || pointsEqual(r.end, point),
      );
      const existing = project.joints.find((j) => pointsEqual(j.point, point));
      let type: Joint["type"] = "end";
      if (existing?.type === "structure_connection") {
        type = "structure_connection";
      } else if (connected.length >= 2) {
        const a = connected[0];
        const b = connected[1];
        const aOther = pointsEqual(a.start, point) ? a.end : a.start;
        const bOther = pointsEqual(b.start, point) ? b.end : b.start;
        const angle = jointAngleDegrees(aOther, point, bOther);
        type = angle < CORNER_ANGLE_THRESHOLD ? "corner" : "straight";
      }
      joints.push({
        id: existing?.id ?? cryptoRandomId(),
        point: { ...point },
        connectedRunIds: connected.map((c) => c.id),
        type,
      });
    }
  }
  return joints;
}

export function syncRunLengths(runs: FenceRun[]): FenceRun[] {
  return runs.map((r) => ({
    ...r,
    length: distance(r.start, r.end),
  }));
}

export function gatesOnRun(project: FenceProject, runId: string): Gate[] {
  return project.gates.filter((g) => g.runId === runId);
}
