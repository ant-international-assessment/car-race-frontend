// utils/api.js

import { JSEncrypt } from "jsencrypt";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://ant-international-assessment-632916040300.asia-southeast1.run.app";

export const fetchPublicKey = async () => {
  const res = await fetch(`${API_BASE}/api/public-key`);
  return res.text();
};

const encryptPayload = async (payload) => {
  const publicKey = await fetchPublicKey();
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  const encrypted = encryptor.encrypt(JSON.stringify(payload));
  return encrypted;
};

export const decryptRequestBody = (encryptedBody, privateKey) => {
  const decryptor = new JSEncrypt();
  decryptor.setPrivateKey(privateKey);
  const decrypted = decryptor.decrypt(encryptedBody);
  return JSON.parse(decrypted);
};

export const startRaceAPI = async (cars) => {
  //   const encrypted = await encryptPayload({ cars });
  //   console.log("startRaceAPI", encrypted);
  const res = await fetch(`${API_BASE}/api/start-race`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cars }),
  });
  return res;
};

export const loginAPI = async (email, password) => {
  const encrypted = await encryptPayload({ email, password });
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ encrypted }),
  });
  return res;
};

export const signupAPI = async (email, password) => {
  const encrypted = await encryptPayload({ email, password });
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ encrypted }),
  });
  return res;
};

export const fetchLeaderboardAPI = async () => {
  const res = await fetch(`${API_BASE}/api/leaderboard`);
  return res.json();
};
