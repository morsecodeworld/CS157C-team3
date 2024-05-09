import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useTranslation } from "react-i18next";

const OrderDialog = ({
  currentOrder,
  setCurrentOrder,
  dialogOpen,
  setDialogOpen,
  handleAddOrUpdateOrder,
  isEditMode,
  setIsEditMode,
  availableItems,
  error,
}) => {
  const { t } = useTranslation();
  const handleDialogClose = () => {
    setDialogOpen(false);
    if (isEditMode) {
      setIsEditMode(false); // Reset edit mode
      // Reset the currentOrder state to its initial state
      setCurrentOrder({
        customerName: "",
        contactNo: "",
        customerAddress: "",
        items: [],
        status: t("pending"),
        paymentStatus: t("pending"),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    let updatedItems = [...currentOrder.items];
    let selectedItem;

    if (field === "item") {
      // Find the selected item from availableItems to get its sellPrice
      selectedItem = availableItems.find((item) => item._id === value);
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
        // Set priceAtPurchase to the selectedItem's sellPrice
        priceAtPurchase: selectedItem ? selectedItem.sellPrice : 0,
      };
    } else {
      // For changes other than item selection, just update the value
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }

    setCurrentOrder({ ...currentOrder, items: updatedItems });
  };

  const addItem = () => {
    setCurrentOrder({
      ...currentOrder,
      items: [
        ...currentOrder.items,
        { item: "", quantity: 1, priceAtPurchase: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    const filteredItems = currentOrder.items.filter((_, idx) => idx !== index);
    setCurrentOrder({ ...currentOrder, items: filteredItems });
  };

  return (
    <div>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {isEditMode ? t("Edit Order") : t("Add Order")}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="customerName"
            label={t("Customer Name")}
            type="text"
            fullWidth
            value={currentOrder.customerName}
            onChange={handleInputChange}
            name="customerName"
          />
          <TextField
            autoFocus
            margin="dense"
            id="contactNo"
            label={t("Contact No")}
            type="text"
            fullWidth
            value={currentOrder.contactNo}
            onChange={handleInputChange}
            name="contactNo"
          />
          <TextField
            autoFocus
            margin="dense"
            id="customerAddress"
            label={t("Customer Address")}
            type="text"
            fullWidth
            value={currentOrder.customerAddress}
            onChange={handleInputChange}
            name="customerAddress"
          />

          {/* Dynamic items form */}
          {currentOrder.items.map((orderItem, index) => {
            return (
              <Grid
                container
                spacing={2}
                key={index}
                sx={{ pt: 1, pb: 1 }}
                justifyContent="space-between"
              >
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>{t("Item")}</InputLabel>
                    <Select
                      value={orderItem.item}
                      onChange={(e) =>
                        handleItemChange(index, "item", e.target.value)
                      }
                      label={t("Item")}
                    >
                      {availableItems?.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Quantity and Price Input Fields */}
                <Grid item xs={3}>
                  <TextField
                    label={t("Quantity")}
                    type="number"
                    value={orderItem.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label={t("Price at Purchase")}
                    type="number"
                    value={orderItem.priceAtPurchase}
                    onChange={(e) =>
                      handleItemChange(index, "priceAtPurchase", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <IconButton onClick={() => removeItem(index)}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Grid>
            );
          })}
          <Button startIcon={<AddCircleOutlineIcon />} onClick={addItem}>
            {t("Add Item")}
          </Button>

          <TextField
            id="outlined-select-order-status"
            fullWidth
            select
            label={t("Order Status")}
            value={currentOrder.status}
            sx={{ mb: 2, mt: 1 }}
            name="status"
            onChange={handleInputChange}
          >
            <MenuItem value="pending">{t("Pending")}</MenuItem>
            <MenuItem value="completed">{t("Completed")}</MenuItem>
            <MenuItem value="cancelled">{t("Cancelled")}</MenuItem>
          </TextField>

          <TextField
            id="outlined-select-payment-status"
            fullWidth
            select
            label={t("Payment Status")}
            value={
              currentOrder.status === "cancelled"
                ? "failed"
                : currentOrder.paymentStatus
            }
            sx={{ mb: 2 }}
            name="paymentStatus"
            onChange={handleInputChange}
          >
            <MenuItem value="pending">{t("Pending")}</MenuItem>
            <MenuItem value="paid">{t("Paid")}</MenuItem>
            <MenuItem value="failed">{t("Failed")}</MenuItem>
          </TextField>

          <TextField
            margin="dense"
            id="orderDate"
            label={t("Order Date")}
            type="date"
            fullWidth
            value={
              currentOrder.orderDate ? currentOrder.orderDate.split("T")[0] : ""
            }
            onChange={handleInputChange}
            name="orderDate"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleAddOrUpdateOrder}
            color="primary"
            variant="contained"
          >
            {isEditMode ? t("Save Changes") : t("Add Order")}
          </Button>
        </DialogActions>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      </Dialog>
    </div>
  );
};

export default OrderDialog;
