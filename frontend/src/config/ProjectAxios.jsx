import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // important if using cookies
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


