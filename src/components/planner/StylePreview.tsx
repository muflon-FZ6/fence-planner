"use client";

import { useId } from "react";
import { styleSummary } from "@/domain/styleDefaults";
import { moduleWidth } from "@/domain/geometry";
import type { FenceFinish, FenceProject, FenceSettings } from "@/domain/types";
import {
  formatLength,
  formatSmallLength,
  inchesToFeet,
} from "@/domain/units";
import { useProject } from "@/state/projectStore";

const FINISH: Record<FenceFinish, string> = {
  natural_cedar: "#b07a45",
  warm_brown: "#6e4220",
  charcoal: "#3a3a3a",
  white_vinyl: "#efeae2",
  tan_vinyl: "#d2b48c",
  galvanized: "#9aa0a6",
  black_chain_link: "#2b2b2b",
};

const POST = "#5c4030";
const RAIL = "#4a3424";

/**
 * Large elevation sample of one fence bay — construction inspiration.
 * Post size and module/on-center spacing drive bay proportions so boards read accurately.
 * `thumb` is a compact card preview (no chrome / dimension labels).
 */
export function StylePreview({
  project: projectProp,
  variant = "full",
}: {
  project?: FenceProject;
  variant?: "full" | "thumb";
}) {
  const live = useProject();
  const project = projectProp ?? live.project;
  const thumb = variant === "thumb";
  const { fenceType, settings } = project;
  const color = FINISH[settings.finish] ?? "#b07a45";
  const heightFt = Math.max(3, Math.round(inchesToFeet(settings.fenceHeight)));
  const summary = styleSummary(settings, fenceType);

  // One module on-center: left post + clear bay. Scale into the SVG frame.
  // Height is relative to a 10 ft max so 4 ft vs 8 ft clearly changes the drawing.
  const W = 460;
  const H = 340;
  const groundY = 278;
  const maxFenceTop = 28; // room for post caps above the tallest fence
  const maxFenceDrawH = groundY - maxFenceTop;
  const maxHeightFt = 10;
  const heightRatio = Math.min(1, Math.max(0.35, heightFt / maxHeightFt));
  const fenceDrawH = maxFenceDrawH * heightRatio;
  const topY = groundY - fenceDrawH;

  const leftMargin = 36;
  const rightReserve = 56; // height label
  const usable = W - leftMargin - rightReserve;
  const pitchIn =
    fenceType === "panel"
      ? moduleWidth(project)
      : settings.postSpacing;
  const spacingIn = Math.max(36, pitchIn);
  const postIn = Math.max(3, settings.postWidth);
  const clearBayIn = Math.max(24, spacingIn - postIn);
  // One inches→pixels scale for posts, boards, and bay width.
  // Wider post spacing = wider bay + more boards; board/post face sizes stay put.
  const DETAIL_PX_PER_IN = 2.75;
  const postW = Math.max(10, postIn * DETAIL_PX_PER_IN);
  const bayW = Math.max(24, clearBayIn * DETAIL_PX_PER_IN);
  const moduleW = postW * 2 + bayW;
  const fitScale = Math.min(1, usable / moduleW);
  const originX = leftMargin + (usable - moduleW * fitScale) / 2;
  const left = 0;
  const bayL = postW;
  const right = postW + bayW;

  const hasLattice =
    settings.latticeTop !== "none" &&
    fenceType !== "chain_link" &&
    settings.boardPattern !== "wire_mesh";
  // Lattice height is stored in inches; map into the drawn fence proportionally.
  const latticeInches = hasLattice
    ? Math.min(
        settings.fenceHeight * 0.5,
        Math.max(8, settings.latticeHeight || 18),
      )
    : 0;
  const latticeRatio = hasLattice
    ? Math.min(0.5, latticeInches / Math.max(1, settings.fenceHeight))
    : 0;
  const kickH = settings.hasKickboard ? 14 : 0;
  const frameT = 8; // picture-frame trim thickness
  const solidBottom = groundY - kickH;
  const solidTop = topY + fenceDrawH * latticeRatio;
  // Picture frame: boards fill flush to the inside of the trim (no air gap).
  // Cap rail alone: leave a small reveal under the cap.
  const boardTopY = settings.hasPictureFrame
    ? solidTop + frameT
    : settings.hasCapRail
      ? solidTop + 10
      : solidTop;
  const boardBottomY = settings.hasPictureFrame
    ? solidBottom - frameT
    : solidBottom;
  const spacingLabel = formatLength(spacingIn, project.unitSystem);
  const postLabel = formatSmallLength(settings.postWidth, project.unitSystem, 0);
  const heightLabel = formatLength(settings.fenceHeight, project.unitSystem);

  if (thumb) {
    // Crop to the bay — leave a little ground, drop dimension chrome
    const cropPad = 20;
    const cropX = Math.max(0, originX - cropPad);
    const cropW = Math.min(W - cropX, moduleW * fitScale + cropPad * 2);
    const cropY = Math.max(0, topY - 28);
    const cropH = Math.min(H - cropY, groundY - cropY + 36);
    return (
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#e8f0ea_0%,#f6f3ec_55%,#ddd5c4_100%)]">
        <svg
          viewBox={`${cropX} ${cropY} ${cropW} ${cropH}`}
          className="h-full w-full"
          role="img"
          aria-label={summary}
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            x={cropX}
            y={groundY}
            width={cropW}
            height={cropH}
            fill="#6f9b6a"
            opacity="0.4"
          />
          <line
            x1={cropX}
            y1={groundY}
            x2={cropX + cropW}
            y2={groundY}
            stroke="#5a7d56"
            strokeWidth="2"
          />
          <g transform={`translate(${originX} 0) scale(${fitScale} 1)`}>
            <rect
              x={left}
              y={topY - 8}
              width={postW}
              height={groundY - topY + 8}
              rx="2"
              fill={POST}
            />
            <rect
              x={right}
              y={topY - 8}
              width={postW}
              height={groundY - topY + 8}
              rx="2"
              fill={POST}
            />
            <PostCap
              x={left + postW / 2}
              y={topY - 8}
              kind={settings.postCap}
              color={color}
              scale={postW / 22}
            />
            <PostCap
              x={right + postW / 2}
              y={topY - 8}
              kind={settings.postCap}
              color={color}
              scale={postW / 22}
            />
            {fenceType === "chain_link" ? (
              <ChainLinkBay
                x={bayL}
                y={topY}
                w={bayW}
                h={groundY - topY}
                color={color}
              />
            ) : (
              <>
                {hasLattice && (
                  <Lattice
                    x={bayL}
                    y={topY}
                    w={bayW}
                    h={solidTop - topY}
                    variant={
                      settings.latticeTop === "none"
                        ? "open"
                        : settings.latticeTop
                    }
                    color={color}
                  />
                )}
                <BoardInfill
                  settings={settings}
                  color={color}
                  x={bayL}
                  y={boardTopY}
                  w={bayW}
                  h={Math.max(4, boardBottomY - boardTopY)}
                  fenceType={fenceType}
                  pxPerInch={DETAIL_PX_PER_IN}
                  edgeInset={settings.hasPictureFrame ? 0 : 4}
                />
                {settings.hasKickboard && (
                  <rect
                    x={bayL}
                    y={solidBottom}
                    width={bayW}
                    height={kickH}
                    fill={RAIL}
                    stroke="rgba(0,0,0,0.2)"
                  />
                )}
                {settings.hasPictureFrame && (
                  <g>
                    <rect
                      x={bayL}
                      y={solidTop}
                      width={bayW}
                      height={frameT}
                      fill={RAIL}
                    />
                    <rect
                      x={bayL}
                      y={solidBottom - frameT}
                      width={bayW}
                      height={frameT}
                      fill={RAIL}
                    />
                    <rect
                      x={bayL}
                      y={solidTop}
                      width={frameT}
                      height={solidBottom - solidTop}
                      fill={RAIL}
                    />
                    <rect
                      x={right - frameT}
                      y={solidTop}
                      width={frameT}
                      height={solidBottom - solidTop}
                      fill={RAIL}
                    />
                  </g>
                )}
                {!settings.hasPictureFrame && settings.hasTrim && (
                  <rect
                    x={bayL}
                    y={boardTopY}
                    width={bayW}
                    height={8}
                    fill={RAIL}
                  />
                )}
                {!settings.hasPictureFrame && settings.hasCapRail && (
                  <rect
                    x={bayL - 4}
                    y={solidTop}
                    width={bayW + 8}
                    height={12}
                    rx="1"
                    fill={RAIL}
                  />
                )}
              </>
            )}
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-soft)] sm:min-h-[400px] lg:min-h-[520px]">
      <div className="border-b border-border px-3 py-3 sm:px-5 sm:py-4">
        <p className="font-display text-xl text-primary sm:text-2xl">
          Fence construction
        </p>
        <p className="mt-1 text-sm text-foreground/65">{summary}</p>
        <p className="mt-1 text-xs text-foreground/50">
          About {heightFt} ft tall · {postLabel} posts · {spacingLabel} on
          center
          {fenceType !== "chain_link" && settings.boardPattern !== "wire_mesh" && (
            <>
              {" "}
              · {formatSmallLength(settings.picketWidth, project.unitSystem, 1)}{" "}
              boards
              {settings.picketGap > 0.05
                ? ` · ${formatSmallLength(settings.picketGap, project.unitSystem, 1)} gaps`
                : " · tight fit"}
            </>
          )}
          {hasLattice && (
            <>
              {" "}
              · {formatSmallLength(latticeInches, project.unitSystem, 0)} lattice
            </>
          )}
        </p>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center bg-[linear-gradient(180deg,#e8f0ea_0%,#f6f3ec_50%,#ddd5c4_100%)] px-3 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full max-h-[280px] w-full max-w-3xl sm:max-h-[380px] lg:max-h-[480px]"
          role="img"
          aria-label={summary}
        >
          <rect x="0" y={groundY} width={W} height={H - groundY} fill="#6f9b6a" opacity="0.4" />
          <line
            x1="24"
            y1={groundY}
            x2={W - 24}
            y2={groundY}
            stroke="#5a7d56"
            strokeWidth="2"
          />

          <g transform={`translate(${originX} 0) scale(${fitScale} 1)`}>
            {/* Posts — face size from post inches; bay width from post spacing */}
            <rect
              x={left}
              y={topY - 8}
              width={postW}
              height={groundY - topY + 8}
              rx="2"
              fill={POST}
            />
            <rect
              x={right}
              y={topY - 8}
              width={postW}
              height={groundY - topY + 8}
              rx="2"
              fill={POST}
            />
            <PostCap
              x={left + postW / 2}
              y={topY - 8}
              kind={settings.postCap}
              color={color}
              scale={postW / 22}
            />
            <PostCap
              x={right + postW / 2}
              y={topY - 8}
              kind={settings.postCap}
              color={color}
              scale={postW / 22}
            />

            {fenceType === "chain_link" ? (
              <ChainLinkBay
                x={bayL}
                y={topY}
                w={bayW}
                h={groundY - topY}
                color={color}
              />
            ) : (
              <>
                {hasLattice && (
                  <Lattice
                    x={bayL}
                    y={topY}
                    w={bayW}
                    h={solidTop - topY}
                    variant={
                      settings.latticeTop === "none"
                        ? "open"
                        : settings.latticeTop
                    }
                    color={color}
                  />
                )}
                <BoardInfill
                  settings={settings}
                  color={color}
                  x={bayL}
                  y={boardTopY}
                  w={bayW}
                  h={Math.max(4, boardBottomY - boardTopY)}
                  fenceType={fenceType}
                  pxPerInch={DETAIL_PX_PER_IN}
                  edgeInset={settings.hasPictureFrame ? 0 : 4}
                />
                {settings.hasKickboard && (
                  <rect
                    x={bayL}
                    y={solidBottom}
                    width={bayW}
                    height={kickH}
                    fill={RAIL}
                    stroke="rgba(0,0,0,0.2)"
                  />
                )}
                {settings.hasPictureFrame && (
                  <g>
                    <rect
                      x={bayL}
                      y={solidTop}
                      width={bayW}
                      height={frameT}
                      fill={RAIL}
                    />
                    <rect
                      x={bayL}
                      y={solidBottom - frameT}
                      width={bayW}
                      height={frameT}
                      fill={RAIL}
                    />
                    <rect
                      x={bayL}
                      y={solidTop}
                      width={frameT}
                      height={solidBottom - solidTop}
                      fill={RAIL}
                    />
                    <rect
                      x={right - frameT}
                      y={solidTop}
                      width={frameT}
                      height={solidBottom - solidTop}
                      fill={RAIL}
                    />
                  </g>
                )}
                {!settings.hasPictureFrame && settings.hasTrim && (
                  <rect
                    x={bayL}
                    y={boardTopY}
                    width={bayW}
                    height={8}
                    fill={RAIL}
                  />
                )}
                {!settings.hasPictureFrame && settings.hasCapRail && (
                  <rect
                    x={bayL - 4}
                    y={solidTop}
                    width={bayW + 8}
                    height={12}
                    rx="1"
                    fill={RAIL}
                  />
                )}
              </>
            )}

            {/* On-center spacing dimension */}
            <line
              x1={left + postW / 2}
              y1={groundY + 14}
              x2={right + postW / 2}
              y2={groundY + 14}
              stroke="#1f5c45"
              strokeWidth="1.25"
            />
            <line
              x1={left + postW / 2}
              y1={groundY + 10}
              x2={left + postW / 2}
              y2={groundY + 18}
              stroke="#1f5c45"
              strokeWidth="1.25"
            />
            <line
              x1={right + postW / 2}
              y1={groundY + 10}
              x2={right + postW / 2}
              y2={groundY + 18}
              stroke="#1f5c45"
              strokeWidth="1.25"
            />
            <text
              x={(left + right + postW) / 2}
              y={groundY + 30}
              textAnchor="middle"
              fill="#1f5c45"
              fontSize="11"
              fontWeight="600"
            >
              {spacingLabel} on center
            </text>

            {/* Height marker */}
            <line
              x1={right + postW + 14}
              y1={topY}
              x2={right + postW + 14}
              y2={groundY}
              stroke="#1f5c45"
              strokeWidth="1.5"
            />
            <text
              x={right + postW + 22}
              y={(topY + groundY) / 2}
              fill="#1f5c45"
              fontSize="13"
              fontWeight="700"
            >
              {heightLabel}
            </text>
          </g>
        </svg>
      </div>
      <p className="border-t border-border px-5 py-3 text-xs text-foreground/55">
        Construction preview only — use the plan for lengths and the shopping list
        for quantities. Wood textures coming later.
      </p>
    </div>
  );
}

function PostCap({
  x,
  y,
  kind,
  color,
  scale = 1,
}: {
  x: number;
  y: number;
  kind: FenceSettings["postCap"];
  color: string;
  scale?: number;
}) {
  if (kind === "none") return null;
  const s = Math.max(0.7, Math.min(1.6, scale));
  if (kind === "flat") {
    return (
      <rect
        x={x - 14 * s}
        y={y - 8 * s}
        width={28 * s}
        height={8 * s}
        rx="1"
        fill={POST}
      />
    );
  }
  if (kind === "solar") {
    return (
      <g>
        <polygon
          points={`${x - 12 * s},${y} ${x + 12 * s},${y} ${x},${y - 16 * s}`}
          fill={POST}
        />
        <circle
          cx={x}
          cy={y - 20 * s}
          r={5 * s}
          fill="#e8c547"
          stroke="#c4a020"
        />
      </g>
    );
  }
  // pyramid
  return (
    <polygon
      points={`${x - 13 * s},${y} ${x + 13 * s},${y} ${x},${y - 18 * s}`}
      fill={color}
      stroke={POST}
      strokeWidth="1"
    />
  );
}

function Lattice({
  x,
  y,
  w,
  h,
  variant,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  variant: "open" | "dense" | "privacy";
  color: string;
}) {
  const clipId = useId();
  // open = thin strips / larger openings
  // dense = closer spacing
  // privacy = thicker boards so the see-through diamonds shrink
  const step = variant === "dense" ? 10 : variant === "privacy" ? 14 : 16;
  const stroke =
    variant === "privacy" ? 5.5 : variant === "dense" ? 2.2 : 1.6;
  const lines = [];
  for (let i = -h; i < w + h; i += step) {
    lines.push(
      <line
        key={`a-${i}`}
        x1={x + i}
        y1={y}
        x2={x + i + h}
        y2={y + h}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="butt"
        opacity={0.9}
      />,
      <line
        key={`b-${i}`}
        x1={x + i}
        y1={y + h}
        x2={x + i + h}
        y2={y}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="butt"
        opacity={variant === "privacy" ? 0.82 : 0.7}
      />,
    );
  }
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={
          variant === "privacy"
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.15)"
        }
      />
      <clipPath id={clipId}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{lines}</g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={RAIL}
        strokeWidth="2"
      />
    </g>
  );
}

function BoardInfill({
  settings,
  color,
  x,
  y,
  w,
  h,
  fenceType,
  pxPerInch,
  edgeInset = 4,
}: {
  settings: FenceSettings;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fenceType: FenceProject["fenceType"];
  /** Shared inches→pixels scale so board face width stays constant when bay width changes. */
  pxPerInch: number;
  /** Vertical inset for boards inside the bay (0 = flush, e.g. picture frame). */
  edgeInset?: number;
}) {
  const hatchId = useId();
  if (h <= 4) return null;

  const boardY = y + edgeInset;
  const boardH = Math.max(4, h - edgeInset * 2);

  // Rails
  const rails = (
    <g>
      <rect x={x} y={y + 8} width={w} height={7} fill={RAIL} />
      <rect x={x} y={y + h * 0.45} width={w} height={7} fill={RAIL} />
      <rect x={x} y={y + h - 18} width={w} height={7} fill={RAIL} />
    </g>
  );

  // Board face size from picketWidth/gap only; wider bay ⇒ more boards, not wider boards.
  // End margins match the between-board gap; leftover width becomes a ripped cut board.
  const boardPx = Math.max(4, settings.picketWidth * pxPerInch);
  const gapPx = Math.max(0, settings.picketGap * pxPerInch);
  const pattern = settings.boardPattern;
  const layout = layoutBoardsPx(x, w, boardPx, gapPx);

  if (pattern === "wire_mesh") {
    return (
      <g>
        {rails}
        <WireMeshInfill
          x={x + gapPx}
          y={y + 10}
          w={Math.max(4, w - 2 * gapPx)}
          h={h - 20}
        />
      </g>
    );
  }

  if (
    settings.boardOrientation === "horizontal" &&
    fenceType !== "panel" &&
    pattern !== "board_and_batten"
  ) {
    const rowLayout = layoutBoardsPx(y, h, boardPx, gapPx);
    const boards = [
      ...rowLayout.fullStarts.map((yy) => (
        <rect
          key={yy}
          x={x + gapPx}
          y={yy}
          width={Math.max(4, w - 2 * gapPx)}
          height={boardPx}
          fill={color}
          stroke="rgba(0,0,0,0.12)"
        />
      )),
    ];
    if (rowLayout.cut) {
      boards.push(
        <CutBoard
          key="cut-h"
          x={x + gapPx}
          y={rowLayout.cut.origin}
          w={Math.max(4, w - 2 * gapPx)}
          h={rowLayout.cut.size}
          color={color}
          hatchId={`${hatchId}-h`}
          horizontal
        />,
      );
    }
    return <g>{boards}</g>;
  }

  // Same-face board-on-board: base boards with gaps, cover boards centered over gaps.
  if (pattern === "board_on_board") {
    const boards = [];
    for (const bx of layout.fullStarts) {
      boards.push(
        <Board
          key={`base-${bx}`}
          x={bx}
          y={boardY}
          w={boardPx}
          h={boardH}
          color={color}
          top={settings.boardTop}
          opacity={0.78}
        />,
      );
    }
    if (layout.cut) {
      boards.push(
        <CutBoard
          key="cut-base"
          x={layout.cut.origin}
          y={boardY}
          w={layout.cut.size}
          h={boardH}
          color={color}
          hatchId={`${hatchId}-bob`}
          top={settings.boardTop}
        />,
      );
    }
    const pitch = boardPx + gapPx;
    const coverLimit = layout.cut
      ? layout.cut.origin + layout.cut.size
      : x + w - gapPx;
    for (let i = 0; i < layout.fullStarts.length - 1; i++) {
      const cx = layout.fullStarts[i] + pitch / 2;
      if (cx + boardPx <= coverLimit + 0.01) {
        boards.push(
          <Board
            key={`cover-${cx}`}
            x={cx}
            y={boardY}
            w={boardPx}
            h={boardH}
            color={color}
            top={settings.boardTop}
            opacity={1}
          />,
        );
      }
    }
    return (
      <g>
        {fenceType !== "panel" && rails}
        {boards}
      </g>
    );
  }

  if (pattern === "board_and_batten") {
    const battenPx = Math.max(3, 1.5 * pxPerInch);
    const boards = [];
    const pieceStarts = [
      ...layout.fullStarts.map((bx) => ({ bx, size: boardPx, cut: false })),
      ...(layout.cut
        ? [{ bx: layout.cut.origin, size: layout.cut.size, cut: true }]
        : []),
    ];
    for (const piece of pieceStarts) {
      if (piece.cut) {
        boards.push(
          <CutBoard
            key={`cut-${piece.bx}`}
            x={piece.bx}
            y={boardY}
            w={piece.size}
            h={boardH}
            color={color}
            hatchId={hatchId}
            top={settings.boardTop}
          />,
        );
      } else {
        boards.push(
          <Board
            key={`base-${piece.bx}`}
            x={piece.bx}
            y={boardY}
            w={piece.size}
            h={boardH}
            color={color}
            top={settings.boardTop}
          />,
        );
      }
    }
    for (let i = 0; i < pieceStarts.length - 1; i++) {
      const a = pieceStarts[i];
      const joint = a.bx + a.size + gapPx / 2;
      boards.push(
        <Board
          key={`batten-${i}`}
          x={joint - battenPx / 2}
          y={boardY}
          w={battenPx}
          h={boardH}
          color={color}
          top={settings.boardTop}
          opacity={0.92}
        />,
      );
    }
    return (
      <g>
        {fenceType !== "panel" && rails}
        {boards}
      </g>
    );
  }

  const boards = [
    ...layout.fullStarts.map((bx, i) => (
      <Board
        key={i}
        x={bx}
        y={boardY}
        w={boardPx}
        h={boardH}
        color={color}
        top={settings.boardTop}
        opacity={pattern === "shadowbox" ? (i % 2 === 0 ? 1 : 0.5) : 1}
      />
    )),
  ];
  if (layout.cut) {
    boards.push(
      <CutBoard
        key="cut"
        x={layout.cut.origin}
        y={boardY}
        w={layout.cut.size}
        h={boardH}
        color={color}
        hatchId={hatchId}
        top={settings.boardTop}
      />,
    );
  }

  return (
    <g>
      {fenceType !== "panel" && rails}
      {boards}
    </g>
  );
}

/**
 * Full boards + optional ripped board so end gaps stay equal to the board gap.
 * Layout: [gap][full]…[full][gap][cut?][gap]
 */
function layoutBoardsPx(
  origin: number,
  span: number,
  boardPx: number,
  gapPx: number,
): {
  fullStarts: number[];
  cut: { origin: number; size: number } | null;
} {
  const g = Math.max(0, gapPx);
  const fullCount =
    g <= 0
      ? Math.max(0, Math.floor(span / boardPx + 1e-9))
      : Math.max(0, Math.floor((span - g) / (boardPx + g) + 1e-9));

  const fullStarts: number[] = [];
  let pos = origin + g;
  for (let i = 0; i < fullCount; i++) {
    fullStarts.push(pos);
    pos += boardPx + g;
  }

  const cutSize = span - fullCount * boardPx - (fullCount + 2) * g;
  if (cutSize >= 2 && cutSize < boardPx - 0.5) {
    return {
      fullStarts,
      cut: { origin: origin + g + fullCount * (boardPx + g), size: cutSize },
    };
  }
  return { fullStarts, cut: null };
}

/** Narrow board ripped to width — hatched + dashed to read as a custom cut. */
function CutBoard({
  x,
  y,
  w,
  h,
  color,
  hatchId,
  top = "flat",
  horizontal = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  hatchId: string;
  top?: FenceSettings["boardTop"];
  horizontal?: boolean;
}) {
  const label = w >= 10 && h >= 28 && !horizontal;
  return (
    <g>
      <defs>
        <pattern
          id={hatchId}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(35)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      {horizontal || top === "flat" ? (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={color}
          stroke="#1f5c45"
          strokeWidth="1.5"
          strokeDasharray="4 2.5"
        />
      ) : (
        <Board
          x={x}
          y={y}
          w={w}
          h={h}
          color={color}
          top={top}
          opacity={1}
        />
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={`url(#${hatchId})`}
        opacity="0.55"
        pointerEvents="none"
      />
      {!horizontal && top !== "flat" && (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="none"
          stroke="#1f5c45"
          strokeWidth="1.5"
          strokeDasharray="4 2.5"
        />
      )}
      {label && (
        <text
          x={x + w / 2}
          y={y + h - 10}
          textAnchor="middle"
          fill="#1f5c45"
          fontSize="8"
          fontWeight="700"
        >
          cut
        </text>
      )}
    </g>
  );
}

function WireMeshInfill({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const step = 10;
  const lines = [];
  for (let i = 0; i <= w; i += step) {
    lines.push(
      <line
        key={`v${i}`}
        x1={x + i}
        y1={y}
        x2={x + i}
        y2={y + h}
        stroke="#7a8088"
        strokeWidth="1"
        opacity="0.75"
      />,
    );
  }
  for (let j = 0; j <= h; j += step) {
    lines.push(
      <line
        key={`h${j}`}
        x1={x}
        y1={y + j}
        x2={x + w}
        y2={y + j}
        stroke="#7a8088"
        strokeWidth="1"
        opacity="0.65"
      />,
    );
  }
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="rgba(255,255,255,0.2)"
        stroke={RAIL}
        strokeWidth="2"
      />
      {lines}
    </g>
  );
}

function Board({
  x,
  y,
  w,
  h,
  color,
  top,
  opacity = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  top: FenceSettings["boardTop"];
  opacity?: number;
}) {
  if (top === "pointed") {
    const tip = 14;
    return (
      <g opacity={opacity}>
        <polygon
          points={`${x},${y + tip} ${x + w / 2},${y} ${x + w},${y + tip} ${x + w},${y + h} ${x},${y + h}`}
          fill={color}
          stroke="rgba(0,0,0,0.15)"
        />
      </g>
    );
  }
  if (top === "dog_ear") {
    const cut = 6;
    return (
      <g opacity={opacity}>
        <polygon
          points={`${x + cut},${y} ${x + w - cut},${y} ${x + w},${y + cut} ${x + w},${y + h} ${x},${y + h} ${x},${y + cut}`}
          fill={color}
          stroke="rgba(0,0,0,0.15)"
        />
      </g>
    );
  }
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill={color}
      stroke="rgba(0,0,0,0.15)"
      opacity={opacity}
    />
  );
}

function ChainLinkBay({
  x,
  y,
  w,
  h,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}) {
  const lines = [];
  for (let i = 0; i <= w; i += 9) {
    lines.push(
      <line
        key={`v${i}`}
        x1={x + i}
        y1={y + 8}
        x2={x + i}
        y2={y + h}
        stroke={color}
        strokeWidth="1.2"
        opacity="0.7"
      />,
    );
  }
  for (let j = 8; j <= h; j += 9) {
    lines.push(
      <line
        key={`h${j}`}
        x1={x}
        y1={y + j}
        x2={x + w}
        y2={y + j}
        stroke={color}
        strokeWidth="1.2"
        opacity="0.5"
      />,
    );
  }
  return (
    <g>
      <line
        x1={x}
        y1={y + 4}
        x2={x + w}
        y2={y + 4}
        stroke={color}
        strokeWidth="6"
      />
      {lines}
    </g>
  );
}
