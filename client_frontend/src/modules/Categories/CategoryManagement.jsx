import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

const CategoryManagement = ({
  categories,
  onEdit,
  fetchCategories,
  showDeleteSuccessSnackbar,
}) => {
  const { t } = useTranslation();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await axiosInstance.delete(`/categories/${categoryToDelete._id}`);
      fetchCategories();
      showDeleteSuccessSnackbar();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    handleCloseDeleteDialog();
  };

  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoryToDelete(null);
  };

  return (
    <Paper elevation={2} sx={{ mt: 2 }}>
      {categories.length > 0 ? (
        <List>
          {categories.map((category) => (
            <ListItem key={category._id} divider>
              <ListItemText
                primary={category.name}
                secondary={category.description}
              />
              <ListItemSecondaryAction>
                <Tooltip title={t("Edit")} placement="bottom">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => onEdit(category)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("Delete")} placement="bottom">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDeleteDialog(category)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="subtitle1" sx={{ p: 2, textAlign: "center" }}>
          {t("No categories found.")}
        </Typography>
      )}

      {/* Confirmation Dialog for Deleting a Category */}
      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteCategory}
        title={t("Confirm Deletion")}
        message={t(
          `Are you sure you want to delete this category: ${categoryToDelete?.name}?`
        )}
      />
    </Paper>
  );
};

export default CategoryManagement;
