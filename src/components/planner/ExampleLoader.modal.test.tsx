/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

/**
 * Focused portal modal harness mirroring ExampleLoader inert behavior.
 * Kept separate so the planner store / Next router are not required.
 */
function PortalConfirmDialog({
  open,
  onDismiss,
}: {
  open: boolean;
  onDismiss: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const inerted: HTMLElement[] = [];
    for (const child of Array.from(document.body.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.dataset.exampleModalRoot === "true") continue;
      inerted.push(child);
      child.inert = true;
      child.setAttribute("aria-hidden", "true");
    }
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = priorOverflow;
      for (const el of inerted) {
        el.inert = false;
        el.removeAttribute("aria-hidden");
      }
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onDismiss]);

  if (!open) return null;
  return createPortal(
    <div
      data-example-modal-root="true"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm example"
    >
      <button type="button" onClick={onDismiss}>
        Keep my plan
      </button>
    </div>,
    document.body,
  );
}

describe("example confirm portal modal a11y", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    cleanup();
  });

  it("makes a background control unfocusable while open and available after close", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    function Harness({ open }: { open: boolean }) {
      return (
        <>
          <div id="app-root">
            <button type="button">Background action</button>
          </div>
          <PortalConfirmDialog open={open} onDismiss={onDismiss} />
        </>
      );
    }

    const { rerender } = render(<Harness open />);
    const bg = document.querySelector("#app-root button") as HTMLButtonElement;
    const keep = screen.getByRole("button", { name: "Keep my plan" });

    expect(bg).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
    const inertShell = document.getElementById("app-root")
      ?.parentElement as HTMLElement;
    expect(inertShell?.inert).toBe(true);
    expect(inertShell?.getAttribute("aria-hidden")).toBe("true");
    expect(keep).toHaveFocus();

    // Background shell is marked inert/aria-hidden while the portal dialog is open
    expect(inertShell.contains(bg)).toBe(true);

    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalled();

    rerender(<Harness open={false} />);
    expect(inertShell?.inert).toBe(false);
    expect(inertShell?.hasAttribute("aria-hidden")).toBe(false);
    expect(document.body.style.overflow).not.toBe("hidden");
    const bgAfter = document.querySelector(
      "#app-root button",
    ) as HTMLButtonElement;
    bgAfter.focus();
    expect(document.activeElement).toBe(bgAfter);
  });
});
