import React, { useState, useEffect } from "react";
import CategoryManagement from "./CategoryManagement";
import CategoryDialog from "./CategoryDialog";
import {
  Button,
  Box,
  Container,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import Loader from "../../components/Loader";

const CategoriesPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryForEdit, setCategoryForEdit] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Update within CategoriesPage component
  const showDeleteSuccessSnackbar = () => {
    setSnackbar({
      open: true,
      message: "Category deleted successfully",
      severity: "success",
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get(`/categories`);
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch categories",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleDialogOpen = (category = null) => {
    setCategoryForEdit(category);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const refreshCategories = () => {
    fetchCategories();
    handleDialogClose();
    setSnackbar({
      open: true,
      message: "Category updated successfully",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <Loader />;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen()}
          sx={{ mb: 2, width: matchesSM ? "100%" : "auto" }}
        >
          {t("Add New Category")}
        </Button>

        <CategoryManagement
          categories={categories}
          onEdit={handleDialogOpen}
          fetchCategories={fetchCategories}
          showDeleteSuccessSnackbar={showDeleteSuccessSnackbar}
        />

        <CategoryDialog
          open={dialogOpen}
          category={categoryForEdit}
          onClose={handleDialogClose}
          refreshCategories={refreshCategories}
        />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CategoriesPage;
