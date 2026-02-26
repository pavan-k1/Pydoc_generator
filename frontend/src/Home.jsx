import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleNavClick = (page) => {
    if (page === "home") {
      navigate("/home");
    } else if (page === "docstring") {
      navigate("/app");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

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
        <div
          className="card header-card"
          style={{ marginTop: "40px", textAlign: "center" }}
        >
          <h1>Welcome to PyDoc Generator!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            PyDoc Generator helps developers automatically create structured,
            PEP 257-compliant Python docstrings for functions, classes, and modules.
            Improve code readability, maintainability, and documentation standards
            with intelligent AI-powered generation.
          </p>
        </div>

        {/* Features Section */}
        <h2 style={{ marginTop: "50px", textAlign: "center" }}>
          Why Use PyDoc Generator?
        </h2>
        <div className="cards-container">
          <div className="card feature-card">
            <h3>Save Development Time</h3>
            <p>
              Writing documentation manually can slow down development.
              PyDoc Generator analyzes your Python code and produces complete,
              well-structured docstrings instantly — reducing repetitive work
              and increasing productivity.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Improve Code Maintainability</h3>
            <p>
              Clear documentation makes it easier for teams to understand,
              modify, and scale codebases. Generated docstrings include
              parameter descriptions, return types, and purpose explanations,
              ensuring long-term maintainability.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Multiple Documentation Styles</h3>
            <p>
              Supports Google Style, NumPy Style, and reStructuredText (reST).
              Maintain consistent documentation standards across projects
              and align with industry best practices.
            </p>
          </div>

          <div className="card feature-card">
            <h3>PEP 257 Compliance</h3>
            <p>
              Ensures that generated docstrings follow PEP 257 conventions,
              including proper summaries, formatting, and structure. This helps
              maintain professional Python documentation standards.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <h2 style={{ marginTop: "50px", textAlign: "center" }}>
          How to Use
        </h2>
        <div className="cards-container">
          <div className="card usage-card">
            <h3>Upload Python File</h3>
            <p>
              Select and upload your Python source file. The system parses
              functions, classes, and modules to understand their structure
              before generating documentation.
            </p>
          </div>

          <div className="card usage-card">
            <h3>Generate Docstrings</h3>
            <p>
              Choose your preferred documentation style and click Generate.
              The AI analyzes function parameters, return statements, and
              logic to create meaningful and accurate docstrings.
            </p>
          </div>

          <div className="card usage-card">
            <h3>Review, Validate & Save</h3>
            <p>
              Review generated docstrings, check PEP 257 validation results,
              and integrate them directly into your project to maintain
              professional documentation standards.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} PyDoc Generator | Intelligent Documentation System
      </footer>
    </div>
  );
};

export default Home;
