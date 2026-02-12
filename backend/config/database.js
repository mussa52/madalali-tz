// Database Configuration
const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'madalali_tz',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000
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
        console.error('   Port:', process.env.DB_PORT || '3306');
        console.error('\n💡 For Railway deployment, ensure these environment variables are set:');
        console.error('   DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT');
        return;
    }
    console.log('✅ Database connected successfully');
    connection.release();
});

module.exports = promisePool;
