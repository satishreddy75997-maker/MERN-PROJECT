const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/bookings', adminController.getAdminBookings);
router.get('/destinations', adminController.getAdminDestinations);
router.get('/packages', adminController.getAdminPackages);

module.exports = router;
