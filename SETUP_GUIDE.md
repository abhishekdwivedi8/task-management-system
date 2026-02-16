# 🚀 Complete Setup Guide

## Step-by-Step Installation

### Step 1: Install Prerequisites

#### Install Node.js
1. Download from https://nodejs.org/ (LTS version recommended)
2. Verify installation:
```bash
node --version
npm --version
```

#### Install MongoDB
**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer and follow instructions
3. MongoDB will run as a Windows service

**Verify MongoDB:**
```bash
mongosh
```

### Step 2: Clone and Setup Project

```bash
# Navigate to project directory
cd Task_Management_System

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables

#### Backend Configuration

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task_management_system
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Task Management <noreply@taskmanagement.com>
OTP_EXPIRY_MINUTES=5
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Configuration (Optional)

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Gmail SMTP Setup

1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password
   - Use this in `EMAIL_PASSWORD` in `.env`

3. **Alternative: Use Less Secure Apps (Not Recommended)**
   - Go to https://myaccount.google.com/lesssecureapps
   - Turn on "Allow less secure apps"

### Step 5: Initialize Database

```bash
cd backend
npm run init-db
```

**Expected Output:**
```
✅ MongoDB Connected
✅ Data cleared
✅ Admin user created
   Email: admin@taskmanagement.com
   Password: Admin@123
✅ Regular user created
   Email: john@example.com
   Password: User@123
✅ 5 sample tasks created
```

### Step 6: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected
✅ Email configuration verified
🚀 Server running on port 5000
📍 Environment: development
🌐 API Base URL: http://localhost:5000/api
💚 Health Check: http://localhost:5000/health
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 7: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### Step 8: Test Login

**Admin Account:**
- Email: `admin@taskmanagement.com`
- Password: `Admin@123`

**User Account:**
- Email: `john@example.com`
- Password: `User@123`

## 🔧 Configuration Options

### JWT Configuration
- `JWT_SECRET`: Must be at least 32 characters for security
- `JWT_EXPIRE`: Token expiration time (e.g., 7d, 24h, 60m)

### Email Configuration
- `EMAIL_HOST`: SMTP server hostname
- `EMAIL_PORT`: SMTP port (587 for TLS, 465 for SSL)
- `EMAIL_USER`: Your email address
- `EMAIL_PASSWORD`: Your email password or app password
- `EMAIL_FROM`: Display name and email for outgoing emails

### OTP Configuration
- `OTP_EXPIRY_MINUTES`: OTP validity duration (default: 5 minutes)

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window (default: 100)

## 🐛 Common Issues and Solutions

### Issue 1: MongoDB Connection Failed
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Check if running
   mongosh
   ```

2. Verify `MONGODB_URI` in `.env`

### Issue 2: Email Not Sending
**Error:** `Failed to send OTP email`

**Solution:**
1. Check Gmail credentials
2. Verify App Password is correct
3. Enable 2-Factor Authentication
4. Check spam folder
5. Test email configuration:
   ```bash
   cd backend
   node scripts/testEmail.js
   ```

### Issue 3: Port Already in Use
**Error:** `EADDRINUSE: address already in use`

**Solution:**
1. Change port in `backend/.env`:
   ```env
   PORT=5001
   ```

2. Update frontend API URL if needed

### Issue 4: JWT Token Invalid
**Error:** `Invalid token`

**Solution:**
1. Clear browser localStorage
2. Logout and login again
3. Check `JWT_SECRET` is set correctly

### Issue 5: CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Verify `FRONTEND_URL` in backend `.env`
2. Ensure frontend is running on correct port
3. Check CORS configuration in `backend/src/index.js`

## 📊 Database Management

### View Database
```bash
mongosh
use task_management_system
db.users.find()
db.tasks.find()
```

### Reset Database
```bash
cd backend
npm run init-db
```

### Backup Database
```bash
mongodump --db task_management_system --out ./backup
```

### Restore Database
```bash
mongorestore --db task_management_system ./backup/task_management_system
```

## 🔐 Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable HTTPS in production**
4. **Use environment-specific configurations**
5. **Regularly update dependencies**
6. **Monitor rate limiting logs**
7. **Implement proper logging**
8. **Use secure password policies**

## 📱 Testing the Application

### Test Registration Flow
1. Go to http://localhost:5173/register
2. Fill in registration form
3. Check email for OTP
4. Enter OTP on verification page
5. Login with credentials

### Test Task Management
1. Login to application
2. Create a new task
3. View task list
4. Edit task details
5. Delete task

### Test Admin Features
1. Login as admin
2. Navigate to "Manage Users"
3. View all users
4. Change user role
5. Suspend/Activate users

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=very-long-random-string-min-64-characters
FRONTEND_URL=https://yourdomain.com
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Backend
1. Use PM2 for process management
2. Configure reverse proxy (Nginx)
3. Enable HTTPS with SSL certificate
4. Set up monitoring and logging

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Review error logs
3. Verify all environment variables
4. Test each component separately

---

**Happy Coding! 🎉**
