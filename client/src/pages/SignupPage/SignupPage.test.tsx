import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SignupPage from "./SignupPage";
import userService from "../../utils/userService";

vi.mock("../../utils/userService");

describe("SignupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Create an Account heading and form fields", () => {
    render(
      <MemoryRouter>
        <SignupPage handleSignUpOrLogin={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText("Create an Account")).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("calls userService.signup and handleSignUpOrLogin on successful submit", async () => {
    const user = userEvent.setup();
    vi.mocked(userService.signup).mockResolvedValueOnce({ _id: "1", email: "new@test.com" });
    const handleSignUpOrLogin = vi.fn();

    render(
      <MemoryRouter>
        <SignupPage handleSignUpOrLogin={handleSignUpOrLogin} />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/username/i), "new@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(userService.signup).toHaveBeenCalledWith({ email: "new@test.com", password: "password123" });
    expect(handleSignUpOrLogin).toHaveBeenCalled();
  });
});