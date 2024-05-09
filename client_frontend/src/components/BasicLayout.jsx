// components/BasicLayout.js
import React from "react";
import { Box } from "@mui/material";
import { Copyright } from "./CopyRight";

const BasicLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {children}
      <Copyright />
    </Box>
  );
};

export default BasicLayout;
