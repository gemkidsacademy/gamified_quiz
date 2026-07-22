import React, { useState } from "react";
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
  
  const server = process.env.REACT_APP_API_BASE;
  
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");

  const navigate = useNavigate();
  //const server = "https://web-production-481a5.up.railway.app";
  

  console.log("SERVER =", server);
  console.log("APP VERSION = 2026-06-27");
  
  
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


  

  

  

  

  return (
    <div style={{ ...styles.container, flexDirection: "column" }}>
      <img
        src="https://gemkidsacademy.com.au/wp-content/uploads/2024/10/cropped-logo-4-1.png"
        alt="Gem Kids Academy"
        style={{ width: "180px", marginBottom: "20px" }}
      />

      <div style={styles.loginBox}>
      
 
       <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStudentLogin();
        }}
      >
        <h2>Login with ID</h2>

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
          type="submit"
          style={{
            ...styles.button,
            backgroundColor: "#28a745",
          }}
        >
          Login
        </button>
      </form>

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