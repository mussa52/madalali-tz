// User Model
const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    /**
     * Create a new user
     */
    static async create(userData) {
        const { name, email, password, phone, role = 'client', status = 'active' } = userData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO users (name, email, password, phone, role, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [name, email, hashedPassword, phone, role, status]);
        return result.insertId;
    }

    /**
     * Find user by email
     */
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];
    }

    /**
     * Find user by ID
     */
    static async findById(id) {
        const query = 'SELECT id, name, email, phone, role, status, profile_image, created_at FROM users WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    /**
     * Get all users (with optional filters)
     */
    static async getAll(filters = {}) {
        let query = 'SELECT id, name, email, phone, role, status, created_at FROM users WHERE 1=1';
        const params = [];

        if (filters.role) {
            query += ' AND role = ?';
            params.push(filters.role);
        }

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        return rows;
    }

    /**
     * Update user
     */
    static async update(id, userData) {
        const fields = [];
        const values = [];

        if (userData.name) {
            fields.push('name = ?');
            values.push(userData.name);
        }

        if (userData.email) {
            fields.push('email = ?');
            values.push(userData.email);
        }

        if (userData.phone) {
            fields.push('phone = ?');
            values.push(userData.phone);
        }

        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            fields.push('password = ?');
            values.push(hashedPassword);
        }

        if (userData.role) {
            fields.push('role = ?');
            values.push(userData.role);
        }

        if (userData.status) {
            fields.push('status = ?');
            values.push(userData.status);
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        
        const [result] = await db.query(query, values);
        return result.affectedRows;
    }

    /**
     * Delete user
     */
    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }

    /**
     * Verify password
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Get user statistics
     */
    static async getStatistics() {
        const query = `
            SELECT 
                role,
                COUNT(*) as count
            FROM users
            GROUP BY role
        `;
        const [rows] = await db.query(query);
        return rows;
    }
}

module.exports = User;
