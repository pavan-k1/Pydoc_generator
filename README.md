# Pydoc Generator

Pydoc Generator is a full-stack developer tool designed to **automatically generate high-quality Python docstrings**. It analyzes Python source code, extracts modules, classes, functions, and methods using the **Abstract Syntax Tree (AST)**, and produces structured documentation using **AI-powered models with fallback mechanisms**.

The project combines a **Python + Flask backend** for code analysis and docstring generation with a **React frontend** that provides an interactive interface for uploading Python files, visualizing documentation coverage, validating existing docstrings, and downloading updated code.

The goal of this project is to help developers **maintain clean, standardized, and well-documented Python codebases without manual effort**.

---

# Table of Contents

* Overview
* Motivation
* Features
* System Architecture
* Project Structure
* Installation
* Backend Setup
* Frontend Setup
* Usage
* Application Workflow
* Backend Architecture
* Frontend Architecture
* File Upload & Management
* Python Code Parsing
* Node Extraction
* Docstring Generation
* AI Model Integration
* Template Fallback Generation
* Supported Docstring Styles
* Validation System
* Documentation Coverage
* API Endpoints
* Data Flow
* Security Considerations
* Performance Considerations
* Technologies Used
* Future Improvements
* Contributing
* License

---

# Overview

Documentation is one of the most important aspects of maintainable software, yet it is frequently ignored during development. Writing docstrings manually can be repetitive and time-consuming.

Pydoc Generator solves this problem by **automatically generating structured documentation for Python projects**.

The system works by:

1. Parsing Python source code using AST
2. Extracting all code structures
3. Generating documentation using AI models
4. Validating existing docstrings
5. Calculating documentation coverage
6. Returning structured results to the frontend

This allows developers to quickly document entire Python files with minimal effort.

---

# Motivation

Many Python projects suffer from poor documentation due to:

* Time constraints
* Lack of documentation discipline
* Inconsistent docstring styles
* Large legacy codebases with missing documentation

Pydoc Generator addresses these challenges by:

* Automating documentation generation
* Enforcing documentation standards
* Visualizing missing documentation
* Improving developer productivity

---

# Features

Automatic Python docstring generation.

Support for:

* Modules
* Classes
* Functions
* Methods

AI-powered documentation generation.

Fallback generation system for reliability.

Support for multiple docstring styles:

* Google Style
* NumPy Style
* reStructuredText (reST)

Validation of existing docstrings using **PEP257**.

Docstring coverage analysis.

Interactive frontend dashboard.

Download generated Python files.

Secure file upload handling.

---

# System Architecture

```
User
 │
 ▼
React Frontend
 │
 ▼
Flask Backend API
 │
 ▼
File Upload Handler
 │
 ▼
AST Parser
 │
 ▼
Node Extraction
 │
 ▼
Docstring Generation Engine
 │      │
 │      ├── Google Generative AI
 │      ├── GLM-4.7-Cerebras
 │      └── Template Generator
 │
 ▼
Docstring Validator (PEP257)
 │
 ▼
Coverage Analyzer
 │
 ▼
JSON Response
 │
 ▼
Frontend Visualization
```

---

# Project Structure

```
Pydoc_generator
│
├── backend
│   │
│   ├── app.py
│   │   Flask API server that exposes endpoints used
│   │   by the frontend application.
│   │
│   ├── generator.py
│   │   Contains the logic for generating docstrings
│   │   using AI models and fallback mechanisms.
│   │
│   ├── parsor.py
│   │   Parses Python source files using the AST module
│   │   and extracts code nodes.
│   │
│   ├── inserter.py
│   │   Inserts generated docstrings into the original
│   │   Python source code.
│   │
│   ├── validator.py
│   │   Validates docstrings using pydocstyle
│   │   according to PEP257 guidelines.
│   │
│   ├── doc_report.py
│   │   Calculates documentation coverage statistics.
│   │
│   ├── requirements.txt
│   │   Python dependencies required by the backend.
│   │
│   └── venv39
│       Python virtual environment.
│
├── frontend
│   │
│   ├── package.json
│   │
│   └── src
│       │
│       ├── main.jsx
│       │   Entry point of the React application.
│       │
│       ├── App.jsx
│       │   Main application layout.
│       │
│       ├── Home.jsx
│       │   Home page where users upload Python files.
│       │
│       ├── Login.jsx
│       │   Authentication page.
│       │
│       ├── components
│       │   │
│       │   ├── Sidebar.jsx
│       │   │   Navigation panel.
│       │   │
│       │   └── sidebar.css
│       │       Styling for sidebar.
│       │
│       ├── style.css
│       ├── home.css
│       └── Login.css
│
├── README.md
└── LICENSE
```

---

# Installation

Clone the repository.

```
git clone https://github.com/yourusername/pydoc-generator.git
```

Navigate to the project directory.

```
cd Pydoc_generator
```

---

# Backend Setup

Navigate to the backend directory.

```
cd backend
```

Create a Python virtual environment.

```
python -m venv venv39
```

Activate the environment.

Windows

```
venv39\Scripts\activate
```

Linux / macOS

```
source venv39/bin/activate
```

Install dependencies.

```
pip install -r requirements.txt
```

Start the backend server.

```
python app.py
```

Backend will run on:

```
http://localhost:5000
```

---

# Frontend Setup

Navigate to the frontend directory.

```
cd ../frontend
```

Install dependencies.

```
npm install
```

Run the React development server.

```
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

# Usage

1. Open the frontend application in your browser.
2. Upload one or more Python files.
3. The backend analyzes the files and extracts nodes.
4. AI models generate docstrings automatically.
5. Existing docstrings are validated.
6. Coverage statistics are displayed using charts.
7. Download the updated Python files containing generated docstrings.

---

# Application Workflow

1. User uploads a Python file.
2. The backend receives the file through the `/upload` endpoint.
3. The AST parser analyzes the code.
4. Node extraction identifies classes, functions, and methods.
5. The generator produces docstrings.
6. The validator checks compliance with PEP257.
7. Coverage analysis calculates documentation statistics.
8. Results are returned to the frontend.

---

# Backend Architecture

The backend is responsible for:

* File management
* Python code analysis
* Node extraction
* Docstring generation
* Validation
* Coverage calculation

Each module performs a specific task and communicates internally to process the code.

---

# Frontend Architecture

The frontend is built using **React** and follows a component-based architecture.

Main UI components include:

Sidebar – navigation panel.

FileUpload – allows users to upload Python files.

NodeList – displays extracted nodes.

CodeDisplay – shows original and generated code.

CoverageBar – displays documentation coverage.

ValidationMessage – shows validation warnings.

---

# File Upload & Management

Files are uploaded through the frontend interface.

The backend handles uploads securely using:

`werkzeug.utils.secure_filename`

Uploaded files are temporarily stored for analysis and removed after processing.

---

# Python Code Parsing

The backend uses Python's **AST (Abstract Syntax Tree)** module.

AST allows the program to analyze Python code structure without executing the code.

This ensures safe and reliable analysis.

---

# Node Extraction

The parser extracts:

Modules
Classes
Functions
Methods
Decorators
Parameters
Return values
Existing docstrings

The extracted information is converted into structured JSON data.

---

# Docstring Generation

Docstrings are generated based on:

Function name
Parameter list
Return values
Code structure
Naming conventions

The generator uses AI models to create meaningful documentation.

---

# AI Model Integration

Primary Model

Google Generative AI

Fallback Model

GLM-4.7-Cerebras

If the primary model fails due to API limits or network issues, the system automatically switches to the fallback model.

---

# Template Fallback Generation

If both AI models fail, the system uses template-based generation.

Example template:

```
def add(a, b):
    """
    Add two numbers.

    Args:
        a (int): First number
        b (int): Second number

    Returns:
        int: Sum of the numbers
    """
```

This guarantees that every node receives documentation.

---

# Supported Docstring Styles

Google Style

NumPy Style

reStructuredText (reST)

If the user does not choose a style, the system defaults to **Google Style**.

---

# Validation System

Docstrings are validated using **pydocstyle** which checks compliance with **PEP257 documentation standards**.

Validation detects:

Missing docstrings
Formatting errors
Incorrect indentation
Missing summary lines

---

# Documentation Coverage

Coverage analysis calculates:

Total nodes
Documented nodes
Missing docstrings
Documentation percentage

Results are visualized using charts in the frontend.

---

# API Endpoints

Upload files

```
POST /upload
```

Retrieve uploaded files

```
GET /my_files
```

Download generated files

```
GET /download/<filename>
```

---

# Data Flow

1. Frontend uploads Python file.
2. Flask API receives request.
3. Parser analyzes the code.
4. Generator produces docstrings.
5. Validator checks documentation.
6. Coverage analyzer calculates statistics.
7. Results returned to frontend.

---

# Security Considerations

Secure filename handling.

Controlled upload directories.

AST parsing without executing Python code.

---

# Performance Considerations

Efficient AST parsing.

Optimized AI API usage.

Fallback mechanisms to prevent generation failures.

---

# Technologies Used

Backend

Python
Flask
AST module
pydocstyle

Frontend

React
JavaScript
CSS
react-chartjs-2

AI Models

Google Generative AI
GLM-4.7-Cerebras

---

# Future Improvements

VS Code extension.

Command line interface.

Repository-wide documentation scanning.

GitHub integration for automatic documentation pull requests.

Docker container deployment.

Multi-language documentation support.

---

# Contributing

Fork the repository.

Create a feature branch.

Commit your changes.

Push the branch.

Open a pull request.

---

# License

This project is licensed under the **MIT License**.

See the LICENSE file for details.
