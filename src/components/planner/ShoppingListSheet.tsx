"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { BuildPanel } from "@/components/planner/BuildPanel";

type InertSnapshot = {
  el: HTMLElement;
  inert: boolean;
  ariaHidden: string | null;
};

/**
 * Shopping list as output surface — sheet/dialog, not a peer stage of Style.
 */
export function ShoppingListSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    // Never leave a print-only sheet visible behind this dialog
    document.body.classList.remove("print-shopping-list");

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inerted: InertSnapshot[] = [];
    for (const child of Array.from(document.body.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.dataset.shoppingListSheet === "true") continue;
      inerted.push({
        el: child,
        inert: child.inert,
        ariaHidden: child.getAttribute("aria-hidden"),
      });
      child.inert = true;
      child.setAttribute("aria-hidden", "true");
    }

    const dialog = dialogRef.current;
    const focusables = () =>
      dialog
        ? Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1)
        : [];

    const focusTimer = window.setTimeout(() => {
      focusables()[0]?.focus();
    }, 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const items = focusables();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = priorOverflow;
      for (const snap of inerted) {
        snap.el.inert = snap.inert;
        if (snap.ariaHidden === null) {
          snap.el.removeAttribute("aria-hidden");
        } else {
          snap.el.setAttribute("aria-hidden", snap.ariaHidden);
        }
      }
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      data-shopping-list-sheet="true"
      className="no-print fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-xl border border-border bg-surface shadow-lg sm:max-h-[85vh] sm:rounded-xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 id={titleId} className="font-display text-xl text-primary">
            Shopping list
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-muted"
          >
            <X className="size-3.5 shrink-0" aria-hidden />
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
          <BuildPanel embedded />
        </div>
      </div>
    </div>,
    document.body,
  );
}
