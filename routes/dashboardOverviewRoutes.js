const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardOverview } = require('../controllers/dashboardOverviewController');

router.get('/', protect, getDashboardOverview);

module.exports = router;
