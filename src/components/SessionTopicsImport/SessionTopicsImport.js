import React, { useState } from "react";
import "./SessionTopicsImport.css";

import DownloadTemplate from "./DownloadTemplate/DownloadTemplate";
import UploadTopics from "./UploadTopics/UploadTopics";

export default function SessionTopicsImport() {

    const [view, setView] = useState("home");

    // -------------------------
    // Download CSV Screen
    // -------------------------

    if (view === "download") {

        return (
            <DownloadTemplate
                onBack={() => setView("home")}
            />
        );

    }

    // -------------------------
    // Upload CSV Screen
    // -------------------------

    if (view === "upload") {

        return (
            <UploadTopics
                onBack={() => setView("home")}
            />
        );

    }

    return (

        <div className="session-topics">

            <h2>Session Topics</h2>

            <p className="page-description">

                Import session topics using a CSV file.
                Download the automatically generated template,
                populate the <strong>Topic</strong> column,
                then upload the completed CSV.

            </p>

            <div className="card-grid">

                {/* Download Template */}

                <div
                    className="action-card"
                    onClick={() => setView("download")}
                >

                    <div className="card-icon">

                        📥

                    </div>

                    <h3>

                        Download CSV

                    </h3>

                    <p>

                        Download a CSV template containing
                        all configured classes together
                        with every generated session.

                    </p>

                    <button className="card-btn">

                        Download Template

                    </button>

                </div>

                {/* Upload CSV */}

                <div
                    className="action-card"
                    onClick={() => setView("upload")}
                >

                    <div className="card-icon">

                        📤

                    </div>

                    <h3>

                        Upload CSV

                    </h3>

                    <p>

                        Upload the completed CSV after
                        filling in the Topic column.

                    </p>

                    <button className="card-btn">

                        Upload Topics

                    </button>

                </div>

            </div>

            <div className="assumption-box">

                <h3>

                    Implementation Assumption (Please Confirm)

                </h3>

                <ul>

                    <li>

                        The system generates a CSV template
                        containing every configured class and
                        every automatically generated session.

                    </li>

                    <li>

                        The administrator only completes
                        the <strong>Topic</strong> column.

                    </li>

                    <li>

                        Uploading the completed CSV stores
                        all topic mappings in the database.

                    </li>

                    <li>

                        The scheduler retrieves these topics
                        when generating gamified quizzes.

                    </li>

                </ul>

            </div>

        </div>

    );

}