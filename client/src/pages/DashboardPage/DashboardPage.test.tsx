import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import recipeService from "../../utils/recipeService";

vi.mock("../../utils/recipeService");

const currentUser = { _id: "user1", email: "me@test.com" };

const myRecipe = {
  _id: "r1",
  title: "My Soup",
  ingredients: ["Water"],
  instructions: "Boil.",
  tags: ["Easy"],
  image: "",
  ownerId: "user1",
  createdAt: "2025-01-01T00:00:00.000Z",
};

const othersRecipe = {
  _id: "r2",
  title: "Not Mine",
  ingredients: ["Salt"],
  instructions: "Shake.",
  tags: [],
  image: "",
  ownerId: "someone-else",
};

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an empty state when the user has no recipes", async () => {
    vi.mocked(recipeService.getAll).mockResolvedValueOnce([othersRecipe]);
    render(
      <MemoryRouter>
        <DashboardPage user={currentUser} />
      </MemoryRouter>
    );
    expect(await screen.findByText("Your recipes will show up here.")).toBeInTheDocument();
    expect(screen.queryByText("Not Mine")).not.toBeInTheDocument();
  });

  it("shows only the current user's recipes", async () => {
    vi.mocked(recipeService.getAll).mockResolvedValueOnce([myRecipe, othersRecipe]);
    render(
      <MemoryRouter>
        <DashboardPage user={currentUser} />
      </MemoryRouter>
    );
    expect(await screen.findByText("My Soup")).toBeInTheDocument();
    expect(screen.queryByText("Not Mine")).not.toBeInTheDocument();
  });

  it("creates a new recipe and shows a success message", async () => {
    const user = userEvent.setup();
    vi.mocked(recipeService.getAll).mockResolvedValue([]);
    vi.mocked(recipeService.create).mockResolvedValueOnce(myRecipe);

    render(
      <MemoryRouter>
        <DashboardPage user={currentUser} />
      </MemoryRouter>
    );

    await screen.findByText("Your recipes will show up here.");
    await user.click(screen.getByRole("button", { name: /create recipe/i }));

    await user.type(screen.getByLabelText(/title/i), "New Soup");
    await user.type(screen.getByLabelText(/ingredients/i), "Water");
    await user.type(screen.getByLabelText(/instructions/i), "Boil it.");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(recipeService.create).toHaveBeenCalled();
    expect(await screen.findByText("Your recipe was successfully created.")).toBeInTheDocument();
  });

  it("shows a confirm modal and deletes a recipe on confirm", async () => {
    const user = userEvent.setup();
    vi.mocked(recipeService.getAll).mockResolvedValue([myRecipe]);
    vi.mocked(recipeService.delete).mockResolvedValueOnce({ message: "Deleted Recipe" });

    render(
      <MemoryRouter>
        <DashboardPage user={currentUser} />
      </MemoryRouter>
    );

    await screen.findByText("My Soup");
    await user.click(screen.getByRole("button", { name: /delete recipe/i }));
    expect(screen.getByText("Delete recipe?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /yes, delete recipe/i }));

    expect(recipeService.delete).toHaveBeenCalledWith("r1");
    expect(await screen.findByText("Your recipe was successfully deleted.")).toBeInTheDocument();
  });
});