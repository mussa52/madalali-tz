# 🚀 MADALALI TZ - Quick Start Guide

## Step-by-Step Installation

### 1. Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MySQL (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- ✅ A code editor (VS Code recommended)
- ✅ A web browser (Chrome, Firefox, Edge)

### 2. Install Node.js Packages

Open terminal in the project folder and run:

```bash
cd backend
npm install
```

This will install all required dependencies:
- express (web framework)
- mysql2 (database driver)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variables)
- cors (cross-origin resource sharing)
- express-validator (input validation)

### 3. Set Up MySQL Database

#### Option A: Using MySQL Workbench (GUI)
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Go to File → Run SQL Script
4. Select `database/madalali_tz.sql`
5. Click Run

#### Option B: Using Command Line
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE madalali_tz;

# Use the database
USE madalali_tz;

# Import the schema
SOURCE database/madalali_tz.sql;

# Exit
exit;
```

#### Option C: Using phpMyAdmin
1. Open phpMyAdmin in browser
2. Click "New" to create database named `madalali_tz`
3. Click "Import" tab
4. Choose file: `database/madalali_tz.sql`
5. Click "Go"

### 4. Configure Environment Variables

1. Navigate to backend folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
3. Edit `.env` file with your settings:
   ```env
   PORT=3000
   NODE_ENV=development

   # Update these with your MySQL credentials
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=madalali_tz

   # Change these for production
   JWT_SECRET=your_secure_random_string
   JWT_EXPIRES_IN=7d

   SESSION_SECRET=your_session_secret
   ```

### 5. Start the Server

```bash
# From backend directory
npm start

# OR for development with auto-restart
npm run dev
```

You should see:
```
✅ Database connected successfully
✅ MADALALI TZ Server running on port 3000
🌐 Frontend: http://localhost:3000
📡 API: http://localhost:3000/api
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 7. Test the System

Use these pre-configured accounts:

**Admin Login:**
- Email: admin@madalali.tz
- Password: admin123
- URL: http://localhost:3000/login.html

**Agent Login:**
- Email: agent@madalali.tz  
- Password: agent123

**Client Login:**
- Email: client@madalali.tz
- Password: client123

---

## Common Installation Issues

### ❌ Issue: "Cannot find module 'express'"
**Solution:** Run `npm install` in the backend directory

### ❌ Issue: "Database connection error"
**Solution:** 
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure database exists

### ❌ Issue: "Port 3000 already in use"
**Solution:**
- Change PORT in `.env` file to 3001 or another port
- Or stop the process using port 3000

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill
```

### ❌ Issue: "JWT token invalid"
**Solution:** Clear browser localStorage and login again

### ❌ Issue: "Cannot read properties of undefined"
**Solution:** Clear browser cache and reload

---

## Directory Structure Overview

```
kigamboni real estate/
│
├── backend/              # Server-side code
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── models/          # Data models
│   ├── routes/          # API endpoints
│   ├── server.js        # Main server file
│   └── package.json     # Dependencies
│
├── frontend/            # Client-side code
│   ├── admin/          # Admin pages
│   ├── agent/          # Agent pages
│   ├── client/         # Client pages
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── index.html      # Landing page
│
├── database/           # Database schema
│   └── madalali_tz.sql
│
└── README.md           # Full documentation
```

---

## Testing Workflow

### 1. Test Admin Features
1. Login as admin
2. View dashboard statistics
3. Manage users (create/edit/delete)
4. Approve/reject properties
5. View all inquiries

### 2. Test Agent Features
1. Login as agent
2. Add new property
3. View your properties
4. Edit/delete properties
5. View inquiries about your properties

### 3. Test Client Features
1. Login as client (or browse without login)
2. Browse properties
3. Filter properties
4. View property details
5. Send inquiry (requires login)

---

## Development Tips

### Hot Reload (Nodemon)
If you installed nodemon, changes to backend files will auto-restart the server:
```bash
npm run dev
```

### Debugging
Enable detailed error messages by setting in `.env`:
```env
NODE_ENV=development
```

### Database Management
View data directly in MySQL:
```sql
USE madalali_tz;
SELECT * FROM users;
SELECT * FROM properties;
SELECT * FROM inquiries;
```

---

## Next Steps

✅ System is now running!

**What to do next:**
1. Test all user roles
2. Add sample properties as agent
3. Approve properties as admin
4. Send inquiries as client
5. Customize the system (colors, features)
6. Deploy to production server (optional)

---

## Production Deployment Notes

When deploying to production:

1. **Change all default passwords**
2. **Use environment variables for secrets**
3. **Enable HTTPS**
4. **Set up proper backup system**
5. **Use production database server**
6. **Enable error logging**
7. **Set NODE_ENV to production**
8. **Implement rate limiting**
9. **Add monitoring tools**
10. **Regular security updates**

---

## Support

If you encounter issues:
1. Check this installation guide
2. Review README.md for detailed documentation
3. Check console for error messages
4. Verify database connection
5. Ensure all dependencies are installed

---

**System Ready! Happy Testing! 🎉**

For full documentation, see [README.md](README.md)
