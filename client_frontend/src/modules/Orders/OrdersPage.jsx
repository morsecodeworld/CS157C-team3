import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import OrdersTable from "./OrdersTable";
import OrderDialog from "./OrderDialog";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import Filters from "./Filters";
import { Collapse, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import Loader from "../../components/Loader";

const OrdersPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [orders, setOrders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({
    customerName: "",
    contactNo: "",
    customerAddress: "",
    items: [],
    status: t("pending"),
    paymentStatus: t("pending"),
  });
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const itemsPerPage = 6;

  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          ...(filterStatus && { status: filterStatus }),
          ...(filterPaymentStatus && { paymentStatus: filterPaymentStatus }),
          ...(startDate && endDate && { startDate, endDate }),
        },
      };

      const response = await axiosInstance.get(`/orders`, config);
      setLoading(false);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [currentPage, filterStatus, filterPaymentStatus, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchAvailableItems();
  }, []);

  const fetchAvailableItems = async () => {
    try {
      const response = await axiosInstance.get(`/items`);

      setAvailableItems(response.data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setIsEditMode(false);
    setError("");
  };

  const handleAddOrUpdateOrder = async () => {
    setError("");

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(
          `/orders/${currentOrder._id}`,
          currentOrder
        );
      } else {
        response = await axiosInstance.post(`/orders`, currentOrder);
      }
      console.log("Order operation successful", response.data);
      fetchOrders();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error in order operation:", error);
      setError(
        error.response && error.response.data.error
          ? error.response.data.error
          : "Failed to perform the operation. Please try again."
      );
    }

    if (!error) {
      setIsEditMode(false);
      setCurrentOrder({
        customerName: "",
        items: [],
        status: t("pending"),
        paymentStatus: t("pending"),
      });
    }
  };

  const handleEditClick = (event, order) => {
    event.stopPropagation();
    setCurrentOrder(order);
    setIsEditMode(true);
    setDialogOpen(true);
  };

  // New function to open delete confirmation dialog
  const handleDeleteDialogOpen = (event, orderId) => {
    event.stopPropagation();
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  // Function to close delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  // Function to delete order
  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        await axiosInstance.delete(`/orders/${orderToDelete}`);
        fetchOrders(); // Refresh orders after deletion
        handleDeleteDialogClose(); // Close the dialog
      } catch (error) {
        console.error("Error deleting order:", error);
        // Optionally, display an error message to the user
      }
    }
  };

  const resetFilters = () => {
    // Reset all filter states to their initial values
    setFilterStatus("");
    setFilterPaymentStatus("");
    setStartDate("");
    setEndDate("");

    // Optionally, reset pagination to the first page
    setCurrentPage(1);
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
        {matchesSM && (
          <>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              onClick={handleDialogOpen}
              sx={{ mb: 2, width: "100%" }}
            >
              {t("Add New Order")}
            </Button>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Typography>
                {filtersOpen ? t("Hide Filters") : t("Show Filters")}
              </Typography>
              <IconButton
                onClick={() => setFiltersOpen(!filtersOpen)}
                aria-expanded={filtersOpen}
                aria-label="show filters"
              >
                <FilterListIcon />
              </IconButton>
            </Stack>
          </>
        )}
        {!matchesSM && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              onClick={handleDialogOpen}
              sx={{ mb: 2, width: "auto" }}
            >
              {t("Add New Order")}
            </Button>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Typography>
                {filtersOpen ? t("Hide Filters") : t("Show Filters")}
              </Typography>
              <IconButton
                onClick={() => setFiltersOpen(!filtersOpen)}
                aria-expanded={filtersOpen}
                aria-label="show filters"
              >
                <FilterListIcon />
              </IconButton>
            </Stack>
          </Box>
        )}

        <Collapse in={filtersOpen}>
          <Filters
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPaymentStatus={filterPaymentStatus}
            setFilterPaymentStatus={setFilterPaymentStatus}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            resetFilters={resetFilters}
          />
        </Collapse>

        {/* Add or Edit Order Dialog */}
        <OrderDialog
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          handleAddOrUpdateOrder={handleAddOrUpdateOrder}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          availableItems={availableItems}
          error={error}
        />

        {/* Order Table */}
        <OrdersTable
          orders={orders}
          handleEditClick={handleEditClick}
          handleDeleteDialogOpen={handleDeleteDialogOpen}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          onConfirm={handleConfirmDelete}
          title={t("Confirm Order Deletion")}
          message={t("Are you sure you want to delete this order?")}
        />
      </Container>
    </Box>
  );
};

export default OrdersPage;
