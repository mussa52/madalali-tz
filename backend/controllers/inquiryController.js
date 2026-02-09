// Inquiry Controller
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

class InquiryController {
    /**
     * Create new inquiry
     */
    static async createInquiry(req, res) {
        try {
            const { property_id, subject, message } = req.body;
            const client_id = req.user.id;

            // Get property and agent info
            const property = await Property.findById(property_id);
            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            // Check if property is approved
            if (property.status !== 'approved') {
                return res.status(400).json({
                    success: false,
                    message: 'You can only inquire about approved properties'
                });
            }

            const inquiryId = await Inquiry.create({
                property_id,
                client_id,
                agent_id: property.agent_id,
                subject,
                message
            });

            const inquiry = await Inquiry.findById(inquiryId);

            res.status(201).json({
                success: true,
                message: 'Inquiry sent successfully',
                data: { inquiry }
            });
        } catch (error) {
            console.error('Create inquiry error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send inquiry',
                error: error.message
            });
        }
    }

    /**
     * Get all inquiries with filters
     */
    static async getAllInquiries(req, res) {
        try {
            const { property_id, status } = req.query;
            const filters = {};

            // Agents see only their inquiries
            if (req.user.role === 'agent') {
                filters.agent_id = req.user.id;
            }

            // Clients see only their inquiries
            if (req.user.role === 'client') {
                filters.client_id = req.user.id;
            }

            if (property_id) filters.property_id = property_id;
            if (status) filters.status = status;

            const inquiries = await Inquiry.getAll(filters);

            res.json({
                success: true,
                data: { inquiries, count: inquiries.length }
            });
        } catch (error) {
            console.error('Get inquiries error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get inquiries',
                error: error.message
            });
        }
    }

    /**
     * Get inquiry by ID
     */
    static async getInquiryById(req, res) {
        try {
            const { id } = req.params;
            const inquiry = await Inquiry.findById(id);

            if (!inquiry) {
                return res.status(404).json({
                    success: false,
                    message: 'Inquiry not found'
                });
            }

            // Check access permissions
            if (req.user.role !== 'admin') {
                if (req.user.role === 'agent' && inquiry.agent_id !== req.user.id) {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied'
                    });
                }
                if (req.user.role === 'client' && inquiry.client_id !== req.user.id) {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied'
                    });
                }
            }

            // Mark as read if it's the agent viewing it
            if (req.user.role === 'agent' && inquiry.status === 'new') {
                await Inquiry.updateStatus(id, 'read');
                inquiry.status = 'read';
            }

            res.json({
                success: true,
                data: { inquiry }
            });
        } catch (error) {
            console.error('Get inquiry error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get inquiry',
                error: error.message
            });
        }
    }

    /**
     * Update inquiry status
     */
    static async updateInquiryStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['new', 'read', 'responded', 'closed'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
            }

            const inquiry = await Inquiry.findById(id);
            if (!inquiry) {
                return res.status(404).json({
                    success: false,
                    message: 'Inquiry not found'
                });
            }

            // Only agent or admin can update status
            if (req.user.role === 'agent' && inquiry.agent_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            if (req.user.role === 'client') {
                return res.status(403).json({
                    success: false,
                    message: 'Only agents can update inquiry status'
                });
            }

            await Inquiry.updateStatus(id, status);

            const updatedInquiry = await Inquiry.findById(id);

            res.json({
                success: true,
                message: 'Inquiry status updated successfully',
                data: { inquiry: updatedInquiry }
            });
        } catch (error) {
            console.error('Update inquiry status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update inquiry status',
                error: error.message
            });
        }
    }

    /**
     * Delete inquiry
     */
    static async deleteInquiry(req, res) {
        try {
            const { id } = req.params;

            const inquiry = await Inquiry.findById(id);
            if (!inquiry) {
                return res.status(404).json({
                    success: false,
                    message: 'Inquiry not found'
                });
            }

            // Only admin or the client who created it can delete
            if (req.user.role !== 'admin' && inquiry.client_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            await Inquiry.delete(id);

            res.json({
                success: true,
                message: 'Inquiry deleted successfully'
            });
        } catch (error) {
            console.error('Delete inquiry error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete inquiry',
                error: error.message
            });
        }
    }

    /**
     * Get inquiry statistics
     */
    static async getStatistics(req, res) {
        try {
            let agentId = null;
            
            // Agents only see their own stats
            if (req.user.role === 'agent') {
                agentId = req.user.id;
            }

            const stats = await Inquiry.getStatistics(agentId);

            res.json({
                success: true,
                data: { statistics: stats }
            });
        } catch (error) {
            console.error('Get inquiry statistics error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get statistics',
                error: error.message
            });
        }
    }
}

module.exports = InquiryController;
