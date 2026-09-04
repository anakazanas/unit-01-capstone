import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import RecipesPage from "./pages/RecipesPage/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage/RecipeDetailPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import type { User } from "./shared.types";
import userService from "./utils/userService";

function App() {
  const [user, setUser] = useState<User | null>(userService.getUser());

  function handleSignUpOrLogin() {
    setUser(userService.getUser());
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <h1 style={{ fontSize: "40px" }}>Welcome to Spoonful!</h1>
              <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "24px" }}>
                <Link to="/recipes" style={{ color: "var(--color-green-400)", fontWeight: 600, fontSize: "18px", textDecoration: "none" }}>
                  Explore Recipes
                </Link>
                {user ? (
                  <Link to="/dashboard" style={{ color: "var(--color-green-400)", fontWeight: 600, fontSize: "18px", textDecoration: "none" }}>
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/login" style={{ color: "var(--color-green-400)", fontWeight: 600, fontSize: "18px", textDecoration: "none" }}>
                    Login
                  </Link>
                )}
              </div>
            </div>
          }
        />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/login" element={<LoginPage handleSignUpOrLogin={handleSignUpOrLogin} />} />
        <Route path="/signup" element={<SignupPage handleSignUpOrLogin={handleSignUpOrLogin} />} />
        <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;