// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return response if successful
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marking request as retried
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/user/refresh-token`,
          {
            token: localStorage.getItem("refreshToken"),
          }
        );

        localStorage.setItem("token", response.data.token);
        // Fix the Authorization header on the original request
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        // Retry the original request with new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle case where refresh also fails (e.g., refresh token is invalid)
        console.error("Refresh token invalid", refreshError);
        // Consider redirecting the user to login or handling logout
        return Promise.reject(refreshError);
      }
    }
    // Return any other errors not related to token expiration
    return Promise.reject(error);
  }
);

export default axiosInstance;
