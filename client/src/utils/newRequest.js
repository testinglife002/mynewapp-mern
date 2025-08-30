  
import axios from "axios";

const newRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // ✅ dynamic
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

