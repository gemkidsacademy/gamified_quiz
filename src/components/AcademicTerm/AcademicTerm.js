import React, { useEffect, useState } from "react";
import "./AcademicTerm.css";

export default function AcademicTerm({ loggedInUser }) {
  const server = process.env.REACT_APP_API_BASE;

  const [termName, setTermName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentTerm, setCurrentTerm] = useState(null);
  const [loadingTerm, setLoadingTerm] = useState(false);

  useEffect(() => {
  if (loggedInUser?.center_code) {
    handleViewCurrentTerm();
  }
}, [loggedInUser]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${server}/academic-term-gamified`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          center_code: loggedInUser.center_code,
          term_name: termName,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Academic term saved successfully.");

        setTermName("");
        setStartDate("");
        setEndDate("");

        // Optionally render saved term immediately if backend returns it
        setCurrentTerm(data);
      } else {
        alert(data.detail || "Failed to save academic term.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to connect to the server.");
    }
  };

  const handleViewCurrentTerm = async () => {
  try {
    setLoadingTerm(true);

    const res = await fetch(
      `${server}/academic-term-gamified/${loggedInUser.center_code}`
    );

    const data = await res.json();

    if (res.ok) {
      setCurrentTerm(data);

      // Populate the form with the row values
      setTermName(data.term_name || "");
      setStartDate(data.start_date || "");
      setEndDate(data.end_date || "");
    } else {
      alert(data.detail || "No academic term found.");
      setCurrentTerm(null);
    }
  } catch (err) {
    console.error(err);
    alert("Unable to fetch academic term.");
    setCurrentTerm(null);
  } finally {
    setLoadingTerm(false);
  }
};

  return (
    <div className="academic-term">
      <h2>Academic Term</h2>

      <p className="description">
        Configure the academic term. The system will automatically calculate
        the number of weeks between the start and end dates and create the
        corresponding learning sessions.
      </p>

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Term Name</label>
          <input
            type="text"
            placeholder="e.g. Term 1 2026"
            value={termName}
            onChange={(e) => setTermName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Term Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Term End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="academic-term-actions">
          <button
            type="submit"
            className="save-btn"
            disabled={!!currentTerm}
          >
            Save Academic Term
          </button>

          <button
            type="button"
            className="view-btn"
            onClick={handleViewCurrentTerm}
          >
            {loadingTerm ? "Loading..." : "View Current Term"}
          </button>
        </div>
      </form>

      {currentTerm && (
        <div className="current-term-card">
          <h3>Current Academic Term</h3>

          <div className="current-term-row">
            <span className="label">Term Name:</span>
            <span>{currentTerm.term_name}</span>
          </div>

          <div className="current-term-row">
            <span className="label">Start Date:</span>
            <span>{currentTerm.start_date}</span>
          </div>

          <div className="current-term-row">
            <span className="label">End Date:</span>
            <span>{currentTerm.end_date}</span>
          </div>

          <div className="current-term-row">
            <span className="label">Number of Weeks:</span>
            <span>{currentTerm.number_of_weeks}</span>
          </div>

          <div className="current-term-row">
            <span className="label">Is Active:</span>
            <span>{currentTerm.is_active ? "Yes" : "No"}</span>
          </div>

          
        </div>
      )}
    </div>
  );
} 