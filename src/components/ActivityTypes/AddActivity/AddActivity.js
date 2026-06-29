import React, { useState } from "react";
import "./AddActivity.css";

export default function AddActivity({ onBack }) {

    const [activityName, setActivityName] = useState("");

    const [isEnabled, setIsEnabled] = useState(true);

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log({
            activityName,
            isEnabled
        });

        // TODO:
        // POST to backend

        alert("Activity created successfully.");

        setActivityName("");
        setIsEnabled(true);

    };

    return (

        <div className="add-activity">

            <h2>Add Activity Type</h2>

            <p className="description">
                Create a new activity type that can be randomly selected
                by the scheduler when generating gamified quizzes.
            </p>

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label>Activity Name</label>

                    <input
                        type="text"
                        placeholder="Enter activity type"
                        value={activityName}
                        onChange={(e) =>
                            setActivityName(e.target.value)
                        }
                    />

                </div>

                <div className="form-group">

                    <label>Scheduler Status</label>

                    <label className="checkbox-label">

                        <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={(e) =>
                                setIsEnabled(e.target.checked)
                            }
                        />

                        Enable this activity for quiz generation

                    </label>

                </div>

                <div className="button-row">

                    <button
                        type="submit"
                        className="save-btn"
                    >
                        Save Activity
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onBack}
                    >
                        Back
                    </button>

                </div>

            </form>

            <div className="assumption-box">

                <h3>Implementation Assumption (Please Confirm)</h3>

                <ul>

                    <li>
                        Only <strong>enabled</strong> activity types are eligible
                        for random selection by the scheduler.
                    </li>

                    <li>
                        Disabled activity types remain in the system but
                        will never be selected until they are enabled again.
                    </li>

                    <li>
                        The scheduler randomly selects one enabled activity
                        type whenever it generates a gamified quiz.
                    </li>

                </ul>

            </div>

        </div>

    );

}