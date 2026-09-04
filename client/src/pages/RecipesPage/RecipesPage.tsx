import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import recipeService from "../../utils/recipeService";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import type { Recipe } from "../../shared.types";
import "./RecipesPage.css";

function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes(title?: string) {
    const data = await recipeService.getAll(title ? { title } : {});
    setRecipes(data);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    fetchRecipes(e.target.value);
  }

  return (
    <div className="recipes-page">
      <p className="breadcrumb"><Link to="/">Home</Link> &gt; Recipe List</p>
      <h2>Recipe List</h2>
      <input type="text" placeholder="Search recipes" value={search} onChange={handleSearchChange} className="recipes-search" />
      {recipes.length === 0 ? (
        <p className="no-recipes-message">We couldn't find any recipes.</p>
      ) : (
        <div className="recipes-list">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} createdAt={recipe.createdAt} showViewLink />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipesPage;