const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

router.get('/', packageController.getAllPackages);
router.post('/', packageController.createPackage);

router.get('/:idOrSlug/availability', packageController.getPackageAvailability);
router.get('/:idOrSlug', packageController.getPackageByIdOrSlug);
router.patch('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

module.exports = router;
