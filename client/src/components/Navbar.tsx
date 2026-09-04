import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { User } from "../shared.types";
import userService from "../utils/userService";
import "./Navbar.css";

type NavbarProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

function Navbar({ user, setUser }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    userService.logout();
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <nav className={user ? "navbar navbar-loggedin" : "navbar navbar-loggedout"}>
      <Link to="/" className="navbar-logo">
        <img src="https://i.imgur.com/EcJKI62.png" alt="Spoonful" style={{ height: "28px" }} />
      </Link>
      {user && (
        <div className="navbar-right">
          <div className="navbar-profile">
            <button className="navbar-profile-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Profile menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </button>
            {menuOpen && (
              <div className="navbar-dropdown">
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;