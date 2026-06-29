import React from "react";
import "./Dashboard.css";

export default function Dashboard() {

    // Temporary data.
    // These values will come from the backend later.

    const dashboard = {

        activeTerm: "Term 3 2026",

        configuredClasses: 24,

        enabledActivities: 18,

        importedTopics: 240,

        schedulerEnabled: true,

        nextRun: "Monday 6:00 PM",

        lastRun: "27 Jun 2026 6:00 PM",

        lastRunStatus: "Success"

    };

    return (

        <div className="dashboard">

            <h2>

                Gamified Quiz Dashboard

            </h2>

            <p className="dashboard-description">

                This dashboard provides a quick overview of the current
                Gamified Quiz configuration and scheduler status.

            </p>

            <div className="dashboard-grid">

                <div className="dashboard-card">

                    <h4>Academic Term</h4>

                    <span>{dashboard.activeTerm}</span>

                </div>

                <div className="dashboard-card">

                    <h4>Configured Classes</h4>

                    <span>{dashboard.configuredClasses}</span>

                </div>

                <div className="dashboard-card">

                    <h4>Enabled Activity Types</h4>

                    <span>{dashboard.enabledActivities}</span>

                </div>

                <div className="dashboard-card">

                    <h4>Topics Imported</h4>

                    <span>{dashboard.importedTopics}</span>

                </div>

                <div className="dashboard-card">

                    <h4>Scheduler</h4>

                    <span className="green">

                        {dashboard.schedulerEnabled
                            ? "Enabled"
                            : "Disabled"}

                    </span>

                </div>

                <div className="dashboard-card">

                    <h4>Next Scheduled Run</h4>

                    <span>{dashboard.nextRun}</span>

                </div>

                <div className="dashboard-card">

                    <h4>Last Scheduler Run</h4>

                    <span>{dashboard.lastRun}</span>

                </div>

                <div className="dashboard-card">

                    <h4>Last Run Result</h4>

                    <span className="green">

                        {dashboard.lastRunStatus}

                    </span>

                </div>

            </div>

            <div className="summary-box">

                <h3>

                    System Summary

                </h3>

                <ul>

                    <li>

                        One active academic term is configured.

                    </li>

                    <li>

                        Classes have been configured and linked
                        to chatbot student batches.

                    </li>

                    <li>

                        Session topics have been imported successfully.

                    </li>

                    <li>

                        Enabled activity types are available
                        for random selection.

                    </li>

                    <li>

                        The scheduler is configured and ready
                        to generate quizzes.

                    </li>

                </ul>

            </div>

        </div>

    );

}