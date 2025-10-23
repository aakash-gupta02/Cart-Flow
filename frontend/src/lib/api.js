import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptor for request
api.interceptors.request.use(
  (config) => {
    // You can modify the config before sending request
    // For example, if you want to add a custom header
    // config.headers["X-Custom-Header"] = "value";
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Interceptor for response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized! Redirect to login or handle refresh");
    }
    return Promise.reject(error);
  }
);

export default api;
