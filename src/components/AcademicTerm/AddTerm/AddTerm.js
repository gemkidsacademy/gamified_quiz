import React, { useState } from "react";
import "./AddTerm.css";

export default function AddTerm({ loggedInUser, onBack }) {
  const server = process.env.REACT_APP_API_BASE;

  const [termName, setTermName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
        alert(data.message || "Academic term saved successfully.");

        setTermName("");
        setStartDate("");
        setEndDate("");
      } else {
        alert(data.detail || "Failed to save academic term.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="add-term">
      <h2>Add Academic Term</h2>

      <p className="description">
        Create a new academic term for this centre. The system will automatically
        calculate the number of weeks between the start and end dates.
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

        <div className="button-row">
          <button type="submit" className="save-btn">
            Save Academic Term
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={onBack}
          >
            Back
          </button>
        </div>
      </form>

      <div className="assumption-box">
        <h3>Implementation Assumption (Please Confirm)</h3>
        <ul>
          <li>
            A new academic term can be added at any time.
          </li>
          <li>
            Saving a term does not necessarily make it the current active term.
          </li>
          <li>
            The current active term is managed from the Manage Terms screen.
          </li>
        </ul>
      </div>
    </div>
  );
}