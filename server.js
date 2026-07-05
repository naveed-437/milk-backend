const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const errorHandler = require("./middleware/errorHandler");

app.use((req, res, next) => {
  console.log('REQ', req.method, req.path);
  next();
});
app.use(cors());
app.disable('etag');
app.use(express.json());
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const frontendDist = path.join(__dirname, 'frontend', 'dist');
const serveFrontend = fs.existsSync(frontendDist);
console.log('frontendDist=', frontendDist, 'serveFrontend=', serveFrontend);
if (serveFrontend) {
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
  app.use('/assets', express.static(path.join(frontendDist, 'assets')));
  app.use(express.static(frontendDist));
}

const dashboardRoutes = require("./routes/dashboardRoutes");
const dashboardOverviewRoutes = require("./routes/dashboardOverviewRoutes");

console.log('middleware stack after static:', app._router?.stack?.map((layer) => ({ name: layer.name, path: layer.route?.path || layer.regexp?.toString() })).filter(Boolean));

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

if (serveFrontend) {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/assets')) {
      return next();
    }

    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});