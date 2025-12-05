import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Components
import AdminDashboard from "./components/AdminDashboard";
import AddDoctor from "./components/AddDoctorPage";
import EditDoctor from "./components/EditDoctorPage";
import ViewDoctors from "./components/ViewDoctors";
import DeleteDoctor from "./components/DeleteDoctor";
import Chatbot_gamified_quiz from "./components/Chatbot_gamified_quiz";
import UsageDashboard from "./components/UsageDashboard";

// ===================== LOGIN PAGE =====================
function LoginPage({ setIsLoggedIn, setDoctorData, setSessionToken }) {
  const [mode, setMode] = useState("otp"); // "otp" | "password"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const server = "https://web-production-481a5.up.railway.app";

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
        setTimer(300); // 5 mins
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

    try {
      // PASSWORD LOGIN
      if (mode === "password") {
        if (!username || !password) {
          setError("Enter username & password");
          return;
        }

        const res = await fetch(`${server}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          setIsLoggedIn(true);
          setDoctorData(data);
          setSessionToken(data.session_token || null);
          navigate(data.name === "Admin" ? "/AdminPanel" : "/quiz");
        } else {
          setError(data.detail || "Invalid credentials");
        }
      }

      // OTP LOGIN
      else {
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
          setDoctorData({
            student_id: data.user.student_id,
            email: data.user.email,
            name: data.user.name,
            class_name: Array.isArray(data.user.class_name)
              ? data.user.class_name
              : [data.user.class_name],
          });

          navigate(data.user.name === "Admin" ? "/AdminPanel" : "/quiz");
        } else {
          setError(data.detail || "Invalid OTP");
        }
      }
    } catch (e) {
      console.error(e);
      setError("Login failed. Try again.");
    }
  };

  // ---------------- SWITCH LOGIN MODE ----------------
  const switchMode = () => {
    setMode(mode === "password" ? "otp" : "password");
    setError("");
    setOtpSent(false);
    setOtp("");
    setUsername("");
    setPassword("");
  };

  // ---------------- DISABLE LOGIN UNTIL OTP SENT ----------------
  const loginDisabled =
    mode === "otp" ? !otpSent : false; // password mode always enabled

  return (
    <div style={{ ...styles.container, flexDirection: "column" }}>
      <img
        src="https://gemkidsacademy.com.au/wp-content/uploads/2024/10/cropped-logo-4-1.png"
        alt="Gem Kids Academy"
        style={{ width: "180px", marginBottom: "20px" }}
      />

      <div style={styles.loginBox}>
        <h2>
          {mode === "password" ? "Login with ID / Password" : "Login with OTP"}
        </h2>

        {/* SWITCH LOGIN MODE BUTTON */}
        <button
          onClick={switchMode}
          style={{ ...styles.button, marginBottom: "20px", background: "#888" }}
        >
          Switch to {mode === "password" ? "OTP Login" : "Password Login"}
        </button>

        {/* PASSWORD LOGIN UI */}
        {mode === "password" && (
          <>
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </>
        )}

        {/* OTP LOGIN UI */}
        {mode === "otp" && (
          <>
            <input
              type="email"
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              />
            )}

            {otpSent && timer > 0 && (
              <p>
                Resend in{" "}
                {String(Math.floor(timer / 60)).padStart(2, "0")}:
                {String(timer % 60).padStart(2, "0")}
              </p>
            )}
          </>
        )}

        {/* LOGIN BUTTON (DISABLED UNTIL OTP SENT) */}
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
  const [doctorData, setDoctorData] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              setIsLoggedIn={setIsLoggedIn}
              setDoctorData={setDoctorData}
              setSessionToken={setSessionToken}
            />
          }
        />

        <Route
          path="/AdminPanel"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AdminDashboard />
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
          element={<Chatbot_gamified_quiz doctorData={doctorData} />}
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
  error: { color: "red", marginTop: "10px" },
};

export default App;
