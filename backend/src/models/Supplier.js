// models/Supplier.js
const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactName: String,
  address: String,
  phone: String,
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
