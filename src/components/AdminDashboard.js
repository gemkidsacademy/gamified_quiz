// src/components/AdminDashboard.js
import React, { useState } from "react";
import "./AdminDashboard.css";
import AddActivity from "./AddActivity";



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
            <AddActivity />
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
