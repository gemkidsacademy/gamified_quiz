import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./DemoChatbot.css";

export default function ChatbotGamifiedQuiz({
    loggedInUser,
}) {
  // ------------------ State ------------------
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const server = process.env.REACT_APP_API_BASE;
  
  const [isWaiting, setIsWaiting] = useState(false);
  const hasFetchedQuizRef = useRef(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const chatEndRef = useRef(null);
  

  // ------------------ Auto-scroll ------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaiting]);

  // ------------------ Welcome message ------------------
  useEffect(() => {
    console.log("[DEBUG] loggedInUser:", loggedInUser);

      if (loggedInUser?.name) {

          setMessages([
              {
                  sender: "bot",
                  text: `Welcome, Dear ${loggedInUser.name}! Let's begin your weekly quiz.`,
              },
          ]);

      }

      }, [loggedInUser]);

  // ------------------ Fetch Quiz ------------------
  useEffect(() => {
  if (!loggedInUser?.student_id) return;

  if (hasFetchedQuizRef.current) return;
  hasFetchedQuizRef.current = true;

  const fetchQuiz = async () => {
    console.log("[DEBUG] loggedInUser:", loggedInUser);
    try {
      const response = await fetch(`${server}/student/current-gamified-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: loggedInUser.student_id,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch quiz");

      const data = await response.json();

      if (data.message === "You have already attempted this week's quiz.") {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) => msg.sender === "bot" && msg.text === data.message
          );

          if (alreadyExists) return prev;

          return [...prev, { sender: "bot", text: data.message }];
        });
        return;
      }

      setQuiz(data);

      if (data?.questions?.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.questions[0].prompt,
          },
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
}, [loggedInUser?.student_id, server]);

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

  const handleAnswerSelection = async (selectedOption) => {
    // Optionally show the selected answer in chat input
    setInput(selectedOption);
    
    // Reuse your existing handleSubmit logic
    await handleSubmit({ preventDefault: () => {} }, selectedOption);
    };

  // ------------------ Handle answer submission ------------------
  const handleSubmit = async (e, selectedOption = null) => {
  // Prevent default form submission if event exists
  if (e) e.preventDefault();
  console.log("Submitting question:", currentQuestionIndex);

  // Determine the answer: either from input or selected option
  const studentAnswer = selectedOption || input.trim();

  // If no answer or quiz not loaded, do nothing
  if (!studentAnswer || !quiz) return;

  

  // Clear input and show waiting state
  setInput("");
  setIsWaiting(true);

  try {
    const payload = {
      student_id: loggedInUser.student_id,
      question_index: Number(currentQuestionIndex),
      selected_option: studentAnswer,
    };

    console.log("Submitting payload:", payload);

    const response = await fetch(
      `${server}/student/submit-quiz-answer`,
      {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
      }
  );

    if (!response.ok) throw new Error(`Backend error: ${response.status}`);
    const data = await response.json();

    // Show user's answer in chat
    setMessages((prev) => [...prev, { sender: "user", text: studentAnswer }]);

    // Move to next question or finish quiz
    const nextIndex = currentQuestionIndex + 1;
    if (quiz?.questions?.[nextIndex]) {
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
      setCurrentQuestionIndex(null); // disable further input
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
  if (!loggedInUser) {
      return <Navigate to="/" replace />;
  }

  // ------------------ Render ------------------
  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">GEM AI Quiz</div>

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
        {/* ------------------ Class Selection & Input ------------------ */}
        {/* ------------------ Class Selection & Quiz Input ------------------ */}
        <form
            onSubmit={handleSubmit}
            className="chat-input"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >

            
        {/* Class selection before starting the quiz */}
        <>
            {currentQuestionIndex === null && (
                <div style={{ color: "red", marginBottom: "4px" }}>
                Quiz completed – input disabled
                </div>
            )}

            {currentQuestionIndex !== null &&
            quiz?.questions?.[currentQuestionIndex]?.options ? (

              <div
                  style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                  }}
              >

                  {quiz.questions[currentQuestionIndex].options.map((opt, idx) => (

                      <button
                          key={idx}
                          type="button"
                          onClick={() => handleAnswerSelection(opt)}
                          disabled={isWaiting}
                      >
                          {opt}
                      </button>

                  ))}

              </div>

          ) : (

              <div
                  style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                  }}
              >

                  <input
                      type="text"
                      placeholder="Type your answer..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled
                  />

              </div>

          )
            }
            </>

        </form>


      </div>
    </div>
  );
}













