import { Link } from "react-router-dom";
import type { Recipe } from "../../shared.types";
import "./RecipeCard.css";

type RecipeCardProps = {
  recipe: Recipe;
  createdAt?: string;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  showViewLink?: boolean;
};

function RecipeCard({ recipe, createdAt, onEdit, onDelete, showViewLink }: RecipeCardProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" })
    : null;

  return (
    <div className="recipe-card">
      {recipe.image && <img src={recipe.image} alt={recipe.title} className="recipe-card-image" />}
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        {formattedDate && <p className="recipe-card-date">Created on {formattedDate}</p>}
        <div className="recipe-card-tags">
          {recipe.tags.map((tag) => (
            <span className="recipe-card-tag" key={tag}>{tag}</span>
          ))}
        </div>
        {showViewLink && (
          <Link to={`/recipes/${recipe._id}`} className="recipe-card-view-link">View Recipe</Link>
        )}
        {(onEdit || onDelete) && (
          <div className="recipe-card-actions">
            {onDelete && (
              <button className="recipe-card-icon-btn" onClick={() => onDelete(recipe)} aria-label="Delete recipe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-green-400)" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                </svg>
              </button>
            )}
            {onEdit && (
              <button className="recipe-card-icon-btn" onClick={() => onEdit(recipe)} aria-label="Edit recipe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-green-400)" strokeWidth="2">
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;