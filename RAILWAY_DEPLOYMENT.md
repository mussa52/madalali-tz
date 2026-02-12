# Railway Deployment Guide for MADALALI TZ

## Required Environment Variables

Make sure you have set these environment variables in your Railway project:

### Database Configuration (from Railway MySQL service)
```
DB_HOST=your-mysql-host.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-database-password
DB_NAME=railway
```

### Application Configuration
```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secure-jwt-secret-key-here
```

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Select your backend service
3. Click on **Variables** tab
4. Add each variable listed above

### Getting Database Credentials

If you're using Railway's MySQL plugin:

1. In your Railway project, click on your MySQL service
2. Go to the **Variables** tab
3. Copy these values to your backend service variables:
   - `MYSQL_HOST` → Use as `DB_HOST`
   - `MYSQL_PORT` → Use as `DB_PORT`
   - `MYSQL_USER` → Use as `DB_USER`
   - `MYSQL_PASSWORD` → Use as `DB_PASSWORD`
   - `MYSQL_DATABASE` → Use as `DB_NAME`

OR if you have a connection URL:
   - `MYSQL_URL` looks like: `mysql://user:password@host:port/database`
   - Parse it and set individual variables

## Database Setup

After connecting to Railway MySQL, import your database schema:

1. Connect to Railway MySQL using a client or Railway's CLI
2. Import the schema:
   ```bash
   mysql -h your-mysql-host.railway.app -u root -p railway < database/madalali_tz.sql
   ```

OR use Railway CLI:
```bash
railway connect MySQL
mysql railway < database/madalali_tz.sql
```

## Frontend Configuration

The frontend is already configured to use:
```javascript
const API_BASE_URL = 'https://madalali-tz-production.up.railway.app/api';
```

**Important:** Update this URL in `js/app.js` if your Railway domain is different:
- Line 2: Change the URL to match your Railway deployment URL

## Troubleshooting

### Connection Errors

If you see database connection errors:

1. **Check environment variables are set** in Railway dashboard
2. **Verify MySQL service is running** in Railway
3. **Check database credentials** match the MySQL service
4. **Ensure database exists** and schema is imported
5. **Check Railway logs** for specific error messages:
   ```bash
   railway logs
   ```

### Common Issues

1. **"ECONNREFUSED" Error**
   - MySQL service not running
   - Wrong DB_HOST or DB_PORT

2. **"ER_ACCESS_DENIED_ERROR"**
   - Incorrect DB_USER or DB_PASSWORD
   - Check credentials in MySQL service variables

3. **"ER_BAD_DB_ERROR"**
   - Database doesn't exist
   - Import the SQL schema file

4. **"Cannot connect to server"**
   - Backend service not deployed
   - Wrong API_BASE_URL in frontend
   - Check Railway service is running

## Deployment Checklist

- [ ] Railway MySQL service is running
- [ ] All environment variables are set in backend service
- [ ] Database schema is imported
- [ ] JWT_SECRET is set to a secure random string
- [ ] Frontend API_BASE_URL matches your Railway domain
- [ ] Backend service is deployed and running
- [ ] Test login with admin credentials

## Testing Deployment

1. Visit your Railway URL
2. Try to login (check browser console for errors)
3. Check Railway logs for backend errors:
   ```bash
   railway logs
   ```

## Admin Account

Create an admin account after deployment:

```bash
railway run node backend/create-admin.js
```

Or connect to your service and run:
```bash
node backend/create-admin.js
```

## Useful Railway Commands

```bash
# View logs
railway logs

# Connect to MySQL
railway connect MySQL

# Run commands in Railway environment
railway run node your-script.js

# Deploy manually
railway up
```

## Support

If issues persist:
1. Check Railway service logs
2. Verify all environment variables
3. Test database connection separately
4. Check if services are running in Railway dashboard
