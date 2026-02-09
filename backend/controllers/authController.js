// Authentication Controller
const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
    /**
     * Register a new user
     */
    static async register(req, res) {
        try {
            console.log('\n=== REGISTRATION ATTEMPT ===');
            const { name, email, password, phone, role } = req.body;
            console.log('Data received:', { name, email, phone, role: role || 'client', passwordLength: password?.length });

            // Validate required fields
            if (!name || !email || !password) {
                console.log('❌ Missing required fields');
                return res.status(400).json({
                    success: false,
                    message: 'Name, email, and password are required'
                });
            }

            // Check JWT_SECRET
            if (!process.env.JWT_SECRET) {
                console.error('❌ JWT_SECRET is not defined in environment variables');
                return res.status(500).json({
                    success: false,
                    message: 'Server configuration error. Please contact administrator.'
                });
            }

            // Check if user already exists
            console.log('Checking if user exists...');
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                console.log('❌ Email already registered');
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
            console.log('✅ Email is available');

            // Create user
            console.log('Creating user...');
            const userId = await User.create({
                name,
                email,
                password,
                phone,
                role: role || 'client'
            });
            console.log('✅ User created with ID:', userId);

            // Get created user
            console.log('Fetching created user...');
            const user = await User.findById(userId);
            console.log('✅ User fetched:', { id: user.id, name: user.name, email: user.email, role: user.role });

            // Generate JWT token
            console.log('Generating JWT token...');
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );
            console.log('✅ Token generated successfully');

            console.log('✅ Registration successful');
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            console.error('\n❌ REGISTRATION ERROR:');
            console.error('Error message:', error.message);
            console.error('Error code:', error.code);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Registration failed',
                error: error.message
            });
        }
    }

    /**
     * Login user
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            console.log('\n=== LOGIN ATTEMPT ===');
            console.log('Email:', email);
            console.log('Password length:', password?.length);

            // Find user
            console.log('Finding user by email...');
            const user = await User.findByEmail(email);
            console.log('User found:', user ? 'YES' : 'NO');
            
            if (!user) {
                console.log('❌ User not found');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            
            console.log('User details:', { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status });

            // Check if user is active
            if (user.status !== 'active') {
                console.log('❌ User is not active. Status:', user.status);
                return res.status(403).json({
                    success: false,
                    message: 'Your account is inactive or suspended'
                });
            }

            // Verify password
            console.log('Verifying password...');
            console.log('Stored hash:', user.password?.substring(0, 20) + '...');
            const isValidPassword = await User.verifyPassword(password, user.password);
            console.log('Password valid:', isValidPassword);
            
            if (!isValidPassword) {
                console.log('❌ Invalid password');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT token
            console.log('Generating JWT token...');
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            console.log('Token generated successfully');

            console.log('✅ Login successful');
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        phone: user.phone
                    },
                    token
                }
            });
        } catch (error) {
            console.error('\n❌ LOGIN ERROR:');
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Login failed',
                error: error.message
            });
        }
    }

    /**
     * Get current user profile
     */
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            
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
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get profile',
                error: error.message
            });
        }
    }

    /**
     * Update user profile
     */
    static async updateProfile(req, res) {
        try {
            const { name, phone, email } = req.body;
            const userId = req.user.id;

            // If email is being changed, check if it's already taken
            if (email && email !== req.user.email) {
                const existingUser = await User.findByEmail(email);
                if (existingUser && existingUser.id !== userId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already in use'
                    });
                }
            }

            const updateData = {};
            if (name) updateData.name = name;
            if (phone) updateData.phone = phone;
            if (email) updateData.email = email;

            await User.update(userId, updateData);

            const updatedUser = await User.findById(userId);

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: { user: updatedUser }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
    }

    /**
     * Change password
     */
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            // Get user with password
            const user = await User.findByEmail(req.user.email);

            // Verify current password
            const isValidPassword = await User.verifyPassword(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Update password
            await User.update(userId, { password: newPassword });

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to change password',
                error: error.message
            });
        }
    }
}

module.exports = AuthController;
