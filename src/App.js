import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// --- Components ---
import AdminDashboard from "./components/AdminDashboard";
import AddDoctor from "./components/AddDoctorPage";
import EditDoctor from "./components/EditDoctorPage";
import ViewDoctors from "./components/ViewDoctors";
import DeleteDoctor from "./components/DeleteDoctor";
import Chatbot_gamified_quiz from "./components/Chatbot_gamified_quiz";


import UsageDashboard from "./components/UsageDashboard";



// --- Login Page ---
function LoginPage({ setIsLoggedIn, setDoctorData, setSessionToken }) {
  const [loginMode, setLoginMode] = useState("otp"); // "password" or "otp"
  const [isDisabled, setIsDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(0); // countdown in seconds
   const [canLogin, setCanLogin] = useState(false); 


  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const server = "https://web-production-481a5.up.railway.app";



  // Start OTP timer when otpSent becomes true
useEffect(() => {
  let interval = null;
  if (otpSent && timer > 0) {
    interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
  } else if (timer === 0) {
    clearInterval(interval);
  }
  return () => clearInterval(interval);
}, [otpSent, timer]);

  

  // --- Generate OTP ---
  const generateOtp = async () => {
  if (!email) {
    setError("Please enter an email address");
    return;
  }

  const formattedEmail = email.trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formattedEmail)) {
    setError("Please enter a valid email address");
    return;
  }

  try {
    const response = await fetch(`${server}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formattedEmail }),
    });

    const data = await response.json();

    if (response.ok) {
      setOtpSent(true);
      setCanLogin(true); // ENABLE login button
      setError(null);
      setIsDisabled(false);
      console.log("[INFO] OTP sent successfully:", data);
    } else {
      setError(data.detail || "Failed to generate OTP");
      console.warn("[WARN] OTP generation failed:", data);
    }
  } catch (err) {
    setError("Failed to generate OTP");
    console.error("[ERROR] Exception while generating OTP:", err);
  }
};

  // --- Login Handler ---
  // ------------------ Handle Password Login Only ------------------
const handleLogin = async () => {
  try {
    setError(null);

    // ---------------- Password Login ----------------
    if (loginMode === "password") {
      if (!username || !password) {
        setError("Please enter username and password");
        return;
      }

      console.log("[INFO] Attempting password login:", username);

      const response = await fetch(`${server}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: username, password }),
      });

      const data = await response.json();
      console.log("[DEBUG] Password login response:", data);

      if (response.ok) {
        setIsLoggedIn(true);
        setDoctorData(data);
        setSessionToken(data.session_token || null);

        if (data?.name === "Admin") navigate("/AdminPanel");
        else navigate("/quiz");
      } else {
        setError(data.detail || "Invalid credentials");
      }
    } 

    // ---------------- OTP Login (Email) ----------------
    else if (loginMode === "otp") {
      console.log("[INFO] OTP login mode active");
    if (!canLogin) {
      setError("Please generate OTP first.");
      return;
      }

      if (!otpSent) {
        setError("Please generate OTP first");
        return;
      }

      if (!email) {
        setError("Please enter your email");
        return;
      }

      if (!otp) {
        setError("Please enter the OTP");
        return;
      }

      const formattedEmail = email.trim().toLowerCase();

      console.log("[INFO] Sending verify-otp request for email:", formattedEmail, "OTP:", otp);

      try {
        const verifyResponse = await fetch(`${server}/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formattedEmail, otp }),
        });

        console.log("[DEBUG] Raw verify-otp response status:", verifyResponse.status);

        let verifyData;
        try {
          verifyData = await verifyResponse.json();
          console.log("[DEBUG] verify-otp response JSON:", verifyData);
        } catch (err) {
          console.error("[ERROR] Failed to parse verify-otp response:", err);
          setError("Failed to verify OTP");
          return;
        }

        if (verifyResponse.ok) {
          console.log("[INFO] OTP verified successfully");

          setIsLoggedIn(true);
          setDoctorData({
            student_id: verifyData.user.student_id,
            email: verifyData.user.email,
            name: verifyData.user.name,
            class_name: Array.isArray(verifyData.user.class_name)
              ? verifyData.user.class_name
              : [verifyData.user.class_name], // wrap single string
          });
          setSessionToken(null);

          if (verifyData.user.name === "Admin") {
            navigate("/AdminPanel");
          } else {
            navigate("/quiz");
          }
        } else {
          console.warn("[WARN] OTP verification failed:", verifyData);
          setError(verifyData.detail || "Invalid OTP");
        }
      } catch (err) {
        console.error("[ERROR] OTP login failed unexpectedly:", err);
        setError("Login failed. Please try again.");
      }
    }
  } catch (err) {
    console.error("[ERROR] Login failed unexpectedly:", err);
    setError("Login failed. Please try again.");
  }
};



  const toggleLoginMode = () => {
    setLoginMode(loginMode === "password" ? "otp" : "password");
    setError(null);
    setOtpSent(false);
    setOtp("");
    setUsername("");
    setPassword("");
    setCanLogin(false);

  };

  return (
  <div
    style={{
      ...styles.container,
      flexDirection: "column", // ⭐ ensures logo appears above the card
    }}
  >

    {/* ⭐ LOGO ABOVE LOGIN CARD ⭐ */}
    <img
      src="https://gemkidsacademy.com.au/wp-content/uploads/2024/10/cropped-logo-4-1.png"
      alt="Gem Kids Academy"
      style={{
        width: "180px",
        marginBottom: "20px",
        userSelect: "none",
      }}
    />

    <div style={styles.loginBox}>
      <h2>
        {loginMode === "password" ? "Login with ID/Password" : "Login with OTP"}
      </h2>

      {loginMode === "password" ? (
        <>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={handleLogin}
            style={{ ...styles.button, opacity: 1, cursor: "pointer" }}
          >
            Login
          </button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setCanLogin(false);    // ⭐ NEW LINE
            }}

            style={styles.input}
            disabled={otpSent}
          />

          {!otpSent && (
            <button
              onClick={() => {
                generateOtp();
                setTimer(300);
              }}
              style={{
                ...styles.button,
                ...styles.gButton,
                marginTop: "5px",
              }}
              disabled={!email}
            >
              Generate OTP
            </button>

          )}

          {otpSent && timer === 0 && (
            <button
              onClick={() => {
                generateOtp();
                setTimer(300);
              }}
              style={{
                ...styles.button,
                background: "#ffc107",
                marginTop: "5px",
              }}
            >
              Resend OTP
            </button>
          )}

          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
            />
          )}

          <button
            onClick={handleLogin}
            disabled={!canLogin}
            style={{
              ...styles.button,
              ...styles.eButton,
              opacity: canLogin ? 1 : 0.5,
              cursor: canLogin ? "pointer" : "not-allowed",
              marginTop: "10px"
            }}
          >
            Login
          </button>


          {otpSent && timer > 0 && (
            <p style={{ marginTop: "10px", textAlign: "center" }}>
              Please enter the OTP sent to your email. Resend in{" "}
              {Math.floor(timer / 60).toString().padStart(2, "0")}:
              {(timer % 60).toString().padStart(2, "0")}
            </p>
          )}
        </>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  </div>
);

}


// --- Private Route Wrapper ---
const PrivateRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/" />;
};

// --- Main App ---
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

        {/* Admin Routes */}
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

// --- Styles ---const styles = {
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

  // 🎨 Gem Brand Colors (from previous working code)
  gButton: { backgroundColor: "rgb(219, 71, 45)" },   // Generate OTP
  eButton: { backgroundColor: "rgb(0, 140, 200)" },   // Login
  mButton: { backgroundColor: "rgb(242, 152, 52)" },  // Continue as Guest

  error: {
    color: "red",
    marginTop: "10px",
  },
};


export default App;
