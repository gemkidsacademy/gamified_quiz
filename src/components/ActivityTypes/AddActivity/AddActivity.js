import React, { useState } from "react";
import "./AddActivity.css";

export default function AddActivity({
    loggedInUser,
    editingActivity,
    onBack,
}) {

    const server = process.env.REACT_APP_API_BASE;

    const [activityName, setActivityName] = useState(
        editingActivity?.activity_name || ""
    );

    const [isEnabled, setIsEnabled] = useState(
        editingActivity?.is_enabled ?? true
    );

    const handleSubmit = async (e) => {

    e.preventDefault();

    if (!activityName.trim()) {

        alert("Please enter an activity name.");

        return;

    }

    try {

        const url = editingActivity
            ? `${server}/activity-types/${editingActivity.id}`
            : `${server}/activity-types`;

        const method = editingActivity
            ? "PUT"
            : "POST";

        const res = await fetch(
            url,
            {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    center_code: loggedInUser.center_code,
                    activity_name: activityName.trim(),
                    is_enabled: isEnabled,
                }),
            }
        );

        const data = await res.json();

        if (res.ok) {

            alert(data.message);

            setActivityName("");
            setIsEnabled(true);

            onBack();

        } else {

            alert(data.detail);

        }

    } catch (err) {

        console.error(err);

        alert("Unable to connect to the server.");

    }

};
    return (

        <div className="add-activity">

            <h2>
                {editingActivity
                    ? "Edit Activity Type"
                    : "Add Activity Type"}
            </h2>

            <p className="description">

                {editingActivity
                    ? "Modify the activity type and its scheduler status."
                    : "Create a new activity type that can be randomly selected by the scheduler when generating gamified quizzes."}

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
                        {editingActivity
                            ? "Update Activity"
                            : "Save Activity"}
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