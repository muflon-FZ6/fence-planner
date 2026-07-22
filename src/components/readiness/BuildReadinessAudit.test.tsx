/** @vitest-environment jsdom */
import { describe, expect, it, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BuildReadinessAudit } from "@/components/readiness/BuildReadinessAudit";
import { READINESS_STORAGE_KEY } from "@/domain/buildReadiness";

describe("BuildReadinessAudit UI", () => {
  afterEach(() => {
    cleanup();
    localStorage.removeItem(READINESS_STORAGE_KEY);
  });

  it("supports selecting answers and shows Stop when locate is No", async () => {
    const user = userEvent.setup();
    render(<BuildReadinessAudit />);

    const noRadios = screen.getAllByRole("radio", { name: "No" });
    expect(noRadios.length).toBeGreaterThan(2);
    // utility_locate is the 3rd question (index 2)
    await user.click(noRadios[2]);

    expect(screen.getByText(/Overall: Stop before digging/i)).toBeTruthy();
  });

  it("persists answers only to localStorage (no network)", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 204 }));
    render(<BuildReadinessAudit />);
    const yesRadios = screen.getAllByRole("radio", { name: "Yes" });
    await user.click(yesRadios[0]);
    expect(localStorage.getItem(READINESS_STORAGE_KEY)).toContain(
      "boundary_source",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
