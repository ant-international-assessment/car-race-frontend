import React, { useState, useEffect } from "react";
import "./StartPage.css"; // Optional: use if you want custom CSS
import { useNavigate } from "react-router-dom";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const StartPage = ({ setRaceStarted, setCarList, user }) => {
  const [numCars, setNumCars] = useState(2);
  const [userCarName, setUserCarName] = useState("");
  const navigate = useNavigate();
  // Auto-fill car name from user's email
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
      const name = i === 1 ? userCarName : `Car ${i}`;
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
    navigate("/race"); // ✅ Redirect to race page
  };

  return (
    <div className="start-container">
      <div className="start-card">
        <h1 className="title">🏎️ Ready, Set, Go!</h1>

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
          <label>Your Car Name (auto from email):</label>
          <input
            type="text"
            value={userCarName}
            disabled
            className="input-field"
          />
        </div>

        <button className="start-button" onClick={startRace}>
          🚦 Start Race
        </button>
      </div>
    </div>
  );
};

export default StartPage;
