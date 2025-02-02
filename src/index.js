import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Modal from "./Modal";
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

  const [formData, dispatch] = useReducer(formReducer, initialState);
  const [currentPage, setCurrentPage] = useState("home"); // "home", "login", "signup"
  const [activeUserType, setActiveUserType] = useState("Borrower"); // "Borrower" or "Lender"
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
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
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/signup",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage("Account created successfully!");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setCurrentPage("login");
      }, 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        loginData
      );

      if (response.data.success) {
        setIsLoggedIn(true);
        setMessage("Login successful");
      } else {
        setMessage("Invalid email or password");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleUserTypeToggle = (type) => {
    setActiveUserType(type);
  };

  return (
    <div className="App">
      {showModal && <Modal message={message} closeModal={closeModal} />}

      {currentPage === "home" && (
        <div className="HomePage">
          <header>
            <h1>QuickConnect</h1>
            <nav>
              <button onClick={() => handleNavigation("login")}>
                Be a Money Lender
              </button>
              <button onClick={() => handleNavigation("signup")}>
                Find Money Lenders
              </button>
            </nav>
          </header>
          <main>
            <h2>Connecting Moneylenders and Consumers Effortlessly!</h2>
            <p>
              QuickConnect bridges the gap between moneylenders and consumers,
              simplifying borrowing and lending. Join us today!
            </p>
          </main>
          <footer>
            <div>Terms & Conditions | Privacy Policy</div>
          </footer>
        </div>
      )}

      {currentPage === "login" && (
        <div className="LoginPage">
          <h2>Login</h2>
          <div className="UserTypeToggle">
            <button
              className={activeUserType === "Borrower" ? "active" : ""}
              onClick={() => handleUserTypeToggle("Borrower")}
            >
              Borrower
            </button>
            <button
              className={activeUserType === "Lender" ? "active" : ""}
              onClick={() => handleUserTypeToggle("Lender")}
            >
              Lender
            </button>
          </div>
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
            <button type="submit">Login</button>
          </form>
          {isLoggedIn && <p>Welcome! You are logged in.</p>}
          {!isLoggedIn && message && <p>{message}</p>}
        </div>
      )}

      {currentPage === "signup" && (
        <div className="SignupPage">
          <h2>Sign Up</h2>
          <div className="UserTypeToggle">
            <button
              className={activeUserType === "Borrower" ? "active" : ""}
              onClick={() => handleUserTypeToggle("Borrower")}
            >
              Borrower
            </button>
            <button
              className={activeUserType === "Lender" ? "active" : ""}
              onClick={() => handleUserTypeToggle("Lender")}
            >
              Lender
            </button>
          </div>
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
            <input type="file" name="aadharCard" onChange={handleFileChange} />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      )}
    </div>
  );
}
export default App;
