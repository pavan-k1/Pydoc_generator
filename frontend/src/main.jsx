import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";   // ✅ ADDED
import Home from "./home.jsx";
import "./style.css";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/" />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />

      {/* ✅ NEW REGISTER ROUTE */}
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/app"
        element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
