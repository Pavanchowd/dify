import React, { useState, useReducer, useEffect } from "react";

import { jwtDecode } from "jwt-decode";
const AfterLogin = () => {
  const [userData, setUserData] = useState(null);
  const [appName] = useState("QuickConnect");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if the token exists and is valid
    if (!token) {
      // Redirect to login page if no token exists
    } else {
      try {
        const decoded = jwtDecode(token); // Decode the token
        setUserData(decoded); // Set user data (like name, email, etc.)

        // Optionally, handle token expiry here (e.g., using a timer)
        const expiryTime = decoded.exp * 1000; // Expiry time in milliseconds
        const currentTime = Date.now();

        if (currentTime > expiryTime) {
          // Token expired, redirect to login
          localStorage.removeItem("token");
          // Redirect to login page
        }
      } catch (error) {
        console.error("Error decoding token", error);
        localStorage.removeItem("token");
        // Redirect to login page
      }
    }
  }); // Add navigate as a dependency to avoid missing context
  <div className="AfterLoginPage">
    return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.profileIcon}>👤</div>
      </div>
      <div style={styles.card}>
        <div style={styles.icon}>💸</div>
        <p style={styles.description}></p>
        <div style={styles.buttonsContainer}>
          <button style={styles.button}>Borrower</button>
          <button style={styles.button}>Lender</button>
        </div>
      </div>
    </div>
    );
  </div>;
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  appName: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  profileIcon: {
    fontSize: "24px",
  },
  card: {
    backgroundColor: "#003b3f",
    color: "white",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
  },
  icon: {
    fontSize: "50px",
    marginBottom: "10px",
  },
  description: {
    marginBottom: "20px",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-around",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#ffcc00",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
export default AfterLogin;
