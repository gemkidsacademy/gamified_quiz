import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function GuestCredentials({ loggedInUser }) {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadGuests();
    }, []);

    const loadGuests = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${API_BASE}/guest/users`);

            if (!res.ok) {
                throw new Error("Failed to load guest users");
            }

            const data = await res.json();

            setGuests(data);

        } catch (err) {
            console.error("Error loading guest users:", err);
            setError("Unable to load guest users.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (value) => {
        if (!value) return "-";

        return new Date(value).toLocaleString("en-AU", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="guest-credentials">

            <h2>Guest Credentials</h2>

            <p>
                View registered guest users and their account information.
            </p>

            {loading && (
                <p>Loading guest users...</p>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {!loading && !error && guests.length === 0 && (
                <p>No guest users found.</p>
            )}

            {!loading && !error && guests.length > 0 && (
                <div style={{ overflowX: "auto" }}>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "20px",
                        }}
                    >

                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Full Name</th>
                                <th style={thStyle}>Contact</th>
                                <th style={thStyle}>Method</th>
                                <th style={thStyle}>Category</th>
                                <th style={thStyle}>Class Year</th>
                                <th style={thStyle}>Registered</th>
                                <th style={thStyle}>Last Login</th>
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {guests.map((guest) => (
                                <tr key={guest.id}>

                                    <td style={tdStyle}>
                                        {guest.id}
                                    </td>

                                    <td style={tdStyle}>
                                        {guest.full_name}
                                    </td>

                                    <td style={tdStyle}>
                                        {guest.contact}
                                    </td>

                                    <td style={tdStyle}>
                                        {guest.contact_method}
                                    </td>

                                    <td style={tdStyle}>
                                        {guest.category}
                                    </td>

                                    <td style={tdStyle}>
                                        {guest.class_year}
                                    </td>

                                    <td style={tdStyle}>
                                        {formatDate(guest.registered_at)}
                                    </td>

                                    <td style={tdStyle}>
                                        {formatDate(guest.last_login)}
                                    </td>

                                    <td style={tdStyle}>
                                        {guest.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}


const thStyle = {
    padding: "12px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
    background: "#f5f7fa",
    fontWeight: "600",
};

const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #eee",
};