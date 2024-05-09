import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TableContainer,
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import TablePaginationActions from "./TablePaginationActions";
import { useTranslation } from "react-i18next";
import { StatusChip } from "../../components/StatusChip";

const MobileOrderList = ({
  orders,
  handleEditClick,
  handleDeleteDialogOpen,
}) => {
  const { t } = useTranslation();
  return (
    <Box>
      {orders.map((order) => (
        <Paper
          key={order._id}
          elevation={1}
          sx={{ p: 2, mb: 2, overflow: "hidden" }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {order.customerName}
          </Typography>

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
                {t("Items")}
              </Typography>
              {order.items.map((item, index) => (
                <Typography key={index} variant="body2">
                  {`${item.item?.name}`}
                </Typography>
              ))}
            </Stack>
            <Stack>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ fontWeight: "fontWeightBold" }}
              >
                {t("Quantity")}
              </Typography>

              {new Intl.NumberFormat("en-IN").format(
                order.items.reduce((total, item) => total + item.quantity, 0)
              )}
            </Stack>
            <Stack>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ fontWeight: "fontWeightBold", mb: 1 }}
              >
                {t("Total Price:")}
              </Typography>

              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(
                order.items
                  .reduce(
                    (acc, item) => acc + item.quantity * item.priceAtPurchase,
                    0
                  )
                  .toFixed(2)
              )}
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 1,
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t("Order Status:")}
            </Typography>
            <StatusChip status={order.status} type={"order"} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 1,
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t("Payment Status:")}
            </Typography>
            <StatusChip status={order.paymentStatus} type={"payment"} />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title={t("Edit")} placement="bottom">
              <IconButton
                onClick={(event) => handleEditClick(event, order)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("Delete")} placement="bottom">
              <IconButton
                onClick={(event) => handleDeleteDialogOpen(event, order._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

const OrdersTable = ({
  orders,
  handleEditClick,
  handleDeleteDialogOpen,
  totalPages,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Function to handle row click
  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div style={{ overflowX: "auto" }}>
      {isMobile ? (
        <MobileOrderList
          orders={orders}
          handleEditClick={handleEditClick}
          handleDeleteDialogOpen={handleDeleteDialogOpen}
        />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("Customer Name")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t("Items")}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("Items Quantity")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("Total Price")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("Order Status")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("Payment Status")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("Order Date")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("Actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders?.map((order) => (
                  <TableRow
                    key={order._id}
                    hover
                    onClick={() => handleRowClick(order._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      {order.items.map((item, index) => (
                        <div key={index}>{`${item.item?.name}`}</div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-IN").format(
                        order.items.reduce(
                          (total, item) => total + item.quantity,
                          0
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(
                        order.items
                          .reduce(
                            (acc, item) =>
                              acc + item.quantity * item.priceAtPurchase,
                            0
                          )
                          .toFixed(2)
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={order.status} type={"order"} />
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        status={order.paymentStatus}
                        type={"payment"}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), "PP")}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={t("Edit")} placement="bottom">
                        <IconButton
                          onClick={(event) => handleEditClick(event, order)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("Delete")} placement="bottom">
                        <IconButton
                          onClick={(event) =>
                            handleDeleteDialogOpen(event, order._id)
                          }
                        >
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
                      {t("No orders found")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalPages > 0 && (
        <TablePagination
          component="div"
          count={totalPages * itemsPerPage}
          page={currentPage - 1}
          onPageChange={(event, newPage) => setCurrentPage(newPage + 1)}
          rowsPerPage={itemsPerPage}
          rowsPerPageOptions={[]}
          ActionsComponent={TablePaginationActions}
        />
      )}
    </div>
  );
};

export default OrdersTable;
