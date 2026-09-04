import { useState } from "react";
import type { Recipe } from "../../shared.types";
import "./RecipeForm.css";

type RecipeFormProps = {
  initialData?: Recipe;
  onSubmit: (data: object) => void;
  onCancel: () => void;
  submitLabel?: string;
};

function RecipeForm({ initialData, onSubmit, onCancel, submitLabel = "Save" }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [ingredients, setIngredients] = useState(initialData?.ingredients?.join(", ") || "");
  const [instructions, setInstructions] = useState(initialData?.instructions || "");
  const [tags, setTags] = useState(initialData?.tags.join(", ") || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [showImageInput, setShowImageInput] = useState(!initialData?.image);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      title,
      ingredients: ingredients.split(",").map((i) => i.trim()).filter(Boolean),
      instructions,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      image,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <h2>Create a Recipe</h2>

      <label htmlFor="recipe-title">Title</label>
      <input
        id="recipe-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="recipe-input"
      />

      <label htmlFor="recipe-ingredients">Ingredients</label>
      <textarea
        id="recipe-ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="1 Tbsp Olive Oil, 1 Onion, 2 Cloves Garlic..."
        required
        className="recipe-textarea"
      />

      <label htmlFor="recipe-instructions">Instructions</label>
      <textarea
        id="recipe-instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Saute onions in garlic. Add chickpeas and tomatoes, simmer for 20 mins."
        required
        className="recipe-textarea"
      />

      <label htmlFor="recipe-tags">Tags</label>
      <input
        id="recipe-tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Vegan, Gluten Free, Dinner"
        className="recipe-input"
      />

      <label htmlFor="recipe-image">Image</label>
      {image && !showImageInput ? (
        <div className="recipe-image-box">
          <img src={image} alt="Preview" className="recipe-image-preview" />
          <div className="recipe-image-actions">
            <button type="button" className="recipe-card-icon-btn" onClick={() => setImage("")} aria-label="Remove image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
              </svg>
            </button>
            <button type="button" className="recipe-card-icon-btn" onClick={() => setShowImageInput(true)} aria-label="Edit image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="recipe-image-box recipe-image-box-empty">
          <input
            id="recipe-image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="+ Add Image (paste a link)"
            className="recipe-image-url-input"
            onBlur={() => image && setShowImageInput(false)}
          />
        </div>
      )}

      <button type="submit" className="btn-primary">{submitLabel}</button>
      <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default RecipeForm;