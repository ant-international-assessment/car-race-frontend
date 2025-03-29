import React, { useState } from "react";
import StartPage from "./components/StartPage";
import CarRace from "./components/CarRace";

function App() {
  const [raceStarted, setRaceStarted] = useState(false);
  const [carList, setCarList] = useState([]);

  return (
    <div className="App">
      {!raceStarted ? (
        <StartPage setRaceStarted={setRaceStarted} setCarList={setCarList} />
      ) : (
        <CarRace carList={carList} />
      )}
    </div>
  );
}

export default App;
