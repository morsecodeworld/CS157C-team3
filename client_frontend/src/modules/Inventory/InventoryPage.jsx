import React, { useState, useEffect } from "react";
import { Button, Box, Container, useTheme, useMediaQuery } from "@mui/material";
import InventoryManagement from "./InventoryManagement";
import AddIcon from "@mui/icons-material/Add";
import Loader from "../../components/Loader";
import InventoryDialog from "./InventoryDialog";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

const InventoryPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    description: "",
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    category: "",
    supplier: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        axiosInstance.get(`/items`),
        axiosInstance.get(`categories`),
      ]);

      setItems(itemsResponse.data.items);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => {
    setCurrentItem({
      name: "",
      description: "",
      quantity: 0,
      buyPrice: 0,
      sellPrice: 0,
      category: "",
      supplier: null,
    });
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const handleDialogClose = () => setDialogOpen(false);

  const handleInputChange = (e) =>
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });

  const handleAddOrUpdateItem = async () => {
    const url = `/items${isEditMode ? `/${currentItem._id}` : ""}`;
    const method = isEditMode ? axiosInstance.put : axiosInstance.post;

    try {
      await method(url, currentItem);
      fetchItems();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} item:`, error);
    } finally {
      setDialogOpen(false);
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setIsEditMode(true);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (itemId) => {
    try {
      await axiosInstance.delete(`/items/${itemId}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/items`);

      setItems(response.data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleDialogOpen}
          sx={{ mb: 2, width: matchesSM ? "100%" : "auto" }}
        >
          {t("Add New Item")}
        </Button>
        <InventoryManagement
          items={items}
          categories={categories}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        <InventoryDialog
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
          isEditMode={isEditMode}
          currentItem={currentItem}
          handleInputChange={handleInputChange}
          categories={categories}
          handleAddOrUpdateItem={handleAddOrUpdateItem}
        />
      </Container>
    </Box>
  );
};

export default InventoryPage;
