import React, { useState, useEffect } from "react";
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
  const [user, setUser] = useState(null); // This will be updated on login
  const [carList, setCarList] = useState([]);

  // Load user from localStorage if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Public routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        {/* ✅ Protected routes */}
        <Route
          path="/start"
          element={
            user ? (
              <StartPage
                user={user}
                setCarList={setCarList}
                setRaceStarted={() => {}}
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

        {/* ✅ Default fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? "/start" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
