import React, { useState } from "react";
import "./AcademicTerm.css";

import AddTerm from "./AddTerm/AddTerm";
import ManageTerms from "./ManageTerms/ManageTerms";

export default function AcademicTerm({ loggedInUser }) {
  const [view, setView] = useState("home");

  if (view === "add") {
    return (
      <AddTerm
        loggedInUser={loggedInUser}
        onBack={() => setView("home")}
      />
    );
  }

  if (view === "manage") {
    return (
      <ManageTerms
        loggedInUser={loggedInUser}
        onBack={() => setView("home")}
      />
    );
  }

  return (
    <div className="academic-term-home">
      <h2>Academic Terms</h2>

      <p className="page-description">
        Create and manage academic terms used by the Gamified Quiz module.
        Multiple terms can be created for the centre, but only one term is
        treated as the current active term at any time.
      </p>

      <div className="card-grid">
        {/* Add Term */}
        <div
          className="action-card"
          onClick={() => setView("add")}
        >
          <div className="card-icon">➕</div>

          <h3>Add Term</h3>

          <p>
            Create a new academic term by entering the term name,
            start date and end date.
          </p>

          <button className="card-btn">
            Add Term
          </button>
        </div>

        {/* Manage Terms */}
        <div
          className="action-card"
          onClick={() => setView("manage")}
        >
          <div className="card-icon">📅</div>

          <h3>Manage Terms</h3>

          <p>
            View all academic terms, edit their details, delete terms,
            and choose which term should be the current active term.
          </p>

          <button className="card-btn">
            Manage Terms
          </button>
        </div>
      </div>

      <div className="assumption-box">
        <h3>Implementation Assumption (Please Confirm)</h3>

        <ul>
          <li>
            Multiple academic terms can exist for the same centre.
          </li>

          <li>
            Only <strong>one academic term</strong> is treated as the
            <strong> current active term</strong> at any given time.
          </li>

          <li>
            The scheduler uses the <strong>current active term</strong> to
            calculate the current learning week and retrieve the relevant session.
          </li>

          <li>
            The backend automatically calculates the number of weeks for each term
            from its start and end dates.
          </li>
        </ul>
      </div>
    </div>
  );
}