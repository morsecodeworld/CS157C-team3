import React from "react";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";

export const StatusChip = ({ status, type }) => {
  const { t } = useTranslation();

  let color = "default";

  // Define color based on status and type
  if (status === "pending") {
    color = "warning";
  } else if (
    (status === "completed" && type === "order") ||
    (status === "paid" && type === "payment")
  ) {
    color = "success";
  } else if (status === "cancelled" && type === "order") {
    color = "default"; // Grey is the default color
  } else if (status === "failed" && type === "payment") {
    color = "error"; // Red color for error
  }

  // Capitalize the first letter of the status
  const formattedStatus = t(status.charAt(0).toUpperCase() + status.slice(1));

  return <Chip label={formattedStatus} color={color} size="small" />;
};
