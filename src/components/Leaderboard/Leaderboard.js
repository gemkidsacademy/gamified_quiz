import React, { useEffect, useState } from "react";
import "./Leaderboard.css";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function Leaderboard({ loggedInUser }) {
    const [terms, setTerms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [classYears, setClassYears] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [selectedClassYear, setSelectedClassYear] = useState("");
    const [selectedTerm, setSelectedTerm] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        loadClassYears();
        loadTerms();
        loadCategories();
    }, []);

  const loadClassYears = async () => {
    try {
        const response = await fetch(
            `${API_BASE}/leaderboard/class-years`,
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

        const data = await response.json();

        console.log("Leaderboard class years:", data);

        setClassYears(
            Array.isArray(data.class_years)
                ? data.class_years
                : []
        );
    } catch (err) {
        console.log("Error loading class years:", err);
        setClassYears([]);
    }
};

    const loadTerms = async () => {
        try {
            const response = await fetch(`${API_BASE}/academic-terms/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    center_code: loggedInUser.center_code,
                }),
            });

            const data = await response.json();
            console.log("Terms:", data);
            setTerms(data);
        } catch (err) {
            console.log("Error loading terms:", err);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetch(`${API_BASE}/leaderboard/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    center_code: loggedInUser.center_code,
                }),
            });

            const data = await response.json();
            console.log("Categories:", data);
            setCategories(data);
        } catch (err) {
            console.log("Error loading categories:", err);
        }
    };

    const handleClassYearChange = (e) => {
        setSelectedClassYear(e.target.value);

        // reset downstream filters
        setSelectedTerm("");
        setSelectedSession("");
        setSelectedCategory("");
        setSessions([]);
        setLeaderboard([]);
    };

    const handleTermChange = (e) => {
        const termId = Number(e.target.value);

        setSelectedTerm(termId);
        setSelectedSession("");
        setLeaderboard([]);

        const selected = terms.find(
            (term) => Number(term.id) === termId
        );

        if (!selected) {
            setSessions([]);
            return;
        }

        const totalWeeks = Number(selected.number_of_weeks || 0);

        const list = [];
        for (let i = 1; i <= totalWeeks; i++) {
            list.push(i);
        }

        setSessions(list);
    };

    const loadLeaderboard = async () => {
        if (
            !selectedClassYear ||
            !selectedTerm ||
            !selectedSession ||
            !selectedCategory
        ) {
            alert("Select class year, term, session, and category.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/leaderboard`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    center_code: loggedInUser.center_code,
                    class_year: selectedClassYear,
                    term_id: selectedTerm,
                    session: selectedSession,
                    category: selectedCategory,
                }),
            });

            const data = await res.json();

            console.log("Leaderboard status:", res.status);
            console.log("Leaderboard response:", data);

            if (!res.ok) {
                console.log("Leaderboard load failed:", data);
                setLeaderboard([]);
                return;
            }

            setLeaderboard(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("Error loading leaderboard:", err);
        }
    };

    return (
        <div className="leaderboard">
            <h2>Weekly Leaderboard</h2>

            <div className="filters">
                <div>
                    <label>Class Year</label>
                    <select
                        value={selectedClassYear}
                        onChange={handleClassYearChange}
                    >
                        <option value="">Select</option>

                        {Array.isArray(classYears) &&
                            classYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                    </select>
                </div>

                <div>
                    <label>Academic Term</label>
                    <select
                        value={selectedTerm}
                        onChange={handleTermChange}
                        disabled={!selectedClassYear}
                    >
                        <option value="">Select</option>

                        {terms.map((term) => (
                            <option
                                key={term.id}
                                value={term.id}
                            >
                                {term.term_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Session</label>
                    <select
                        value={selectedSession}
                        onChange={(e) =>
                            setSelectedSession(Number(e.target.value))
                        }
                        disabled={!selectedTerm}
                    >
                        <option value="">Select</option>

                        {sessions.map((session) => (
                            <option
                                key={session}
                                value={session}
                            >
                                Session {session}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                        disabled={!selectedSession}
                    >
                        <option value="">Select</option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={loadLeaderboard}>
                    Load Leaderboard
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Student</th>
                        <th>Category</th>
                        <th>Year</th>
                        <th>Day</th>
                        <th>Score</th>
                        <th>Completed</th>
                    </tr>
                </thead>

                <tbody>
                    {leaderboard.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                No leaderboard data found.
                            </td>
                        </tr>
                    ) : (
                        leaderboard.map((row, index) => (
                            <tr key={row.id}>
                                <td>{index + 1}</td>
                                <td>{row.student_id}</td>
                                <td>{row.category}</td>
                                <td>{row.class_year}</td>
                                <td>{row.class_day}</td>
                                <td>
                                    {row.current_score}/{row.total_questions}
                                </td>
                                <td>
                                    {row.is_completed
                                        ? "Completed"
                                        : "In Progress"}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}