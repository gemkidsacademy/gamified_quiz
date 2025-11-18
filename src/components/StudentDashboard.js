import React, { useState } from "react";

function StudentDashboard({ student }) {
  const [activeTab, setActiveTab] = useState("attempt"); // default tab

  return (
    <div style={styles.container}>
      <h2 style={styles.welcome}>
        Welcome, {student.name}!
      </h2>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "attempt" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("attempt")}
        >
          Attempt Quiz
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "leaderboard" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("leaderboard")}
        >
          View Leaderboard
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === "attempt" && (
          <div>
            <h3>Ready to attempt your weekly quiz?</h3>
            <p>Click below to start the quiz.</p>
            <button style={styles.startButton}>Start Quiz</button>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div>
            <h3>Leaderboard</h3>
            <p>Check how you rank among your classmates!</p>
            {/* You can replace this with dynamic leaderboard data */}
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

// --- Simple Styles ---
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  welcome: {
    textAlign: "center",
    marginBottom: "20px",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  tabButton: {
    padding: "10px 20px",
    margin: "0 5px",
    border: "1px solid #007bff",
    borderRadius: "4px",
    background: "#fff",
    cursor: "pointer",
  },
  activeTab: {
    background: "#007bff",
    color: "#fff",
  },
  tabContent: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  startButton: {
    padding: "10px 20px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default StudentDashboard;
