import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import userService from "../utils/userService";

vi.mock("../utils/userService");

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows only the logo when logged out", () => {
    render(
      <MemoryRouter>
        <Navbar user={null} setUser={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByAltText("Spoonful")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /profile menu/i })).not.toBeInTheDocument();
  });

  it("opens the dropdown menu when logged in and the profile icon is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navbar user={{ _id: "1", email: "test@test.com" }} setUser={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /profile menu/i }));

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });

  it("logs out and calls setUser(null) when Log Out is clicked", async () => {
    const user = userEvent.setup();
    const setUser = vi.fn();
    render(
      <MemoryRouter>
        <Navbar user={{ _id: "1", email: "test@test.com" }} setUser={setUser} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /profile menu/i }));
    await user.click(screen.getByText("Log Out"));

    expect(userService.logout).toHaveBeenCalled();
    expect(setUser).toHaveBeenCalledWith(null);
  });
});