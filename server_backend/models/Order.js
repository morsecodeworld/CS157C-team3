// models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    contactNo: String,
    customerAddress: String,
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderDate: { type: Date, default: Date.now },
    paymentDate: Date,
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
