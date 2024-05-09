const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const setupSwagger = require("./utils/swaggerConfig");
const connectDB = require("./db/db");

const cors = require("cors");

connectDB().catch((err) => console.error("MongoDB connection error:", err));

const app = express();

const PORT = process.env.PORT || 9000;
app.use(express.json());
app.use(cors({ origin: "*" }));
//to parse body from url
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the inventory management express app");
});
app.use("/api/user", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/organizations", organizationRoutes);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
