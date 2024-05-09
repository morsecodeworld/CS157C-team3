import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Grid,
  Link as MuiLink,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

// const backgroundImageUrl = "invManage.gif";

// Create a validation schema using Yup
const validationSchema = yup.object({
  organizationName: yup.string().required("Organization name is required"),
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password should be of minimum 4 characters length"),
  country: yup.string().required("Country is required"),
  currency: yup.string().required("Currency is required"),
});

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      currency: "INR",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(`/user/register`, data);
      if (response.data.token) {
        console.log("Registration successful", response.data);
        reset();
        navigate("/login");
      }
    } catch (err) {
      const message = err.response?.data || "Registration failed.";
      setErrorMessage(message);
      console.error("Registration failed: ", err.response || err);
    }
  };

  return (
    <Grid
      container
      component="main"
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
          {/* Logo Image */}
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
              sx={{ textAlign: "center" }}
            >
              {t("Register")}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 3 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="organizationName"
                label={t("Organization Name")}
                name="organizationName"
                autoComplete="organizationName"
                autoFocus
                {...register("organizationName")}
                error={!!errors.organizationName}
                helperText={errors.organizationName?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label={t("Username")}
                name="username"
                autoComplete="username"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t("Email Address")}
                name="email"
                autoComplete="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t("Password")}
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="country"
                label={t("Country")}
                name="country"
                autoComplete="country"
                {...register("country")}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="currency"
                label={t("Currency")}
                name="currency"
                autoComplete="currency"
                {...register("currency")}
                error={!!errors.currency}
                helperText={errors.currency?.message}
              />

              <Box sx={{ width: "100%", mt: 2 }}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              </Box>

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

              <Box textAlign="center">
                <Link
                  to="/login"
                  variant="body2"
                  style={{ textDecoration: "none", color: "#19747E" }}
                >
                  {t("Already have an account? Login")}
                </Link>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, textAlign: "center" }}
              >
                {t("By creating an account, you agree to the")}{" "}
                <MuiLink href="#" underline="hover">
                  {t("Terms of Service")}
                </MuiLink>
                {t(
                  ". For more information about Ruralnventory's privacy practices, see the"
                )}{" "}
                <MuiLink href="#" underline="hover">
                  {t("Ruralnventory Privacy Statement")}
                </MuiLink>
                .
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Grid>

      {/* <Grid
        item
        xs={false}
        sm={6}
        md={8}
        sx={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "contain",
          backgroundPosition: "center center",
          // backgroundAttachment: "fixed",
          display: { xs: "none", sm: "block" },
        }}
      /> */}
    </Grid>
  );
}
