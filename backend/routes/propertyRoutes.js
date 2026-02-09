// Property Routes
const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/propertyController');
const { authenticate, optionalAuthenticate, authorize, checkOwnership } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Add error handler for Multer
router.use((err, req, res, next) => {
    if (err instanceof Error && err.message.includes('image files')) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
});

/**
 * @route   GET /api/properties
 * @desc    Get all properties with filters
 * @access  Public (but filtered by role if authenticated)
 */
router.get('/', optionalAuthenticate, PropertyController.getAllProperties);

/**
 * @route   GET /api/properties/statistics
 * @desc    Get property statistics
 * @access  Private (Admin only)
 */
router.get('/statistics', authenticate, authorize('admin'), PropertyController.getStatistics);

/**
 * @route   GET /api/properties/my-properties
 * @desc    Get agent's own properties
 * @access  Private (Agent only)
 */
router.get('/my-properties', authenticate, authorize('agent'), PropertyController.getMyProperties);

/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID
 * @access  Public
 */
router.get('/:id', PropertyController.getPropertyById);

/**
 * @route   POST /api/properties
 * @desc    Create new property
 * @access  Private (Agent only)
 */
router.post('/', authenticate, authorize('agent'), upload.single('property_photo'), PropertyController.createPropertyWithPhoto);

/**
 * @route   PUT /api/properties/:id
 * @desc    Update property
 * @access  Private (Agent - own properties, Admin - all)
 */
router.put('/:id', authenticate, authorize('agent', 'admin'), PropertyController.updateProperty);

/**
 * @route   PUT /api/properties/:id/status
 * @desc    Update property status (approve/reject)
 * @access  Private (Admin only)
 */
router.put('/:id/status', authenticate, authorize('admin'), PropertyController.updatePropertyStatus);

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property
 * @access  Private (Agent - own properties, Admin - all)
 */
router.delete('/:id', authenticate, authorize('agent', 'admin'), PropertyController.deleteProperty);

module.exports = router;
