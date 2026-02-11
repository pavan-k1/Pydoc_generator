import React, { useEffect, useState } from "react";
import "./sidebar.css"; // custom styles

const Sidebar = ({ isOpen, onClose }) => {
  const [userFiles, setUserFiles] = useState({ uploaded: [], generated: [] });
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username || !isOpen) return;

    fetch(`http://localhost:5000/user_files/${username}`)
      .then((res) => res.json())
      .then((data) => setUserFiles(data))
      .catch((err) => console.error(err));
  }, [username, isOpen]);

  const handleFileClick = (fileType, filename) => {
    // Open file in a new tab
    const url = `http://localhost:5000/download/${filename}`;
    window.open(url, "_blank");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h3>My Files</h3>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
      </div>

      <div className="sidebar-content">
        <h4>Uploaded Files</h4>
        {userFiles.uploaded.length > 0 ? (
          <ul>
            {userFiles.uploaded.map((f, idx) => (
              <li key={idx} onClick={() => handleFileClick("uploaded", f)}>
                {f}
              </li>
            ))}
          </ul>
        ) : (
          <p>No uploaded files</p>
        )}

        <h4>Generated Files</h4>
        {userFiles.generated.length > 0 ? (
          <ul>
            {userFiles.generated.map((f, idx) => (
              <li key={idx} onClick={() => handleFileClick("generated", f)}>
                {f}
              </li>
            ))}
          </ul>
        ) : (
          <p>No generated files</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
