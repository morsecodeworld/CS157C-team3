// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  quantity: { type: Number, required: true, default: 0 },
  buyPrice: { type: Number, required: true }, // Updated from price to buyPrice
  sellPrice: { type: Number, required: true }, // Added sellPrice
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    default: null,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
