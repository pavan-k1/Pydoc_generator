# Pydoc Generator

Pydoc Generator is an advanced Python documentation generator designed to automate the creation of docstrings for Python code. It helps developers maintain high-quality, standardized documentation effortlessly by analyzing source code, extracting functions, classes, and methods, and generating detailed docstrings automatically.

This project combines **Python backend analysis** with a **React-based frontend** to create a seamless user experience for developers and teams.

---

## Table of Contents

* [Features](#features)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Usage](#usage)
* [How It Works](#how-it-works)
* [Frontend Details](#frontend-details)
* [Backend Details](#backend-details)
* [File Upload & Management](#file-upload--management)
* [Node Extraction](#node-extraction)
* [Docstring Generation](#docstring-generation)
* [Validation & Coverage](#validation--coverage)
* [Screenshots](#screenshots)
* [Future Enhancements](#future-enhancements)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* Automatic docstring generation for Python scripts
* Support for functions, classes, and methods
* Docstring coverage visualization with charts
* Validation of existing docstrings
* User-friendly React frontend with modern UI

---

## Project Structure

```
Pydoc_generator/
│
├── backend/
│   ├── app.py                  # Main Flask app
│   ├── inserter.py             # Docstring insertion logic into the code
│   ├── parsor.py               # Python AST-based node extraction
|   ├── validator.py            #validating pep257 using pydocstyle
|   ├── generator.py            #complete docstring generation logic
│   ├── doc_report.py           # Docstring coverage analysis
│   ├── venv39/                 # Python virtual environment
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main React app
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── sidebar.css
│   │   ├── main.jsx             # Main React app
│   │   ├── Home.jsx             # Main React app
│   │   ├── home.css             # Main React app
│   │   ├── Login.jsx             # Main React app
│   │   ├── Login.css             # Main React app
│   │   │── style.css  
│   │    
│   │     
│   │     
│   │      
│   │   
│   └── package.json
│
├── README.md
└── LICENCE
```

---

## Installation

### Backend (Python)

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pydoc-generator.git
cd Pydoc_generator/backend
```

2. Create and activate the virtual environment:

```bash
python -m venv venv39
# Windows
venv39\Scripts\activate
# Mac/Linux
source venv39/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the Flask server:

```bash
python app.py
```

---

### Frontend (React)

1. Navigate to frontend folder:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

Your app will be accessible at `http://localhost:3000`.

---

## Usage

1. Open the frontend app in the browser.
2. Upload one or more Python files using the **File Upload** component.
3. The backend analyzes the code, extracting nodes (functions, classes, methods).
4. Generated docstrings appear alongside the original code.
5. Check **Docstring Coverage** using interactive charts.
6. Download the updated files with fully generated docstrings.

---

## How It Works

The Pydoc Generator works in **three main steps**:

1. **Node Extraction:**
   Using Python’s `ast` module, the code is parsed to extract all nodes like classes, functions, and methods.

2. **Docstring Generation:**
   Each node is analyzed, and meaningful docstrings are generated automatically. It uses:

   * Function/method name
   * Parameters and types
   * Return type
   * Optional summary or detailed description

3. **Coverage & Validation:**
   Existing docstrings are validated. Coverage statistics are calculated and displayed in a bar chart, highlighting missing or incomplete documentation.

---

## Frontend Details

* Built using **React**

* Components:

  * **Navbar & Footer:** For navigation and branding
  * **FileUpload:** Drag-and-drop file upload functionality
  * **NodeList:** Lists all detected code nodes
  * **CodeDisplay:** Side-by-side original code and generated docstrings
  * **CoverageBar:** Displays docstring coverage per file
  * **ValidationMessage:** Shows warnings or errors for docstrings

* Styling:

  * Uses `style.css` with a responsive, mobile-friendly design
  * Charts rendered with `react-chartjs-2`

---

## Backend Details

* Built using **Flask**

* Handles:

  * File uploads and secure storage
  * Python code analysis
  * Docstring generation
  * Returning results as JSON to frontend

* Key Modules:

  * `parsor.py`: Extracts Python AST nodes
  * `main.py`: Generates docstrings for extracted nodes
  * `doc_report.py`: Calculates docstring coverage

---

## File Upload & Management

* Files are uploaded via the frontend and stored in a temporary folder.
* Secure filenames are ensured using `werkzeug.utils.secure_filename`.
* Backend endpoints:

  * `/upload` – Upload files
  * `/my_files` – Fetch list of uploaded files
  * `/download/:filename` – Download generated files

---

## Node Extraction

* Utilizes Python **AST module**:

  * Detects classes, functions, methods
  * Extracts function parameters, return types, and decorators
  * Generates a structured JSON for frontend consumption

---

## Validation & Coverage

* **Coverage analysis** identifies:

  * Functions or methods without docstrings
  * Classes without docstrings
* Coverage is visualized using **bar charts** (react-chartjs-2)
* Validation messages highlight missing or incomplete docstrings

---

## License

This project is licensed under the MIT License.
See [LICENSE](LICENSE) for details.

---

## Acknowledgements

* Inspired by Python's `pydoc` module
* ReactJS & Flask communities
* Chart.js for visualization
* Open-source contributions for AST parsing and code analysis
