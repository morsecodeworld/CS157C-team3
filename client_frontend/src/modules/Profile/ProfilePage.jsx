import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { Snackbar } from "@mui/material";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
];

const ProfilePage = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    organizationName: "",
    country: "",
    currency: "",
  });
  const { updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/user/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateUserProfile(profile);

      // Update the message and show the snackbar
      setSnackbarMessage("Profile updated successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Show error message in the snackbar
      setSnackbarMessage("Failed to update profile.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
            <CorporateFareIcon
              fontSize="large"
              sx={{
                fontSize: 100,
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: "50%",
                padding: 2,
              }}
            />
          </Box>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="organizationName"
            label={t("Organization Name")}
            name="organizationName"
            value={profile.organization?.name}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label={t("Username")}
            name="username"
            value={profile.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("Email Address")}
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="country"
            label={t("Country")}
            name="country"
            value={profile.country}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="currency"
            label={t("Currency")}
            name="currency"
            value={profile.currency}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">{t("Role")}</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={profile.role || ""}
              label={t("Role")}
              onChange={handleChange}
              required
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              {t("Save Changes")}
            </Button>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(ProfilePage);
