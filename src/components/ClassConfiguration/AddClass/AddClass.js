import React, { useState, useEffect } from "react";
import "./AddClass.css";

export default function AddClass({
    loggedInUser,
    editingClass,
    onBack,
}) {

    const server = process.env.REACT_APP_API_BASE;
    const [category, setCategory] = useState(
        editingClass?.category || ""
    );

    const [classYear, setClassYear] = useState(
        editingClass?.year || ""
    );

    const [classDay, setClassDay] = useState(
        editingClass?.day || ""
    );
    const [categories, setCategories] = useState([]);
    const [classYears, setClassYears] = useState([]);
    const [classDays, setClassDays] = useState([]);
    const loadClassDays = async (selectedCategory, selectedYear) => {

    try {

        const res = await fetch(
            `${server}/class-configuration/class-days`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    center_code: loggedInUser.center_code,
                    category: selectedCategory,
                    class_year: selectedYear,
                }),
            }
        );

        const data = await res.json();

        if (res.ok) {
            setClassDays(data.class_days);
        }

    } catch (err) {
        console.error(err);
    }

};
    const loadClassYears = async (selectedCategory) => {
        try {

            const res = await fetch(
                `${server}/class-configuration/class-years`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        center_code: loggedInUser.center_code,
                        category: selectedCategory,
                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {
                setClassYears(data.class_years);
            }

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {

    const initializeForm = async () => {

        await loadCategories();

        if (editingClass) {

            await loadClassYears(editingClass.category);

            await loadClassDays(
                editingClass.category,
                editingClass.year
            );

        }

    };

    if (loggedInUser) {
        initializeForm();
    }

}, [loggedInUser, editingClass]);
    

    const loadCategories = async () => {
        try {
            const res = await fetch(
                `${server}/class-configuration/categories`,
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
                setCategories(data.categories);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const url = editingClass
            ? `${server}/class-configuration/${editingClass.id}`
            : `${server}/class-configuration`;

        const method = editingClass ? "PUT" : "POST";

        const res = await fetch(
            url,
            {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    center_code: loggedInUser.center_code,
                    category: category,
                    class_year: classYear,
                    class_day: classDay,
                }),
            }
        );

        const data = await res.json();

        if (res.ok) {

            alert(data.message);

            setCategory("");
            setClassYear("");
            setClassDay("");

            setClassYears([]);
            setClassDays([]);

            await loadCategories();

            if (onBack) {
                onBack();
            }

        } else {

            alert(data.detail);

        }

    } catch (err) {

        console.error(err);

        alert("Unable to connect to the server.");

    }

};

    return (

        <div className="add-class">

            <h2>
                {editingClass ? "Edit Class" : "Add Class"}
            </h2>

            <p className="description">
                Create a new teaching class that will later be used by the
                scheduler to generate gamified quizzes.
            </p>

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(e) => {

                            const value = e.target.value;

                            setCategory(value);

                            setClassYear("");
                            setClassDay("");

                            setClassYears([]);
                            setClassDays([]);

                            if (value) {
                                loadClassYears(value);
                            }

                        }}
                    >

                        <option value="">Select Category</option>

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

                <div className="form-group">

                    <label>Class Year</label>

                   <select
                        value={classYear}
                        disabled={!category}
                        onChange={(e) => {

                            const value = e.target.value;

                            setClassYear(value);

                            setClassDay("");

                            setClassDays([]);

                            if (value) {
                                loadClassDays(category, value);
                            }

                        }}
                    >

                        <option value="">Select Class Year</option>

                        {classYears.map((year) => (
                            <option
                                key={year}
                                value={year}
                            >
                                {year}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="form-group">

                    <label>Class Day</label>

                    <select
                        value={classDay}
                        disabled={!classYear}
                        onChange={(e) => setClassDay(e.target.value)}
                    >

                        <option value="">Select Day</option>

                        {classDays.map((day) => (
                            <option
                                key={day}
                                value={day}
                            >
                                {day}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="button-row">

                    <button
                        type="submit"
                        className="save-btn"
                    >
                        {editingClass ? "Edit Class" : "Save Class"}
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    );

}