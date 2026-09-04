import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RecipeDetailPage from "./RecipeDetailPage";
import recipeService from "../../utils/recipeService";

vi.mock("../../utils/recipeService");

const mockRecipe = {
  _id: "1",
  title: "Chickpea Stew",
  ingredients: ["Chickpeas", "Onion"],
  instructions: "Simmer everything together.",
  tags: ["Vegan", "Easy"],
  image: "https://example.com/image.jpg",
  ownerId: "owner1",
};

function renderWithRoute(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/recipes/${id}`]}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RecipeDetailPage", () => {
  it("shows a loading state before the recipe is fetched", () => {
    vi.mocked(recipeService.getOne).mockReturnValueOnce(new Promise(() => {}));
    renderWithRoute("1");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the recipe details once loaded", async () => {
    vi.mocked(recipeService.getOne).mockResolvedValueOnce(mockRecipe);
    renderWithRoute("1");

    expect(await screen.findByText("Chickpea Stew")).toBeInTheDocument();
    expect(screen.getByText("Chickpeas")).toBeInTheDocument();
    expect(screen.getByText("Simmer everything together.")).toBeInTheDocument();
    expect(screen.getByText("Vegan")).toBeInTheDocument();
  });
});