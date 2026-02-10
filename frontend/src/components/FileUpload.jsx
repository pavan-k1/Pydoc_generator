import React from 'react'
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./FileUpload.css";

const FileUpload =async () => {

        const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    setFilename(data.filename);
    setNodes([]);
    setTree([]);
    setExpandedClasses({});
    setCoverage(null);
    setBarData(null);







  return (
           <div className="card">
          <h3>Upload Python File</h3>
          <input
            type="file"
            accept=".py"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <br />
          <button onClick={uploadFile} disabled={!file}>Upload</button>
          <button onClick={analyzeCode} disabled={!filename}>Analyze</button>
          {coverage !== null && (
            <div className="coverage">Coverage: {coverage.toFixed(2)}%</div>
          )}
        </div>
  )
}

export default FileUpload
