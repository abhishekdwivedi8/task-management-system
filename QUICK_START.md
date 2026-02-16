# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (should be v16+)
node --version

# Check npm
npm --version

# Check MongoDB (should be running)
mongosh
```

## Installation

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend `.env`:**
```bash
cd backend
copy .env.example .env
# Edit .env with your settings
```

**Minimum Required Settings:**
```env
MONGODB_URI=mongodb://localhost:27017/task_management_system
JWT_SECRET=your-secret-key-min-32-chars
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. Initialize Database

```bash
cd backend
npm run init-db
```

### 4. Start Application

**Single Command (Recommended):**
```bash
# From root directory
npm install
npm run dev
```

This will start both backend and frontend servers simultaneously!

**Or run separately:**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Access Application

Open browser: http://localhost:5173

**Login Credentials:**
- Admin: `admin@taskmanagement.com` / `Admin@123`
- User: `john@example.com` / `User@123`

## 🎯 What to Test

1. ✅ Login with demo credentials
2. ✅ View dashboard
3. ✅ Create a new task
4. ✅ Edit and delete tasks
5. ✅ (Admin) Manage users

## 🐛 Quick Troubleshooting

**MongoDB not running?**
```bash
# Windows
net start MongoDB
```

**Port already in use?**
Change `PORT=5001` in backend `.env`

**Email not working?**
Use Gmail App Password (see SETUP_GUIDE.md)

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details

---

**Need Help?** Check the troubleshooting section in SETUP_GUIDE.md
