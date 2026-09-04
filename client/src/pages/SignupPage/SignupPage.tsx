import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";
import userService from "../../utils/userService";

type SignupPageProps = { handleSignUpOrLogin: () => void };

export default function SignupPage({ handleSignUpOrLogin }: SignupPageProps) {
  const [error, setError] = useState("");
  const [state, setState] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await userService.signup(state);
      handleSignUpOrLogin();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-form-container">
        <h2 className="signup-header">Create an Account</h2>
        <form autoComplete="off" onSubmit={handleSubmit} className="signup-form">
          <label htmlFor="email">Username</label>
          <input id="email" type="email" name="email" placeholder="you@email.com" value={state.email} onChange={handleChange} required className="signup-input" />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={state.password} onChange={handleChange} required className="signup-input" />
          <button type="submit" className="btn-primary">Create Account</button>
          <button type="button" className="btn-outline" onClick={() => navigate("/")}>Cancel</button>
          {error ? <ErrorMessage message={error} /> : null}
        </form>
      </div>
    </div>
  );
}