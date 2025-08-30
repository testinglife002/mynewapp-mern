import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8800/api',
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // ✅ dynamic
  withCredentials: true,
});

export default api;