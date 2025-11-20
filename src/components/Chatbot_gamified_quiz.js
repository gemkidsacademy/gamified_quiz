import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./DemoChatbot.css";

export default function Chatbot_gamified_quiz({ doctorData }) {
  // ------------------ State ------------------
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedClass, setSelectedClass] = useState(""); // ✅ track selected class
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
    console.log("[DEBUG] doctorData changed:", doctorData); // Log the full object
    if (doctorData?.name) {
      setMessages([
        {
          sender: "bot",
          text: `Welcome, Dr. ${doctorData.name}! Please select your class to start the quiz.`,
          links: [],
        },
      ]);
    }
  }, [doctorData?.name]);

  // ------------------ Fetch Quiz ------------------
  useEffect(() => {
  if (!selectedClass) return; // wait for class selection

  const fetchQuiz = async () => {
    try {
      const response = await fetch(
        `https://web-production-481a5.up.railway.app/get-quiz?class_name=${encodeURIComponent(
          selectedClass
        )}&student_id=${doctorData.student_id}`
      );

      if (!response.ok) throw new Error("Failed to fetch quiz");

      const data = await response.json();

      // Check if backend sent a "already attempted" message
      if (data.message === "You have already attempted this week's quiz.") {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.message },
        ]);
        return; // stop further quiz display
      }

      setQuiz(data);

      // Show first question if quiz exists
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
}, [selectedClass, doctorData.student_id]);

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

  // ------------------ Handle answer submission ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !quiz) return;

    // ✅ use selectedClass instead of selectedClassName
    if (!selectedClass) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Please select your class before starting the quiz." },
      ]);
      return;
    }

    const studentAnswer = input.trim();
    setInput("");
    setIsWaiting(true);

    try {
      const payload = {
        student_id: Number(doctorData.student_id),
        student_name: doctorData.name,
        class_name: selectedClass,
        class_day: doctorData.class_day || "",
        question_index: Number(currentQuestionIndex),
        selected_option: studentAnswer,
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

        {/* ------------------ Class Selection & Input ------------------ */}
        <form
          onSubmit={handleSubmit}
          className="chat-input"
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          {!selectedClass && doctorData?.class_name?.length > 0 ? (
            <>
              <label htmlFor="class-select">Class Name:</label>
              <select
                id="class-select"
                value={selectedClass} // ✅ bind dropdown to selectedClass
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">-- Select class --</option>
                {doctorData.class_name.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Type your answer..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flex: 1, padding: "8px" }}
              />
              <button type="submit" style={{ padding: "8px 16px" }}>
                Submit
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}




