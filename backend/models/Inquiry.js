// Inquiry Model
const db = require('../config/database');

class Inquiry {
    /**
     * Create a new inquiry
     */
    static async create(inquiryData) {
        const { property_id, client_id, agent_id, subject, message } = inquiryData;

        const query = `
            INSERT INTO inquiries (property_id, client_id, agent_id, subject, message, status)
            VALUES (?, ?, ?, ?, ?, 'new')
        `;

        const [result] = await db.query(query, [
            property_id, client_id, agent_id, subject, message
        ]);

        return result.insertId;
    }

    /**
     * Get inquiry by ID with details
     */
    static async findById(id) {
        const query = `
            SELECT 
                i.*,
                p.title as property_title,
                p.location as property_location,
                c.name as client_name,
                c.email as client_email,
                c.phone as client_phone,
                a.name as agent_name,
                a.email as agent_email,
                a.phone as agent_phone
            FROM inquiries i
            JOIN properties p ON i.property_id = p.id
            JOIN users c ON i.client_id = c.id
            JOIN users a ON i.agent_id = a.id
            WHERE i.id = ?
        `;

        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    /**
     * Get all inquiries with filters
     */
    static async getAll(filters = {}) {
        let query = `
            SELECT 
                i.*,
                p.title as property_title,
                p.location as property_location,
                c.name as client_name,
                c.email as client_email,
                a.name as agent_name
            FROM inquiries i
            JOIN properties p ON i.property_id = p.id
            JOIN users c ON i.client_id = c.id
            JOIN users a ON i.agent_id = a.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.property_id) {
            query += ' AND i.property_id = ?';
            params.push(filters.property_id);
        }

        if (filters.client_id) {
            query += ' AND i.client_id = ?';
            params.push(filters.client_id);
        }

        if (filters.agent_id) {
            query += ' AND i.agent_id = ?';
            params.push(filters.agent_id);
        }

        if (filters.status) {
            query += ' AND i.status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY i.created_at DESC';

        const [rows] = await db.query(query, params);
        return rows;
    }

    /**
     * Update inquiry status
     */
    static async updateStatus(id, status) {
        const query = 'UPDATE inquiries SET status = ? WHERE id = ?';
        const [result] = await db.query(query, [status, id]);
        return result.affectedRows;
    }

    /**
     * Delete inquiry
     */
    static async delete(id) {
        const query = 'DELETE FROM inquiries WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }

    /**
     * Get inquiry statistics
     */
    static async getStatistics(agentId = null) {
        let query = `
            SELECT 
                status,
                COUNT(*) as count
            FROM inquiries
        `;

        const params = [];
        
        if (agentId) {
            query += ' WHERE agent_id = ?';
            params.push(agentId);
        }

        query += ' GROUP BY status';

        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = Inquiry;
