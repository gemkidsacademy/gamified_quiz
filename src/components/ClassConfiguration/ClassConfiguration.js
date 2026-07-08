import React, { useEffect, useState } from "react";
import "./ClassConfiguration.css";

import AddClass from "./AddClass/AddClass";
import ManageClasses from "./ManageClass/ManageClasses";

export default function ClassConfiguration({ loggedInUser }) {
    const server = process.env.REACT_APP_API_BASE;

    const [view, setView] = useState("home");
    const [editingClass, setEditingClass] = useState(null);

    const [terms, setTerms] = useState([]);
    const [selectedTermId, setSelectedTermId] = useState("");
    const [selectedTerm, setSelectedTerm] = useState(null);

    // ---------------------------------------
    // Load academic terms for this center
    // ---------------------------------------
    const loadTerms = async () => {
        try {
            const res = await fetch(
                `${server}/academic-terms/list`,
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
                // IMPORTANT:
                // Replace this with the real response key if your API returns
                // academic_terms instead of terms.
                const termList = Array.isArray(data) ? data : [];

                setTerms(termList);

                // Do NOT auto-select active term.
                // Admin must explicitly choose the term in Class Configuration.
                setSelectedTermId("");
                setSelectedTerm(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (loggedInUser?.center_code) {
            loadTerms();
        }
    }, [loggedInUser]);

    const handleTermChange = (e) => {
        const value = e.target.value;
        setSelectedTermId(value);

        const matchedTerm = terms.find(
            (term) => String(term.id) === value
        );

        setSelectedTerm(matchedTerm || null);
    };

    const handleEdit = (item) => {
        setEditingClass(item);
        setView("add");
    };

    const handleBackToHome = () => {
        setEditingClass(null);
        setView("home");
    };

    // ---------------------------------------
    // Add Class Screen
    // ---------------------------------------
    if (view === "add") {
        return (
            <AddClass
                loggedInUser={loggedInUser}
                editingClass={editingClass}
                selectedTerm={selectedTerm}
                onBack={handleBackToHome}
            />
        );
    }

    // ---------------------------------------
    // Manage Classes Screen
    // ---------------------------------------
    if (view === "manage") {
        return (
            <ManageClasses
                loggedInUser={loggedInUser}
                selectedTerm={selectedTerm}
                onEdit={handleEdit}
                onBack={handleBackToHome}
            />
        );
    }

    // ---------------------------------------
    // Home Screen
    // ---------------------------------------
    return (
        <div className="class-configuration">
            <h2>Class Configuration</h2>

            <p className="page-description">
                Create and manage teaching classes used by the
                Gamified Quiz module. Each class is uniquely identified
                by its <strong>Category</strong>,
                <strong> Class Year</strong> and
                <strong> Class Day</strong> within a selected academic term.
            </p>

            {/* Term Selector */}
            <div className="term-selector-box">
                <label className="term-label">Academic Term</label>

                <select
                    value={selectedTermId}
                    onChange={handleTermChange}
                    className="term-select"
                >
                    <option value="">Select Academic Term</option>

                    {terms.map((term) => (
                        <option key={term.id} value={term.id}>
                            {term.term_name}
                        </option>
                    ))}
                </select>

                {!selectedTerm && (
                    <p className="term-warning">
                        Please select an academic term before adding or managing classes.
                    </p>
                )}
            </div>

            <div className="card-grid">
                {/* Add Class */}
                <div
                    className={`action-card ${!selectedTerm ? "disabled-card" : ""}`}
                    onClick={() => {
                        if (!selectedTerm) return;
                        setEditingClass(null);
                        setView("add");
                    }}
                >
                    <div className="card-icon">➕</div>

                    <h3>Add Class</h3>

                    <p>
                        Create a new class for the selected academic term by selecting
                        Category, Class Year and Class Day.
                    </p>

                    <button
                        className="card-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!selectedTerm) return;
                            setEditingClass(null);
                            setView("add");
                        }}
                        disabled={!selectedTerm}
                    >
                        Add Class
                    </button>
                </div>

                {/* Manage Classes */}
                <div
                    className={`action-card ${!selectedTerm ? "disabled-card" : ""}`}
                    onClick={() => {
                        if (!selectedTerm) return;
                        setView("manage");
                    }}
                >
                    <div className="card-icon">📚</div>

                    <h3>Manage Classes</h3>

                    <p>
                        View, edit and delete configured classes for the selected academic term.
                    </p>

                    <button
                        className="card-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!selectedTerm) return;
                            setView("manage");
                        }}
                        disabled={!selectedTerm}
                    >
                        Manage Classes
                    </button>
                </div>
            </div>

            <div className="assumption-box">
                <h3>Implementation Assumption (Please Confirm)</h3>

                <ul>
                    <li>
                        A class represents one unique combination of
                        <strong> Category → Class Year → Class Day</strong>
                        within a selected academic term.
                    </li>

                    <li>
                        Students are already allocated to these classes
                        through the chatbot student module.
                    </li>

                    <li>
                        The admin chooses the academic term here when configuring
                        classes, so class planning can be prepared in advance for
                        any term.
                    </li>

                    <li>
                        The scheduler and quiz generation logic can later read the
                        relevant term context from the class configuration / runtime
                        flow instead of forcing this screen to use the current active term.
                    </li>
                </ul>
            </div>
        </div>
    );
}