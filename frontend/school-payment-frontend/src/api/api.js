import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://school-payment-yinu.onrender.com/api",
});

// Add JWT token if saved in localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
