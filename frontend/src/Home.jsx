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

      {/* ================= NAVBAR ================= */}
      <nav className="navbar first">
        <div className="logo">PyDoc Generator</div>
        <div>
          <button onClick={() => handleNavClick("home")}>Home</button>
          <button onClick={() => handleNavClick("docstring")}>
            Docstring Generator
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="container">

        {/* ================= HERO SECTION ================= */}
        <div className="card">
          <h1>PyDoc Generator</h1>
          <p>
            Intelligent Python Documentation Automation System
          </p>
          <p>
            Automatically generate structured, PEP 257-compliant Python
            docstrings for functions, classes, and modules. Improve
            readability, enforce documentation standards, and accelerate
            development workflows using automated code analysis.
          </p>
        </div>

        {/* ================= WHAT IS THIS ================= */}
        <div className="card">
          <h2 className="features-title">What is PyDoc Generator?</h2>
          <p>
            PyDoc Generator is a full-stack web application designed to analyze
            Python source code and automatically generate meaningful,
            structured documentation. It extracts functions, classes,
            parameters, return types, and generates high-quality docstrings
            in standardized formats.
          </p>
        </div>

        {/* ================= KEY FEATURES ================= */}
        <div className="card">
          <h2 className="features-title">Key Features</h2>

          <div className="features-grid">

            <div className="feature-item">
              <h3>Automated Code Analysis</h3>
              <p>
                Uses Python AST parsing to deeply understand code structure,
                function signatures, and class definitions.
              </p>
            </div>

            <div className="feature-item">
              <h3>Multiple Documentation Styles</h3>
              <p>
                Supports Google Style, NumPy Style, and reStructuredText (reST)
                formats.
              </p>
            </div>

            <div className="feature-item">
              <h3>PEP 257 Compliance</h3>
              <p>
                Ensures proper summary lines, spacing rules, and structured
                formatting according to official Python documentation standards.
              </p>
            </div>

            <div className="feature-item">
              <h3>Validation Engine</h3>
              <p>
                Checks documentation completeness and highlights missing
                parameter descriptions or return explanations.
              </p>
            </div>

            <div className="feature-item">
              <h3>File Upload Support</h3>
              <p>
                Upload full Python files or paste code directly into the system
                for analysis.
              </p>
            </div>

            <div className="feature-item">
              <h3>Download Updated Code</h3>
              <p>
                Automatically inject generated docstrings into your source code
                and download the updated file instantly.
              </p>
            </div>

          </div>
        </div>

        {/* ================= HOW IT WORKS ================= */}
        <div className="card">
          <h2 className="features-title">How It Works</h2>

          <div className="features-grid">

            <div className="feature-item">
              <h3>1. Upload Code</h3>
              <p>
                Provide your Python source file or paste your code into the
                editor.
              </p>
            </div>

            <div className="feature-item">
              <h3>2. Choose Documentation Style</h3>
              <p>
                Select your preferred documentation format based on your
                project standards.
              </p>
            </div>

            <div className="feature-item">
              <h3>3. Analyze & Generate</h3>
              <p>
                The backend parses your code using AST and generates
                context-aware docstrings.
              </p>
            </div>

            <div className="feature-item">
              <h3>4. Review & Download</h3>
              <p>
                Validate generated documentation and download your updated
                Python file.
              </p>
            </div>

          </div>
        </div>

        {/* ================= TECHNOLOGY STACK ================= */}
        <div className="card">
          <h2 className="features-title">Technology Stack</h2>

          <div className="features-grid">

            <div className="feature-item">
              <h3>Frontend</h3>
              <p>
                Built with React.js for a dynamic and responsive user
                experience.
              </p>
            </div>

            <div className="feature-item">
              <h3>Backend</h3>
              <p>
                Developed using Flask (Python) to handle file processing,
                parsing, and documentation logic.
              </p>
            </div>

            <div className="feature-item">
              <h3>Parsing Engine</h3>
              <p>
                Utilizes Python’s Abstract Syntax Tree (AST) module for
                accurate code analysis.
              </p>
            </div>

            <div className="feature-item">
              <h3>Storage</h3>
              <p>
                Stores metadata and generated documentation for efficient
                tracking and reuse.
              </p>
            </div>

          </div>
        </div>

        {/* ================= BENEFITS ================= */}
        <div className="card">
          <h2 className="features-title">Benefits</h2>

          <div className="features-grid">

            <div className="feature-item">
              <h3>Improved Code Readability</h3>
              <p>
                Makes projects easier to understand and maintain.
              </p>
            </div>

            <div className="feature-item">
              <h3>Faster Development</h3>
              <p>
                Saves time by automating repetitive documentation tasks.
              </p>
            </div>

            <div className="feature-item">
              <h3>Team Collaboration</h3>
              <p>
                Enforces consistent documentation standards across teams.
              </p>
            </div>

            <div className="feature-item">
              <h3>Professional Standards</h3>
              <p>
                Ensures high-quality, production-ready documentation.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        © {new Date().getFullYear()} PyDoc Generator. All rights reserved.
      </footer>

    </div>
  );
};

export default Home;