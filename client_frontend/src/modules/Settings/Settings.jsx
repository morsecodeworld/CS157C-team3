import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Container,
  Grid,
  Chip,
  Paper,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import ChangePassword from "./ChangePassword";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector";

const Settings = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/user/all`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error, maybe set an error state and show a message
      }
    };

    fetchUsers();
  }, []);

  const deleteProfile = async () => {
    try {
      await axiosInstance.delete(`/user/profile`);
      alert("Profile deleted successfully");
      navigate("/login");
    } catch (error) {
      console.error(
        "Failed to delete profile:",
        error.response?.data || error.message
      );
      alert("Failed to delete profile");
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {t("Change Password")}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <ChangePassword />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4, mb: 4 }} />

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              {t("User")}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              {t("Role")}
            </Typography>
          </Grid>
        </Grid>

        {users.map((user) => (
          <Grid
            container
            spacing={2}
            alignItems="center"
            component={Paper}
            elevation={0}
            sx={{ p: 1, mt: 1 }}
            key={user._id}
          >
            <Grid item xs={6}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <Stack>
                  <Typography>{user.username}</Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {user.email}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Chip
                label={user.role}
                size="small"
                color="primary"
                variant="filled"
              />
            </Grid>
          </Grid>
        ))}

        <Divider sx={{ mt: 4, mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {t("Select Language")}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <LanguageSelector />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4, mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {t("Delete Account")}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {t(
                  "Delete your account and all of your source data. This is irreversible."
                )}
              </Typography>

              <Button
                variant="outlined"
                color="error"
                onClick={handleOpenDeleteDialog}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  width: isMobile ? "100%" : "50%",
                }}
              >
                {t("Delete Account")}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={deleteProfile}
        title={t("Confirm Account Deletion")}
        message={t(
          "Are you sure you want to delete your account? This action cannot be undone."
        )}
      />
    </Box>
  );
};

export default Settings;
