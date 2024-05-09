const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Category = require("./models/Category");
const Item = require("./models/Item");
const Order = require("./models/Order");
const Organization = require("./models/Organization");

require("dotenv").config();
const connectDB = require("./db/db");

connectDB();

// Utility function to generate a random date within the last 6 months
function randomDateWithinLast6Months() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
  const timestamp =
    Math.random() * (Date.now() - sixMonthsAgo.getTime()) +
    sixMonthsAgo.getTime();
  return new Date(timestamp);
}

async function seedDB() {
  try {
    console.log("************************************************************");
    console.log(
      "************************ Clearing old data... ************************"
    );
    console.log("************************************************************");
    await Organization.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});
    await Order.deleteMany({});

    console.log(
      "************************ Seeding Organizations... ************************"
    );
    // Define the organizations
    const orgNames = ["Org A", "Org B"];

    const organizations = await Promise.all(
      orgNames.map(async (name) => {
        let organization = await Organization.findOne({ name });
        if (!organization) {
          organization = await new Organization({ name }).save();
        }
        return organization;
      })
    );

    // Users to be added
    console.log(
      "************************ Seeding Users... ************************"
    );
    // Users to be added
    const usersData = [
      {
        username: "johnDoe",
        email: "john@example.com",
        password: "1234",
        country: "IND",
        currency: "INR",
        role: "admin",
        organization: organizations[0]._id,
      },
      {
        username: "janeDoe",
        email: "jane@example.com",
        password: "1234",
        country: "IND",
        currency: "INR",
        role: "manager",
        organization: organizations[1]._id,
      },
    ];

    // Save users
    for (const userData of usersData) {
      let user = new User(userData);
      await user.save();
    }

    console.log(
      "************************ Seeding Categories... ************************"
    );

    const categoriesData = [];
    for (let i = 1; i <= 50; i++) {
      categoriesData.push({
        name: `Category ${i}`,
        description: `Description for Category ${i}`,
        organization: organizations[i % organizations.length]._id,
      });
    }
    const categories = await Category.insertMany(categoriesData);

    console.log(
      "************************ Seeding Items... ************************"
    );
    const itemsData = [];
    for (let i = 1; i <= 100; i++) {
      itemsData.push({
        name: `Item ${i}`,
        description: `Description for Item ${i}`,
        quantity: 100 + i,
        buyPrice: 10 + i,
        sellPrice: 15 + i,
        category: categories[i % categories.length]._id,
        organization: organizations[i % organizations.length]._id,
      });
    }
    const items = await Item.insertMany(itemsData);

    console.log(
      "************************ Seeding Orders... ************************"
    );

    const randomOrders = [];
    for (let i = 0; i < 50000; i++) {
      const randomItemIndex = Math.floor(Math.random() * items.length);
      const randomItem = items[randomItemIndex];

      const organizationIndex = Math.floor(
        Math.random() * organizations.length
      );
      const organization = organizations[organizationIndex];

      const orderDate = randomDateWithinLast6Months();

      randomOrders.push({
        customerName: `Customer ${i + 1}`,
        items: [
          {
            item: randomItem._id,
            quantity: Math.floor(Math.random() * 10) + 1,
            priceAtPurchase: randomItem.sellPrice,
          },
        ],
        orderDate: orderDate,
        organization: organization._id,
        status: ["pending", "completed", "cancelled"][
          Math.floor(Math.random() * 3)
        ],
        paymentStatus: ["pending", "paid", "failed"][
          Math.floor(Math.random() * 3)
        ],
      });

      // Insert orders in batches to avoid memory overflow
      if (randomOrders.length === 1000) {
        // Adjust batch size as needed
        await Order.insertMany(randomOrders);
        randomOrders.length = 0; // Clear the array for the next batch
        console.log(`Inserted ${i + 1} orders...`);
      }
    }

    // Insert any remaining orders
    if (randomOrders.length) {
      await Order.insertMany(randomOrders);
    }
    console.log(
      "************************ Orders seeded successfully. ************************"
    );

    console.log(
      "************************ Database seeded successfully. ************************ "
    );
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
