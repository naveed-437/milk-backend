const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { productImageUpload } = require("../middleware/uploadMiddleware");

const {
  createProduct,
  getProducts,
  getCategories,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.use(protect);

// Create
router.post("/", productImageUpload.single('image'), createProduct);

// Read all
router.get("/", getProducts);

// Categories
router.get("/categories", getCategories);

// Read one
router.get("/:id", getProductById);

// Update
router.put("/:id", productImageUpload.single('image'), updateProduct);

// Delete
router.delete("/:id", deleteProduct);

module.exports = router;