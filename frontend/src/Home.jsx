import React, { useState } from "react";
import App from "./App";
import "./style.css";

const Home = () => {
  const [activePage, setActivePage] = useState("home"); // 'home' or 'docstring'

  const handleNavClick = (page) => {
    setActivePage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // clear login info
    window.location.href = "/"; // go to Login
  };

  // Show Docstring Generator Page
  if (activePage === "docstring") {
    return <App />;
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar first">
        <div className="logo">PyDoc Generator</div>
        <div>
          <button onClick={() => handleNavClick("home")}>Home</button>
          <button onClick={() => handleNavClick("docstring")}>
            Docstring Generator
          </button>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Home Page Header */}
      <div className="container">
        <div className="card header-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h1>Welcome to PyDoc Generator!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            Your intelligent assistant to generate high-quality Python docstrings automatically.
          </p>
        </div>

        {/* Features Section */}
        <h2 style={{ marginTop: "50px", textAlign: "center" }}>Why Use PyDoc Generator?</h2>
        <div className="cards-container">
          <div className="card feature-card">
            <h3>Save Time</h3>
            <p>
              Automatically generate docstrings for your Python functions, classes, and modules without writing them manually.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Improve Readability</h3>
            <p>
              Make your code easier to understand and maintain with structured, standard-compliant docstrings.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Multiple Styles</h3>
            <p>
              Supports Google, NumPy, and reStructuredText docstring styles, so your documentation stays consistent.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Easy Integration</h3>
            <p>
              Simple upload-and-generate interface. Works with your existing Python projects seamlessly.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <h2 style={{ marginTop: "50px", textAlign: "center" }}>How to Use</h2>
        <div className="cards-container">
          <div className="card usage-card">
            <h3> Upload Python File</h3>
            <p>Select the Python file you want to document.</p>
          </div>
          <div className="card usage-card">
            <h3> Generate Docstrings</h3>
            <p>Click the 'Generate' button to auto-create docstrings for your code.</p>
          </div>
          <div className="card usage-card">
            <h3> Review & Save</h3>
            <p>Review generated docstrings and save them back to your project.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} 
      </footer>
    </div>
  );
};

export default Home;
