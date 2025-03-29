import React, { useEffect, useState, useRef } from "react";
import "./CarRace.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const socketUrl = API_BASE + "/race-ws";

const CarRace = ({ carList, resetToStart }) => {
  const [cars, setCars] = useState({});
  const [finishOrder, setFinishOrder] = useState([]);
  const clientRef = useRef(null);
  const [racePhase, setRacePhase] = useState("init");
  const [liveRanking, setLiveRanking] = useState([]);
  const carsRef = useRef({});

  const startRace = async () => {
    setRacePhase("init"); // reset phase before race starts
    setCars({});
    setFinishOrder([]);

    await fetch(API_BASE + `/api/start-race`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cars: carList }),
    });

    setRacePhase("racing"); // enable animation again
  };

  // Run once on mount to start the initial race
  useEffect(() => {
    startRace();
  }, []);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: () => {
        client.subscribe("/topic/car-progress", (message) => {
          const car = JSON.parse(message.body);

          setCars((prevCars) => {
            const updatedCars = {
              ...prevCars,
              [car.id]: car,
            };
            carsRef.current = updatedCars; // 👈 keep the ref updated
            return updatedCars;
          });

          setFinishOrder((prevOrder) => {
            if (
              car.status === "FINISHED" &&
              !prevOrder.find((item) => item.id === car.id)
            ) {
              return [...prevOrder, { id: car.id, name: car.name }];
            }
            return prevOrder;
          });
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, []);

  useEffect(() => {
    if (finishOrder.length === carList.length) {
      const rankingNames = finishOrder.map((car) => car.name);

      // 👇 Freeze the ranking so real-time updates stop
      setLiveRanking(finishOrder);

      fetch(API_BASE + "/api/update-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rankingNames),
      });
    }
  }, [finishOrder, carList]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (finishOrder.length === carList.length) return; // 👈 don't update after finished

      const rankedCars = Object.values(carsRef.current)
        .filter((c) => c.status === "RUNNING" || c.status === "FINISHED")
        .sort((a, b) => b.position - a.position);

      setLiveRanking(rankedCars);
    }, 100);

    return () => clearInterval(interval);
  }, [finishOrder.length, carList.length]);

  return (
    <div className="container">
      <h2>🚦 Race in Progress</h2>

      <div className="ranking-board">
        <h3 className="ranking-title">🏁 Race Results</h3>
        <ul className="ranking-list">
          {liveRanking.map((car, index) => {
            const medal =
              index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";

            return (
              <li key={car.id} className="ranking-item">
                <span className="ranking-position">{index + 1}</span>
                <span className="ranking-name">{car.name}</span>
                <span className="ranking-medal">{medal}</span>
              </li>
            );
          })}
        </ul>

        {finishOrder.length === carList.length && (
          <>
            <button className="re-race-button" onClick={startRace}>
              🔁 Re-Race
            </button>
            <button className="back-button" onClick={resetToStart}>
              🔙 Back to Start Page
            </button>
          </>
        )}
      </div>

      <div className="race-track">
        {carList.map((car) => (
          <div className="car-wrapper" key={car.id}>
            <div className="track">
              <div
                className={`car ${
                  cars[car.id]?.status === "FINISHED" ? "finished" : ""
                } ${racePhase !== "racing" ? "no-transition" : ""}`}
                style={{
                  left: `calc(${(cars[car.id]?.position || 0) / 10}% - 18px)`,
                }}
              >
                <img
                  src={
                    carList.find((c) => c.id === car.id)?.isUser
                      ? "/racing-car (1).png"
                      : "/racing-car (0).png"
                  }
                  alt={car.name}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarRace;
