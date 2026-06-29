import React, { useState } from "react";
import "./AcademicTerm.css";

export default function AcademicTerm() {
  const [termName, setTermName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    // TODO:
    // POST to backend
    console.log({
      termName,
      startDate,
      endDate,
    });
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

        <button type="submit" className="save-btn">
          Save Academic Term
        </button>

      </form>

      <div className="assumption-box">

        <h3>Implementation Assumption (Please Confirm)</h3>

        <ul>
          <li>
            The administrator defines the academic term once by specifying the
            start and end dates.
          </li>

          <li>
            The system automatically calculates the number of weeks in the term.
          </li>

          <li>
            Each week represents one learning session that will later be used
            by the scheduler.
          </li>

        </ul>

      </div>

    </div>
  );
}