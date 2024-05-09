import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

export default function ChangePassword() {
  const { t } = useTranslation();
  // Validation schema
  const schema = yup
    .object({
      oldPassword: yup.string().required(t("Old password is required")),
      newPassword: yup
        .string()
        .required(t("New password is required"))
        .min(6, t("Password must be at least 6 characters long")),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], t("Passwords must match"))
        .required(t("Confirm password is required")),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(`/user/change-password`, data);

      setSnackbarMessage("Password changed successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      reset();
    } catch (error) {
      console.error(
        "Failed to change password:",
        error.response?.data || error.message
      );
      setSnackbarMessage("Failed to change password");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          name="oldPassword"
          label={t("Old Password")}
          type="password"
          id="oldPassword"
          autoComplete="current-password"
          {...register("oldPassword")}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label={t("New Password")}
          type="password"
          id="newPassword"
          autoComplete="new-password"
          {...register("newPassword")}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label={t("Confirm New Password")}
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {t("Change Password")}
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
