const express = require('express');
const router = express.Router();

const destinationRoutes = require('./destinationRoutes');
const packageRoutes = require('./packageRoutes');
const tripRoutes = require('./tripRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const bookingRoutes = require('./bookingRoutes');
const adminRoutes = require('./adminRoutes');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TravelEase API',
    timestamp: new Date().toISOString(),
  });
});

// Resource endpoints
router.use('/destinations', destinationRoutes);
router.use('/packages', packageRoutes);
router.use('/trips', tripRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
