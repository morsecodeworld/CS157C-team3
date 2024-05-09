// LayoutWrapper.js
import React from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import BasicLayout from "./BasicLayout";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const noDashboardLayoutPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/password-reset",
  ];

  const shouldUseBasicLayout = noDashboardLayoutPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (shouldUseBasicLayout) {
    return <BasicLayout>{children}</BasicLayout>;
  } else {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
};

export default LayoutWrapper;
