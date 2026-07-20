"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

type InertSnapshot = {
  el: HTMLElement;
  inert: boolean;
  ariaHidden: string | null;
};

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Emphasize the confirm action as destructive (e.g. reset / delete). */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * In-app confirm dialog — use instead of window.confirm / alert / prompt.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inerted: InertSnapshot[] = [];
    for (const child of Array.from(document.body.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.dataset.confirmDialogRoot === "true") continue;
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
      // Prefer cancel as first focus for destructive confirms
      const items = focusables();
      const cancelBtn = items.find((el) => el.dataset.confirmAction === "cancel");
      (cancelBtn ?? items[0])?.focus();
    }, 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancelRef.current();
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
      data-confirm-dialog-root="true"
      className="no-print fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-lg"
      >
        <h2 id={titleId} className="font-display text-xl text-primary">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-foreground/75">
          {description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            data-confirm-action="cancel"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            data-confirm-action="confirm"
            className={
              destructive
                ? "rounded-md bg-[#8b3a2a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#742f22]"
                : "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            }
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
