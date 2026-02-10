# MADALALI TZ - Real Estate Management System

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Installation Guide](#installation-guide)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Sample Credentials](#sample-credentials)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Future Enhancements](#future-enhancements)

---

## 🌟 Overview

**MADALALI TZ** is a comprehensive web-based Real Estate Management System designed for Small & Medium Enterprises (SMEs) in Tanzania. The system enables efficient property listing, management, and client-agent communication through a role-based access control architecture.

### System Highlights
- 🔐 Secure authentication with JWT
- 👥 Three user roles (Admin, Agent, Client)
- 🏠 Complete property CRUD operations
- ✅ Property approval workflow
- 💬 Inquiry management system
- 📱 Responsive design (mobile-friendly)
- 🔍 Advanced search and filtering

---

## ✨ Features

### Admin Features
- ✅ Dashboard with system statistics
- 👥 User management (Create, Read, Update, Delete)
- 🏠 Property approval/rejection workflow
- 📊 System monitoring and analytics
- 💬 View all inquiries
- 🔒 Full system access control

### Agent Features
- 📊 Personal dashboard with statistics
- ➕ Add new property listings
- ✏️ Edit own properties
- 🗑️ Delete own properties
- 📋 View property approval status
- 💬 Manage client inquiries
- 📈 Track property performance

### Client Features
- 🔍 Browse approved properties
- 🔎 Advanced search and filtering
- 📄 View detailed property information
- 💬 Send inquiries to agents
- 📧 Track inquiry responses
- ⭐ Save favorite properties

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js v14+
- **Framework:** Express.js v4.18+
- **Database:** MySQL v8.0+
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Environment:** dotenv

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS variables
- **Vanilla JavaScript** - No frameworks (as required)
- **Fetch API** - For AJAX requests

### Development Tools
- **Nodemon** - Development server auto-restart
- **npm** - Package management

---

## 🏗️ System Architecture

### Client-Server Architecture (MVC Pattern)

```
┌─────────────┐
│   Client    │  (Frontend: HTML, CSS, JS)
│  (Browser)  │
└──────┬──────┘
       │ HTTP/HTTPS
       │ REST API
┌──────▼──────┐
│   Server    │  (Backend: Node.js + Express)
│             │
│  ┌────────┐ │
│  │ Routes │ │
│  └───┬────┘ │
│      │      │
│  ┌───▼─────┐│
│  │Controllers│
│  └───┬─────┘│
│      │      │
│  ┌───▼────┐ │
│  │ Models │ │
│  └───┬────┘ │
└──────┼──────┘
       │
┌──────▼──────┐
│   MySQL     │  (Database)
│  Database   │
└─────────────┘
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'agent', 'client') DEFAULT 'client',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Properties Table
```sql
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    property_type ENUM('house', 'apartment', 'land', 'commercial', 'villa', 'condo'),
    listing_type ENUM('sale', 'rent'),
    price DECIMAL(15, 2) NOT NULL,
    location VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    bedrooms INT,
    bathrooms INT,
    area_sqm DECIMAL(10, 2),
    parking_spaces INT,
    features TEXT,
    agent_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'sold', 'rented') DEFAULT 'pending',
    views_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Property Images Table
```sql
CREATE TABLE property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
```

### Inquiries Table
```sql
CREATE TABLE inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    client_id INT NOT NULL,
    agent_id INT NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'responded', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Logs Table (Optional)
```sql
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## 📦 Installation Guide

### Prerequisites
- Node.js v14 or higher
- MySQL v8.0 or higher
- npm or yarn package manager

### Step 1: Clone or Extract Project
```bash
cd "kigamboni real estate"
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the backend directory (copy from `.env.example`):

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=madalali_tz

JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRES_IN=7d

SESSION_SECRET=your_session_secret
```

### Step 4: Set Up Database
1. Open MySQL:
```bash
mysql -u root -p
```

2. Create database and import schema:
```sql
CREATE DATABASE madalali_tz;
USE madalali_tz;
SOURCE database/madalali_tz.sql;
```

Or use MySQL Workbench to import the `database/madalali_tz.sql` file.

### Step 5: Start the Server
```bash
# From backend directory
npm start

# For development with auto-restart
npm run dev
```

The server will start on http://localhost:3000

### Step 6: Access the Application
Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+255712345678",
  "role": "client"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Property Endpoints

#### Get All Properties
```http
GET /api/properties?status=approved&property_type=house&city=Dar es Salaam
```

#### Get Property by ID
```http
GET /api/properties/:id
```

#### Create Property (Agent only)
```http
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Modern Villa",
  "description": "Beautiful villa...",
  "property_type": "villa",
  "listing_type": "sale",
  "price": 250000000,
  "location": "Kigamboni",
  "city": "Dar es Salaam",
  "bedrooms": 3,
  "bathrooms": 2,
  "area_sqm": 250
}
```

#### Update Property
```http
PUT /api/properties/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 300000000
}
```

#### Delete Property
```http
DELETE /api/properties/:id
Authorization: Bearer {token}
```

#### Approve/Reject Property (Admin only)
```http
PUT /api/properties/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved"
}
```

### Inquiry Endpoints

#### Create Inquiry (Client only)
```http
POST /api/inquiries
Authorization: Bearer {token}
Content-Type: application/json

{
  "property_id": 1,
  "subject": "Interested in this property",
  "message": "I would like to schedule a viewing..."
}
```

#### Get All Inquiries
```http
GET /api/inquiries
Authorization: Bearer {token}
```

#### Update Inquiry Status (Agent/Admin)
```http
PUT /api/inquiries/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "responded"
}
```

### User Management Endpoints (Admin only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

#### Create User
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Agent",
  "email": "agent@example.com",
  "password": "password123",
  "role": "agent"
}
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer {token}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

---

## 👥 User Roles & Permissions

### Role-Based Access Control Matrix

| Feature | Admin | Agent | Client |
|---------|-------|-------|--------|
| View Dashboard | ✅ | ✅ | ✅ |
| Browse Properties | ✅ | ✅ | ✅ |
| Add Property | ✅ | ✅ | ❌ |
| Edit Own Property | ✅ | ✅ | ❌ |
| Edit All Properties | ✅ | ❌ | ❌ |
| Delete Own Property | ✅ | ✅ | ❌ |
| Delete Any Property | ✅ | ❌ | ❌ |
| Approve/Reject Property | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Send Inquiry | ❌ | ❌ | ✅ |
| View Own Inquiries | ✅ | ✅ | ✅ |
| View All Inquiries | ✅ | ❌ | ❌ |
| Respond to Inquiries | ✅ | ✅ | ❌ |

---

## 🔑 Sample Credentials

For testing purposes, use these pre-configured accounts:

### Admin Account
- **Email:** admin@madalali.tz
- **Password:** admin123
- **Access:** Full system control

### Agent Account
- **Email:** agent@madalali.tz
- **Password:** agent123
- **Access:** Property management

### Client Account
- **Email:** client@madalali.tz
- **Password:** client123
- **Access:** Browse and inquire

**Note:** Change these credentials in production!

---

## 📁 Project Structure

```
kigamboni real estate/
│
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── propertyController.js # Property CRUD
│   │   └── inquiryController.js  # Inquiry management
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Property.js          # Property model
│   │   └── Inquiry.js           # Inquiry model
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   ├── propertyRoutes.js    # Property endpoints
│   │   └── inquiryRoutes.js     # Inquiry endpoints
│   ├── server.js                # Main server file
│   └── package.json             # Dependencies
│
├── frontend/
│   ├── admin/
│   │   ├── dashboard.html       # Admin dashboard
│   │   └── properties.html      # Property management
│   ├── agent/
│   │   ├── dashboard.html       # Agent dashboard
│   │   ├── add-property.html    # Add property form
│   │   └── properties.html      # Agent properties
│   ├── client/
│   │   └── properties.html      # Browse properties
│   ├── css/
│   │   └── style.css            # Main stylesheet
│   ├── js/
│   │   └── app.js               # Core JavaScript
│   ├── index.html               # Landing page
│   ├── login.html               # Login page
│   └── register.html            # Registration page
│
├── database/
│   └── madalali_tz.sql          # Database schema
│
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

---

## 🔒 Security Features

### Implemented Security Measures

1. **Password Security**
   - Passwords hashed using bcryptjs (10 salt rounds)
   - Never stored in plain text

2. **JWT Authentication**
   - Secure token-based authentication
   - Tokens expire after 7 days
   - Stored securely in localStorage

3. **Input Validation**
   - Server-side validation using express-validator
   - Client-side validation with JavaScript
   - Protection against SQL injection

4. **Access Control**
   - Role-based access control (RBAC)
   - Middleware authentication checks
   - Route-level authorization

5. **Database Security**
   - Foreign key constraints
   - Prepared statements (parameterized queries)
   - Connection pooling

6. **Error Handling**
   - Graceful error messages
   - No sensitive data in error responses
   - Proper HTTP status codes

### Security Best Practices Recommendations

```
⚠️  IMPORTANT FOR PRODUCTION:

1. Change JWT_SECRET to a strong, random string
2. Use HTTPS (SSL/TLS certificates)
3. Change default admin password immediately
4. Enable CORS with specific origins
5. Implement rate limiting
6. Add request logging
7. Regular security audits
8. Keep dependencies updated
9. Use environment-specific configurations
10. Implement backup strategies
```

---

## 🚀 Future Enhancements

### Potential Features for Version 2.0

- [ ] Image upload functionality with Multer
- [ ] Email notifications (using Nodemailer)
- [ ] SMS notifications (Twilio integration)
- [ ] Property comparison feature
- [ ] Advanced analytics dashboard
- [ ] Payment integration (M-Pesa API)
- [ ] Property booking system
- [ ] Reviews and ratings
- [ ] Interactive maps (Google Maps API)
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Export reports (PDF generation)
- [ ] Social media integration
- [ ] Live chat support
- [ ] Property recommendation engine

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: Database Connection Failed
```
Solution:
1. Verify MySQL is running
2. Check credentials in .env file
3. Ensure database exists
4. Check firewall settings
```

#### Issue: JWT Token Expired
```
Solution:
1. Login again to get new token
2. Increase JWT_EXPIRES_IN in .env
```

#### Issue: Port Already in Use
```
Solution:
1. Change PORT in .env
2. Or kill process using port 3000:
   Windows: netstat -ano | findstr :3000
   Linux/Mac: lsof -ti:3000 | xargs kill
```

---

## 📞 Support & Contact

For academic support or issues:
- Review code comments
- Check API documentation above
- Verify database schema
- Test with sample credentials

---

## 📄 License

This project is developed for academic purposes. Feel free to use and modify for educational projects.

---

## 🎓 Academic Note

This system demonstrates:
- ✅ Full-stack web development
- ✅ RESTful API design
- ✅ Database design and normalization
- ✅ Authentication and authorization
- ✅ Role-based access control
- ✅ MVC architecture
- ✅ Client-server communication
- ✅ Security best practices
- ✅ Responsive web design
- ✅ Code organization and documentation

**Suitable for:**
- Final year projects
- Web development coursework
- Software engineering capstone projects
- Full-stack development portfolios

---

## 🙏 Acknowledgments

Built with modern web technologies and best practices for real estate management in Tanzania.

**© 2026 MADALALI TZ - Real Estate Management System**
