import React, { useState, useReducer, useEffect } from "react";
import ReactDom from "react-dom/client";
import { useNavigate } from "react-router-dom";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AfterLogin from "./Afterlogin";
import axios from "axios";

import "./App.css";

function App() {
  const initialState = {
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userType: "Borrower",
    aadharCard: null,
  };
  const navigate = useNavigate();
  function formReducer(state, action) {
    switch (action.type) {
      case "RESET_FORM":
        return { ...initialState, userType: action.userType };
      case "UPDATE_FIELD":
        return { ...state, [action.field]: action.value };
      default:
        return state;
    }
  }
  const [appName] = useState("App name");
  const [formData, dispatch] = useReducer(formReducer, initialState);
  const [currentPage, setCurrentPage] = useState("home"); // "home", "login", "signup"
  const [activeUserType, setActiveUserType] = useState("Borrower"); // "Borrower" or "Lender"
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (currentPage === "signup") {
      dispatch({ type: "RESET_FORM", userType: activeUserType });
    }
  }, [currentPage, activeUserType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FIELD", field: name, value });
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleFileChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "aadharCard",
      value: e.target.files[0],
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password
    ) {
      alert("All fields are required");
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match"); // Alert if passwords don't match
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("password", formData.password);

      if (formData.aadharCard) {
        formDataToSend.append("aadharCard", formData.aadharCard);
      }

      const response = await axios.post(
        "http://localhost:5001/signup",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Corrected Content-Type
          },
        }
      );
      if (response.status === 201) {
        alert("Account created successfully!"); // Success message
        dispatch({ type: "RESET_FORM", userType: formData.userType }); // Reset form
        setCurrentPage("login"); // Redirect to login page
      } else {
        setMessage(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Email already exists"
      ) {
        alert("This mail is already registered.Try with another email");
      }
      setMessage(error.response?.data?.message || "Signup failed. Try again.");
      console.error("Error during signup:", error); // Log the error for debugging
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/login", // Replace with your actual API endpoint
        loginData
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        setIsLoggedIn(true);
        navigate("/afterlogin");
        // Save token to localStorage
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Error during login:", error); // Log the error for debugging
    }
  };

  const handleUserTypeToggle = (type) => {
    setActiveUserType(type);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {currentPage === "home" && (
        <div className="HomePage">
          <header>
            <h1>QuickConnect</h1>
          </header>

          <main>
            <h2>Connecting Moneylenders and Consumers Effortlessly!</h2>
            <p>
              QuickConnect bridges the gap between moneylenders and consumers,
              simplifying borrowing and lending. Whether you need a loan or want
              to lend money, this platform connects you with the right people,
              making the process easy and safe.
            </p>
            <p>Join us today and experience a better way to connect!</p>
            <div className="navigation-buttons">
              <button onClick={() => handleNavigation("login")}>Login</button>
              <button onClick={() => handleNavigation("signup")}>
                Sign Up
              </button>
            </div>
          </main>
          <footer>
            <div>Terms & Conditions | Privacy Policy</div>
          </footer>
        </div>
      )}

      {currentPage === "login" && (
        <div className="AuthPage">
          <header>
            <h1>QuickConnect</h1>
          </header>

          <main>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginInputChange}
              />
              <button onClick={() => navigate("/afterlogin")} type="submit">
                Login
              </button>
            </form>
            <div className="SwitchForm">
              <p>
                Don't have an account?{" "}
                <button onClick={() => handleNavigation("signup")}>
                  Sign up here
                </button>
              </p>
            </div>
          </main>
        </div>
      )}

      {currentPage === "signup" && (
        <div className="AuthPage">
          <header>
            <h1>QuickConnect</h1>
          </header>

          <main>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <h4>Aadhar Card (optional)</h4>
              <input
                type="file"
                name="aadharCard"
                onChange={handleFileChange}
              />
              <button type="submit">Sign Up</button>
            </form>
            <div className="SwitchForm">
              <p>
                Already have an account?{" "}
                <button onClick={() => handleNavigation("login")}>
                  Login here
                </button>
              </p>
            </div>
          </main>
        </div>
      )}
      <div className="App">
        <Routes>
          <Route path="/afterlogin" element={<AfterLogin />} />
        </Routes>
      </div>
    </div>
  );
}

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

export default App;
