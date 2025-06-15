import axios from "axios";

// ✅ Use correct backend base URL (NO /api here)
const api = axios.create({
  baseURL: "http://localhost:8000",
});

// ✅ Attach token to all requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
