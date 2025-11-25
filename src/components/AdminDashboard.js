// src/components/AdminDashboard.js
import React, { useState } from "react";
import "./AdminDashboard.css";
import AddActivity from "./AddActivity";
import SetDate from "./SetDate"; // <-- your new component
import TermDatesTable from "./TermDatesTable";
import AddBulkActivity from "./AddBulkActivity";// <-- your new component


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("setDate");

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="tab-nav">
        <div
          className={`tab-item ${activeTab === "setDate" ? "active" : ""}`}
          onClick={() => setActiveTab("setDate")}
        >
          Set Date
        </div>
        <div
          className={`tab-item ${activeTab === "addActivity" ? "active" : ""}`}
          onClick={() => setActiveTab("addActivity")}
        >
          Add Activity
        </div>
        <div
          className={`tab-item ${activeTab === "addbulkactivity" ? "active" : ""}`}
          onClick={() => setActiveTab("addbulkactivity")}
        >
          Add Bulk Activity
        </div>
        <div
          className={`tab-item ${activeTab === "term-dates" ? "active" : ""}`}
          onClick={() => setActiveTab("term-dates")}
        >
          View Term Dates
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "setDate" && (
          <div className="tab-panel">
            <SetDate />
          </div>
        )}

        {activeTab === "addbulkactivity" && (
          <div className="tab-panel">
            <AddBulkActivity />
          </div>
        )}
        {activeTab === "addActivity" && (
          <div className="tab-panel">
            <AddActivity />
          </div>
        )}

        {activeTab === "term-dates" && (
          <div className="tab-panel">
            <h3>Term Dates</h3>
            <TermDatesTable />
          </div>
        )}
      </div>
    </div>
  );
}
