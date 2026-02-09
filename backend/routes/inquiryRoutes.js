// Inquiry Routes
const express = require('express');
const router = express.Router();
const InquiryController = require('../controllers/inquiryController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateInquiry } = require('../middleware/validation');

/**
 * @route   GET /api/inquiries
 * @desc    Get all inquiries (filtered by role)
 * @access  Private
 */
router.get('/', authenticate, InquiryController.getAllInquiries);

/**
 * @route   GET /api/inquiries/statistics
 * @desc    Get inquiry statistics
 * @access  Private (Admin, Agent)
 */
router.get('/statistics', authenticate, authorize('admin', 'agent'), InquiryController.getStatistics);

/**
 * @route   GET /api/inquiries/:id
 * @desc    Get inquiry by ID
 * @access  Private
 */
router.get('/:id', authenticate, InquiryController.getInquiryById);

/**
 * @route   POST /api/inquiries
 * @desc    Create new inquiry
 * @access  Private (Client only)
 */
router.post('/', authenticate, authorize('client'), validateInquiry, InquiryController.createInquiry);

/**
 * @route   PUT /api/inquiries/:id/status
 * @desc    Update inquiry status
 * @access  Private (Agent, Admin)
 */
router.put('/:id/status', authenticate, authorize('agent', 'admin'), InquiryController.updateInquiryStatus);

/**
 * @route   DELETE /api/inquiries/:id
 * @desc    Delete inquiry
 * @access  Private (Client - own inquiries, Admin - all)
 */
router.delete('/:id', authenticate, InquiryController.deleteInquiry);

module.exports = router;
