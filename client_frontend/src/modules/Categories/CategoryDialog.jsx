import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

// Validation schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
});

const CategoryDialog = ({ open, category, onClose, refreshCategories }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (category) {
      reset(category);
    } else {
      reset({ name: "", description: "" });
    }
  }, [category, reset]);

  const onSubmit = async (data) => {
    try {
      if (category) {
        // Edit category
        await axiosInstance.put(`/categories/${category._id}`, data);
      } else {
        // Add new category
        await axiosInstance.post(`/categories`, data);
      }
      refreshCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="form-dialog-title">
          {category ? t("Edit Category") : t("Add New Category")}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            name="name"
            label={t("Category Name")}
            type="text"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label={t("Description")}
            type="text"
            fullWidth
            multiline
            rows={4}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("Cancel")}</Button>
          <Button type="submit" variant="contained">
            {category ? t("Save Changes") : t("Add")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryDialog;
