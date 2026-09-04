import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import userService from "./utils/userService";
import recipeService from "./utils/recipeService";

vi.mock("./utils/userService");
vi.mock("./utils/recipeService");

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(recipeService.getAll).mockResolvedValue([]);
  });

  it("renders the landing page at the root route when logged out", () => {
    vi.mocked(userService.getUser).mockReturnValue(null);
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Welcome to Spoonful!")).toBeInTheDocument();
  });

  it("redirects to /login when visiting /dashboard while logged out", () => {
    vi.mocked(userService.getUser).mockReturnValue(null);
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Welcome Back!")).toBeInTheDocument();
  });

    it("shows the dashboard when logged in", async () => {
    vi.mocked(userService.getUser).mockReturnValue({ _id: "1", email: "test@test.com" });
    render(
        <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
        </MemoryRouter>
    );
    expect(await screen.findByText(/welcome back! manage your recipes/i)).toBeInTheDocument();
    });
});