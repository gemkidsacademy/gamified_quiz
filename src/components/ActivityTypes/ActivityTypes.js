import React, { useState } from "react";
import "./ActivityTypes.css";

import AddActivity from "./AddActivity/AddActivity";
import ManageActivities from "./ManageActivities/ManageActivities";

export default function ActivityTypes() {

    const [view, setView] = useState("home");

    if (view === "add") {

        return (

            <AddActivity
                onBack={() => setView("home")}
            />

        );

    }

    if (view === "manage") {

        return (

            <ManageActivities
                onBack={() => setView("home")}
            />

        );

    }

    return (

        <div className="activity-types">

            <h2>Activity Types</h2>

            <p className="page-description">

                Configure the activity types that can be used
                by the AI when generating gamified quizzes.

            </p>

            <div className="card-grid">

                <div
                    className="action-card"
                    onClick={() => setView("add")}
                >

                    <div className="card-icon">

                        ➕

                    </div>

                    <h3>

                        Add Activity

                    </h3>

                    <p>

                        Create a new activity type that
                        may later be selected by the scheduler.

                    </p>

                    <button className="card-btn">

                        Add Activity

                    </button>

                </div>

                <div
                    className="action-card"
                    onClick={() => setView("manage")}
                >

                    <div className="card-icon">

                        🎮

                    </div>

                    <h3>

                        Manage Activities

                    </h3>

                    <p>

                        View, edit, delete and enable or
                        disable activity types.

                    </p>

                    <button className="card-btn">

                        Manage Activities

                    </button>

                </div>

            </div>

            <div className="assumption-box">

                <h3>

                    Implementation Assumption (Please Confirm)

                </h3>

                <ul>

                    <li>

                        Activity types define the format of
                        the gamified quiz.

                    </li>

                    <li>

                        Only enabled activity types participate
                        in random selection.

                    </li>

                    <li>

                        When the scheduler runs, one enabled
                        activity type is selected at random.

                    </li>

                </ul>

            </div>

        </div>

    );

}