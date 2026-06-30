import React, { useState } from "react";
import "./UploadTopics.css";

export default function UploadTopics({
    loggedInUser,
    onBack,
}) {

    const server = process.env.REACT_APP_API_BASE;

    const [file, setFile] = useState(null);

    const handleUpload = async () => {

        if (!file) {

            alert("Please select a CSV file.");

            return;

        }

        try {

            const formData = new FormData();

            formData.append(
                "center_code",
                loggedInUser.center_code
            );

            formData.append(
                "file",
                file
            );

            const res = await fetch(
                `${server}/session-topics/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (res.ok) {

                alert(data.message);

                setFile(null);

            } else {

                alert(data.detail);

            }

        } catch (err) {

            console.error(err);

            alert("Unable to upload CSV.");

        }

    };

    return (

        <div className="upload-topics">

            <h2>Upload Session Topics</h2>

            <p className="description">

                Upload the completed CSV after filling
                the <strong>Topic</strong> column.

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