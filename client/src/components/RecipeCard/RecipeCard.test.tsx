import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import type { Recipe } from "../../shared.types";

const mockRecipe: Recipe = {
  _id: "1",
  title: "Chickpea Stew",
  ingredients: ["1 can chickpeas"],
  instructions: "Simmer everything together.",
  tags: ["Vegan", "Easy"],
  image: "https://example.com/image.jpg",
  ownerId: "owner1",
  createdAt: "2025-02-13T00:00:00.000Z",
};

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("RecipeCard", () => {
  it("renders the title, date, and tags", () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} createdAt={mockRecipe.createdAt} />);
    expect(screen.getByText("Chickpea Stew")).toBeInTheDocument();
    expect(screen.getByText(/Created on/)).toBeInTheDocument();
    expect(screen.getByText("Vegan")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
  });

  it("shows a View Recipe link when showViewLink is true", () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} showViewLink />);
    expect(screen.getByRole("link", { name: /view recipe/i })).toHaveAttribute("href", "/recipes/1");
  });

  it("calls onDelete and onEdit when their icons are clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    renderWithRouter(<RecipeCard recipe={mockRecipe} onDelete={onDelete} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: /delete recipe/i }));
    await user.click(screen.getByRole("button", { name: /edit recipe/i }));

    expect(onDelete).toHaveBeenCalledWith(mockRecipe);
    expect(onEdit).toHaveBeenCalledWith(mockRecipe);
  });
});