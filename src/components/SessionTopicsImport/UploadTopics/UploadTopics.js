import React, { useState } from "react";
import "./UploadTopics.css";

export default function UploadTopics({ onBack }) {

    const [file, setFile] = useState(null);

    const handleUpload = () => {

        if (!file) {

            alert("Please select a CSV file.");

            return;

        }

        // TODO
        // POST CSV to backend

        alert("CSV Uploaded");

    };

    return (

        <div className="upload-topics">

            <h2>Upload Session Topics</h2>

            <p className="description">

                Upload the completed CSV after filling
                the Topic column.

            </p>

            <div className="upload-box">

                <input

                    type="file"

                    accept=".csv"

                    onChange={(e) =>
                        setFile(e.target.files[0])
                    }

                />

                {file && (

                    <p>

                        Selected File:
                        <strong> {file.name}</strong>

                    </p>

                )}

            </div>

            <div className="button-row">

                <button
                    className="upload-btn"
                    onClick={handleUpload}
                >
                    Upload CSV
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