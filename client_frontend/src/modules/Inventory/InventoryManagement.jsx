import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Chip,
  Typography,
  Box,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { findCategoryNameById } from "../../utils";
import { useTranslation } from "react-i18next";

const MobileInventoryList = ({ items, categories, onEdit, onDelete }) => {
  const { t } = useTranslation();
  return (
    <Box>
      {items.map((item) => (
        <Paper
          key={item._id}
          elevation={1}
          sx={{ p: 2, mb: 2, overflow: "hidden" }}
        >
          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">{item.name}</Typography>
            <Chip
              label={findCategoryNameById(categories, item.category)}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>

          <Stack
            spacing={2}
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ mb: 1 }}
          >
            <Stack>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ fontWeight: "fontWeightBold" }}
              >
                {t("Quantity")}
              </Typography>
              {new Intl.NumberFormat("en-IN").format(item.quantity)}
              {/* {item.quantity < 20 && (
                <Chip label="Low Stock" color="warning" size="small" />
              )} */}
            </Stack>
            <Stack>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ fontWeight: "fontWeightBold" }}
              >
                {t("Buy Price")}
              </Typography>

              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(item.buyPrice)}
            </Stack>
            <Stack>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ fontWeight: "fontWeightBold", mb: 1 }}
              >
                {t("Sell Price")}
              </Typography>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(item.sellPrice)}
            </Stack>
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Tooltip title={t("Edit")} placement="bottom">
              <IconButton onClick={() => onEdit(item)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("Delete")} placement="bottom">
              <IconButton onClick={() => onDelete(item._id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

const InventoryManagement = ({ items, categories, onEdit, onDelete }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleDialogOpen = (itemId) => {
    setOpenDialog(true);
    setSelectedItemId(itemId);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedItemId(null);
  };

  const handleDelete = () => {
    onDelete(selectedItemId);
    handleDialogClose();
  };

  return (
    <>
      {isMobile ? (
        <MobileInventoryList
          items={items}
          categories={categories}
          onEdit={onEdit}
          onDelete={(itemId) => {
            setSelectedItemId(itemId);
            handleDialogOpen();
          }}
        />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="inventory table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {t("Quantity")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {t("Buy Price")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {t("Sell Price")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {t("Category")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {t("Actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length > 0 ? (
                items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="right">
                      {item.quantity < 20 && (
                        <Chip
                          label={t("Low Stock")}
                          color="warning"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      )}
                      {new Intl.NumberFormat("en-IN").format(item.quantity)}
                    </TableCell>
                    <TableCell align="right">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(item.buyPrice)}
                    </TableCell>
                    <TableCell align="right">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(item.sellPrice)}
                    </TableCell>
                    <TableCell align="right">
                      {findCategoryNameById(categories, item.category)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t("Edit")} placement="bottom">
                        <IconButton onClick={() => onEdit(item)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("Delete")} placement="bottom">
                        <IconButton onClick={() => handleDialogOpen(item._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} style={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("No items found")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleDelete}
        title={t("Confirm Deletion")}
        message={t("Are you sure you want to delete this item?")}
      />
    </>
  );
};

export default InventoryManagement;
