import { useState } from "react";
import { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,
} from "chart.js";
import "./style.css";
import {  useEffect } from "react";
import Sidebar from "./components/Sidebar";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function App() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [generatedFile, setGeneratedFile] = useState("");

  const [nodes, setNodes] = useState([]); 
  const [tree, setTree] = useState([]);   

  const [expandedClasses, setExpandedClasses] = useState({});
  const [style, setStyle] = useState("google");
  const [original, setOriginal] = useState("");
  const [updated, setUpdated] = useState("");
  const [currcoverage, setcurrCoverage] = useState(null);
  const [updatedcoverage, setupdatedCoverage] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [barData, setBarData] = useState(null);
  const [upbarData, upsetBarData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [moduleExpanded, setModuleExpanded] = useState(true);
  const currentUser = localStorage.getItem("username");
  const [userFiles, setUserFiles] = useState({ uploaded: [], generated: [] });
const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
const [pastedCode, setPastedCode] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [editedCode, setEditedCode] = useState("");
const analyzeRef = useRef(null);
const generateRef = useRef(null);
const coverageRef = useRef(null);
const updatedCoverageRef = useRef(null);
const validationRef = useRef(null);

const scrollToSection = (ref) => {
  if (ref.current) {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
   
  useEffect(() => {
    if (!currentUser) return;

    fetch(`http://localhost:5000/user_files/${currentUser}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched user files:", data);
        setUserFiles(data);
      })
      .catch((err) => console.error("Error fetching user files:", err));
  }, [currentUser]);



const moduleName = "Whole Module";

//   const uploadFile = async () => {
//     const formData = new FormData();
//     formData.append("file", file);

// const username = localStorage.getItem("username");
// const res = await fetch(`http://localhost:5000/upload?username=${username}`, {
//   method: "POST",
//   body: formData,
// });


//     const data = await res.json();
    
//     setFilename(data.filename);
//     const resFiles = await fetch(`http://localhost:5000/user_files/${username}`);
// const fileData = await resFiles.json();
// setUserFiles(fileData);

//     setNodes([]);
//     setTree([]);
//     setExpandedClasses({});
//     setcurrCoverage(null);
//     setupdatedCoverage(null);
//     setBarData(null);
//     upsetBarData(null);
//     setModuleExpanded(false);

//   };

const uploadFile = async () => {
  const username = localStorage.getItem("username");

  // 🔹 Case 1: Normal file upload
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost:5000/upload?username=${username}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setFilename(data.filename);
  }

  // 🔹 Case 2: Pasted code upload
  else if (pastedCode.trim()) {
    const res = await fetch("http://localhost:5000/paste_code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: pastedCode,
        username: username,
      }),
    });

    const data = await res.json();
    setFilename(data.filename);
  }

  // Refresh user files
  const resFiles = await fetch(
    `http://localhost:5000/user_files/${username}`
  );
  const fileData = await resFiles.json();
  setUserFiles(fileData);

  // Reset UI states
  setNodes([]);
  setTree([]);
  setExpandedClasses({});
  setcurrCoverage(null);
  setupdatedCoverage(null);
  setBarData(null);
  upsetBarData(null);
  setModuleExpanded(false);
};

  

  const analyzeCode = async () => {
  const res = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({filename})
  });

  const data = await res.json();

  setNodes(data.nodes);
  setTree(data.tree);
  setcurrCoverage(data.coverage);

  const labels = data.nodes.map((n) =>
    n.type === "module" ? "Whole Module" : n.name
  );

  const percentages = data.nodes.map((n) => n.coverage ?? 0);

  setBarData({
    labels,
datasets: [
  {
    label: "Docstring Coverage %",
    data: percentages,
    backgroundColor: "rgba(0, 198, 255, 0.8)",  
    borderColor: "rgba(0, 198, 255, 1)",
    borderWidth: 2,
    borderRadius: 10,
    hoverBackgroundColor: "rgba(255, 215, 0, 0.9)",
  },
],

  });
};



const upanalyzeCode = async () => {
  const res = await fetch("http://localhost:5000/upanalyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
   body: JSON.stringify({filename:generatedFile })
  });

  const data = await res.json();

    setNodes(data.nodes);
  setTree(data.tree);
  setupdatedCoverage(data.coverage);

  const labels = data.nodes.map((n) =>
    n.type === "module" ? "Whole Module" : n.name
  );

  const percentages = data.nodes.map((n) => n.coverage ?? 0);

  upsetBarData({
    labels,
datasets: [
  {
    label: "Docstring Coverage %",
    data: percentages,
    backgroundColor: "rgba(0, 198, 255, 0.8)",   // cyan-blue glow
    borderColor: "rgba(0, 198, 255, 1)",
    borderWidth: 2,
    borderRadius: 10,
    hoverBackgroundColor: "rgba(255, 215, 0, 0.9)", // golden hover
  },
],

  });
};


  


  const classes = tree.filter(
    (n) => n.type === "class" && n.parent === null
  );

  const standaloneFunctions = tree.filter(
    (n) => n.type === "function" && n.parent === null
  );

  const getMethods = (className) =>
    tree.filter((n) => n.parent === className);

  const toggleClass = (name) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  const toggleModule = () => {
  setModuleExpanded((prev) => !prev);
};



 // ---------------- Generate ----------------
const generateDocstrings = async () => {
  const res = await fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      filename, 
      style, 
      username: localStorage.getItem("username")  // ✅ send username
    }),
  });

  const data = await res.json();
  setOriginal(data.original);
  setUpdated(data.updated);
  setEditedCode(data.updated);   // 🔥 important
  setIsEditing(false);           // reset editing
  setGeneratedFile(data.generatedFile);
  await fetch("http://localhost:5000/save_project", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: localStorage.getItem("username"),
    filename: data.generatedFile,
    original: data.original,
    updated: data.updated,
    tree: data.tree,
    nodes: data.nodes,
    coverage: data.coverage,
    style,
  }),
});
  setValidationResult(null);
};



const validateDocstrings = async () => {

  // 🔥 STEP 1: Save latest edited version FIRST
  const saveRes = await fetch("http://localhost:5000/save_edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: generatedFile,
      content: updated,
    }),
  });

  const saveData = await saveRes.json();

  if (!saveData.success) {
    alert("Error saving file before validation");
    return;
  }

  // 🔥 STEP 2: THEN validate
  const res = await fetch("http://localhost:5000/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: generatedFile,
      type: "generated",
    }),
  });

  const data = await res.json();
  setValidationResult(data);
};

 
  const handleCopy = () => {
    navigator.clipboard.writeText(updated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

const downloadFile = (filename) => {
  const url = `http://localhost:5000/download/${filename}`;
  window.open(url, "_blank");
};

 
  const goHome = () => {
    window.location.href = "/home"; 
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); 
    window.location.href = "/"; 
  };

const saveEditedCode = async () => {
  const res = await fetch("http://localhost:5000/save_edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: generatedFile,
      content: updated,
    }),
  });

  const data = await res.json();

  if (data.success) {
    alert("File updated successfully!");
  } else {
    alert("Error saving file");
  }
};

const pasteCodeToFile = async () => {
  if (!pastedCode.trim()) {
    alert("Paste some Python code first!");
    return;
  }

  const res = await fetch("http://localhost:5000/paste_code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: pastedCode,
      username: localStorage.getItem("username"),
    }),
  });

  const data = await res.json();

  if (data.filename) {
    setFilename(data.filename);
    alert("File created successfully!");
  } else {
    alert("Error creating file");
  }
};




  return (

    
    <>


            <nav className="navbar">
           <div className="logo">PyDoc Generator</div>
              
              <div className="one">
<button onClick={goHome}> Home</button>
<button onClick={uploadFile} disabled={!file && !pastedCode.trim()}> Upload</button>
                <button
  onClick={async () => {
    await analyzeCode();
    setTimeout(() => scrollToSection(analyzeRef), 200);
  }}
  disabled={!filename}
>
  Analyze
</button>
<button
  onClick={async () => {
    await generateDocstrings();
    setTimeout(() => scrollToSection(generateRef), 200);
  }}
  disabled={!nodes.length}
>
  Generate Docstrings
</button>
<button
  onClick={async () => {
    await upanalyzeCode();
    setTimeout(() => scrollToSection(updatedCoverageRef), 200);
  }}
  disabled={!generatedFile}
>
  Updated Coverage
</button>
<button
  onClick={async () => {
    await validateDocstrings();
    setTimeout(() => scrollToSection(validationRef), 200);
  }}
  disabled={!updatedcoverage}
>
  Validate (PEP 257)
</button>
 <button onClick={() => setIsSidebarOpen(true)}>View Files</button>
          <button onClick={() => downloadFile(generatedFile)} disabled={!generatedFile}>
  Download File
</button>

          </div>
              <button  className="logout-btn" onClick={handleLogout} style={{ marginLeft: "10px" }}>
       Logout
    </button>
            </nav>
      
            <div className="container" style={{ padding: 20, paddingBottom: 80 }}>
              <div className="card">
                <h3>Select Python File</h3>
<div
  className="upload-area"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".py")) {
      setFile(droppedFile);
    } else {
      alert("Please upload a Python (.py) file");
    }
  }}
  onClick={() => document.getElementById("fileInput").click()}
>
  {file ? (
    <p>📄 {file.name}</p>
  ) : (
    <p>Drag & Drop Python file here or Click to Upload</p>
  )}

  <input
    id="fileInput"
    type="file"
    accept=".py"
    style={{ display: "none" }}
    onChange={(e) => setFile(e.target.files[0])}
  />
</div>
                <div className="card">
  <h3>Or Paste Python Code</h3>

  <textarea
    value={pastedCode}
    onChange={(e) => setPastedCode(e.target.value)}
    placeholder="Paste your Python code here..."
    className="editable-code"
    style={{ height: "200px" }}
  />
</div>
        <div className="onepart">
          <h3>Docstring Style</h3>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="google">Google</option>
            <option value="numpy">NumPy</option>
            <option value="rest">reST</option>
          </select>
        


          {/* <button onClick={() => downloadFile(generatedFile)} disabled={!generatedFile}> DownloadFile </button> */}
      
    
        </div>

              </div>
             <Sidebar 
  isOpen={isSidebarOpen} 
  onClose={() => setIsSidebarOpen(false)} 
  currentUser={currentUser} 
 onSelectFile={async (file) => {
  const username = localStorage.getItem("username");

  const res = await fetch(
    `http://localhost:5000/load_file_content/${username}/${file}`
  );

  const data = await res.json();

  setOriginal(data.original);
  setUpdated(data.updated);
  setEditedCode(data.updated);
  setGeneratedFile(file);
  setIsEditing(false);
}}
/>

             
              {tree.length > 0 && (
              <div ref={analyzeRef}>
 <div className="node-group card" >
  <div className="tree-node module" onClick={toggleModule}>
    <span className="icon">{moduleExpanded ? "" : ""}</span>
    <span className="node-title">{moduleName}</span>
  </div>

  {moduleExpanded && (
    <div className="tree-children">

      {/* CLASSES */}
      {classes.map((cls) => (
        <div key={cls.id} className="node-group">
          <div
            className="tree-node class"
            onClick={() => toggleClass(cls.id)}
          >
            <span className="icon">
              {expandedClasses[cls.id] ? "" : ""}
            </span>
            <span className="node-title">class {cls.name}</span>
          </div>

          {expandedClasses[cls.id] && (
            <ul className="method-list">
              {getMethods(cls.id).length > 0 ? (
                getMethods(cls.id).map((fn) => (
                  <li key={fn.id} className="method-item">
                    <span className="icon">🔹</span>
                    {fn.name}
                  </li>
                ))
              ) : (
                <li className="muted">No methods</li>
              )}
            </ul>
          
          )}
        </div>
        
      ))}

      {/* STANDALONE FUNCTIONS */}
      {standaloneFunctions.length > 0 && (
        <div className="node-group">
          <div className="tree-node function">
            <span className="icon"></span>
            <span className="node-title">Standalone Functions</span>
          </div>

          <ul className="method-list">
            {standaloneFunctions.map((fn) => (
              <li key={fn.id} className="method-item">
                <span className="icon">🔸</span>
                {fn.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )}
</div>
</div>
)}


     
                       {barData && (
                <div className="card" ref={coverageRef}>
        
          <h3>Docstring Coverage for module,classes and functions</h3>
                          {currcoverage !== null && (
                  <div className="coverage">Overall Coverage: {currcoverage}%</div>
                )}
            
          <div className="chart-container">

            
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
                title: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: {
                    display: true,
                    text: "Coverage %",
                  },
                },
              },
            }}
          />
        </div>

        </div>
      )}

              
  

        {/* Options */}



        {/* Code Blocks */}
        {original && (
          <div className="code-container" ref={generateRef}>
            <div className="card code-card">
              <h3>Original Code</h3>
              <pre>{original}</pre>
            </div>

<div className="card code-card">
  <div className="card-header">
    <h3>Documented Code</h3>

    {!isEditing ? (
      <button
        className="edit-btn"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
    ) : (
      <button
        className="save-btn"
        onClick={async () => {
          const res = await fetch("http://localhost:5000/save_edit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: generatedFile,
              content: editedCode,
            }),
          });

          const data = await res.json();

          if (data.success) {
            setUpdated(editedCode);
            setIsEditing(false);
          } else {
            alert("Error saving file");
          }
        }}
      >
        Save
      </button>
    )}

    <div className="copy-wrapper" onClick={handleCopy}>
      📋
      <span className="copy-tooltip">
        {copied ? "Copied!" : "Copy"}
      </span>
    </div>
  </div>

  {!isEditing ? (
    <pre>{updated}</pre>
  ) : (
    <textarea
      value={editedCode}
      onChange={(e) => setEditedCode(e.target.value)}
      className="editable-code"
    />
  )}
</div>
            </div>
        )}
      {upbarData && (
                <div className="card" ref={updatedCoverageRef}>
        
          <h3>Updated Docstring Coverage for module,classes and functions</h3>
                          {updatedcoverage !== null && (
                  <div className="coverage">Overall Coverage: {updatedcoverage}%</div>
                )}
          <div className="chart-container">
          <Bar
            data={upbarData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
                title: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: {
                    display: true,
                    text: "Coverage %",
                  },
                },
              },
            }}
          />
          
        </div>
        </div>
      )}
     
 {validationResult && (
  <div ref={validationRef}
    className={`validation ${
      validationResult.passed ? "passed" : "failed"
    }`}
  >
    <h3>
      {validationResult.passed
        ? "HURRAH! ALL THE DOCSTRINGS HAVE PASSED PEP257(PYDOCSTYLE VALIDATION)"
        : "OOPS! THERE ARE SOME MINOR ERRORS ACCORDING TO PEP257(PYDOCSTYLE VALIDATION)"}
    </h3>

    {validationResult.message && (
      <p>{validationResult.message}</p>
    )}

    {!validationResult.passed &&
      validationResult.errors.length > 0 && (
        <ul>
          {validationResult.errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
  </div>
)}
   

      </div>
    </>
  );
}

export default App;
