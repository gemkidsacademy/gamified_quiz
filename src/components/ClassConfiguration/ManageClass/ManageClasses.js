import React, { useState } from "react";
import "./ManageClasses.css";

export default function ManageClasses() {

    const [search, setSearch] = useState("");

    // Temporary data
    const [classes] = useState([
        {
            id: 1,
            category: "Foundation",
            year: "Year 5",
            day: "Monday",
        },
        {
            id: 2,
            category: "Foundation",
            year: "Year 6",
            day: "Tuesday",
        },
        {
            id: 3,
            category: "Naplan",
            year: "Year 4",
            day: "Wednesday",
        },
    ]);

    const filteredClasses = classes.filter((item) =>
        `${item.category} ${item.year} ${item.day}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <div className="manage-classes">

            <h2>Manage Classes</h2>

            <p className="description">
                View, search, edit and delete class configurations.
            </p>

            <div className="toolbar">

                <input
                    type="text"
                    placeholder="Search classes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Category</th>

                        <th>Class Year</th>

                        <th>Class Day</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredClasses.map((item) => (

                        <tr key={item.id}>

                            <td>{item.category}</td>

                            <td>{item.year}</td>

                            <td>{item.day}</td>

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

        </div>

    );

}