const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");
const Item = require("./models/Item");
const Order = require("./models/Order");
const Organization = require("./models/Organization");

require("dotenv").config();
const connectDB = require("./db/db");

connectDB();

async function cleanDB() {
  try {
    console.log("************************************************************");
    console.log(
      "************************ Cleaning database... ************************"
    );
    console.log("************************************************************");

    // Delete data from all collections
    await Organization.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});
    await Order.deleteMany({});

    console.log(
      "************************ Database cleaned successfully. ************************"
    );
  } catch (error) {
    console.error("Database cleaning error:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

cleanDB();
