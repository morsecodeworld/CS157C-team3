import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token from localStorage or wherever it's stored
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    // Optionally, you can also clear the entire localStorage if it doesn't store other necessary data
    // localStorage.clear();

    // Redirect to the login page
    navigate("/login");
  }, [navigate]); // Empty dependency array means this runs once on mount

  // Optionally, provide feedback or a loading spinner while the logout process completes
  return <div>Logging out...</div>;
};

export default Logout;
