const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createAdmin() {
  const email = 'admin2@madalali.tz';
  const password = 'admin123';
  const name = 'Admin 2';
  const phone = '0700000000';
  const role = 'admin';
  const status = 'active';

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DATABASE_PORT || process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Admin already exists with this email.');
      await connection.end();
      return;
    }
    await connection.execute(
      'INSERT INTO users (name, email, password, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, role, status]
    );
    await connection.end();
    console.log('Admin created!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (err) {
    console.error('Error creating admin:', err.message);
  }
}

createAdmin();
