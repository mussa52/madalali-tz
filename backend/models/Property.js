// Property Model
const db = require('../config/database');

class Property {
    /**
     * Create a new property
     */
    static async create(propertyData) {
        const {
            title, description, property_type, listing_type, price,
            location, city, address, bedrooms, bathrooms, area_sqm,
            parking_spaces, features, agent_id, status = 'pending'
        } = propertyData;

        const query = `
            INSERT INTO properties (
                title, description, property_type, listing_type, price,
                location, city, address, bedrooms, bathrooms, area_sqm,
                parking_spaces, features, agent_id, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            title, description, property_type, listing_type, price,
            location, city, address, bedrooms, bathrooms, area_sqm,
            parking_spaces, features, agent_id, status
        ]);

        return result.insertId;
    }

    /**
     * Get property by ID with agent info and images
     */
    static async findById(id) {
        const query = `
            SELECT 
                p.*,
                u.name as agent_name,
                u.email as agent_email,
                u.phone as agent_phone
            FROM properties p
            JOIN users u ON p.agent_id = u.id
            WHERE p.id = ?
        `;

        const [rows] = await db.query(query, [id]);
        
        if (rows.length === 0) return null;

        const property = rows[0];

        // Get property images
        const [images] = await db.query(
            'SELECT * FROM property_images WHERE property_id = ? ORDER BY display_order',
            [id]
        );

        property.images = images;
        return property;
    }

    /**
     * Get all properties with filters
     */
    static async getAll(filters = {}) {
        let query = `
            SELECT 
                p.*,
                u.name as agent_name,
                u.email as agent_email
            FROM properties p
            JOIN users u ON p.agent_id = u.id
            WHERE 1=1
        `;
        const params = [];

        // Apply filters
        if (filters.status) {
            query += ' AND p.status = ?';
            params.push(filters.status);
        }

        if (filters.property_type) {
            query += ' AND p.property_type = ?';
            params.push(filters.property_type);
        }

        if (filters.listing_type) {
            query += ' AND p.listing_type = ?';
            params.push(filters.listing_type);
        }

        if (filters.city) {
            query += ' AND p.city LIKE ?';
            params.push(`%${filters.city}%`);
        }

        if (filters.location) {
            query += ' AND p.location LIKE ?';
            params.push(`%${filters.location}%`);
        }

        if (filters.min_price) {
            query += ' AND p.price >= ?';
            params.push(filters.min_price);
        }

        if (filters.max_price) {
            query += ' AND p.price <= ?';
            params.push(filters.max_price);
        }

        if (filters.bedrooms) {
            query += ' AND p.bedrooms >= ?';
            params.push(filters.bedrooms);
        }

        if (filters.agent_id) {
            query += ' AND p.agent_id = ?';
            params.push(filters.agent_id);
        }

        if (filters.search) {
            query += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.location LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY p.created_at DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(filters.limit));
        }

        const [rows] = await db.query(query, params);

        // Get primary image for each property
        for (let property of rows) {
            const [images] = await db.query(
                'SELECT * FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, display_order LIMIT 1',
                [property.id]
            );
            property.primary_image = images[0] || null;
        }

        return rows;
    }

    /**
     * Update property
     */
    static async update(id, propertyData) {
        const fields = [];
        const values = [];

        const allowedFields = [
            'title', 'description', 'property_type', 'listing_type', 'price',
            'location', 'city', 'address', 'bedrooms', 'bathrooms', 'area_sqm',
            'parking_spaces', 'features', 'status', 'featured'
        ];

        allowedFields.forEach(field => {
            if (propertyData[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(propertyData[field]);
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const query = `UPDATE properties SET ${fields.join(', ')} WHERE id = ?`;

        const [result] = await db.query(query, values);
        return result.affectedRows;
    }

    /**
     * Delete property
     */
    static async delete(id) {
        const query = 'DELETE FROM properties WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }

    /**
     * Increment property views
     */
    static async incrementViews(id) {
        const query = 'UPDATE properties SET views_count = views_count + 1 WHERE id = ?';
        await db.query(query, [id]);
    }

    /**
     * Get property statistics
     */
    static async getStatistics() {
        const query = `
            SELECT 
                status,
                COUNT(*) as count,
                AVG(price) as avg_price
            FROM properties
            GROUP BY status
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    /**
     * Add property image
     */
    static async addImage(propertyId, imageUrl, isPrimary = false, displayOrder = 0) {
        const query = `
            INSERT INTO property_images (property_id, image_url, is_primary, display_order)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [propertyId, imageUrl, isPrimary, displayOrder]);
        return result.insertId;
    }

    /**
     * Get property images
     */
    static async getImages(propertyId) {
        const query = 'SELECT * FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, display_order';
        const [rows] = await db.query(query, [propertyId]);
        return rows;
    }
}

module.exports = Property;
