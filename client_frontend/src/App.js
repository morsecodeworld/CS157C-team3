// App.js
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LayoutWrapper from "./components/LayoutWrapper";
import theme from "./theme";
import Loader from "./components/Loader";
import { AuthProvider } from "./context/AuthContext";
import "./i18n";

// Lazy load the modules
const Login = lazy(() => import("./modules/Auth/Login"));
const Register = lazy(() => import("./modules/Auth/Register"));
const Dashboard = lazy(() => import("./modules/Dashboard/Dashboard"));
const InventoryPage = lazy(() => import("./modules/Inventory/InventoryPage"));
const ProfilePage = lazy(() => import("./modules/Profile/ProfilePage"));
const Settings = lazy(() => import("./modules/Settings/Settings"));
const CategoriesPage = lazy(() =>
  import("./modules/Categories/CategoriesPage")
);
const OrdersPage = lazy(() => import("./modules/Orders/OrdersPage"));
const OrderDetailsPage = lazy(() =>
  import("./modules/Orders/OrderDetailsPage")
);
const Logout = lazy(() => import("./modules/Auth/Logout"));
const ForgotPassword = lazy(() => import("./modules/Auth/ForgotPassword"));
const PasswordReset = lazy(() => import("./modules/Auth/PasswordReset"));

const defaultTheme = createTheme(theme);

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Router>
          <LayoutWrapper>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/password-reset/:token"
                  element={<PasswordReset />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route
                  path="*"
                  element={<Navigate replace to="/dashboard" />}
                />
              </Routes>
            </Suspense>
          </LayoutWrapper>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
