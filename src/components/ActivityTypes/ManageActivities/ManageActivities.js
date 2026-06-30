import React, { useState, useEffect } from "react";
import "./ManageActivities.css";

export default function ManageActivities({
    loggedInUser,
    onBack,
    onEdit,
}) {

    const server = process.env.REACT_APP_API_BASE;

    const [search, setSearch] = useState("");

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {

        try {

            const res = await fetch(
                `${server}/activity-types/list`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        center_code: loggedInUser.center_code,
                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {

                setActivities(data.activities);

            } else {

                alert(data.detail);

            }

        } catch (err) {

            console.error(err);

            alert("Unable to connect to the server.");

        }

    };

    const toggleStatus = async (activity) => {

        try {

            const res = await fetch(
                `${server}/activity-types/${activity.id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        is_enabled: !activity.is_enabled,
                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {

                loadActivities();

            } else {

                alert(data.detail);

            }

        } catch (err) {

            console.error(err);

            alert("Unable to connect to the server.");

        }

    };

    const deleteActivity = async (id) => {

        if (!window.confirm("Delete this activity?")) {
            return;
        }

        try {

            const res = await fetch(
                `${server}/activity-types/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (res.ok) {

                alert(data.message);

                loadActivities();

            } else {

                alert(data.detail);

            }

        } catch (err) {

            console.error(err);

            alert("Unable to connect to the server.");

        }

    };

    const filteredActivities = activities.filter((activity) =>
        activity.activity_name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <div className="manage-activities">

            <h2>Manage Activity Types</h2>

            <p className="description">
                View, search, enable, disable, edit and delete activity
                types available for Gamified Quiz generation.
            </p>

            <div className="toolbar">

                <input
                    type="text"
                    placeholder="Search Activity..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    className="back-btn"
                    onClick={onBack}
                >
                    ← Back
                </button>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Activity Type</th>

                        <th>Available</th>

                        <th>Last Updated</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredActivities.map((activity) => (

                        <tr key={activity.id}>

                            <td>{activity.id}</td>

                            <td>{activity.activity_name}</td>

                            <td>

                                {activity.is_enabled ? (

                                    <span className="status-enabled">

                                        Enabled

                                    </span>

                                ) : (

                                    <span className="status-disabled">

                                        Disabled

                                    </span>

                                )}

                            </td>

                            <td>{activity.updated_at}</td>

                            <td>

                                <button
                                    className="edit-btn"
                                    onClick={() => onEdit(activity)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        deleteActivity(activity.id)
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            <div className="assumption-box">

                <h3>
                    Implementation Assumption (Please Confirm)
                </h3>

                <ul>

                    <li>
                        Toggling the checkbox immediately enables or
                        disables the activity for future quiz generation.
                    </li>

                    <li>
                        Only enabled activities participate in
                        random activity selection.
                    </li>

                    <li>
                        The Last Updated column reflects the latest
                        modification made to the activity.
                    </li>

                    <li>
                        Editing changes only the activity name,
                        while deleting permanently removes it.
                    </li>

                </ul>

            </div>

        </div>

    );

}