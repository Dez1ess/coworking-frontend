import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(
        "/api/auth/login",
        form
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login">
      <div className="login__top">
        <div className="login__title">
          <h1>Login</h1>
        </div>
        <div className="login__descr">
          <p>Welcome back</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form__input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="login-form__input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" className="login-form__btn">
          Login
        </button>
      </form>
      <div className="login__bottom">
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="login__bottom-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
