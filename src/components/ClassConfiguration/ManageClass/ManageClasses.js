import React, { useState, useEffect } from "react";
import "./ManageClasses.css";

export default function ManageClasses({
    loggedInUser,
    onEdit,
}) {
    const server = process.env.REACT_APP_API_BASE;

    const [search, setSearch] = useState("");

    // Temporary data
    const [classes, setClasses] = useState([]);

    const filteredClasses = classes.filter((item) =>
        `${item.category} ${item.year} ${item.day}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    useEffect(() => {
        loadClasses();
    }, []);
  const loadClasses = async () => {

    try {

        const res = await fetch(
            `${server}/class-configuration/list`,
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
            setClasses(data.classes);
        }

    } catch (err) {
        console.error(err);
    }

};
const deleteClass = async (id) => {

    if (!window.confirm("Delete this class?")) {
        return;
    }

    try {

        const res = await fetch(
            `${server}/class-configuration/${id}`,
            {
                method: "DELETE",
            }
        );

        const data = await res.json();

        if (res.ok) {

            alert(data.message);

            loadClasses();

        } else {

            alert(data.detail);

        }

    } catch (err) {

        console.error(err);

        alert("Unable to connect to the server.");

    }

};

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

                                <button
                                    className="edit-btn"
                                    onClick={() => onEdit(item)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteClass(item.id)}
                                >
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