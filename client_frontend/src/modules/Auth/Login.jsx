import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

// Background image URL
//const backgroundImageUrl = "invManage.gif";

// Create a validation schema using Yup
const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    const email = data.email;
    const password = data.password;
    try {
      setLoading(true);
      await login(email, password);
      setLoading(false);
      navigate("/profile");
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
          display: { xs: "none", sm: "block" },
        }}
      /> */}
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
              sx={{
                textAlign: "center",
              }}
            >
              {t("LOGIN")}
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
                label={t("Email Address")}
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
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  // This is where the toggle button is added
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: theme.palette.primary.light }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Link
                  to="/forgot-password"
                  variant="body2"
                  style={{ textDecoration: "none", color: "#19747E" }}
                >
                  {t("Forgot password?")}
                </Link>
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
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("Submit")
                )}
              </Button>

              {errors && errors.general && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {errors.general.message}
                </Alert>
              )}

              <Box textAlign="center" sx={{ mt: 2 }}>
                <Link
                  to="/register"
                  variant="body2"
                  style={{ textDecoration: "none", color: "#19747E" }}
                >
                  {t("Don't have an account? Register here")}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}
