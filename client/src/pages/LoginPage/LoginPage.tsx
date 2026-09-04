import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../utils/userService";

type LoginPageProps = { handleSignUpOrLogin: () => void };

export default function LoginPage({ handleSignUpOrLogin }: LoginPageProps) {
  const [error, setError] = useState("");
  const [state, setState] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await userService.login(state);
      handleSignUpOrLogin();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h2 className="login-header">Welcome Back!</h2>
        <p className="login-subheader">Log in to your account to continue</p>
        <form autoComplete="off" onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={state.email} onChange={handleChange} required className="login-input" />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={state.password} onChange={handleChange} required className="login-input" />
          <p className="forgot-password">Forgot Password?</p>
          <button type="submit" className="btn-primary">Login</button>
          <Link to="/signup" className="btn-outline" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
            Create an Account
          </Link>
          {error ? <ErrorMessage message={error} /> : null}
        </form>
        <Link to="/recipes" className="explore-link">Explore Recipes without Logging In</Link>
      </div>
    </div>
  );
}