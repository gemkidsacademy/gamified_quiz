import React, { useEffect, useState } from "react";
import "./SchedulerRuns.css";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function SchedulerRuns({ loggedInUser }) {
    const [runs, setRuns] = useState([]);
    const [loadingRuns, setLoadingRuns] = useState(false);

    const [selectedRunId, setSelectedRunId] = useState(null);
    const [selectedRun, setSelectedRun] = useState(null);

    const [details, setDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        if (loggedInUser?.center_code) {
            loadSchedulerRuns();
        }
    }, [loggedInUser]);

    const loadSchedulerRuns = async () => {
        try {
            setLoadingRuns(true);

            const response = await fetch(`${API_BASE}/scheduler/runs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    center_code: loggedInUser.center_code,
                }),
            });

            const data = await response.json();

            console.log("Scheduler runs response:", data);

            if (!response.ok) {
                console.log("Failed to load scheduler runs:", data);
                setRuns([]);
                return;
            }

            setRuns(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log("Error loading scheduler runs:", error);
            setRuns([]);
        } finally {
            setLoadingRuns(false);
        }
    };

    const loadSchedulerRunDetails = async (run) => {
        try {
            setSelectedRunId(run.id);
            setSelectedRun(run);
            setLoadingDetails(true);
            setDetails([]);

            const response = await fetch(`${API_BASE}/scheduler/run-details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scheduler_run_id: run.id,
                }),
            });

            const data = await response.json();

            console.log("Scheduler run details response:", data);

            if (!response.ok) {
                console.log("Failed to load scheduler run details:", data);
                setDetails([]);
                return;
            }

            setDetails(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log("Error loading scheduler run details:", error);
            setDetails([]);
        } finally {
            setLoadingDetails(false);
        }
    };

    return (
        <div className="scheduler-runs">
            <h2>Scheduler Activity</h2>

            <div className="scheduler-runs-actions">
                <button onClick={loadSchedulerRuns}>
                    Refresh Runs
                </button>
            </div>

            <div className="scheduler-runs-section">
                <h3>Scheduler Runs</h3>

                {loadingRuns ? (
                    <p>Loading scheduler runs...</p>
                ) : (
                    <table className="scheduler-runs-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Term</th>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Session</th>
                                <th>Total Classes</th>
                                <th>Generated</th>
                                <th>Missing Topic</th>
                                <th>Existing Quiz</th>
                                <th>Failed</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {runs.length === 0 ? (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center" }}>
                                        No scheduler runs found.
                                    </td>
                                </tr>
                            ) : (
                                runs.map((run) => (
                                    <tr key={run.id}>
                                        <td>{run.id}</td>
                                        <td>{run.term_name}</td>
                                        <td>{run.run_date}</td>
                                        <td>{run.weekday}</td>
                                        <td>{run.current_session}</td>
                                        <td>{run.total_classes}</td>
                                        <td>{run.generated_quizzes}</td>
                                        <td>{run.skipped_missing_topic}</td>
                                        <td>{run.skipped_existing_quiz}</td>
                                        <td>{run.failed_generations}</td>
                                        <td>{run.status}</td>
                                        <td>
                                            <button
                                                onClick={() => loadSchedulerRunDetails(run)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedRun && (
                <div className="scheduler-details-section">
                    <h3>
                        Run Details — Run #{selectedRun.id} ({selectedRun.run_date})
                    </h3>

                    <div className="scheduler-run-summary">
                        <p><strong>Center:</strong> {selectedRun.center_code}</p>
                        <p><strong>Term:</strong> {selectedRun.term_name}</p>
                        <p><strong>Trigger:</strong> {selectedRun.scheduler_trigger}</p>
                        <p><strong>Weekday:</strong> {selectedRun.weekday}</p>
                        <p><strong>Session:</strong> {selectedRun.current_session}</p>
                        <p><strong>Status:</strong> {selectedRun.status}</p>
                        <p><strong>Message:</strong> {selectedRun.message}</p>
                    </div>

                    {loadingDetails ? (
                        <p>Loading run details...</p>
                    ) : (
                        <table className="scheduler-details-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Category</th>
                                    <th>Year</th>
                                    <th>Day</th>
                                    <th>Session</th>
                                    <th>Topic</th>
                                    <th>Selected Activity</th>
                                    <th>Generated Quiz ID</th>
                                    <th>Status</th>
                                    <th>Message</th>
                                </tr>
                            </thead>

                            <tbody>
                                {details.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" style={{ textAlign: "center" }}>
                                            No detail rows found for this run.
                                        </td>
                                    </tr>
                                ) : (
                                    details.map((row) => (
                                        <tr key={row.id}>
                                            <td>{row.id}</td>
                                            <td>{row.category}</td>
                                            <td>{row.class_year}</td>
                                            <td>{row.class_day}</td>
                                            <td>{row.session}</td>
                                            <td>{row.topic}</td>
                                            <td>{row.selected_activity_type}</td>
                                            <td>{row.generated_quiz_id || "-"}</td>
                                            <td>{row.status}</td>
                                            <td>{row.message}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}