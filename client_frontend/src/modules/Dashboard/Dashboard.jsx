import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import PaymentIcon from "@mui/icons-material/Payment";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
import Loader from "../../components/Loader";
//import { processOrdersData } from "../../utils";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

const DashboardMetric = ({ Icon, title, value, currency }) => {
  return (
    <Grid item xs={12} md={6} lg={3}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Icon fontSize="large" color="primary" sx={{ mb: 1 }} />
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">
          {currency
            ? new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(value)
            : new Intl.NumberFormat("en-IN").format(value)}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [reportData, setReportData] = useState({
    totalOrders: 0,
    soldQuantity: 0,
    totalEarnings: 0,
    earningsPast7Days: 0,
  });

  //const [ordersData, setOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [reportResponse] = await Promise.all([
          axiosInstance.get(`/reports/summaryReport`),
          //axiosInstance.get(`/orders`),
        ]);

        setReportData(reportResponse.data);
        //setOrdersData(processOrdersData(ordersResponse.data.orders));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

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
        <Grid container spacing={3}>
          <DashboardMetric
            Icon={ShoppingCartCheckoutIcon}
            title={t("Total Delivered Orders")}
            value={reportData.totalCompletedOrders}
          />
          <DashboardMetric
            Icon={PendingActionsIcon}
            title={t("Pending Orders")}
            value={reportData.totalPendingOrders}
          />
          <DashboardMetric
            Icon={PaymentIcon}
            title={t("Total unpaid orders")}
            value={reportData.totalUnpaidOrders}
          />
          <DashboardMetric
            Icon={CurrencyRupeeIcon}
            title={t("Today's Earnings")}
            value={reportData.todaysEarnings}
            currency={true}
          />
          <DashboardMetric
            Icon={CurrencyRupeeIcon}
            title={t("Last month Earnings")}
            value={reportData.last30DaysEarnings}
            currency={true}
          />
          <DashboardMetric
            Icon={CurrencyRupeeIcon}
            title={t("Last quarter Earnings")}
            value={reportData.last90DaysEarnings}
            currency={true}
          />
          <DashboardMetric
            Icon={CurrencyRupeeIcon}
            title={t("Total Earnings")}
            value={`${reportData.totalEarnings.toFixed(2)}`}
            currency={true}
          />

          {/* Bar Chart Grid item */}
          {/* <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 400,
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                {t("Weekly Orders")}
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ordersData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalOrders" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
}
