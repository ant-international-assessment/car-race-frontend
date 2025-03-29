import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import StartPage from "./components/StartPage";
import CarRace from "./components/CarRace";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";

function App() {
  const [user, setUser] = useState(null);
  const [carList, setCarList] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ prevent redirect too early

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token && email) {
      setUser({ email, token });
    }

    setLoading(false); // ✅ done checking localStorage
  }, []);

  if (loading) return <div>Loading...</div>; // Or a spinner/loading screen

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        <Route
          path="/start"
          element={
            user ? (
              <StartPage
                setCarList={setCarList}
                setRaceStarted={() => {}}
                user={user}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/race"
          element={
            user ? (
              <CarRace carList={carList} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={<Navigate to={user ? "/start" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
