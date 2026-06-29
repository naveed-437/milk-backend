const express = require("express");
const router = express.Router();

const {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
} = require("../controllers/deliveryController");

router.post("/", createDelivery);
router.get("/", getDeliveries);
router.get("/:id", getDeliveryById);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);

module.exports = router;