import React from "react";
import "./DownloadTemplate.css";

export default function DownloadTemplate({ onBack }) {

    const handleDownload = () => {

        // TODO
        // Call backend endpoint
        // GET /api/session-topics/download-template

        alert("Download CSV");

    };

    return (

        <div className="download-template">

            <h2>Download Session Topics Template</h2>

            <p className="description">

                Download a CSV template containing every configured
                class together with every automatically generated
                session. The administrator only needs to complete
                the <strong>Topic</strong> column.

            </p>

            <div className="preview-box">

                <h3>CSV Template Columns</h3>

                <ul>

                    <li>Category</li>

                    <li>Class Year</li>

                    <li>Class Day</li>

                    <li>Week</li>

                    <li>Session</li>

                    <li>Topic</li>

                </ul>

            </div>

            <div className="button-row">

                <button
                    className="download-btn"
                    onClick={handleDownload}
                >
                    Download CSV
                </button>

                <button
                    className="back-btn"
                    onClick={onBack}
                >
                    Back
                </button>

            </div>

        </div>

    );

}