// utils/api.js

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const startRaceAPI = async (cars) => {
  const res = await fetch(`${API_BASE}/api/start-race`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cars }),
  });
  return res;
};

export const loginAPI = async (email, password) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
};

export const signupAPI = async (email, password) => {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
};

export const fetchLeaderboardAPI = async () => {
  const res = await fetch(`${API_BASE}/api/leaderboard`);
  return res.json();
};

export const fetchPublicKey = async () => {
  const res = await fetch(`${API_BASE}/api/public-key`);
  return res.text();
};
