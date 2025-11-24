// src/components/SetDate.js
import React, { useState, useEffect } from "react";

export default function SetDate() {
  // Original date picker state
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New term interface state
  const [termYear, setTermYear] = useState("");
  const [termStartDate, setTermStartDate] = useState("");
  const [termEndDate, setTermEndDate] = useState("");
  const [termLoading, setTermLoading] = useState(false);
  const [termError, setTermError] = useState("");

  useEffect(() => {
    // Fetch term start date on component mount
    const fetchTermStartDate = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://web-production-481a5.up.railway.app/retrieve-term-start-date",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`Backend returned status ${response.status}`);
        }

        const data = await response.json();
        if (data.date) {
          setSelectedDate(data.date);
        } else {
          setError("Date not returned from backend");
        }
      } catch (err) {
        console.error("Error fetching term start date:", err);
        setError("Failed to retrieve term start date. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTermStartDate();
  }, []);

  // Original handlers
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      setError("Please select a date first");
      return;
    }

    setError("");
    console.log("Selected date submitted:", selectedDate);
  };

  // New term handlers
  const handleTermSubmit = async () => {
    if (!termYear || !termStartDate || !termEndDate) {
      setTermError("Please fill in all fields for the term");
      return;
    }

    setTermError("");
    setTermLoading(true);

    try {
      const response = await fetch(
        "https://web-production-481a5.up.railway.app/set-term-data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: termYear,
            termStartDate,
            termEndDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      console.log("Term data submitted:", { termYear, termStartDate, termEndDate });
      alert("Term data updated successfully!");
    } catch (err) {
      console.error("Error submitting term data:", err);
      setTermError("Failed to submit term data. Please try again.");
    } finally {
      setTermLoading(false);
    }
  };

  return (
    <div className="set-date-container">
      {/* Original date picker */}
      <h3>Set Date</h3>
      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="date-picker">Select Term Start Date: </label>
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <button onClick={handleSubmit} disabled={loading || !selectedDate}>
        {loading ? "Loading..." : "Submit"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <hr style={{ margin: "20px 0" }} />

      {/* New term interface */}
      <h3>Set Term Details</h3>

      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="term-year">Year: </label>
        <input
          type="number"
          id="term-year"
          value={termYear}
          onChange={(e) => setTermYear(e.target.value)}
          placeholder="e.g., 2025"
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="term-start">Term Start Date: </label>
        <input
          type="date"
          id="term-start"
          value={termStartDate}
          onChange={(e) => setTermStartDate(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="term-end">Term End Date: </label>
        <input
          type="date"
          id="term-end"
          value={termEndDate}
          onChange={(e) => setTermEndDate(e.target.value)}
        />
      </div>

      <button onClick={handleTermSubmit} disabled={termLoading}>
        {termLoading ? "Saving..." : "Submit Term"}
      </button>

      {termError && <p style={{ color: "red", marginTop: "10px" }}>{termError}</p>}
    </div>
  );
}
