import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./DemoChatbot.css";

export default function Chatbot_gamified_quiz({ doctorData }) {
  // ------------------ State ------------------
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [reasoningLevel, setReasoningLevel] = useState("simple");
  const [isWaiting, setIsWaiting] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const chatEndRef = useRef(null);

  // ------------------ Auto-scroll ------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaiting]);

  // ------------------ Welcome message ------------------
  useEffect(() => {
    if (doctorData?.name) {
      setMessages([
        {
          sender: "bot",
          text: `Welcome, Dr. ${doctorData.name}! Let's start your quiz.`,
          links: [],
        },
      ]);
    }
  }, [doctorData?.name]);

  // ------------------ Fetch Quiz ------------------
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!doctorData?.class_name) return;
      try {
        const response = await fetch(
          `https://web-production-481a5.up.railway.app/get-quiz?class_name=${encodeURIComponent(
            doctorData.class_name
          )}`
        );
        if (!response.ok) throw new Error("Failed to fetch quiz");
        const data = await response.json();
        setQuiz(data);

        // Show first question
        if (data?.questions?.length > 0) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: data.questions[0].prompt },
          ]);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, no quiz available right now." },
        ]);
      }
    };

    fetchQuiz();
  }, [doctorData?.class_name]);

  // ------------------ Helpers ------------------
  const parseBoldText = (text) => {
    const regex = /\*\*(.+?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={lastIndex}>{text.slice(lastIndex, match.index)}</span>);
      }
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  const formatMessageWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  };
  async function getStudentName(studentId) {
    const response = await fetch(
      `https://web-production-481a5.up.railway.app/student-name?student_id=${studentId}`
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch student name");
    }
  
    return await response.json(); // { student_id, student_name }
  }

  // ------------------ Handle answer submission ------------------
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!input.trim() || !quiz) return;

  const studentAnswer = input.trim();
  setInput(""); // clear input
  setIsWaiting(true);

  try {
    // Validate and coerce fields
    const studentId = Number(doctorData?.student_id);
    const className = String(doctorData?.class_name || "").trim();
    const questionIndex = Number(currentQuestionIndex);
    const selectedOption = String(studentAnswer).trim();

    // Check for invalid values
    if (!studentId || !className || isNaN(questionIndex) || !selectedOption) {
      console.error("Invalid payload values:", {
        studentId,
        className,
        questionIndex,
        selectedOption,
      });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Cannot submit answer: invalid data detected.",
        },
      ]);
      setIsWaiting(false);
      return;
    }
    const { student_name } = await getStudentName(doctorData.id);

    const payload = {
      student_id: student.id,
      student_name,                // <-- fetched from backend
      class_name: student.class_name,
      question_index: currentIndex,
      selected_option: selectedOption,
    };

    console.log("Submitting payload:", payload);

    const response = await fetch(
      "https://web-production-481a5.up.railway.app/submit-quiz-answer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) throw new Error(`Backend error: ${response.status}`);
    const data = await response.json();

    // Add user's answer to chat
    setMessages((prev) => [...prev, { sender: "user", text: studentAnswer }]);

    // Show next question or completion
    const nextIndex = currentQuestionIndex + 1;
    if (quiz.questions[nextIndex]) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: quiz.questions[nextIndex].prompt },
      ]);
      setCurrentQuestionIndex(nextIndex);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Quiz completed! Your score: ${data.current_score}/${quiz.questions.length}`,
        },
      ]);
      setCurrentQuestionIndex(null);
    }
  } catch (err) {
    console.error("Error submitting answer:", err);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Sorry, there was a problem recording your answer." },
    ]);
  } finally {
    setIsWaiting(false);
  }
};


  // ------------------ Redirect if no doctorData ------------------
  if (!doctorData?.name) {
    return <Navigate to="/" replace />;
  }

  // ------------------ Render ------------------
  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">Gem AI Quiz</div>
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              {msg.sender === "bot" ? (
                <>
                  {msg.name && <div className="bot-label">{parseBoldText(msg.name)}</div>}
                  <div dangerouslySetInnerHTML={{ __html: formatMessageWithLinks(msg.text) }} />
                  {Array.isArray(msg.links) && msg.links.length > 0 && (
                    <div className="pdf-links">
                      <a
                        href={msg.links[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-link"
                      >
                        Open PDF
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div>{msg.text}</div>
              )}
            </div>
          ))}
          {isWaiting && (
            <div className="message bot waiting">
              <div className="spinner"></div>
              <span>Waiting for response...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="chat-input"
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <div className="reasoning-container">
            <label htmlFor="reasoning-select" className="reasoning-label">
              Reasoning
            </label>
            <select
              id="reasoning-select"
              value={reasoningLevel}
              onChange={(e) => setReasoningLevel(e.target.value)}
              className="reasoning-select"
            >
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <button type="submit" style={{ padding: "8px 16px" }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}





