  import React, { useState } from "react";
  import "./AcademicTerm.css";

  export default function AcademicTerm({ loggedInUser })  {
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
          alert("Academic term saved successfully.");

          console.log(data);

          // Clear the form
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