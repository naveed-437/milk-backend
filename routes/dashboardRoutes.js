const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats, healthCheck } = require('../controllers/dashboardController');

router.get('/stats', protect, getDashboardStats);
router.get('/health', healthCheck);

module.exports = router;
