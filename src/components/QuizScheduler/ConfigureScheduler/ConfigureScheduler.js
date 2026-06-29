import React, { useState } from "react";
import "./ConfigureScheduler.css";

export default function ConfigureScheduler({ onBack }) {

    const [enabled, setEnabled] = useState(true);

    const [runTime, setRunTime] = useState("18:00");

    const [days, setDays] = useState({
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    });
    const handleRunNow = () => {

    // TODO
    // Call backend endpoint to execute scheduler immediately

    alert("Scheduler started.");

};

    const toggleDay = (day) => {

        setDays({
            ...days,
            [day]: !days[day]
        });

    };

    const handleSave = () => {

        console.log({

            enabled,

            runTime,

            schedulerTimeZone: "Australia/Sydney",

            days

        });

        // TODO
        // Save scheduler configuration

        alert("Scheduler configuration saved successfully.");

    };

    return (

        <div className="configure-scheduler">

            <h2>Configure Scheduler</h2>

            <p className="description">

                Configure when the scheduler automatically generates
                gamified quizzes for students.

            </p>

            <div className="form-group">

                <label>

                    Scheduler Status

                </label>

                <label className="checkbox-label">

                    <input

                        type="checkbox"

                        checked={enabled}

                        onChange={(e) =>
                            setEnabled(e.target.checked)
                        }

                    />

                    Enable Scheduler

                </label>

            </div>

            <div className="form-group">

                <label>

                    Run Time

                </label>

                <input

                    type="time"

                    value={runTime}

                    onChange={(e) =>
                        setRunTime(e.target.value)
                    }

                />

            </div>

            <div className="form-group">

                <label>

                    Scheduler Time Zone

                </label>

                <div className="readonly-box">

                    Australia / Sydney (AEST / AEDT)

                </div>

            </div>

            <div className="form-group days">

                <label>

                    Run On Days

                </label>

                <div className="day-list">

                    {Object.keys(days).map((day) => (

                        <label
                            key={day}
                            className="day-item"
                        >

                            <input

                                type="checkbox"

                                checked={days[day]}

                                onChange={() =>
                                    toggleDay(day)
                                }

                            />

                            {day.charAt(0).toUpperCase() +
                                day.slice(1)}

                        </label>

                    ))}

                </div>

            </div>

            <div className="button-row">

                <button
                    className="save-btn"
                    onClick={handleSave}
                >
                    Save Configuration
                </button>

                <button
                    className="run-btn"
                    onClick={handleRunNow}
                >
                    ▶ Run Scheduler Now
                </button>

                <button
                    className="back-btn"
                    onClick={onBack}
                >
                    Back
                </button>

            </div>

            <div className="assumption-box">

                <h3>

                    Implementation Assumption (Please Confirm)

                </h3>

                <ul>

                    <li>

                        The scheduler runs only when it is enabled.

                    </li>

                    <li>

                        It executes at the configured time
                        using the academy's local time zone.

                    </li>

                    <li>

                        It only runs on the selected days.

                    </li>

                    <li>

                        During execution, it determines the
                        current academic week from the
                        configured term.

                    </li>

                    <li>

                        It retrieves the corresponding session,
                        loads its assigned topic,
                        randomly selects one enabled activity
                        type and generates the gamified quiz.

                    </li>

                    <li>

                        Generated quizzes become available
                        to students belonging to the matching
                        Category → Class Year → Class Day.

                    </li>

                </ul>

            </div>

        </div>

    );

}