import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard({ student }) {
  const [activeTab, setActiveTab] = useState("attempt");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/ChatBot", { state: { student } });
  };

  useEffect(() => {
    if (activeTab === "leaderboard") {
      // Fetch leaderboard only when the tab is active
      fetchLeaderboard();
    }
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://web-production-481a5.up.railway.app/quiz-results?class_name=${encodeURIComponent(
          student.class_name
        )}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.status}`);
      }
      const data = await response.json();
      // Sort by total_score descending
      const sortedData = data.sort((a, b) => b.total_score - a.total_score);
      setLeaderboard(sortedData);
    } catch (err) {
      console.error(err);
      setError("Unable to load leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {student.name}!</h2>

      {/* Tabs */}
      <div className="tab-nav">
        <div
          className={`tab-item ${activeTab === "attempt" ? "active" : ""}`}
          onClick={() => setActiveTab("attempt")}
        >
          Attempt Quiz
        </div>
        <div
          className={`tab-item ${activeTab === "leaderboard" ? "active" : ""}`}
          onClick={() => setActiveTab("leaderboard")}
        >
          View Leaderboard
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "attempt" && (
          <div className="tab-panel">
            <h3>Ready to attempt your weekly quiz?</h3>
            <p>Click below to start the quiz.</p>
            <button className="dashboard-button" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="tab-panel">
            <h3>Leaderboard</h3>
            {loading && <p>Loading leaderboard...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && leaderboard.length === 0 && (
              <p>No results available yet.</p>
            )}
            {!loading && !error && leaderboard.length > 0 && (
              <ul>
                {leaderboard.map((entry, index) => (
                  <li key={entry.student_id}>
                    {index + 1}. {entry.student_name || "Student"} -{" "}
                    {entry.total_score} points
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
