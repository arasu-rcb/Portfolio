import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 15000,
});

// Request interceptor to attach JWT Token if it exists in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
