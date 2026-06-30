import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Components
//import AdminDashboard from "./components/AdminDashboard";

import AdminDashboardNew from "./components/AdminDashboardNew";
import AddDoctor from "./components/AddDoctorPage";
import EditDoctor from "./components/EditDoctorPage";
import ViewDoctors from "./components/ViewDoctors";
import DeleteDoctor from "./components/DeleteDoctor";
import ChatbotGamifiedQuiz from "./components/ChatbotGamifiedQuiz";
import UsageDashboard from "./components/UsageDashboard";

// ===================== LOGIN PAGE =====================
function LoginPage({ setIsLoggedIn, setLoggedInUser }) {
  const [email, setEmail] = useState("");
  const server = process.env.REACT_APP_API_BASE;
  const [loginMode, setLoginMode] = useState("otp");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  //const server = "https://web-production-481a5.up.railway.app";
  

  console.log("SERVER =", server);
  console.log("APP VERSION = 2026-06-27");
  
  const handleEnterKey = (e) => {
    if (e.key !== "Enter") return;
  
    if (!otpSent) {
      generateOtp();
    } else {
      handleLogin();
    }
  };
  const handleStudentLogin = async () => {
  setError("");

  if (!studentId.trim()) {
    setError("Enter Student ID");
    return;
  }

  if (!password.trim()) {
    setError("Enter Password");
    return;
  }

  try {
    const res = await fetch(`${server}/student-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentId.trim(),
        password: password,
      }),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (res.ok) {
      setIsLoggedIn(true);

      // -----------------------
      // Admin Login
      // -----------------------
      if (data.user_type === "admin") {

          setLoggedInUser({
              user_type: "admin",
              id: data.admin.id,
              username: data.admin.username,
              role: data.admin.role,
              center_code: data.admin.center_code,
          });

          navigate("/AdminPanel");
          return;
      }

      // -----------------------
      // Student Login
      // -----------------------
      setLoggedInUser({
        user_type: "student",
        student_id: data.student.student_id,
        name: data.student.name,
        class_name: data.student.class_name,
        student_year: data.student.student_year,
        class_day: data.student.class_day,
        center_code: data.student.center_code,
        center_name: data.student.center_name,
        parent_email: data.student.parent_email,
      });

      navigate("/quiz");
    }
    else {
      setError(data.detail || "Invalid Username or Password");
    }
  } catch (err) {
    console.error(err);
    setError("Login failed");
  }
};


  // ---------------- TIMER HANDLER ----------------
  useEffect(() => {
    if (!otpSent || timer <= 0) return;

    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // ---------------- GENERATE OTP ----------------
  const generateOtp = async () => {
    setError("");

    const formattedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formattedEmail || !emailRegex.test(formattedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch(`${server}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formattedEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setTimer(300); // 5 minutes
      } else {
        setError(data.detail || "Failed to send OTP");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to send OTP");
    }
  };

  // ---------------- HANDLE LOGIN ----------------
  const handleLogin = async () => {
    setError("");

    if (!otpSent) {
      setError("Please click 'Generate OTP' first");
      return;
    }
    if (!email) {
      setError("Enter email");
      return;
    }
    if (!otp) {
      setError("Enter OTP");
      return;
    }

    try {
      const res = await fetch(`${server}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
          setIsLoggedIn(true);

          if (data.user_type === "admin") {
              setLoggedInUser({
                  user_type: "admin",
                  id: data.admin.id,
                  username: data.admin.username,
                  role: data.admin.role,
                  center_code: data.admin.center_code,
              });

              navigate("/AdminPanel");
              return;
          }

          setLoggedInUser({
              user_type: "student",
              student_id: data.student.student_id,
              name: data.student.name,
              class_name: data.student.class_name,
              class_day: data.student.class_day,
              student_year: data.student.student_year,
              center_code: data.student.center_code,
              center_name: data.student.center_name,
              parent_email: data.student.parent_email,
          });

          navigate("/quiz");
      } else {
        setError(data.detail || "Invalid OTP");
      }
    } catch (e) {
      console.error(e);
      setError("Login failed. Try again.");
    }
  };

  // LOGIN BUTTON disabled until OTP is generated
  const loginDisabled = !otpSent;

  return (
    <div style={{ ...styles.container, flexDirection: "column" }}>
      <img
        src="https://gemkidsacademy.com.au/wp-content/uploads/2024/10/cropped-logo-4-1.png"
        alt="Gem Kids Academy"
        style={{ width: "180px", marginBottom: "20px" }}
      />

      <div style={styles.loginBox}>
      <div style={styles.toggleContainer}>
        <button
          style={{
            ...styles.toggleButton,
            ...(loginMode === "otp" ? styles.activeToggle : {}),
          }}
          onClick={() => setLoginMode("otp")}
        >
          OTP Login
        </button>

        <button
          style={{
            ...styles.toggleButton,
            ...(loginMode === "student" ? styles.activeToggle : {}),
          }}
          onClick={() => setLoginMode("student")}
        >
          ID Login
        </button>
      </div>
        {loginMode === "otp" && (
  <>
    <h2>Login with OTP</h2>

    <input
      type="email"
      style={styles.input}
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      onKeyDown={handleEnterKey}
      disabled={otpSent}
    />

    {!otpSent && (
      <button
        style={{ ...styles.button, ...styles.gButton }}
        onClick={generateOtp}
        disabled={!email}
      >
        Generate OTP
      </button>
    )}

    {otpSent && timer === 0 && (
      <button
        style={{ ...styles.button, background: "#ffc107" }}
        onClick={generateOtp}
      >
        Resend OTP
      </button>
    )}

    {otpSent && (
      <input
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        onKeyDown={handleEnterKey}
      />
    )}

    {otpSent && timer > 0 && (
      <p>
        Resend in{" "}
        {String(Math.floor(timer / 60)).padStart(2, "0")}:
        {String(timer % 60).padStart(2, "0")}
      </p>
    )}

    <button
      style={{
        ...styles.button,
        ...styles.eButton,
        opacity: loginDisabled ? 0.6 : 1,
        cursor: loginDisabled ? "not-allowed" : "pointer",
      }}
      disabled={loginDisabled}
      onClick={handleLogin}
    >
      Login
    </button>
  </>
)}
        {loginMode === "student" && (
          <>
            <h2>Login With ID/Password</h2>

            <input
              style={styles.input}
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />

            <input
              type="password"
              style={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              style={{
                ...styles.button,
                backgroundColor: "#28a745",
              }}
              onClick={handleStudentLogin}
            >
              Login
            </button>
          </>
        )}

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

// ===================== PRIVATE ROUTE =====================
const PrivateRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? children : <Navigate to="/" />;

// ===================== MAIN APP =====================
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
                setIsLoggedIn={setIsLoggedIn}
                setLoggedInUser={setLoggedInUser}
            />
          }
        />

        <Route
          path="/AdminPanel"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AdminDashboardNew
                loggedInUser={loggedInUser}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-doctor"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AddDoctor />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-doctor"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <EditDoctor />
            </PrivateRoute>
          }
        />

        <Route
          path="/view-doctors"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <ViewDoctors />
            </PrivateRoute>
          }
        />

        <Route
          path="/delete-doctor"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <DeleteDoctor />
            </PrivateRoute>
          }
        />

        <Route
          path="/usage-dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <UsageDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/quiz"
          element={<ChatbotGamifiedQuiz
            loggedInUser={loggedInUser}
        />}
        />
      </Routes>
    </Router>
  );
}

// ===================== STYLES =====================
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5",
  },
  loginBox: {
    padding: "30px",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    minWidth: "300px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "4px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  gButton: { backgroundColor: "rgb(219, 71, 45)" },
  eButton: { backgroundColor: "rgb(0, 140, 200)" },
  toggleContainer: {
  display: "flex",
  marginBottom: "20px",
  borderRadius: "6px",
  overflow: "hidden",
  border: "1px solid #ccc",
},

toggleButton: {
  flex: 1,
  padding: "12px",
  border: "none",
  cursor: "pointer",
  background: "#f5f5f5",
  fontWeight: "bold",
  fontSize: "15px",
},

activeToggle: {
  backgroundColor: "rgb(0,140,200)",
  color: "white",
},
  error: { color: "red", marginTop: "10px" },
};

export default App;
