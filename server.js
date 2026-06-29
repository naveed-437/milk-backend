const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware FIRST
app.use(cors());
app.use(express.json());
const deliveryRoutes = require("./routes/deliveryRoutes");

app.use("/api/deliveries", deliveryRoutes);

const subscriptionRoutes = require("./routes/subscriptionRoutes");

app.use("/api/subscriptions", subscriptionRoutes);

// Import routes
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");

// Register routes AFTER middleware
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});