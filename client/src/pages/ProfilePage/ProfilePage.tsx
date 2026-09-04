import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import SuccessBanner from "../../components/SuccessBanner/SuccessBanner";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import userService from "../../utils/userService";
import type { User } from "../../shared.types";
import "./ProfilePage.css";

type ProfilePageProps = {
  user: User;
  setUser: (user: User | null) => void;
};

function ProfilePage({ user, setUser }: ProfilePageProps) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const updates: { email?: string; password?: string } = { email };
      if (password) updates.password = password;
      const updatedUser = await userService.updateProfile(updates);
      setUser(updatedUser);
      setPassword("");
      setSuccess("Your profile info was successfully updated.");
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleLogout() {
    userService.logout();
    setUser(null);
    navigate("/login");
  }

  async function handleDelete() {
    await userService.deleteAccount();
    setUser(null);
    navigate("/");
  }

  return (
    <div className="profile-page">
      <p className="breadcrumb"><Link to="/">Home</Link> &gt; Your Profile</p>
      <h2>Your Profile</h2>
      {success && <SuccessBanner message={success} />}
      <form onSubmit={handleSave} className="profile-form">
        <label htmlFor="email">Username</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="profile-input" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Leave blank to keep current password" value={password} onChange={(e) => setPassword(e.target.value)} className="profile-input" />
        <button type="submit" className="btn-primary">Save Changes</button>
        <button type="button" className="btn-outline" onClick={handleLogout}>Log Out</button>
        {error ? <ErrorMessage message={error} /> : null}
      </form>
      <p className="delete-account-link" onClick={() => setShowDeleteConfirm(true)}>Delete Account</p>

      {showDeleteConfirm && (
        <ConfirmModal
          message="Delete account?"
          subMessage="Do you want to delete your account? This action cannot be undone."
          confirmLabel="Yes, Delete Account"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;