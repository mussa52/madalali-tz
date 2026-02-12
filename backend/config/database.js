// Database Configuration
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Build connection config - support Railway's MYSQL_URL or individual env vars
const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

// Create connection pool for better performance
// mysql2 accepts a connection string directly as the first argument
const pool = connectionUrl
    ? mysql.createPool(connectionUrl)
    : mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'madalali_tz',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

// Promisify for async/await usage
const promisePool = pool.promise();

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection error:');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('\n⚠️  TROUBLESHOOTING:');
        if (err.code === 'ECONNREFUSED') {
            console.error('   → MySQL server is not running');
            console.error('   → Start MySQL using START-MYSQL.bat or XAMPP Control Panel');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   → Incorrect database credentials');
            console.error('   → Check DB_USER and DB_PASSWORD in .env file');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('   → Database does not exist');
            console.error('   → Run: mysql -u root -e "CREATE DATABASE madalali_tz"');
            console.error('   → Then import: mysql -u root madalali_tz < database/madalali_tz.sql');
        }
        console.error('\n   Current config:');
        console.error('   Host:', process.env.DB_HOST || 'localhost');
        console.error('   User:', process.env.DB_USER || 'root');
        console.error('   Database:', process.env.DB_NAME || 'madalali_tz');
        return;
    }
    console.log('✅ Database connected successfully');
    connection.release();
});

module.exports = promisePool;
