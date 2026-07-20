"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  CONSTRUCTION_STYLES,
  type ConstructionStyle,
} from "@/domain/constructionStyles";
import { createEmptyProject, defaultSettings } from "@/domain/defaults";
import { moduleWidth } from "@/domain/geometry";
import {
  formatLength,
  formatSmallLength,
  fromInches,
  toInches,
} from "@/domain/units";
import type {
  ConstructionStyleId,
  FenceFinish,
  FenceSettings,
  UnitSystem,
} from "@/domain/types";
import { useProject } from "@/state/projectStore";
import { StylePreview } from "@/components/planner/StylePreview";

function projectForStarter(style: ConstructionStyle) {
  return createEmptyProject({
    fenceType: style.fenceType,
    stylePresetId: style.id,
    settings: {
      ...defaultSettings(style.fenceType),
      ...style.settings,
    },
  });
}

const CU_IN_PER_CU_FT = 1728;
const LITERS_PER_CU_IN = 0.0163871;
const LITERS_PER_CU_FT = CU_IN_PER_CU_FT * LITERS_PER_CU_IN;

const FINISHES: { id: FenceFinish; label: string; swatch: string }[] = [
  { id: "natural_cedar", label: "Natural cedar", swatch: "#b07a45" },
  { id: "warm_brown", label: "Warm brown", swatch: "#6e4220" },
  { id: "charcoal", label: "Charcoal", swatch: "#3a3a3a" },
  { id: "white_vinyl", label: "White", swatch: "#f4f1ea" },
  { id: "tan_vinyl", label: "Tan", swatch: "#d2b48c" },
  { id: "galvanized", label: "Galvanized", swatch: "#9aa0a6" },
  { id: "black_chain_link", label: "Black mesh", swatch: "#2b2b2b" },
];

type StyleTab = "boards" | "tops" | "lattice" | "posts" | "caps" | "color";

const TABS: { id: StyleTab; label: string }[] = [
  { id: "boards", label: "Boards" },
  { id: "tops", label: "Tops" },
  { id: "lattice", label: "Lattice" },
  { id: "posts", label: "Posts" },
  { id: "caps", label: "Caps" },
  { id: "color", label: "Color" },
];

/** Common on-center post spacings (feet). */
const POST_SPACING_FT = [4, 6, 8] as const;
const CHAIN_LINK_SPACING_FT = [6, 8, 10] as const;
/** Nominal square post face (inches). */
const POST_SIZE_IN = [4, 6] as const;
/** Typical residential fence heights (feet). */
const FENCE_HEIGHT_FT = [4, 5, 6, 7, 8, 10] as const;

/**
 * Style studio: horizontal starters + one option section at a time + big preview.
 */
export function StyleStudio() {
  const { project, setProject, updateSettings, setUnitSystem } = useProject();
  const [tab, setTab] = useState<StyleTab>("boards");
  const s = project.settings;
  const wood = project.fenceType !== "chain_link";
  const activePreset = project.stylePresetId ?? "custom";
  const selectedStarter = CONSTRUCTION_STYLES.find((x) => x.id === activePreset);
  // Collapse once a starter is chosen — expand to browse/change
  const [startersOpen, setStartersOpen] = useState(
    () => activePreset === "custom" || !selectedStarter,
  );
  // Avoid setState-in-effect: derive a safe tab when chain-link hides board tabs
  const activeTab: StyleTab =
    !wood && (tab === "boards" || tab === "tops" || tab === "lattice")
      ? "posts"
      : tab;

  function applyPreset(id: ConstructionStyleId) {
    const style = CONSTRUCTION_STYLES.find((x) => x.id === id);
    if (!style) return;
    // Single project update — do not call setFenceType afterward (that was wiping settings)
    setProject({
      ...project,
      fenceType: style.fenceType,
      stylePresetId: id,
      settings: {
        ...defaultSettings(style.fenceType),
        ...style.settings,
      },
    });
    if (style.fenceType === "chain_link") setTab("posts");
    else setTab("boards");
    setStartersOpen(false);
  }

  function patchStyle(partial: Partial<FenceSettings>) {
    setProject({
      ...project,
      stylePresetId: "custom",
      settings: { ...project.settings, ...partial },
    });
  }

  const finishes = FINISHES.filter((f) => {
    if (project.fenceType === "chain_link")
      return f.id === "galvanized" || f.id === "black_chain_link";
    return !f.id.includes("chain");
  });

  return (
    <div className="space-y-4">
      {/* Starters — collapsed after a choice so Style stays preview-first */}
      <section className="rounded-lg border border-border bg-surface shadow-[var(--shadow-soft)]">
        <button
          type="button"
          className="group flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-surface-muted/70"
          aria-expanded={startersOpen}
          onClick={() => setStartersOpen((o) => !o)}
        >
          <div className="flex min-w-0 items-center gap-3">
            {selectedStarter && activePreset !== "custom" ? (
              <div className="h-11 w-16 shrink-0 overflow-hidden rounded-md border border-border">
                <StylePreview
                  project={projectForStarter(selectedStarter)}
                  variant="thumb"
                />
              </div>
            ) : null}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">Starter look</p>
              <p className="truncate text-xs text-foreground/65">
                {activePreset === "custom"
                  ? "Custom — tweaked from a starter"
                  : (selectedStarter?.title ?? "Choose a starter")}
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground/75 transition group-hover:border-primary/40 hover:border-primary/40 hover:bg-surface-muted">
            {startersOpen ? (
              <ChevronUp className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <ChevronDown className="size-3.5 shrink-0" aria-hidden />
            )}
            {startersOpen ? "Hide" : "Change"}
          </span>
        </button>
        {startersOpen ? (
          <div className="border-t border-border px-3 pb-3 pt-2">
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6">
              {CONSTRUCTION_STYLES.map((style) => {
                const selected = activePreset === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => applyPreset(style.id)}
                    className={`overflow-hidden rounded-md border text-left transition ${
                      selected
                        ? "border-primary ring-2 ring-primary/25"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="aspect-[4/3] w-full">
                      <StylePreview
                        project={projectForStarter(style)}
                        variant="thumb"
                      />
                    </div>
                    <p className="bg-surface px-1.5 py-1.5 text-xs font-semibold leading-snug text-primary sm:text-sm">
                      {style.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        {/* One section of options at a time */}
        <section className="rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
            {TABS.map((t) => {
              if (!wood && (t.id === "boards" || t.id === "tops" || t.id === "lattice"))
                return null;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                    activeTab === t.id
                      ? "bg-primary text-white"
                      : "bg-surface-muted text-foreground/75 hover:bg-primary-soft"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 space-y-3">
            {activeTab === "boards" && wood && (
              <>
                <p className="text-xs text-foreground/60">
                  How each bay is filled — patterns you can build from lumber-yard
                  boards and mesh.
                </p>
                <ChoiceGrid
                  value={s.boardPattern}
                  onChange={(boardPattern) => {
                    const picketGap =
                      boardPattern === "spaced"
                        ? Math.max(1.5, s.picketGap || 1.5)
                        : boardPattern === "shadowbox"
                          ? Math.max(1.5, s.picketGap || 2.5)
                          : boardPattern === "board_on_board"
                            ? Math.max(0.5, s.picketGap || 1)
                            : 0;
                    const patch: Partial<FenceSettings> = {
                      boardPattern,
                      picketGap,
                    };
                    if (boardPattern === "wire_mesh") {
                      patch.railsPerSpan = Math.min(2, s.railsPerSpan || 2);
                      patch.boardOrientation = "vertical";
                      patch.latticeTop = "none";
                    } else if (boardPattern === "board_and_batten") {
                      patch.boardOrientation = "vertical";
                    }
                    patchStyle(patch);
                  }}
                  options={[
                    {
                      id: "solid",
                      label: "Side-by-side solid",
                      hint: "Boards edge-to-edge",
                    },
                    {
                      id: "board_on_board",
                      label: "Board-on-board",
                      hint: "Cover boards over gaps, same face",
                    },
                    {
                      id: "shadowbox",
                      label: "Shadowbox",
                      hint: "Alternating faces",
                    },
                    {
                      id: "board_and_batten",
                      label: "Board-and-batten",
                      hint: "Narrow strips over joints",
                    },
                    {
                      id: "spaced",
                      label: "Spaced picket",
                      hint: "Open gaps",
                    },
                    {
                      id: "wire_mesh",
                      label: "Wood & wire",
                      hint: "Welded-wire in wood frame",
                    },
                  ]}
                />
                {s.boardPattern !== "wire_mesh" && (
                  <>
                    <p className="text-xs font-semibold">Direction</p>
                    <ChoiceGrid
                      value={s.boardOrientation}
                      onChange={(boardOrientation) =>
                        patchStyle({ boardOrientation })
                      }
                      options={[
                        { id: "vertical", label: "Vertical" },
                        {
                          id: "horizontal",
                          label: "Horizontal",
                          hint:
                            s.boardPattern === "board_and_batten"
                              ? "Uses solid horizontal look"
                              : undefined,
                        },
                      ]}
                    />
                    <BoardSizingControls
                      picketWidth={s.picketWidth}
                      picketGap={s.picketGap}
                      boardPattern={s.boardPattern}
                      unitSystem={project.unitSystem}
                      onWidth={(picketWidth) => patchStyle({ picketWidth })}
                      onGap={(picketGap) => {
                        let boardPattern = s.boardPattern;
                        if (boardPattern === "solid" && picketGap > 0.25) {
                          boardPattern = "spaced";
                        } else if (
                          boardPattern === "spaced" &&
                          picketGap <= 0.25
                        ) {
                          boardPattern = "solid";
                        }
                        patchStyle({ picketGap, boardPattern });
                      }}
                    />
                  </>
                )}
                {s.boardPattern === "wire_mesh" && (
                  <p className="rounded-md bg-surface-muted px-2.5 py-2 text-[11px] text-foreground/70">
                    Posts and rails form a wood frame; welded-wire panels fill
                    each bay. Add a kickboard under Tops if you want ground
                    protection.
                  </p>
                )}
              </>
            )}

            {activeTab === "tops" && wood && (
              <>
                {s.boardPattern !== "wire_mesh" && (
                  <>
                    <p className="text-xs text-foreground/60">
                      Shape of each board top.
                    </p>
                    <ChoiceGrid
                      value={s.boardTop}
                      onChange={(boardTop) => patchStyle({ boardTop })}
                      options={[
                        { id: "flat", label: "Flat top" },
                        { id: "dog_ear", label: "Dog-ear" },
                        { id: "pointed", label: "Pointed" },
                      ]}
                    />
                  </>
                )}
                <p className="text-xs font-semibold">Finish package</p>
                <p className="text-[11px] text-foreground/55">
                  Cap, picture frame, and kickboard are store-bought add-ons.
                </p>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={s.hasPictureFrame}
                    onChange={(e) =>
                      patchStyle({
                        hasPictureFrame: e.target.checked,
                        hasCapRail: e.target.checked ? false : s.hasCapRail,
                        hasTrim: e.target.checked ? false : s.hasTrim,
                      })
                    }
                  />
                  Picture-frame trim around each bay
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={s.hasCapRail}
                    disabled={s.hasPictureFrame}
                    onChange={(e) =>
                      patchStyle({
                        hasCapRail: e.target.checked,
                        hasTrim: e.target.checked ? s.hasTrim : false,
                      })
                    }
                  />
                  Cap rail across the top
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={s.hasTrim}
                    disabled={!s.hasCapRail || s.hasPictureFrame}
                    onChange={(e) => patchStyle({ hasTrim: e.target.checked })}
                  />
                  Trim under the cap
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={s.hasKickboard}
                    onChange={(e) =>
                      patchStyle({ hasKickboard: e.target.checked })
                    }
                  />
                  Kickboard / rot board at the bottom
                </label>
              </>
            )}

            {activeTab === "lattice" && wood && (
              <>
                {s.boardPattern === "wire_mesh" ? (
                  <p className="text-xs text-foreground/60">
                    Lattice toppers aren&apos;t used with wood-and-wire frames.
                    Switch to a board pattern to add a lattice top.
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-foreground/60">
                      Optional lattice section on top of the solid fence.
                    </p>
                    <ChoiceGrid
                      value={s.latticeTop}
                      onChange={(latticeTop) => patchStyle({ latticeTop })}
                      options={[
                        { id: "none", label: "No lattice" },
                        {
                          id: "open",
                          label: "Open lattice",
                          hint: "More see-through",
                        },
                        {
                          id: "dense",
                          label: "Dense lattice",
                          hint: "Tighter grid",
                        },
                        {
                          id: "privacy",
                          label: "Privacy lattice",
                          hint: "Thicker strips, smaller openings",
                        },
                      ]}
                    />
                    {s.latticeTop !== "none" && (
                      <LatticeHeightControls
                        latticeHeight={s.latticeHeight}
                        fenceHeight={s.fenceHeight}
                        unitSystem={project.unitSystem}
                        onChange={(latticeHeight) =>
                          patchStyle({ latticeHeight })
                        }
                      />
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "posts" && (
              <>
                <p className="text-xs text-foreground/60">
                  Post size and spacing set how wide each bay is — so board
                  count and proportions in the preview match a real span.
                </p>

                <p className="text-xs font-semibold">Post face used by this plan</p>
                <p className="text-[11px] text-foreground/55">
                  Enter the actual measured or manufacturer face dimension. Common
                  nominal labels (4×4 / 6×6) are not always exactly 4 in or 6 in —
                  use a custom value when needed. This face also drives concrete
                  displacement.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POST_SIZE_IN.map((inches) => {
                    const selected = Math.abs(s.postWidth - inches) < 0.05;
                    return (
                      <button
                        key={inches}
                        type="button"
                        onClick={() =>
                          patchStyle({
                            postWidth: inches,
                            postCrossSection: inches,
                          })
                        }
                        className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                          selected
                            ? "border-primary bg-primary-soft"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {inches}&quot; plan face
                      </button>
                    );
                  })}
                </div>
                <label className="block text-xs">
                  Custom post face (
                  {project.unitSystem === "metric" ? "mm" : "in"})
                  <input
                    type="number"
                    min={1}
                    step={project.unitSystem === "metric" ? 1 : 0.125}
                    className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
                    value={
                      project.unitSystem === "metric"
                        ? Number(
                            fromInches(s.postWidth, "metric", false).toFixed(0),
                          )
                        : s.postWidth
                    }
                    onChange={(e) => {
                      const display = Number(e.target.value) || 0;
                      const inches = Math.max(
                        0,
                        toInches(display, project.unitSystem, false),
                      );
                      patchStyle({
                        postWidth: inches,
                        postCrossSection: inches,
                      });
                    }}
                  />
                </label>

                {project.fenceType === "panel" ? (
                  <>
                    <p className="text-xs font-semibold">Panel width</p>
                    <p className="text-[11px] text-foreground/55">
                      Entered panel size. Post spacing (pitch) is calculated from
                      the module basis below — it is not always equal to this
                      width.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {POST_SPACING_FT.map((ft) => {
                        const inches = toInches(ft, "imperial");
                        const selected = Math.abs(s.panelWidth - inches) < 0.5;
                        const label =
                          project.unitSystem === "imperial"
                            ? `${ft} ft`
                            : `${fromInches(inches, "metric").toFixed(1)} m`;
                        return (
                          <button
                            key={ft}
                            type="button"
                            onClick={() => patchStyle({ panelWidth: inches })}
                            className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                              selected
                                ? "border-primary bg-primary-soft"
                                : "border-border hover:border-primary/40"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <label className="block text-xs">
                      Module basis
                      <select
                        className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
                        value={s.moduleWidthMode}
                        onChange={(e) =>
                          patchStyle({
                            moduleWidthMode: e.target.value as
                              | "panel_only"
                              | "includes_post",
                          })
                        }
                      >
                        <option value="panel_only">
                          Panel itself (pitch = panel + post face)
                        </option>
                        <option value="includes_post">
                          Complete repeating module / pitch
                        </option>
                      </select>
                    </label>
                    <p className="rounded-md bg-[#eef7f3] px-2 py-1.5 text-[11px] text-primary">
                      Calculated pitch:{" "}
                      {formatSmallLength(s.panelWidth, project.unitSystem)} panel
                      {s.moduleWidthMode === "panel_only"
                        ? ` + ${formatSmallLength(s.postWidth, project.unitSystem)} post = ${formatSmallLength(moduleWidth(project), project.unitSystem)}`
                        : ` = ${formatSmallLength(moduleWidth(project), project.unitSystem)} (includes post)`}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold">
                      On-center post spacing
                    </p>
                    <p className="text-[11px] text-foreground/55">
                      {project.fenceType === "chain_link"
                        ? "Line-post spacing on center. 10 ft is a common starting point."
                        : "On-center spacing. 6 ft and 8 ft are the usual wood standards; shorter bays look stiffer and need more posts."}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(project.fenceType === "chain_link"
                        ? CHAIN_LINK_SPACING_FT
                        : POST_SPACING_FT
                      ).map((ft) => {
                        const inches = toInches(ft, "imperial");
                        const selected =
                          Math.abs(s.postSpacing - inches) < 0.5;
                        const label =
                          project.unitSystem === "imperial"
                            ? `${ft} ft`
                            : `${fromInches(inches, "metric").toFixed(1)} m`;
                        return (
                          <button
                            key={ft}
                            type="button"
                            onClick={() =>
                              patchStyle({ postSpacing: inches })
                            }
                            className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                              selected
                                ? "border-primary bg-primary-soft"
                                : "border-border hover:border-primary/40"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <label className="block text-xs">
                      Custom spacing (
                      {project.unitSystem === "imperial" ? "ft" : "m"})
                      <input
                        type="number"
                        min={project.unitSystem === "imperial" ? 3 : 1}
                        max={project.unitSystem === "imperial" ? 12 : 4}
                        step={project.unitSystem === "imperial" ? 1 : 0.5}
                        className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
                        value={Number(
                          fromInches(s.postSpacing, project.unitSystem).toFixed(
                            project.unitSystem === "imperial" ? 0 : 1,
                          ),
                        )}
                        onChange={(e) => {
                          const inches = toInches(
                            Number(e.target.value) || 0,
                            project.unitSystem,
                          );
                          patchStyle({ postSpacing: inches });
                        }}
                      />
                    </label>
                  </>
                )}

                <p className="text-xs font-semibold">Post hole & concrete</p>
                <p className="text-[11px] text-foreground/55">
                  Used for the shopping-list bag estimate. Lengths follow the
                  project unit system; bag yield is a planning default — enter
                  the yield printed on your product.
                </p>
                <ConcreteSettingsFields
                  settings={s}
                  unitSystem={project.unitSystem}
                  onChange={updateSettings}
                />
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={s.applyWasteToConcrete}
                    onChange={(e) =>
                      updateSettings({ applyWasteToConcrete: e.target.checked })
                    }
                  />
                  Apply waste % to concrete volume (off by default)
                </label>

                <p className="text-xs font-semibold">Fence height</p>
                <p className="text-[11px] text-foreground/55">
                  Common backyard sizes. 6 ft is the usual privacy height.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {FENCE_HEIGHT_FT.map((ft) => {
                    const inches = toInches(ft, "imperial");
                    const selected =
                      Math.abs(s.fenceHeight - inches) < 0.5;
                    const label =
                      project.unitSystem === "imperial"
                        ? `${ft} ft`
                        : `${fromInches(inches, "metric").toFixed(1)} m`;
                    return (
                      <button
                        key={ft}
                        type="button"
                        onClick={() => patchStyle({ fenceHeight: inches })}
                        className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                          selected
                            ? "border-primary bg-primary-soft"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <p className="rounded-md bg-surface-muted px-2.5 py-2 text-[11px] text-foreground/70">
                  {formatLength(s.fenceHeight, project.unitSystem)} tall
                  {" · "}
                  {formatSmallLength(s.postWidth, project.unitSystem, 0)} plan
                  face
                  {" · "}
                  {project.fenceType === "panel"
                    ? `${formatSmallLength(moduleWidth(project), project.unitSystem)} calculated pitch`
                    : `${formatLength(s.postSpacing, project.unitSystem)} on center`}{" "}
                  — preview height and bay width update to match.
                </p>
              </>
            )}

            {activeTab === "caps" && (
              <>
                <p className="text-xs text-foreground/60">
                  Decorative or light caps on top of posts.
                </p>
                <ChoiceGrid
                  value={s.postCap}
                  onChange={(postCap) => patchStyle({ postCap })}
                  options={[
                    { id: "none", label: "No cap" },
                    { id: "flat", label: "Flat cap" },
                    { id: "pyramid", label: "Pyramid cap" },
                    { id: "solar", label: "Solar / light" },
                  ]}
                />
              </>
            )}

            {activeTab === "color" && (
              <>
                <p className="text-xs text-foreground/60">
                  Color chips for now — wood textures coming later.
                </p>
                <div className="flex flex-wrap gap-2">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      title={f.label}
                      aria-label={f.label}
                      onClick={() =>
                        patchStyle({ finish: f.id, finishTexture: f.id })
                      }
                      className={`h-10 w-10 rounded-full border-2 ${
                        s.finish === f.id
                          ? "border-primary ring-2 ring-primary/25"
                          : "border-black/10"
                      }`}
                      style={{ background: f.swatch }}
                    />
                  ))}
                </div>
                <label className="block text-xs">
                  Units
                  <select
                    className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
                    value={project.unitSystem}
                    onChange={(e) =>
                      setUnitSystem(e.target.value as "imperial" | "metric")
                    }
                  >
                    <option value="imperial">Feet</option>
                    <option value="metric">Meters</option>
                  </select>
                </label>
                <label className="block text-xs">
                  Extra waste %
                  <input
                    type="number"
                    min={0}
                    max={50}
                    className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
                    value={s.wastePercent}
                    onChange={(e) =>
                      // waste alone shouldn't force custom style label for construction
                      updateSettings({ wastePercent: Number(e.target.value) })
                    }
                  />
                </label>
              </>
            )}

            {!wood && activeTab === "boards" && (
              <p className="text-xs text-foreground/60">
                Chain link uses mesh construction. Switch to a wood starter look
                above to edit boards, lattice, and tops.
              </p>
            )}
          </div>
        </section>

        <StylePreview />
      </div>
    </div>
  );
}

function ChoiceGrid<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; hint?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`rounded-md border px-2.5 py-2 text-left ${
            value === opt.id
              ? "border-primary bg-primary-soft"
              : "border-border bg-surface hover:border-primary/40"
          }`}
        >
          <p className="text-xs font-medium">{opt.label}</p>
          {opt.hint && (
            <p className="text-[11px] text-foreground/55">{opt.hint}</p>
          )}
        </button>
      ))}
    </div>
  );
}

function ConcreteSettingsFields({
  settings,
  unitSystem,
  onChange,
}: {
  settings: FenceSettings;
  unitSystem: UnitSystem;
  onChange: (partial: Partial<FenceSettings>) => void;
}) {
  const lengthUnit = unitSystem === "metric" ? "mm" : "in";
  const yieldUnit = unitSystem === "metric" ? "L / bag" : "cu ft / bag";
  const lengthStep = unitSystem === "metric" ? 1 : 0.5;

  const displayLen = (inches: number) =>
    unitSystem === "metric"
      ? Number(fromInches(inches, "metric", false).toFixed(0))
      : inches;

  const storeLen = (display: number) =>
    Math.max(0, toInches(display, unitSystem, false));

  const displayYield =
    unitSystem === "metric"
      ? Number(
          ((settings.concreteBagYield / CU_IN_PER_CU_FT) * LITERS_PER_CU_FT).toFixed(
            1,
          ),
        )
      : Number((settings.concreteBagYield / CU_IN_PER_CU_FT).toFixed(2));

  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="block text-xs">
        Hole diameter ({lengthUnit})
        <input
          type="number"
          min={0}
          step={lengthStep}
          className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
          value={displayLen(settings.holeDiameter)}
          onChange={(e) =>
            onChange({ holeDiameter: storeLen(Number(e.target.value) || 0) })
          }
        />
      </label>
      <label className="block text-xs">
        Hole depth ({lengthUnit})
        <input
          type="number"
          min={0}
          step={unitSystem === "metric" ? 1 : 1}
          className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
          value={displayLen(settings.holeDepth)}
          onChange={(e) =>
            onChange({ holeDepth: storeLen(Number(e.target.value) || 0) })
          }
        />
      </label>
      <label className="block text-xs">
        Post face for displacement ({lengthUnit})
        <input
          type="number"
          min={0}
          step={lengthStep}
          className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
          value={displayLen(settings.postCrossSection)}
          onChange={(e) =>
            onChange({
              postCrossSection: storeLen(Number(e.target.value) || 0),
            })
          }
        />
      </label>
      <label className="block text-xs">
        Bag yield ({yieldUnit})
        <input
          type="number"
          min={0.01}
          step={unitSystem === "metric" ? 0.1 : 0.01}
          className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
          value={displayYield}
          onChange={(e) => {
            const raw = Number(e.target.value);
            if (!Number.isFinite(raw) || raw <= 0) return;
            const cuFt =
              unitSystem === "metric" ? raw / LITERS_PER_CU_FT : raw;
            onChange({ concreteBagYield: cuFt * CU_IN_PER_CU_FT });
          }}
        />
      </label>
    </div>
  );
}

const BOARD_WIDTH_PRESETS_IN = [3.5, 5.5, 7.25];
const BOARD_GAP_PRESETS_IN = [0, 0.5, 1, 1.5, 2.5];
/** Common store-bought lattice topper heights (inches). */
const LATTICE_HEIGHT_PRESETS_IN = [12, 18, 24] as const;

function LatticeHeightControls({
  latticeHeight,
  fenceHeight,
  unitSystem,
  onChange,
}: {
  latticeHeight: number;
  fenceHeight: number;
  unitSystem: "imperial" | "metric";
  onChange: (inches: number) => void;
}) {
  const unit = unitSystem === "imperial" ? "in" : "mm";
  const maxInches = Math.max(12, Math.round(fenceHeight * 0.5));
  const clamped = Math.min(maxInches, Math.max(8, latticeHeight || 18));
  const display = Number(
    fromInches(clamped, unitSystem, false).toFixed(
      unitSystem === "imperial" ? 0 : 0,
    ),
  );
  const solidInches = Math.max(0, fenceHeight - clamped);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold">Lattice height</p>
      <p className="text-[11px] text-foreground/55">
        How tall the lattice topper is — usually 12″ to 24″ from the store.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {LATTICE_HEIGHT_PRESETS_IN.map((inches) => {
          const selected = Math.abs(clamped - inches) < 0.5;
          const label =
            unitSystem === "imperial"
              ? `${inches}"`
              : `${Math.round(fromInches(inches, "metric", false))} mm`;
          return (
            <button
              key={inches}
              type="button"
              onClick={() => onChange(inches)}
              className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                selected
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <label className="block text-xs">
        Custom height ({unit})
        <input
          type="number"
          min={unitSystem === "imperial" ? 8 : 200}
          max={
            unitSystem === "imperial"
              ? maxInches
              : Math.round(fromInches(maxInches, "metric", false))
          }
          step={unitSystem === "imperial" ? 1 : 10}
          className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
          value={display}
          onChange={(e) => {
            const next = toInches(
              Number(e.target.value) || 0,
              unitSystem,
              false,
            );
            onChange(Math.min(maxInches, Math.max(8, next)));
          }}
        />
      </label>
      <input
        type="range"
        min={8}
        max={maxInches}
        step={1}
        value={clamped}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <p className="rounded-md bg-surface-muted px-2.5 py-2 text-[11px] text-foreground/70">
        {formatSmallLength(clamped, unitSystem, 0)} lattice
        {" · "}
        {formatSmallLength(solidInches, unitSystem, 0)} solid boards below
        {" · "}
        {formatLength(fenceHeight, unitSystem)} total
      </p>
    </div>
  );
}

function BoardSizingControls({
  picketWidth,
  picketGap,
  boardPattern,
  unitSystem,
  onWidth,
  onGap,
}: {
  picketWidth: number;
  picketGap: number;
  boardPattern: FenceSettings["boardPattern"];
  unitSystem: "imperial" | "metric";
  onWidth: (inches: number) => void;
  onGap: (inches: number) => void;
}) {
  const unit = unitSystem === "imperial" ? "in" : "mm";
  const displayWidth = Number(
    fromInches(picketWidth, unitSystem, false).toFixed(unitSystem === "imperial" ? 2 : 0),
  );
  const displayGap = Number(
    fromInches(picketGap, unitSystem, false).toFixed(unitSystem === "imperial" ? 2 : 0),
  );
  const gapHint =
    boardPattern === "board_on_board"
      ? "Gap between base boards and to each post (cover boards overlap the gaps)"
      : boardPattern === "shadowbox"
        ? "Gap between boards and to each post"
        : boardPattern === "board_and_batten"
          ? "Usually 0 — boards run to the posts; battens cover the joints"
          : "Same gap between boards and between the end boards and each post";

  return (
    <div className="space-y-3 border-t border-border pt-3">
      <div>
        <p className="text-xs font-semibold">Board width</p>
        <p className="text-[11px] text-foreground/55">
          Face width of each board (common: 1×4, 1×6, 1×8).
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {BOARD_WIDTH_PRESETS_IN.map((inches) => {
            const label =
              unitSystem === "imperial"
                ? `${inches}"`
                : `${Math.round(fromInches(inches, "metric", false))} mm`;
            const selected = Math.abs(picketWidth - inches) < 0.05;
            return (
              <button
                key={inches}
                type="button"
                onClick={() => onWidth(inches)}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium ${
                  selected
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <label className="mt-2 block text-xs">
          Custom width ({unit})
          <input
            type="number"
            min={unitSystem === "imperial" ? 2 : 50}
            max={unitSystem === "imperial" ? 12 : 300}
            step={unitSystem === "imperial" ? 0.25 : 1}
            className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
            value={displayWidth}
            onChange={(e) =>
              onWidth(
                toInches(Number(e.target.value) || 0, unitSystem, false),
              )
            }
          />
        </label>
      </div>

      <div>
        <p className="text-xs font-semibold">Gap between boards</p>
        <p className="text-[11px] text-foreground/55">{gapHint}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {BOARD_GAP_PRESETS_IN.map((inches) => {
            const label =
              unitSystem === "imperial"
                ? inches === 0
                  ? '0"'
                  : `${inches}"`
                : `${Math.round(fromInches(inches, "metric", false))} mm`;
            const selected = Math.abs(picketGap - inches) < 0.05;
            return (
              <button
                key={inches}
                type="button"
                onClick={() => onGap(inches)}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium ${
                  selected
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <label className="mt-2 block text-xs">
          Custom gap ({unit})
          <input
            type="number"
            min={0}
            max={unitSystem === "imperial" ? 6 : 150}
            step={unitSystem === "imperial" ? 0.25 : 1}
            className="mt-1 w-full rounded-md border border-border px-2 py-1.5"
            value={displayGap}
            onChange={(e) =>
              onGap(toInches(Number(e.target.value) || 0, unitSystem, false))
            }
          />
        </label>
      </div>

      <p className="rounded-md bg-surface-muted px-2.5 py-2 text-[11px] text-foreground/70">
        {formatBoardSizing(picketWidth, picketGap, unitSystem)} — updates the
        preview and picket count on the shopping list.
      </p>
    </div>
  );
}

function formatBoardSizing(
  widthIn: number,
  gapIn: number,
  unitSystem: "imperial" | "metric",
): string {
  const w = formatSmallLength(widthIn, unitSystem, unitSystem === "imperial" ? 1 : 0);
  const g = formatSmallLength(gapIn, unitSystem, unitSystem === "imperial" ? 1 : 0);
  return `${w} boards · ${g} gaps`;
}

/** @deprecated use StyleStudio */
export function StyleBuilder() {
  return <StyleStudio />;
}
