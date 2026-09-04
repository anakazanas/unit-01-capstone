import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import recipeService from "../../utils/recipeService";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import RecipeForm from "../../components/RecipeForm/RecipeForm";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import SuccessBanner from "../../components/SuccessBanner/SuccessBanner";
import type { Recipe, User } from "../../shared.types";
import "./DashboardPage.css";

type DashboardPageProps = { user: User };

function DashboardPage({ user }: DashboardPageProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  async function fetchMyRecipes() {
    const all = await recipeService.getAll();
    setRecipes(all.filter((r: Recipe) => r.ownerId === user._id));
  }

  async function handleCreate(data: object) {
    await recipeService.create(data);
    setShowForm(false);
    setMessage("Your recipe was successfully created.");
    fetchMyRecipes();
  }

  async function handleUpdate(data: object) {
    if (!editingRecipe) return;
    await recipeService.update(editingRecipe._id, data);
    setEditingRecipe(null);
    setMessage("Your recipe was successfully updated.");
    fetchMyRecipes();
  }

  async function confirmDelete() {
    if (!deletingRecipe) return;
    await recipeService.delete(deletingRecipe._id);
    setDeletingRecipe(null);
    setMessage("Your recipe was successfully deleted.");
    fetchMyRecipes();
  }

  if (editingRecipe) {
    return <div className="dashboard-page"><RecipeForm initialData={editingRecipe} onSubmit={handleUpdate} onCancel={() => setEditingRecipe(null)} submitLabel="Save" /></div>;
  }

  if (showForm) {
    return <div className="dashboard-page"><RecipeForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} submitLabel="Save" /></div>;
  }

  return (
    <div className="dashboard-page">
      {message && <SuccessBanner message={message} />}
      <p className="dashboard-welcome">Welcome back! Manage your recipes or add a new one.</p>
      <h2>Your Recipes</h2>
      {recipes.length === 0 ? (
        <div className="empty-recipes-box">Your recipes will show up here.</div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} createdAt={recipe.createdAt} onEdit={() => setEditingRecipe(recipe)} onDelete={() => setDeletingRecipe(recipe)} />
          ))}
        </div>
      )}
      <button className="btn-primary" style={{ maxWidth: "200px" }} onClick={() => setShowForm(true)}>Create Recipe</button>
      <Link to="/recipes" className="browse-link">Browse Recipes</Link>

      {deletingRecipe && (
        <ConfirmModal
          message="Delete recipe?"
          subMessage="Do you want to delete this recipe? This action cannot be undone."
          confirmLabel="Yes, Delete Recipe"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingRecipe(null)}
        />
      )}
    </div>
  );
}

export default DashboardPage;