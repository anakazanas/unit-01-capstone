import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import recipeService from "../../utils/recipeService";
import type { Recipe } from "../../shared.types";
import "./RecipeDetailPage.css";

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (id) recipeService.getOne(id).then(setRecipe);
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-detail-page">
      <p className="breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/recipes">Recipe List</Link> &gt; {recipe.title}
      </p>
      {recipe.image && <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />}
      <h1>{recipe.title}</h1>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
      <h3>Tags</h3>
      <div className="recipe-detail-tags">
        {recipe.tags.map((tag) => <span className="recipe-card-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  );
}

export default RecipeDetailPage;