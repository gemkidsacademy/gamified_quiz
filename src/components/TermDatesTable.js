import React, { useEffect, useState } from "react";

export default function TermDatesTable() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTermDates = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("https://web-production-481a5.up.railway.app/get-term-dates");
        if (!response.ok) {
          throw new Error(`Backend returned status ${response.status}`);
        }
        const data = await response.json();
        setTerms(data);
      } catch (err) {
        console.error("Error fetching term dates:", err);
        setError("Failed to load term dates.");
      } finally {
        setLoading(false);
      }
    };

    fetchTermDates();
  }, []);

  if (loading) return <p>Loading term dates...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (terms.length === 0) return <p>No term dates found.</p>;

  return (
    <table className="term-dates-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Year</th>
          <th>Term Start Date</th>
          <th>Term End Date</th>
        </tr>
      </thead>
      <tbody>
        {terms.map((term) => (
          <tr key={term.id}>
            <td>{term.id}</td>
            <td>{term.year}</td>
            <td>{new Date(term.termStartDate).toLocaleDateString()}</td>
            <td>{new Date(term.termEndDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
