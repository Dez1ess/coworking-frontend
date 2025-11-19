import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(
        "/api/auth/register",
        form
      );
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login">
      <div className="login__top">
        <div className="login__title">
          <h1>Sign Up</h1>
        </div>
        <div className="login__descr">
          <p>Create your account</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form__input">
          <label htmlFor="first_name">Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>
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
          Create Account
        </button>
      </form>
      <div className="login__bottom">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="login__bottom-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
