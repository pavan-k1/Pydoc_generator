import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Please login.");
        navigate("/");
      } else {
        alert(data.msg || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card card">
        <h1 className="login-title">Create Account</h1>
        <p className="login-subtitle">Register to continue</p>

        <form onSubmit={handleRegister} className="login-form">
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
            Register
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#214abb", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
