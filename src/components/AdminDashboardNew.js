// src/components/AdminDashboard.js

import React, { useState } from "react";
import "./AdminDashboard.css";

import AcademicTerm from "./AcademicTerm/AcademicTerm";
import Dashboard from "./Dashboard/Dashboard";
import ClassConfiguration from "./ClassConfiguration/ClassConfiguration";
import SessionTopicsImport from "./SessionTopicsImport/SessionTopicsImport";
import Leaderboard from "./Leaderboard/Leaderboard";
import ActivityTypes from "./ActivityTypes/ActivityTypes";
import QuizScheduler from "./QuizScheduler/QuizScheduler";
export default function AdminDashboardNew({ loggedInUser })  {
  
    // Dashboard is now the default tab
  const [activeTab, setActiveTab] = useState("dashboard");
  

  return (
    <div className="admin-dashboard">

      <h2 className="dashboard-title">
        Gamified Quiz Administration
      </h2>

      {/* Navigation */}

      <div className="tab-nav">
        <div
          className={`tab-item ${
            activeTab === "dashboard" ? "active" : ""
          }`}
          onClick={() => setActiveTab("dashboard")}
          >
          Dashboard
          </div>

        <div
          className={`tab-item ${
            activeTab === "academic-term" ? "active" : ""
          }`}
          onClick={() => setActiveTab("academic-term")}
        >
          Academic Term
        </div>

        <div
          className={`tab-item ${
            activeTab === "class-configuration" ? "active" : ""
          }`}
          onClick={() => setActiveTab("class-configuration")}
        >
          Class Configuration
        </div>

        <div
          className={`tab-item ${
            activeTab === "session-topics" ? "active" : ""
          }`}
          onClick={() => setActiveTab("session-topics")}
        >
          Session Topics
        </div>

        <div
          className={`tab-item ${
            activeTab === "activity-types" ? "active" : ""
          }`}
          onClick={() => setActiveTab("activity-types")}
        >
          Activity Types
        </div>

        <div
          className={`tab-item ${
            activeTab === "scheduler" ? "active" : ""
          }`}
          onClick={() => setActiveTab("scheduler")}
        >
          Scheduler
        </div>
        <div
            className={`tab-item ${
                activeTab === "leaderboard" ? "active" : ""
            }`}
            onClick={() => setActiveTab("leaderboard")}
        >
            Leaderboard
        </div>

      </div>

      {/* Content */}

      <div className="tab-content">
        {activeTab === "dashboard" && (
          <div className="tab-panel">
            <Dashboard />
          </div>
        )}

        {activeTab === "academic-term" && (
          <div className="tab-panel">
            <AcademicTerm loggedInUser={loggedInUser} />
          </div>
        )}

        {activeTab === "class-configuration" && (
          <div className="tab-panel">
            <ClassConfiguration loggedInUser={loggedInUser}/>
          </div>
        )}

        {activeTab === "session-topics" && (
          <div className="tab-panel">
            <SessionTopicsImport loggedInUser={loggedInUser}/>
                      </div>
        )}

        {activeTab === "activity-types" && (
          <div className="tab-panel">
            <ActivityTypes loggedInUser={loggedInUser}/>
            
          </div>
        )}

        {activeTab === "scheduler" && (
          <div className="tab-panel">
            <QuizScheduler loggedInUser={loggedInUser}/>
            
          </div>
        )}
        {activeTab === "leaderboard" && (
            <div className="tab-panel">
                <Leaderboard
                    loggedInUser={loggedInUser}
                />
            </div>
        )}

      </div>

    </div>
  );
}