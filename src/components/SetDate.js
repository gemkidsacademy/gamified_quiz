// src/components/SetDate.js
import React, { useState, useEffect } from "react";

export default function SetDate() {
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            // no body needed
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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      setError("Please select a date first");
      return;
    }

    setError("");
    // You can handle additional logic on submit if needed
    console.log("Selected date submitted:", selectedDate);
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
        {loading ? "Loading..." : "Submit"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {selectedDate && (
        <p style={{ marginTop: "10px" }}>
          Selected date: <strong>{selectedDate}</strong>
        </p>
      )}
    </div>
  );
}
