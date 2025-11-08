import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://vm.local/api",
  withCredentials: true, // works with CORS supports_credentials=True
  timeout: 10000,
});


// Interceptors for clean errors
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.description ||
      err?.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);
client.interceptors.request.use((cfg) => {
  console.log("[API]", cfg.method?.toUpperCase(), cfg.url, cfg.params || cfg.data);
  return cfg;
});

export default client;
