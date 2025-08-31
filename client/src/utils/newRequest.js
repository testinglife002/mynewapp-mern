 // newRequest.js 
// src/utils/newRequest.js
import axios from "axios";

// ✅ Prefer VITE_BACKEND_URL in production, fallback to local in dev
const API_URL =
  import.meta.env.VITE_BACKEND_URL?.trim() ||
  "http://localhost:8800/api";

// Create axios instance
const newRequest = axios.create({
  // baseURL: API_URL,
  baseURL: "http://localhost:8800/api",
  withCredentials: true, // important if using cookies
});

// ✅ Load token from sessionStorage on init (in case of page refresh)
const token = sessionStorage.getItem("accessToken");
if (token) {
  newRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ✅ Utility: set token after login
export const setToken = (token) => {
  if (token) {
    sessionStorage.setItem("accessToken", token);
    newRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// ✅ Utility: clear token on logout
export const clearToken = () => {
  sessionStorage.removeItem("accessToken");
  delete newRequest.defaults.headers.common["Authorization"];
};

export default newRequest;







/*
const API_URL =
  import.meta.env.VITE_BACKEND_URL 
  || 
  "http://localhost:8800/api"; // fallback for dev

const newRequest = axios.create({
   baseURL: API_URL,
  withCredentials: true, // if using cookies/jwt
});

// Set Authorization header from sessionStorage
export const setToken = (token) => {
  newRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Remove token (on logout)
export const clearToken = () => {
  delete newRequest.defaults.headers.common["Authorization"];
};

export default newRequest;
*/

/* === xxx === */


/*
// ✅ Vite injects this at build time
const isProd = import.meta.env.PROD;

// ✅ API base URL: use .env value in production, localhost in dev
const API_URL = isProd
  ? import.meta.env.VITE_BACKEND_URL + "/api"
  : "http://localhost:8800/api";

const newRequest = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ ensures cookies (accessToken) are sent
});

// ❌ no Authorization header, cookies handle auth
export default newRequest;
*/

/* 
import axios from "axios";

// Detect if running locally or in production (Vercel)
// ✅ This comes from Vite automatically
const isProd = import.meta.env.PROD;

// API base URL
const API_URL = isProd
  ? import.meta.env.VITE_BACKEND_URL // ✅ set this in Vercel → Environment Variables
  : "http://localhost:8800/api"; // ✅ local backend

const newRequest = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ send cookies with every request
});

// ❌ remove Authorization header interceptor
// because backend uses cookies only
export default newRequest;
*/

/*
const newRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // ✅ dynamic
  withCredentials: true, // optional if using cookies
});
*/

/*
newRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/

/*
import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true, // optional if using cookies
});

newRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default newRequest;
*/

