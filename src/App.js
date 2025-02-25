import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Import the CSS file

function App() {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      {/* Logo at the top right corner */}
      <div className="logo">CSC</div>

      {/* Main content */}
      <h1>CSC Leaderboard</h1>
      <p className="description">
        Community Service Club (CSC) is dedicated to making a positive impact
        through volunteer work, fundraising events, and helping those in need.
        Our mission is to foster a spirit of service, encourage teamwork, and
        create meaningful change in our community. Join us in making a
        difference!
      </p>
      <div className="button-container">
        <button className="landing-button" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="landing-button" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}

export default App;