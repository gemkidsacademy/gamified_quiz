import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import "./StudentDashboard.css";

function StudentDashboard({ student }) {
  const [activeTab, setActiveTab] = useState("attempt");
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleStartQuiz = () => {
    // Navigate to ChatBot page and pass student data
    navigate("/ChatBot", { state: { student } });
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
            <p>Check how you rank among your classmates!</p>
            <ul>
              <li>Student A - 10 points</li>
              <li>Student B - 8 points</li>
              <li>{student.name} - 7 points</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
