const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Specific routes first
router.get('/featured', destinationController.getFeaturedDestinations);

// Collection routes
router.get('/', destinationController.getAllDestinations);
router.post('/', destinationController.createDestination);

// Dynamic routes
router.get('/:idOrSlug', destinationController.getDestinationByIdOrSlug);
router.patch('/:id', destinationController.updateDestination);
router.delete('/:id', destinationController.deleteDestination);

module.exports = router;
