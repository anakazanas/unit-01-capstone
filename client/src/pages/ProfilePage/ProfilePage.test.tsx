import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import userService from "../../utils/userService";

vi.mock("../../utils/userService");

const mockUser = { _id: "1", email: "me@test.com" };

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prefills the email field with the current user's email", () => {
    render(
      <MemoryRouter>
        <ProfilePage user={mockUser} setUser={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/username/i)).toHaveValue("me@test.com");
  });

  it("updates the profile and shows a success message", async () => {
    const user = userEvent.setup();
    vi.mocked(userService.updateProfile).mockResolvedValueOnce({ _id: "1", email: "new@test.com" });

    render(
      <MemoryRouter>
        <ProfilePage user={mockUser} setUser={vi.fn()} />
      </MemoryRouter>
    );

    await user.clear(screen.getByLabelText(/username/i));
    await user.type(screen.getByLabelText(/username/i), "new@test.com");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(userService.updateProfile).toHaveBeenCalledWith({ email: "new@test.com" });
    expect(await screen.findByText("Your profile info was successfully updated.")).toBeInTheDocument();
  });

  it("shows a confirm modal and deletes the account on confirm", async () => {
    const user = userEvent.setup();
    const setUser = vi.fn();
    vi.mocked(userService.deleteAccount).mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <ProfilePage user={mockUser} setUser={setUser} />
      </MemoryRouter>
    );

    await user.click(screen.getByText("Delete Account"));
    expect(screen.getByText("Delete account?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /yes, delete account/i }));

    expect(userService.deleteAccount).toHaveBeenCalled();
    expect(setUser).toHaveBeenCalledWith(null);
  });
});