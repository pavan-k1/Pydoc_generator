import { useState } from "react";
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

  const [nodes, setNodes] = useState([]); // flat list (charts)
  const [tree, setTree] = useState([]);   // ✅ hierarchy list

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
const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ← toggle state
 const [pastedCode, setPastedCode] = useState(""); // NEW: pasted code


   // 🧩 Fetch user files whenever the user logs in or changes
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

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

const username = localStorage.getItem("username");
const res = await fetch(`http://localhost:5000/upload?username=${username}`, {
  method: "POST",
  body: formData,
});


    const data = await res.json();
    
    setFilename(data.filename);
    const resFiles = await fetch(`http://localhost:5000/user_files/${username}`);
const fileData = await resFiles.json();
setUserFiles(fileData);

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
        backgroundColor: "rgba(33, 74, 187, 0.6)",
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
        backgroundColor: "rgba(33, 74, 187, 0.6)",
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
  setGeneratedFile(data.generatedFile);
  setValidationResult(null);
};


  // ---------------- Validate ----------------
  const validateDocstrings = async () => {
    const res = await fetch("http://localhost:5000/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: generatedFile, type: "generated" }),
    });
    const data = await res.json();
    setValidationResult(data);
  };

  // ---------------- Copy ----------------
  const handleCopy = () => {
    navigator.clipboard.writeText(updated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

const downloadFile = (filename) => {
  const url = `http://localhost:5000/download/${filename}`;
  window.open(url, "_blank");
};

  // 🧭 Navigation
  const goHome = () => {
    window.location.href = "/home"; // go back to Home
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // clear login info
    window.location.href = "/"; // go to Login
  };






  return (

    
    <>


            <nav className="navbar">
             Pydoc Generator
              
              <div className="one">
<button onClick={goHome}> Home</button>
                              <button onClick={uploadFile} disabled={!file}>Upload</button>
                <button onClick={() => {analyzeCode()}} disabled={!filename}>Analyze</button>
                          <button onClick={generateDocstrings} disabled={!nodes.length}>
            Generate Docstrings
          </button>
          <button onClick={upanalyzeCode} disabled={!generatedFile}>
            Updated Coverage
          </button>
           <button onClick={validateDocstrings} disabled={!updatedcoverage}>
            Validate (PEP 257)
          </button>
 <button onClick={() => setIsSidebarOpen(true)}>View Files</button>
          <button onClick={() => downloadFile(generatedFile)} disabled={!generatedFile}>
  Download File
</button>

          </div>
              <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
       Logout
    </button>
            </nav>
      
            <div className="container" style={{ padding: 20, paddingBottom: 80 }}>
              <div className="card">
                <h3>Select Python File</h3>
                <input
                  type="file"
                  accept=".py"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                
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
  onSelectFile={(file) => setFilename(file)} 
/>

             
              {tree.length > 0 && (
              
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

)}


     
                       {barData && (
                <div className="card">
        
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
          <div className="code-container">
            <div className="card code-card">
              <h3>Original Code</h3>
              <pre>{original}</pre>
            </div>

            <div className="card code-card">
              <div className="card-header">
                <h3>Code with Docstrings</h3>
                <div className="copy-wrapper" onClick={handleCopy}>
                  📋
                  <span className="copy-tooltip">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </div>
              </div>
              <pre>{updated}</pre>
            </div>
          </div>
        )}
      {upbarData && (
                <div className="card">
        
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
  <div
    className={`validation ${
      validationResult.passed ? "passed" : "failed"
    }`}
  >
    <h3>
      {validationResult.passed
        ? "✅ PEP 257 Validation Passed"
        : "❌ PEP 257 Validation Failed"}
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
