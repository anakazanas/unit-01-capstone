import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ConfirmModal from "./ConfirmModal";

describe("ConfirmModal", () => {
  it("renders the message, sub-message, and confirm label", () => {
    render(
      <ConfirmModal
        message="Delete recipe?"
        subMessage="This cannot be undone."
        confirmLabel="Yes, Delete Recipe"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText("Delete recipe?")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yes, Delete Recipe" })).toBeInTheDocument();
  });

  it("calls onConfirm and onCancel when their buttons are clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmModal
        message="Delete recipe?"
        confirmLabel="Yes, Delete Recipe"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole("button", { name: "Yes, Delete Recipe" }));
    await user.click(screen.getByRole("button", { name: "Nevermind" }));

    expect(onConfirm).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });
});