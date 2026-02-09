// Authentication and Authorization Middleware
const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and authenticate user
 */
const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authentication required.'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Authentication failed.'
        });
    }
};

/**
 * Optional authentication - attaches user if token present, but doesn't block if not
 */
const optionalAuthenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided, continue without user
            req.user = null;
            return next();
        }

        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        // Invalid token, continue without user
        req.user = null;
        next();
    }
};

/**
 * Authorize based on user roles
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

/**
 * Check if user owns the resource (for agents managing their own properties)
 */
const checkOwnership = (model) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params.id;
            const userId = req.user.id;
            const userRole = req.user.role;

            // Admins can access everything
            if (userRole === 'admin') {
                return next();
            }

            // For agents, check if they own the resource
            if (model === 'property') {
                const db = require('../config/database');
                const [rows] = await db.query(
                    'SELECT agent_id FROM properties WHERE id = ?',
                    [resourceId]
                );

                if (rows.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Resource not found.'
                    });
                }

                if (rows[0].agent_id !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied. You can only manage your own resources.'
                    });
                }
            }

            next();
        } catch (error) {
            console.error('Ownership check error:', error);
            res.status(500).json({
                success: false,
                message: 'Error checking resource ownership.'
            });
        }
    };
};

module.exports = {
    authenticate,
    optionalAuthenticate,
    authorize,
    checkOwnership
};
