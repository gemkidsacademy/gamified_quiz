import React, { useEffect, useState } from "react";
import "./Leaderboard.css";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function Leaderboard({ loggedInUser }) {

    const [terms, setTerms] = useState([]);

    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("");

    

    const [sessions, setSessions] = useState([]);

    const [selectedTerm, setSelectedTerm] = useState("");

    const [selectedSession, setSelectedSession] = useState("");

    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {

        loadTerms();

        loadCategories();

    }, []);
    const loadCategories = async () => {

    try {

        const response = await fetch(

            `${API_BASE}/leaderboard/categories`,

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

        console.log("Categories:", data);

        setCategories(data);

    }

    catch (err) {

        console.log(err);

    }

};

    const loadTerms = async () => {

    try {

        const response = await fetch(

            `${API_BASE}/academic-terms/list`,

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({

                    center_code:
                        loggedInUser.center_code,

                }),

            }

        );

        const data = await response.json();

        setTerms(data);

    }

    catch (err) {

        console.log(err);

    }

};
  const handleTermChange = (e) => {

    const termId = Number(e.target.value);

    setSelectedTerm(termId);

    const selected = terms.find(
        term => term.id === termId
    );

    if (!selected) {

        setSessions([]);

        return;

    }

    const list = [];

    for (let i = 1; i <= selected.number_of_weeks; i++) {
        list.push(i);
    }

    setSessions(list);

};

    

    const loadLeaderboard = async () => {

        if (!selectedTerm || !selectedSession) {

            alert("Select term and session.");

            return;

        }

        try {

            const res = await fetch(
                `${API_BASE}/leaderboard`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({

                        center_code:
                            loggedInUser.center_code,

                        term_id:
                            selectedTerm,

                        session:
                            selectedSession,

                        category:
                            selectedCategory,

                    }),

                }
            );

            const data = await res.json();

            console.log("Status:", res.status);

            console.log("Response:", data);

            setLeaderboard(data);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="leaderboard">

            <h2>

                Weekly Leaderboard

            </h2>

            <div className="filters">

                <div>

                    <label>

                        Academic Term

                    </label>

                    <select
                        value={selectedTerm}
                        onChange={handleTermChange}
                    >

                        <option value="">
                            Select
                        </option>

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

                    <label>

                        Session

                    </label>

                    <select
                        value={selectedSession}
                        onChange={(e) =>
                            setSelectedSession(Number(e.target.value))
                        }
                    >

                        <option value="">

                            Select

                        </option>

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

                    <label>

                        Category

                    </label>

                    <select
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(
                                e.target.value
                            )
                        }
                    >

                        <option value="">

                            Select

                        </option>

                        {categories.map(category => (

                            <option
                                key={category}
                                value={category}
                            >

                                {category}

                            </option>

                        ))}

                    </select>

                </div>
                <button
                    onClick={loadLeaderboard}
                >

                    Load Leaderboard

                </button>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>

                            Rank

                        </th>

                        <th>

                            Student

                        </th>

                        <th>

                            Category

                        </th>

                        <th>

                            Year

                        </th>

                        <th>

                            Day

                        </th>

                        <th>

                            Score

                        </th>

                        <th>

                            Completed

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {leaderboard.map(

                        (
                            row,
                            index
                        ) => (

                            <tr
                                key={row.id}
                            >

                                <td>

                                    {index + 1}

                                </td>

                                <td>

                                    {row.student_id}

                                </td>

                                <td>

                                    {row.category}

                                </td>

                                <td>

                                    {row.class_year}

                                </td>

                                <td>

                                    {row.class_day}

                                </td>

                                <td>

                                    {row.current_score}
                                    /
                                    {
                                        row.total_questions
                                    }

                                </td>

                                <td>

                                    {row.is_completed
                                        ? "Completed"
                                        : "In Progress"}

                                </td>

                            </tr>

                        )

                    )}

                </tbody>

            </table>

        </div>

    );

}