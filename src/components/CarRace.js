import React, { useEffect, useState } from "react";
import "./CarRace.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const socketUrl = "http://localhost:8080/race-ws";

const CarRace = ({ carList }) => {
  const [cars, setCars] = useState({});
  const [finishOrder, setFinishOrder] = useState([]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: () => {
        client.subscribe("/topic/car-progress", (message) => {
          const car = JSON.parse(message.body);

          setCars((prevCars) => {
            const updatedCars = { ...prevCars, [car.id]: car };
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
    return () => client.deactivate();
  }, []);

  // Gửi kết quả khi tất cả xe đã hoàn thành
  useEffect(() => {
    if (finishOrder.length === carList.length) {
      const rankingNames = finishOrder.map((car) => car.name);
      fetch("http://localhost:8080/api/update-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rankingNames),
      });
    }
  }, [finishOrder, carList]);

  return (
    <div className="container">
      <h2>🚦 Race in Progress</h2>

      <div className="ranking-board">
        <h4>🏆 Ranking</h4>
        <ol>
          {finishOrder.map((car, index) => (
            <li key={car.id}>
              {car.name} {index === 0 && "🥇"}
            </li>
          ))}
        </ol>
      </div>

      <div className="race-track">
        {carList.map((car) => (
          <div className="car-wrapper" key={car.id}>
            <div className="track">
              <div
                className={`car ${
                  cars[car.id]?.status === "FINISHED" ? "finished" : ""
                }`}
                style={{
                  left: `calc(${(cars[car.id]?.position || 0) / 10}% - 18px)`,
                }}
              >
                <img src="/sport-car.png" alt={car.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarRace;
