import React, { useState } from "react";
import "./AddClass.css";

export default function AddClass() {

    const [category, setCategory] = useState("");
    const [classYear, setClassYear] = useState("");
    const [classDay, setClassDay] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log({
            category,
            classYear,
            classDay
        });

        // TODO
        // POST to backend

    };

    return (

        <div className="add-class">

            <h2>Add Class</h2>

            <p className="description">
                Create a new teaching class that will later be used by the
                scheduler to generate gamified quizzes.
            </p>

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >

                        <option value="">Select Category</option>

                        <option>Foundation</option>
                        <option>Naplan</option>
                        <option>OC</option>
                        <option>Selective</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>Class Year</label>

                    <select
                        value={classYear}
                        onChange={(e) => setClassYear(e.target.value)}
                    >

                        <option value="">Select Class Year</option>

                        <option>Kindergarten</option>

                        <option>Year 1</option>
                        <option>Year 2</option>
                        <option>Year 3</option>
                        <option>Year 4</option>
                        <option>Year 5</option>
                        <option>Year 6</option>
                        <option>Year 7</option>
                        <option>Year 8</option>
                        <option>Year 9</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>Class Day</label>

                    <select
                        value={classDay}
                        onChange={(e) => setClassDay(e.target.value)}
                    >

                        <option value="">Select Day</option>

                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                        <option>Saturday</option>
                        <option>Sunday</option>

                    </select>

                </div>

                <div className="button-row">

                    <button
                        type="submit"
                        className="save-btn"
                    >
                        Save Class
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