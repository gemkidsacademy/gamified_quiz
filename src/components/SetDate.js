// src/components/SetDate.js
import React, { useState } from "react";

export default function SetDate() {
  const [selectedDate, setSelectedDate] = useState("");
  const [weekNumber, setWeekNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      setError("Please select a date first");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://web-production-481a5.up.railway.app/retrieve-week-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.week_number !== undefined) {
        setWeekNumber(data.week_number);
      } else {
        setError("Week number not returned from backend");
      }
    } catch (err) {
      console.error("Error fetching week number:", err);
      setError("Failed to retrieve week number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="set-date-container">
      <h3>Set Date</h3>
      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="date-picker">Select a date: </label>
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <button onClick={handleSubmit} disabled={loading || !selectedDate}>
        {loading ? "Processing..." : "Submit"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {weekNumber !== null && (
        <p style={{ marginTop: "10px" }}>
          Week number for {selectedDate}: <strong>{weekNumber}</strong>
        </p>
      )}
    </div>
  );
}
