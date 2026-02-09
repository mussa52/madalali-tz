// User Management Controller
const User = require('../models/User');

class UserController {
    /**
     * Get all users (Admin only)
     */
    static async getAllUsers(req, res) {
        try {
            const { role, status } = req.query;
            
            const filters = {};
            if (role) filters.role = role;
            if (status) filters.status = status;

            const users = await User.getAll(filters);

            res.json({
                success: true,
                data: { users, count: users.length }
            });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get users',
                error: error.message
            });
        }
    }

    /**
     * Get user by ID
     */
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: { user }
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get user',
                error: error.message
            });
        }
    }

    /**
     * Create user (Admin only)
     */
    static async createUser(req, res) {
        try {
            const { name, email, password, phone, role, status } = req.body;

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            const userId = await User.create({
                name,
                email,
                password,
                phone,
                role,
                status
            });

            const user = await User.findById(userId);

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: { user }
            });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create user',
                error: error.message
            });
        }
    }

    /**
     * Update user (Admin only)
     */
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, phone, role, status } = req.body;

            // Check if user exists
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // If email is being changed, check if it's already taken
            if (email && email !== user.email) {
                const existingUser = await User.findByEmail(email);
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already in use'
                    });
                }
            }

            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (phone) updateData.phone = phone;
            if (role) updateData.role = role;
            if (status) updateData.status = status;

            await User.update(id, updateData);

            const updatedUser = await User.findById(id);

            res.json({
                success: true,
                message: 'User updated successfully',
                data: { user: updatedUser }
            });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update user',
                error: error.message
            });
        }
    }

    /**
     * Delete user (Admin only)
     */
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Check if user exists
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Prevent admin from deleting themselves
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'You cannot delete your own account'
                });
            }

            await User.delete(id);

            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete user',
                error: error.message
            });
        }
    }

    /**
     * Get user statistics (Admin only)
     */
    static async getStatistics(req, res) {
        try {
            const stats = await User.getStatistics();

            res.json({
                success: true,
                data: { statistics: stats }
            });
        } catch (error) {
            console.error('Get statistics error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get statistics',
                error: error.message
            });
        }
    }
}

module.exports = UserController;
