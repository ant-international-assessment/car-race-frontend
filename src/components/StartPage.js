import React, { useState, useEffect } from "react";
import "./StartPage.css";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const StartPage = ({ setRaceStarted, setCarList, user }) => {
  const [numCars, setNumCars] = useState(2);
  const [userCarName, setUserCarName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      const nameFromEmail = user.email.split("@")[0];
      setUserCarName(nameFromEmail);
    }
  }, [user]);

  const handleNumChange = (e) => {
    const count = Math.max(2, Math.min(10, Number(e.target.value)));
    setNumCars(count);
  };

  const startRace = async () => {
    const cars = [];

    for (let i = 1; i <= numCars; i++) {
      const name = i === 1 ? userCarName : `Car No.${i}`;
      cars.push({
        id: i,
        name,
        isUser: i === 1,
        username: i === 1 ? userCarName : "",
      });
    }

    console.log("Car list:", cars);

    await fetch(API_BASE + "/api/start-race", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cars }),
    });

    setCarList(cars);
    navigate("/race");
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard`);
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <div className="start-page-content">
      <div className="start-card">
        <h1 className="title">Ready, Set, Go!</h1>

        <div className="form-group">
          <label>Number of Cars (2–10):</label>
          <input
            type="number"
            min="2"
            max="10"
            value={numCars}
            onChange={handleNumChange}
            className="input-field"
          />
        </div>

        <div className="form-group" style={{ marginTop: "10px" }}>
          <label>Your Car Name:</label>
          <input
            type="text"
            value={userCarName}
            disabled
            className="input-field"
          />
        </div>

        <button className="start-button" onClick={startRace}>
          Start Race
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="leaderboard-card">
        <h3 className="leaderboard-title">🏆 Leaderboard</h3>
        <ul className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <li key={user.userId} className="leaderboard-item">
              <span className="rank">{index + 1}.</span>
              <span className="user-id">{user.userId}</span>
              <span className="score">{user.totalScore} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StartPage;
