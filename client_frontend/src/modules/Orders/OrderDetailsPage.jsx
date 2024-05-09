import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Loader from "../../components/Loader";
import { calculateTotal, formatDate, generatePDF } from "../../utils";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { StatusChip } from "../../components/StatusChip";

const OrderDetailsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [orderDetails, setOrderDetails] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { orderId } = useParams();
  const navigate = useNavigate();

  const subtotal = orderDetails
    ? parseFloat(calculateTotal(orderDetails.items))
    : 0;
  const discount =
    orderDetails && orderDetails.discount
      ? parseFloat(orderDetails.discount)
      : 0;
  const total = subtotal - discount;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleDownloadInvoice = () => {
    if (orderDetails?.paymentStatus === "paid") {
      generatePDF(orderDetails, subtotal, discount, total);
    } else {
      setSnackbarMessage(
        t(
          'Invoice can only be downloaded for orders with a "Paid" payment status.'
        )
      );
      setSnackbarOpen(true);
    }
  };

  if (!orderDetails) {
    return <Loader />;
  }

  const handleBackClick = () => navigate(-1);

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        mt={2}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackClick}>
          {t("Back")}
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleDownloadInvoice}
        >
          {t("Download Invoice")}
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        mt={2}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">{t("Order Status:")}</Typography>
          <StatusChip status={orderDetails.status} type={"order"} />
          {/* {getOrderStatusChip(orderDetails.status)} */}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">{t("Payment Status:")}</Typography>
          <StatusChip status={orderDetails.paymentStatus} type={"payment"} />
          {/* {getPaymentStatusChip(orderDetails.paymentStatus)} */}
        </Box>
        <Typography variant="h6">
          {t("Order Date:")} {formatDate(orderDetails.orderDate)}
        </Typography>
      </Box>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            {t("Customer Information")}
          </Typography>
          <Typography variant="subtitle1">
            {t("Name:")} {orderDetails.customerName}
          </Typography>
          <Typography variant="subtitle1">
            {t("Contact No:")}{" "}
            {orderDetails.contactNo ? orderDetails.contactNo : "-"}
          </Typography>
          <Typography>
            {t("Total paid by customer:")}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(calculateTotal(orderDetails.items))}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            {t("Customer Address")}
          </Typography>
          <Typography variant="subtitle1">
            {orderDetails.customerAddress ? orderDetails.customerAddress : "-"}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          {t("Order Details")}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("Product Name")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("Quantity")}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: isSmallScreen ? "none" : "table-cell",
                  }}
                >
                  {t("Price at Purchase")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t("Total")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.items.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem.item?.name}</TableCell>
                  <TableCell>{orderItem.quantity}</TableCell>
                  <TableCell
                    sx={{ display: isSmallScreen ? "none" : "table-cell" }}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(orderItem.priceAtPurchase)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(
                      (orderItem.quantity * orderItem.priceAtPurchase).toFixed(
                        2
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>{t("Subtotal")}</TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(subtotal.toFixed(2))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("Discount")}</TableCell>
                <TableCell align="right">
                  -{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(discount.toFixed(2))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("Total")}</TableCell>
                <TableCell align="right">
                  {" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(total.toFixed(2))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderDetailsPage;
