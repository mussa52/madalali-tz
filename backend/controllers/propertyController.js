// Property Controller
const Property = require('../models/Property');

class PropertyController {
    /**
     * Create new property
     */
    static async createProperty(req, res) {
        try {
            const {
                title, description, property_type, listing_type, price,
                location, city, address, bedrooms, bathrooms, area_sqm,
                parking_spaces, features
            } = req.body;

            const propertyId = await Property.create({
                title,
                description,
                property_type,
                listing_type,
                price,
                location,
                city,
                address,
                bedrooms,
                bathrooms,
                area_sqm,
                parking_spaces,
                features: JSON.stringify(features || []),
                agent_id: req.user.id,
                status: 'pending' // All new properties need approval
            });

            const property = await Property.findById(propertyId);

            res.status(201).json({
                success: true,
                message: 'Property created successfully. Pending admin approval.',
                data: { property }
            });
        } catch (error) {
            console.error('Create property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create property',
                error: error.message
            });
        }
    }

    /**
     * Create new property with photo
     */
    static async createPropertyWithPhoto(req, res) {
        try {
            console.log('--- Property Creation Request ---');
            console.log('User:', req.user);
            console.log('Body:', req.body);
            if (req.file) {
                console.log('Photo uploaded:', req.file.filename);
            } else {
                console.log('No photo uploaded');
            }

            const {
                title, description, property_type, listing_type, price,
                location, city, address, bedrooms, bathrooms, area_sqm,
                parking_spaces, features
            } = req.body;

            const propertyId = await Property.create({
                title,
                description,
                property_type,
                listing_type,
                price,
                location,
                city,
                address,
                bedrooms,
                bathrooms,
                area_sqm,
                parking_spaces,
                features: JSON.stringify(features || []),
                agent_id: req.user.id,
                status: 'pending'
            });

            // Save photo if uploaded
            if (req.file) {
                const imageUrl = '/uploads/' + req.file.filename;
                await Property.addImage(propertyId, imageUrl, true, 0);
            }

            const property = await Property.findById(propertyId);

            res.status(201).json({
                success: true,
                message: 'Property created successfully. Pending admin approval.',
                data: { property }
            });
        } catch (error) {
            console.error('Create property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create property',
                error: error.message
            });
        }
    }

    /**
     * Get all properties with filters
     */
    static async getAllProperties(req, res) {
        try {
            const {
                status, property_type, listing_type, city, location,
                min_price, max_price, bedrooms, search, limit
            } = req.query;

            const filters = {};
            
            // For public/unauthenticated users, only show approved properties
            if (!req.user) {
                filters.status = status || 'approved';
            }
            // For clients, only show approved properties
            else if (req.user.role === 'client') {
                filters.status = 'approved';
            } 
            // For admins, show all or filter by status
            else if (req.user.role === 'admin') {
                if (status) filters.status = status;
            }
            // For agents, show their own properties (all statuses) unless status filter is provided
            else if (req.user.role === 'agent') {
                filters.agent_id = req.user.id;
                if (status) filters.status = status;
            }

            if (property_type) filters.property_type = property_type;
            if (listing_type) filters.listing_type = listing_type;
            if (city) filters.city = city;
            if (location) filters.location = location;
            if (min_price) filters.min_price = min_price;
            if (max_price) filters.max_price = max_price;
            if (bedrooms) filters.bedrooms = bedrooms;
            if (search) filters.search = search;
            if (limit) filters.limit = limit;

            const properties = await Property.getAll(filters);

            console.log('📊 Properties Query Result:');
            console.log('  Filters applied:', JSON.stringify(filters));
            console.log('  Total properties found:', properties.length);
            console.log('  User role:', req.user ? req.user.role : 'unauthenticated');

            res.json({
                success: true,
                data: { properties, count: properties.length }
            });
        } catch (error) {
            console.error('Get properties error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get properties',
                error: error.message
            });
        }
    }

    /**
     * Get property by ID
     */
    static async getPropertyById(req, res) {
        try {
            const { id } = req.params;
            const property = await Property.findById(id);

            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            // Increment view count
            await Property.incrementViews(id);

            res.json({
                success: true,
                data: { property }
            });
        } catch (error) {
            console.error('Get property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get property',
                error: error.message
            });
        }
    }

    /**
     * Update property
     */
    static async updateProperty(req, res) {
        try {
            const { id } = req.params;
            const {
                title, description, property_type, listing_type, price,
                location, city, address, bedrooms, bathrooms, area_sqm,
                parking_spaces, features, status
            } = req.body;

            const property = await Property.findById(id);
            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            // Agents can only update their own properties
            if (req.user.role === 'agent' && property.agent_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only update your own properties'
                });
            }

            const updateData = {};
            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (property_type) updateData.property_type = property_type;
            if (listing_type) updateData.listing_type = listing_type;
            if (price) updateData.price = price;
            if (location) updateData.location = location;
            if (city) updateData.city = city;
            if (address) updateData.address = address;
            if (bedrooms !== undefined) updateData.bedrooms = bedrooms;
            if (bathrooms !== undefined) updateData.bathrooms = bathrooms;
            if (area_sqm) updateData.area_sqm = area_sqm;
            if (parking_spaces !== undefined) updateData.parking_spaces = parking_spaces;
            if (features) updateData.features = JSON.stringify(features);
            
            // Only admin can change status
            if (status && req.user.role === 'admin') {
                updateData.status = status;
            }

            await Property.update(id, updateData);

            const updatedProperty = await Property.findById(id);

            res.json({
                success: true,
                message: 'Property updated successfully',
                data: { property: updatedProperty }
            });
        } catch (error) {
            console.error('Update property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update property',
                error: error.message
            });
        }
    }

    /**
     * Delete property
     */
    static async deleteProperty(req, res) {
        try {
            const { id } = req.params;

            const property = await Property.findById(id);
            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            // Agents can only delete their own properties
            if (req.user.role === 'agent' && property.agent_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete your own properties'
                });
            }

            await Property.delete(id);

            res.json({
                success: true,
                message: 'Property deleted successfully'
            });
        } catch (error) {
            console.error('Delete property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete property',
                error: error.message
            });
        }
    }

    /**
     * Approve/Reject property (Admin only)
     */
    static async updatePropertyStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['approved', 'rejected', 'pending'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
            }

            const property = await Property.findById(id);
            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            await Property.update(id, { status });

            const updatedProperty = await Property.findById(id);

            res.json({
                success: true,
                message: `Property ${status} successfully`,
                data: { property: updatedProperty }
            });
        } catch (error) {
            console.error('Update property status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update property status',
                error: error.message
            });
        }
    }

    /**
     * Get property statistics
     */
    static async getStatistics(req, res) {
        try {
            const stats = await Property.getStatistics();

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

    /**
     * Get my properties (Agent)
     */
    static async getMyProperties(req, res) {
        try {
            const properties = await Property.getAll({ agent_id: req.user.id });

            res.json({
                success: true,
                data: { properties, count: properties.length }
            });
        } catch (error) {
            console.error('Get my properties error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get properties',
                error: error.message
            });
        }
    }
}

module.exports = PropertyController;
