import React, { useState } from "react";

const StartPage = ({ setRaceStarted, setCarList }) => {
  const [numCars, setNumCars] = useState(2);
  const [userCarName, setUserCarName] = useState("");

  const handleNumChange = (e) => {
    const count = Math.max(2, Math.min(10, Number(e.target.value)));
    setNumCars(count);
  };

  const startRace = async () => {
    const cars = [];

    for (let i = 1; i <= numCars; i++) {
      const name = i === 1 ? userCarName.trim() || "Car 1" : `Car ${i}`;
      cars.push({ id: i, name });
    }

    await fetch("http://localhost:8080/api/start-race", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cars }),
    });

    setCarList(cars);
    setRaceStarted(true);
  };

  return (
    <div className="container">
      <h2>🏁 Setup Your Race</h2>
      <label>Number of Cars (2–10):</label>
      <input
        type="number"
        min="2"
        max="10"
        value={numCars}
        onChange={handleNumChange}
      />

      <div style={{ marginTop: "10px" }}>
        <label>Your Car Name:</label>
        <input
          type="text"
          placeholder="e.g. Lightning"
          value={userCarName}
          onChange={(e) => setUserCarName(e.target.value)}
        />
      </div>

      <button className="start-button" onClick={startRace}>
        Start Race
      </button>
    </div>
  );
};

export default StartPage;
