import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/home");
      } else {
        alert(data.msg || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card card">
        <h1 className="login-title">Welcome to PyDoc Generator</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* ✅ Register Link Added */}
        <p style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#214abb", cursor: "pointer", fontWeight: "500" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
