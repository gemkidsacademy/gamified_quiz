// src/components/AdminDashboard.js
import React, { useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="tab-nav">
        <div
          className={`tab-item ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </div>
        <div
          className={`tab-item ${activeTab === "addActivity" ? "active" : ""}`}
          onClick={() => setActiveTab("addActivity")}
        >
          Add Activity
        </div>
        <div
          className={`tab-item ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="tab-panel">
            <h3>Overview</h3>
            <p>Summary of all activities, users, and metrics.</p>
          </div>
        )}

        {activeTab === "addActivity" && (
          <div className="tab-panel">
            <h3>Add New Activity</h3>
            <form className="activity-form">
              <label>
                Activity Name:
                <input type="text" placeholder="Enter activity name" />
              </label>
              <label>
                Description:
                <textarea placeholder="Enter activity description" />
              </label>
              <label>
                Date:
                <input type="date" />
              </label>
              <button type="submit">Add Activity</button>
            </form>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="tab-panel">
            <h3>Reports</h3>
            <p>View detailed activity reports and analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
