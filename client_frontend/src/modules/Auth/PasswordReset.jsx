import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Paper,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const validationSchema = yup.object({
  password: yup.string().required("Password is required"),
  confirmPassword: yup.string().required("Confirm password is required"),
});

const PasswordReset = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const { password } = data;

    try {
      // Send the request to the backend to reset the password
      const response = await axiosInstance.post("/user/reset-password", {
        token,
        password,
      });
      setMessage(response.data);
      reset();
    } catch (error) {
      setError("general", {
        type: "manual",
        message: error.response.data,
      });
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh" }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} sm={6} md={4} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={"icon.png"}
            alt="Ruralnventory_logo"
            sx={{
              width: "80%",
              height: "auto",
              marginBottom: 2,
              borderRadius: 1,
            }}
          />
          <Paper
            elevation={6}
            sx={{
              backgroundColor: "#D1E8E2",
              padding: 4,
              display: "flex",
              flexDirection: "column",
              borderRadius: 1,
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                textAlign: "center",
              }}
            >
              {t("Reset Password")}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                type="password"
                label={t("Password")}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                name="confirmPassword"
                label={t("Confirm Password")}
                id="confirmPassword"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#4CAF50",
                  "&:hover": { backgroundColor: "#388E3C" },
                }}
              >
                {t("Reset Password")}
              </Button>

              {errors && errors.general && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {errors.general.message}
                </Alert>
              )}

              {message && <Typography>{message}</Typography>}
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PasswordReset;
