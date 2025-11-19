import React, { useState } from "react";
import "./AddActivity.css";

export default function AddActivity() {
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState(`[
  {
    "prompt": "You are a helpful quiz generator. Use the following topics to create a student quiz: {topics}. Include instructions, questions with options, and correct answers in JSON format."
  }
]`);
  const [scoreLogic, setScoreLogic] = useState("");
  const [className, setClassName] = useState("");
  const [classDay, setClassDay] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(questions);
    } catch (err) {
      setMessage("Invalid JSON in questions field. Please follow the example format.");
      return;
    }

    const payload = {
      instructions,
      questions: parsedQuestions,
      score_logic: scoreLogic,
      class_name: className,
      class_day: classDay,
      week_number: weekNumber
    };

    try {
      const response = await fetch(
        "https://your-backend-url.com/add-activity", // replace with your backend endpoint
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setMessage("Activity added successfully!");
      // Reset form fields
      setInstructions("");
      setQuestions(`[
  {
    "prompt": "You are a helpful quiz generator. Use the following topics to create a student quiz: {topics}. Include instructions, questions with options, and correct answers in JSON format."
  }
]`);
      setScoreLogic("");
      setClassName("");
      setClassDay("");
      setWeekNumber("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add activity.");
    }
  };

  return (
    <div className="add-activity-form">
      <h3>Add New Activity</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Instructions:
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter activity instructions"
            required
          />
        </label>

        <label>
          Questions (JSON format):
          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder={`[
  {
    "prompt": "Question 1?",
    "options": ["Option A","Option B","Option C"],
    "answer": "Option A"
  }
]`}
            required
          />
          <small>Enter questions as a JSON array. Follow the example format above.</small>
        </label>

        <label>
          Score Logic:
          <input
            type="text"
            value={scoreLogic}
            onChange={(e) => setScoreLogic(e.target.value)}
            placeholder="e.g., 1 point per correct answer"
          />
        </label>

        <label>
          Class Name:
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
            required
          />
        </label>

        <label>
          Class Day:
          <input
            type="text"
            value={classDay}
            onChange={(e) => setClassDay(e.target.value)}
            placeholder="Enter class day"
          />
        </label>

        <label>
          Week Number:
          <input
            type="number"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            placeholder="Enter week number"
          />
        </label>

        <button type="submit">Add Activity</button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
}
