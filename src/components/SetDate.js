// src/components/SetTerm.js
import React, { useState, useEffect } from "react";

export default function SetTerm() {
  const [year, setYear] = useState("");
  const [termStartDate, setTermStartDate] = useState("");
  const [termEndDate, setTermEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch current term data on mount
    const fetchTermData = async () => {
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
        if (data.year) setYear(data.year);
        if (data.termStartDate) setTermStartDate(data.termStartDate);
        if (data.termEndDate) setTermEndDate(data.termEndDate);
      } catch (err) {
        console.error("Error fetching term data:", err);
        setError("Failed to retrieve term data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTermData();
  }, []);

  const handleSubmit = async () => {
    if (!year || !termStartDate || !termEndDate) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://web-production-481a5.up.railway.app/set-term-data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year,
            termStartDate,
            termEndDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      console.log("Term data submitted:", { year, termStartDate, termEndDate });
      alert("Term data updated successfully!");
    } catch (err) {
      console.error("Error submitting term data:", err);
      setError("Failed to submit term data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="set-term-container">
      <h3>Set Term Details</h3>

      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="year">Year: </label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
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

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Submit"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}
