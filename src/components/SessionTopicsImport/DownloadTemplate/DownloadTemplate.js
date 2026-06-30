import React from "react";
import "./DownloadTemplate.css";

export default function DownloadTemplate({
    loggedInUser,
    onBack,
}) {

    const server = process.env.REACT_APP_API_BASE;

    const handleDownload = async () => {

        try {

            const response = await fetch(
                `${server}/session-topics/download-template`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        center_code: loggedInUser.center_code,
                    }),
                }
            );

            if (!response.ok) {

                const err = await response.json();

                alert(err.detail);

                return;

            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = "SessionTopicsTemplate.csv";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(err);

            alert("Unable to download template.");

        }

    };

    return (

        <div className="download-template">

            <h2>Download Session Topics Template</h2>

            <p className="description">

                Download a CSV template containing every configured
                class together with every automatically generated
                session. The administrator only needs to complete
                the <strong> Topic </strong> column.

            </p>

            <div className="preview-box">

                <h3>CSV Template Columns</h3>

                <ul>

                    <li>Category</li>

                    <li>Class Year</li>

                    <li>Class Day</li>

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