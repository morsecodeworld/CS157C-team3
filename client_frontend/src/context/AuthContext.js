import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await axiosInstance.post(`/user/login`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    setCurrentUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    // Redirect user to login page
    window.location.href = "/login";
  };

  const refreshToken = useCallback(async () => {
    try {
      const response = await axiosInstance.post(`/user/refresh-token`, {
        token: localStorage.getItem("refreshToken"),
      });
      localStorage.setItem("token", response.data.token);
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
      return false;
    }
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        const _refreshToken = localStorage.getItem("refreshToken");

        let isTokenValid = false;

        if (token) {
          const decoded = jwtDecode(token);
          isTokenValid = decoded.exp * 1000 > Date.now();
        }

        if (!isTokenValid && _refreshToken) {
          const refreshed = await refreshToken();
          if (!refreshed) {
            setLoading(false);
            return;
          }
        }

        if (isTokenValid || _refreshToken) {
          const response = await axiosInstance.get(`/user/profile`);
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error("Authentication check failed", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [refreshToken]);

  // Function to update user profile, including role
  const updateUserProfile = async (updatedProfile) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Assuming you have an endpoint to update user profile
      const response = await axiosInstance.patch(
        `/user/profile`,
        updatedProfile
      );

      // Update currentUser state with the updated user information
      setCurrentUser(response.data);

      return response.data;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    updateUserProfile,
    login,
    logout,
    refreshToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
