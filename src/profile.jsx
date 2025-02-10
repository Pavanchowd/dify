import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ userId }) => {
  const [userType, setUserType] = useState(""); // Will hold the user's type (Money Lender or Consumer)
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch user details if needed, and set initial userType
    // This could be fetching from localStorage or from an API
    // Example:
    // setUserType(currentUser.userType);
  }, []);

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleUpdateProfile = async () => {
    if (!userType) {
      setMessage("Please select a user type (Money Lender or Consumer).");
      return;
    }

    try {
      // Send the selected user type to the backend
      const response = await axios.put("http://localhost:5000/updateProfile", {
        userId,
        userType,
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="ProfilePage">
      <header>
        <h1>User Profile</h1>
      </header>
      <main>
        <h2>Choose your role</h2>
        <div>
          <label>
            <input
              type="radio"
              value="Money Lender"
              checked={userType === "Money Lender"}
              onChange={handleUserTypeChange}
            />
            Money Lender
          </label>
          <label>
            <input
              type="radio"
              value="Consumer"
              checked={userType === "Consumer"}
              onChange={handleUserTypeChange}
            />
            Consumer
          </label>
        </div>
        <button onClick={handleUpdateProfile}>Update Profile</button>
        {message && <p>{message}</p>}
      </main>
    </div>
  );
};

export default Profile;
