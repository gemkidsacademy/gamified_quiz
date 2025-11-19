import React, { useState } from "react";
import "./AddActivity.css";


export default function AddActivity() {
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState('[{"prompt":""}]'); // JSON string
  const [scoreLogic, setScoreLogic] = useState("");
  const [className, setClassName] = useState("");
  const [classDay, setClassDay] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(questions);
    } catch (err) {
      setMessage("Invalid JSON in questions field.");
      return;
    }

    const payload = {
      instructions,
      questions: parsedQuestions,
      score_logic: scoreLogic,
      class_name: className,
      class_day: classDay,
    };

    try {
      const response = await fetch(
        "https://your-backend-url.com/add-activity", // replace with your backend endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setMessage("Activity added successfully!");
      setInstructions("");
      setQuestions('[{"prompt":""}]');
      setScoreLogic("");
      setClassName("");
      setClassDay("");
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
            placeholder='[{"prompt": "Question 1?", "options": ["A","B"], "answer":"A"}]'
            required
          />
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

        <button type="submit">Add Activity</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
