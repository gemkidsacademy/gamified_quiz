import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./DemoChatbot.css";

export default function Chatbot_gamified_quiz({ doctorData }) {
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

  // ------------------ Redirect if no doctorData ------------------
  if (!doctorData?.name) {
    return <Navigate to="/" replace />;
  }

  // ------------------ Welcome message ------------------
  useEffect(() => {
    if (doctorData?.name) {
      const welcomeMsg = {
        sender: "bot",
        text: `Welcome, Dr. ${doctorData.name}! Let's start your quiz.`,
        links: [],
      };
      setMessages([welcomeMsg]);
    }
  }, [doctorData?.name]);

  // ------------------ Fetch Quiz ------------------
  useEffect(() => {
    const fetchQuiz = async () => {
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
  }, [doctorData.class_name]);

  // ------------------ Helper: parse bold text ------------------
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

  // ------------------ Helper: format links ------------------
  const formatMessageWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  };

  // ------------------ Handle user answer submission ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !quiz) return;

    const userAnswer = input;
    setMessages((prev) => [...prev, { sender: "user", text: userAnswer }]);
    setInput("");
    setIsWaiting(true);

    try {
      // Send answer to backend
      const payload = {
        question_index: currentQuestionIndex,
        selected_option: userAnswer,
        student_id: doctorData.id,
        class_name: doctorData.class_name,
      };

      const response = await fetch(
        "https://web-production-481a5.up.railway.app/submit-quiz-answer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error(`Backend returned ${response.status}`);
      const result = await response.json();

      // Move to next question if available
      const nextIndex = currentQuestionIndex + 1;
      if (quiz.questions[nextIndex]) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: quiz.questions[nextIndex].prompt },
        ]);
        setCurrentQuestionIndex(nextIndex);
      } else {
        // Quiz completed
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Quiz completed! Your score: ${result.current_score}/${quiz.questions.length}` },
        ]);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error submitting your answer. Please try again." },
      ]);
    } finally {
      setIsWaiting(false);
    }
  };

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
                      <a href={msg.links[0]} target="_blank" rel="noopener noreferrer" className="pdf-link">
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

        <form onSubmit={handleSubmit} className="chat-input" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <div className="reasoning-container">
            <label htmlFor="reasoning-select" className="reasoning-label">Reasoning</label>
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
          <button type="submit" style={{ padding: "8px 16px" }}>Submit</button>
        </form>
      </div>
    </div>
  );
}
