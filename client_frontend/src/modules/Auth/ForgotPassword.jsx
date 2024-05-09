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
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const validationSchema = yup.object({
    email: yup.string().required(t("Email is required")),
  });

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
    const { email } = data;

    try {
      const response = await axiosInstance.post("/user/forgot-password", {
        email,
      });
      console.log(response);
      setMessage(response.data);
      reset(); // Reset the form fields
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
              {t("Forgot Password")}
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
                id="email"
                label={t("Email")}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                {t("Submit")}
              </Button>

              {errors && errors.general && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {errors.general.message}
                </Alert>
              )}

              <Box textAlign="center" sx={{ mt: 2 }}>
                <Link
                  to="/login"
                  variant="body2"
                  style={{ textDecoration: "none", color: "#19747E" }}
                >
                  {t("Remember my password? Login here")}
                </Link>
              </Box>

              {message && (
                <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                  {message}
                </Alert>
              )}
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
