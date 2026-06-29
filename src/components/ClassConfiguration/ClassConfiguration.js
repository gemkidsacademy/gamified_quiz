import React, { useState } from "react";
import "./ClassConfiguration.css";

import AddClass from "./AddClass/AddClass";
import ManageClasses from "./ManageClass/ManageClasses";
export default function ClassConfiguration() {

    const [view, setView] = useState("home");

    // -----------------------------
    // Render Add Class Screen
    // -----------------------------
    if (view === "add") {
        return (
            <AddClass
                onBack={() => setView("home")}
            />
        );
    }

    // -----------------------------
    // Render Manage Classes Screen
    // -----------------------------
    if (view === "manage") {
        return (
            <ManageClasses
                onBack={() => setView("home")}
            />
        );
    }

    // -----------------------------
    // Home Screen
    // -----------------------------
    return (

        <div className="class-configuration">

            <h2>Class Configuration</h2>

            <p className="page-description">
                Create and manage teaching classes used by the
                Gamified Quiz module. Each class is uniquely identified
                by its <strong>Category</strong>,
                <strong> Class Year</strong> and
                <strong> Class Day</strong>.
            </p>

            <div className="card-grid">

                {/* Add Class */}

                <div
                    className="action-card"
                    onClick={() => setView("add")}
                >

                    <div className="card-icon">
                        ➕
                    </div>

                    <h3>Add Class</h3>

                    <p>
                        Create a new class by selecting its
                        Category, Class Year and Class Day.
                    </p>

                    <button
                        className="card-btn"
                        onClick={() => setView("add")}
                    >
                        Add Class
                    </button>

                </div>

                {/* Manage Classes */}

                <div
                    className="action-card"
                    onClick={() => setView("manage")}
                >

                    <div className="card-icon">
                        📚
                    </div>

                    <h3>Manage Classes</h3>

                    <p>
                        View all configured classes and update
                        or delete existing class configurations.
                    </p>

                    <button
                        className="card-btn"
                        onClick={() => setView("manage")}
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
                        <strong> Category → Class Year → Class Day</strong>.
                    </li>

                    <li>
                        Students are already allocated to these classes
                        through the chatbot student module.
                    </li>

                    <li>
                        The scheduler uses the configured classes to
                        determine which students should receive each
                        generated gamified quiz.
                    </li>

                </ul>

            </div>

        </div>

    );

}