import React, { useState } from "react";
import "./ManageActivities.css";

export default function ManageActivities({ onBack }) {

    const [search, setSearch] = useState("");

    const [activities, setActivities] = useState([

        {
            id: 1,
            name: "Mini Quiz",
            enabled: true,
            updated: "27 Jun 2026 06:00 PM"
        },

        {
            id: 2,
            name: "Story + Question",
            enabled: true,
            updated: "26 Jun 2026 04:15 PM"
        },

        {
            id: 3,
            name: "Logic Puzzle",
            enabled: false,
            updated: "25 Jun 2026 08:30 AM"
        },

        {
            id: 4,
            name: "Word Scramble",
            enabled: true,
            updated: "24 Jun 2026 11:00 AM"
        }

    ]);

    const toggleStatus = (id) => {

        setActivities(

            activities.map((activity) =>

                activity.id === id
                    ? {
                        ...activity,
                        enabled: !activity.enabled,
                        updated: new Date().toLocaleString()
                    }
                    : activity

            )

        );

    };

    const filteredActivities = activities.filter((activity) =>
        activity.name.toLowerCase().includes(search.toLowerCase())
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

                            <td>

                                {activity.id}

                            </td>

                            <td>

                                {activity.name}

                            </td>

                            <td>

                                <input

                                    type="checkbox"

                                    checked={activity.enabled}

                                    onChange={() =>
                                        toggleStatus(activity.id)
                                    }

                                />

                            </td>

                            <td>

                                {activity.updated}

                            </td>

                            <td>

                                <button className="edit-btn">

                                    Edit

                                </button>

                                <button className="delete-btn">

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