# 🎯 Task Management System

An enterprise-grade, full-stack Task Management System built with the MERN stack, featuring JWT authentication, OTP email verification, role-based access control, and a beautiful golden-themed UI.

## ✨ Features

### 🔐 Security Features
- **JWT Authentication** - Secure token-based authentication
- **Email OTP Verification** - Mandatory email verification before login
- **Password Encryption** - bcrypt with salt rounds of 12
- **Role-Based Access Control (RBAC)** - Admin and User roles
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Comprehensive validation on both frontend and backend
- **XSS Protection** - Input sanitization and helmet security headers
- **NoSQL Injection Prevention** - MongoDB sanitization
- **Account Lockout** - Automatic lockout after failed login attempts

### 👤 User Features
- User registration with email verification
- Secure login with account lockout protection
- Profile management
- Task creation with title, description, priority, and due date
- Task listing with pagination, search, and filters
- Task detail view with edit and delete capabilities
- Task status tracking (Pending, In Progress, Completed, Cancelled)
- Priority levels (Low, Medium, High, Urgent)
- Dashboard with statistics and recent tasks

### 👨‍💼 Admin Features
- View all users with pagination and filters
- Update user roles (User/Admin)
- Suspend/Activate user accounts
- Delete users
- System statistics dashboard
- User activity monitoring

## 🎨 Design

The application features a beautiful **Golden Government Theme** with:
- Cream and gold color palette
- Indian flag-inspired accent colors (Saffron, Green, Blue)
- Smooth gradients and transitions
- Responsive design for all devices
- Accessibility-compliant UI components

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - NoSQL injection prevention
- **validator** - Input validation

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Vite** - Build tool

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn
- Email account for SMTP (Gmail recommended)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd Task_Management_System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/task_management_system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Task Management System <noreply@taskmanagement.com>

# OTP Configuration
OTP_EXPIRY_MINUTES=5

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Initialize Database

```bash
cd backend
npm run init-db
```

This will create:
- Admin user: `admin@taskmanagement.com` / `Admin@123`
- Regular user: `john@example.com` / `User@123`
- Sample tasks

### 5. Start the Application

**Option 1 - Run Both Servers Together (Recommended):**
```bash
# From root directory
npm install
npm run dev
```

**Option 2 - Run Servers Separately:**

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

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
3. Use the app password in `EMAIL_PASSWORD` in `.env`

### Other Email Providers
Update the following in `.env`:
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - Your email
- `EMAIL_PASSWORD` - Your password/app password

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Tasks
- `GET /api/tasks` - Get all tasks with pagination (Protected)
- `GET /api/tasks/:id` - Get single task (Protected)
- `POST /api/tasks` - Create new task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)
- `GET /api/tasks/stats` - Get task statistics (Protected)

### Admin
- `GET /api/admin/users` - Get all users (Admin Only)
- `GET /api/admin/users/:id` - Get user by ID (Admin Only)
- `PUT /api/admin/users/:id/role` - Update user role (Admin Only)
- `PUT /api/admin/users/:id/status` - Update user status (Admin Only)
- `DELETE /api/admin/users/:id` - Delete user (Admin Only)
- `GET /api/admin/stats` - Get system statistics (Admin Only)

## 🔒 Security Measures Implemented

1. **Authentication & Authorization**
   - JWT tokens with expiration
   - Role-based access control
   - Protected routes

2. **Password Security**
   - bcrypt hashing with 12 salt rounds
   - Password strength validation
   - Secure password storage

3. **Email Verification**
   - Mandatory OTP verification
   - 5-minute OTP expiry
   - Single-use OTP tokens
   - Rate-limited OTP requests

4. **Account Protection**
   - Account lockout after 5 failed attempts
   - 2-hour lockout duration
   - Login attempt tracking

5. **API Security**
   - Rate limiting (100 requests per 15 minutes)
   - Stricter rate limiting for auth endpoints (10 requests per 15 minutes)
   - Helmet security headers
   - CORS configuration
   - NoSQL injection prevention
   - XSS protection

6. **Input Validation**
   - Server-side validation
   - Client-side validation
   - Data sanitization
   - Type checking

7. **Error Handling**
   - Secure error messages
   - No sensitive data exposure
   - Proper HTTP status codes

## 📱 User Flow

### Registration Flow
1. User fills registration form
2. System validates input
3. User account created (unverified)
4. OTP sent to email
5. User enters OTP
6. Email verified
7. User can now login

### Login Flow
1. User enters credentials
2. System checks email verification
3. System validates password
4. JWT token generated
5. User redirected to dashboard

### Task Management Flow
1. User creates task
2. Task saved with user ID from JWT
3. User can view, edit, delete own tasks
4. Admin can view all tasks

## 🎨 Color Scheme

### Primary Colors
- **Cream Tones**: #fffdf7, #fffbf0, #fff5d6
- **Gold Tones**: #d4af37, #ca8a04, #a16207

### Accent Colors
- **Saffron**: #ff9933, #ff8800
- **Indian Green**: #138808, #0f6b06
- **Indian Blue**: #000080, #000066

## 📊 Project Structure

```
Task_Management_System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── email.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── taskController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── adminRoutes.js
│   │   └── index.js
│   ├── scripts/
│   │   └── initDatabase.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyOTP.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── CreateTask.jsx
│   │   │   ├── TaskDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with valid data
- [ ] Email OTP verification
- [ ] Login with verified account
- [ ] Login attempt with unverified account (should fail)
- [ ] Create task
- [ ] View task list with pagination
- [ ] Edit task
- [ ] Delete task
- [ ] Admin user management
- [ ] Role-based access control
- [ ] Rate limiting
- [ ] Account lockout after failed attempts

## 🐛 Troubleshooting

### Email Not Sending
- Check SMTP credentials in `.env`
- Verify email service is not blocking
- Check spam/junk folder
- Enable "Less secure app access" for Gmail (or use App Password)

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `VITE_API_URL` in frontend `.env`

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ using MERN Stack

## 🙏 Acknowledgments

- React Team for React 18
- Express.js Team
- MongoDB Team
- Tailwind CSS Team
- All open-source contributors

---

**Note**: This is an enterprise-grade application with production-ready security measures. Always use environment variables for sensitive data and never commit `.env` files to version control.
