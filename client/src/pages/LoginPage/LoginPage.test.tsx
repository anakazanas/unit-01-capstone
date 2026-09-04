import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import userService from "../../utils/userService";

vi.mock("../../utils/userService");

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Welcome Back heading and form fields", () => {
    render(
      <MemoryRouter>
        <LoginPage handleSignUpOrLogin={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText("Welcome Back!")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("calls userService.login and handleSignUpOrLogin on successful submit", async () => {
    const user = userEvent.setup();
    vi.mocked(userService.login).mockResolvedValueOnce({ _id: "1", email: "test@test.com" });
    const handleSignUpOrLogin = vi.fn();

    render(
      <MemoryRouter>
        <LoginPage handleSignUpOrLogin={handleSignUpOrLogin} />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "test@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(userService.login).toHaveBeenCalledWith({ email: "test@test.com", password: "password123" });
    expect(handleSignUpOrLogin).toHaveBeenCalled();
  });

  it("shows an error message when login fails", async () => {
    const user = userEvent.setup();
    vi.mocked(userService.login).mockRejectedValueOnce(new Error("bad credentials"));

    render(
      <MemoryRouter>
        <LoginPage handleSignUpOrLogin={vi.fn()} />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "test@test.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("bad credentials")).toBeInTheDocument();
  });
});