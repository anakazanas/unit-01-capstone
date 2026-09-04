import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RecipeForm from "./RecipeForm";

describe("RecipeForm", () => {
  it("calls onSubmit with parsed ingredients and tags arrays", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<RecipeForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/title/i), "Chickpea Stew");
    await user.type(screen.getByLabelText(/ingredients/i), "1 can chickpeas, 1 onion");
    await user.type(screen.getByLabelText(/instructions/i), "Simmer everything together.");
    await user.type(screen.getByLabelText(/tags/i), "Vegan, Easy");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "Chickpea Stew",
      ingredients: ["1 can chickpeas", "1 onion"],
      instructions: "Simmer everything together.",
      tags: ["Vegan", "Easy"],
      image: "",
    });
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(<RecipeForm onSubmit={vi.fn()} onCancel={handleCancel} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(handleCancel).toHaveBeenCalled();
  });

  it("prefills fields when initialData is provided", () => {
    render(
      <RecipeForm
        initialData={{
          _id: "1",
          title: "Soup",
          ingredients: ["Water", "Salt"],
          instructions: "Boil it.",
          tags: ["Easy"],
          image: "",
          ownerId: "owner1",
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue("Soup");
    expect(screen.getByLabelText(/ingredients/i)).toHaveValue("Water, Salt");
  });
});