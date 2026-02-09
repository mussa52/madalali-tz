// Input Validation Middleware
const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

/**
 * User registration validation rules
 */
const validateRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
    body('role')
        .optional()
        .isIn(['admin', 'agent', 'client']).withMessage('Invalid role'),
    
    body('phone')
        .optional()
        .matches(/^[+]?[0-9]{10,15}$/).withMessage('Invalid phone number format'),
    
    handleValidationErrors
];

/**
 * User login validation rules
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required'),
    
    handleValidationErrors
];

/**
 * Property creation/update validation rules
 */
const validateProperty = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    
    body('property_type')
        .notEmpty().withMessage('Property type is required')
        .isIn(['house', 'apartment', 'land', 'commercial', 'villa', 'condo'])
        .withMessage('Invalid property type'),
    
    body('listing_type')
        .notEmpty().withMessage('Listing type is required')
        .isIn(['sale', 'rent']).withMessage('Invalid listing type'),
    
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required'),
    
    body('city')
        .trim()
        .notEmpty().withMessage('City is required'),
    
    body('bedrooms')
        .optional()
        .isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
    
    body('bathrooms')
        .optional()
        .isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
    
    body('area_sqm')
        .optional()
        .isFloat({ min: 0 }).withMessage('Area must be a positive number'),
    
    handleValidationErrors
];

/**
 * Inquiry validation rules
 */
const validateInquiry = [
    body('property_id')
        .notEmpty().withMessage('Property ID is required')
        .isInt().withMessage('Invalid property ID'),
    
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
    
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    
    handleValidationErrors
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateProperty,
    validateInquiry,
    handleValidationErrors
};
