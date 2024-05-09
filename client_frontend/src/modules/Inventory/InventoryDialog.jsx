import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const InventoryDialog = ({
  dialogOpen,
  handleDialogClose,
  isEditMode,
  currentItem,
  handleInputChange,
  categories,
  handleAddOrUpdateItem,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {isEditMode ? t("Edit Item") : t("Add New Item")}
        </DialogTitle>
        <DialogContent>
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label={t("Name")}
            type="text"
            fullWidth
            value={currentItem.name}
            onChange={handleInputChange}
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
            value={currentItem.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="quantity"
            name="quantity"
            label={t("Quantity")}
            type="number"
            fullWidth
            value={currentItem.quantity}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="buyPrice"
            name="buyPrice"
            label={t("Buy Price")}
            type="number"
            fullWidth
            value={currentItem.buyPrice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="sellPrice"
            name="sellPrice"
            label={t("Sell Price")}
            type="number"
            fullWidth
            value={currentItem.sellPrice}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category"
              name="category"
              value={currentItem.category}
              label={t("Category")}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <TextField
            margin="dense"
            id="supplier"
            name="supplier"
            label="Supplier ID"
            type="text"
            fullWidth
            value={currentItem.supplier}
            onChange={handleInputChange}
            helperText="Enter the supplier ID. Enhance by using a select dropdown with supplier options."
          /> */}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddOrUpdateItem} variant="contained">
            {isEditMode ? t("Save Changes") : t("Add")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InventoryDialog;
