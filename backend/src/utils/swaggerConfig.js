// swaggerConfig.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Management API",
      version: "1.0.0",
      description: "API Documentation for Inventory Management App",
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
    },
    servers: [
      {
        url: process.env.Backend_URI
          ? process.env.Backend_URI
          : "http://localhost:5000",
      },
    ],
    tags: [
      {
        name: "User",
        description: "Operations about users",
      },
      {
        name: "Category",
        description: "Operations about category",
      },
      {
        name: "Item",
        description: "Item management and operations",
      },
      {
        name: "Order",
        description: "Order management and operations",
      },
      {
        name: "Report",
        description: "Reporting operations",
      },
      {
        name: "Supplier",
        description: "Supplier management and operations",
      },
      {
        name: "Organization",
        description: "Organization management",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = setupSwagger;
