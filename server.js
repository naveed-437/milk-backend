const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dashboardRoutes = require("./routes/dashboardRoutes");
const dashboardOverviewRoutes = require("./routes/dashboardOverviewRoutes");

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "ASN Dairy Hub API is healthy" });
});

const deliveryRoutes = require("./routes/deliveryRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboard/overview', dashboardOverviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});