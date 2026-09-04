import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RecipesPage from "./RecipesPage";
import recipeService from "../../utils/recipeService";

vi.mock("../../utils/recipeService");

const mockRecipes = [
  {
    _id: "1",
    title: "Chickpea Stew",
    ingredients: ["Chickpeas"],
    instructions: "Simmer.",
    tags: ["Vegan"],
    image: "",
    ownerId: "owner1",
    createdAt: "2025-02-13T00:00:00.000Z",
  },
];

describe("RecipesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders recipes returned from the API", async () => {
    vi.mocked(recipeService.getAll).mockResolvedValueOnce(mockRecipes);
    render(
      <MemoryRouter>
        <RecipesPage />
      </MemoryRouter>
    );
    expect(await screen.findByText("Chickpea Stew")).toBeInTheDocument();
  });

  it("shows a no-results message when there are no recipes", async () => {
    vi.mocked(recipeService.getAll).mockResolvedValueOnce([]);
    render(
      <MemoryRouter>
        <RecipesPage />
      </MemoryRouter>
    );
    expect(await screen.findByText("We couldn't find any recipes.")).toBeInTheDocument();
  });

  it("calls getAll with the search term when typing in the search box", async () => {
    const user = userEvent.setup();
    vi.mocked(recipeService.getAll).mockResolvedValue(mockRecipes);
    render(
      <MemoryRouter>
        <RecipesPage />
      </MemoryRouter>
    );
    await screen.findByText("Chickpea Stew");
    await user.type(screen.getByPlaceholderText("Search recipes"), "soup");

    await waitFor(() => {
      expect(recipeService.getAll).toHaveBeenLastCalledWith({ title: "soup" });
    });
  });
});