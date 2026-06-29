const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Create
router.post("/", createProduct);

// Read all
router.get("/", getProducts);

// Read one
router.get("/:id", getProductById);

// Update
router.put("/:id", updateProduct);

// Delete
router.delete("/:id", deleteProduct);

module.exports = router;