import React from "react";
import { Button, TextField, Grid, MenuItem, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const Filters = ({
  filterStatus,
  setFilterStatus,
  filterPaymentStatus,
  setFilterPaymentStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  resetFilters,
}) => {
  const { t } = useTranslation();
  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={0}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        alignItems="center"
      >
        <Grid item xs={2} sm={4} md={3}>
          <TextField
            select
            label={t("Order Status")}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="">{t("All")}</MenuItem>
            <MenuItem value="pending">{t("Pending")}</MenuItem>
            <MenuItem value="completed">{t("Completed")}</MenuItem>
            <MenuItem value="cancelled">{t("Cancelled")}</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={2} sm={4} md={3}>
          <TextField
            select
            label={t("Payment Status")}
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="">{t("All")}</MenuItem>
            <MenuItem value="pending">{t("Pending")}</MenuItem>
            <MenuItem value="paid">{t("Paid")}</MenuItem>
            <MenuItem value="failed">{t("Failed")}</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={2} sm={4} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                disableFuture
                label={t("Start Date")}
                value={startDate}
                onChange={(newValue) => {
                  return setStartDate(
                    newValue ? newValue.format("YYYY-MM-DD") : ""
                  );
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={2} sm={4} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                disableFuture
                label={t("End Date")}
                value={endDate}
                onChange={(newValue) => {
                  return setEndDate(
                    newValue ? newValue.format("YYYY-MM-DD") : ""
                  );
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Button
            variant="outlined"
            onClick={resetFilters}
            fullWidth
            size="large"
            sx={{ mb: 2 }}
          >
            {t("Reset Filters")}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Filters;
