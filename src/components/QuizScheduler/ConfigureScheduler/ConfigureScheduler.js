import React, { useState, useEffect } from "react";
import "./ConfigureScheduler.css";

export default function ConfigureScheduler({
    loggedInUser,
    onBack,
}) {

    const server = process.env.REACT_APP_API_BASE;

    const [enabled, setEnabled] = useState(true);

    const [runTime, setRunTime] = useState("18:00");

    const [days, setDays] = useState({
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    });

    useEffect(() => {

        if (loggedInUser) {
            loadConfiguration();
        }

    }, [loggedInUser]);

    const loadConfiguration = async () => {

        try {

            const res = await fetch(
                `${server}/scheduler/configuration/load`,
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

            if (res.ok && data.configuration) {

                setEnabled(data.configuration.scheduler_enabled);

                setRunTime(data.configuration.run_time);

                setDays({

                    monday: data.configuration.monday,

                    tuesday: data.configuration.tuesday,

                    wednesday: data.configuration.wednesday,

                    thursday: data.configuration.thursday,

                    friday: data.configuration.friday,

                    saturday: data.configuration.saturday,

                    sunday: data.configuration.sunday,

                });

            }

        } catch (err) {

            console.error(err);

        }

    };

    const handleRunNow = async () => {

        try {

            const res = await fetch(
                `${server}/scheduler/run`,
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

                alert(data.message);

            } else {

                alert(data.detail);

            }

        } catch (err) {

            console.error(err);

            alert("Unable to connect to the server.");

        }

    };

    const toggleDay = (day) => {

        setDays({

            ...days,

            [day]: !days[day],

        });

    };

    const handleSave = async () => {

        try {

            const res = await fetch(
                `${server}/scheduler/configuration`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({

                        center_code: loggedInUser.center_code,

                        scheduler_enabled: enabled,

                        run_time: runTime,

                        timezone: "Australia/Sydney",

                        monday: days.monday,

                        tuesday: days.tuesday,

                        wednesday: days.wednesday,

                        thursday: days.thursday,

                        friday: days.friday,

                        saturday: days.saturday,

                        sunday: days.sunday,

                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {

                alert(data.message);

            } else {

                alert(data.detail);

            }

        } catch (err) {

            console.error(err);

            alert("Unable to connect to the server.");

        }

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

                    <li>The scheduler runs only when it is enabled.</li>

                    <li>
                        It executes at the configured time using the
                        academy's local time zone.
                    </li>

                    <li>
                        It only runs on the selected days.
                    </li>

                    <li>
                        During execution, it determines the current
                        academic session from the configured term.
                    </li>

                    <li>
                        It retrieves the corresponding session topic,
                        randomly selects one enabled activity type,
                        and generates a gamified quiz.
                    </li>

                    <li>
                        Generated quizzes become available to students
                        belonging to the matching Category →
                        Class Year → Class Day.
                    </li>

                </ul>

            </div>

        </div>

    );

}