type AnalyticsEvent =
  | "start_project"
  | "select_fence_type"
  | "choose_quick_mode"
  | "choose_visual_mode"
  | "add_fence_run"
  | "add_gate"
  | "calculate_materials"
  | "view_warning"
  | "print_project"
  | "print_shopping_list"
  | "open_shopping_list"
  | "copy_material_list"
  | "open_guide"
  | "switch_units"
  | "save_local_project";

export function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  // Privacy-light: console in dev; pluggable for GA later
  const payload = { event, ...props, t: Date.now() };
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", payload);
  }
  window.dispatchEvent(new CustomEvent("fence-analytics", { detail: payload }));
}
