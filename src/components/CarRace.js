import React, { useEffect, useState, useRef } from "react";
import "./CarRace.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import { startRaceAPI } from "../utils/api";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://ant-international-assessment-632916040300.asia-southeast1.run.app";
const socketUrl = API_BASE + "/race-ws";

const CarRace = ({ carList }) => {
  const [cars, setCars] = useState({});
  const [finishOrder, setFinishOrder] = useState([]);
  const [racePhase, setRacePhase] = useState("init");
  const [liveRanking, setLiveRanking] = useState([]);
  const clientRef = useRef(null);
  const carsRef = useRef({});
  const navigate = useNavigate();

  const calculateScore = (position) => Math.max(100 - position * 10, 0);

  const startRace = async () => {
    setRacePhase("init");
    setCars({});
    setFinishOrder([]);

    await startRaceAPI(carList);

    setRacePhase("racing");
  };

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: async () => {
        client.subscribe("/topic/car-progress", (message) => {
          const car = JSON.parse(message.body);

          setCars((prevCars) => {
            const updatedCars = { ...prevCars, [car.id]: car };
            carsRef.current = updatedCars;
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

        // setRacePhase("init");
        // setCars({});
        // setFinishOrder([]);

        // await fetch(API_BASE + `/api/start-race`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ cars: carList }),
        // });

        // setRacePhase("racing");
      },
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, []);

  useEffect(() => {
    if (finishOrder.length === carList.length) {
      setLiveRanking(finishOrder);
    }
  }, [finishOrder, carList]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (finishOrder.length === carList.length) return;

      const rankedCars = Object.values(carsRef.current)
        .filter((c) => c.status === "RUNNING" || c.status === "FINISHED")
        .sort((a, b) => b.position - a.position);

      setLiveRanking(rankedCars);
    }, 100);

    return () => clearInterval(interval);
  }, [finishOrder.length, carList.length]);

  const userCar = carList.find((car) => car.isUser);
  const userIndex = finishOrder.findIndex((car) => car.name === userCar?.name);
  const earnedScore = userIndex >= 0 ? calculateScore(userIndex) : 0;

  return (
    <div className="container">
      <h2>🚦 Race in Progress</h2>

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
                <div className="car-label">{car.name}</div>

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
      <div className="ranking-board">
        <h3 className="ranking-title">🏁 Race Results</h3>
        <ul className="ranking-list">
          {liveRanking.map((car, index) => {
            const medal =
              index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
            const score = calculateScore(index);

            return (
              <li key={car.id} className="ranking-item">
                <span className="ranking-position">{index + 1}</span>
                <span className="ranking-name">
                  {car.name}
                  {carList.find((c) => c.name === car.name)?.isUser && " 👤"}
                </span>
                <span className="ranking-score">+{score}</span>
                <span className="ranking-medal">{medal}</span>
              </li>
            );
          })}
        </ul>

        {finishOrder.length === carList.length && (
          <>
            <p className="score-earned">
              You earned: <strong>{earnedScore}</strong> points
            </p>
            <button className="re-race-button" onClick={startRace}>
              Re-Race
            </button>
            <button className="back-button" onClick={() => navigate("/start")}>
              Back to Start Page
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CarRace;
