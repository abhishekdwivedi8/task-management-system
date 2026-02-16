# 📚 API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Error 1", "Error 2"]
}
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user and send OTP to email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Password Requirements:**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! OTP sent to your email.",
  "data": {
    "userId": "64abc123...",
    "email": "john@example.com",
    "name": "John Doe",
    "otpExpiresIn": "5 minutes"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Password must contain at least one uppercase letter",
    "Password must contain at least one number"
  ]
}
```

---

### 2. Verify OTP
**POST** `/auth/verify-otp`

Verify email using OTP code.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid OTP",
  "attemptsLeft": 3
}
```

---

### 3. Resend OTP
**POST** `/auth/resend-otp`

Request a new OTP code.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "New OTP sent to your email.",
  "data": {
    "otpExpiresIn": "5 minutes"
  }
}
```

**Rate Limit:** 1 request per minute per email

---

### 4. Login
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true,
      "createdAt": "2026-02-14T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- **401:** Invalid credentials
- **403:** Email not verified
- **423:** Account locked (too many failed attempts)

---

### 5. Get Profile
**GET** `/auth/me`

Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true,
      "createdAt": "2026-02-14T10:00:00.000Z"
    }
  }
}
```

---

### 6. Logout
**POST** `/auth/logout`

Logout current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

## 📝 Task Endpoints

### 1. Get All Tasks
**GET** `/tasks`

Get paginated list of tasks with filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `status` (string) - Filter by status (pending, in-progress, completed, cancelled)
- `priority` (string) - Filter by priority (low, medium, high, urgent)
- `search` (string) - Search in title and description

**Example:**
```
GET /tasks?page=1&limit=10&status=pending&priority=high&search=project
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "64abc123...",
        "title": "Complete project documentation",
        "description": "Write comprehensive docs...",
        "status": "in-progress",
        "priority": "high",
        "createdBy": {
          "_id": "64def456...",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "dueDate": "2026-02-20T00:00:00.000Z",
        "createdAt": "2026-02-14T10:00:00.000Z",
        "updatedAt": "2026-02-14T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 2. Get Task by ID
**GET** `/tasks/:id`

Get single task details.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "64abc123...",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation...",
      "status": "in-progress",
      "priority": "high",
      "createdBy": {
        "_id": "64def456...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      "dueDate": "2026-02-20T00:00:00.000Z",
      "createdAt": "2026-02-14T10:00:00.000Z",
      "updatedAt": "2026-02-14T10:00:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found."
}
```

---

### 3. Create Task
**POST** `/tasks`

Create a new task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the project",
  "priority": "high",
  "status": "pending",
  "dueDate": "2026-02-20T00:00:00.000Z",
  "tags": ["documentation", "project"]
}
```

**Validation Rules:**
- `title`: Required, 3-100 characters
- `description`: Required, 10-1000 characters
- `priority`: Optional, one of: low, medium, high, urgent
- `status`: Optional, one of: pending, in-progress, completed, cancelled
- `dueDate`: Optional, valid ISO 8601 date
- `tags`: Optional, array of strings

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully!",
  "data": {
    "task": {
      "_id": "64abc123...",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation...",
      "status": "pending",
      "priority": "high",
      "createdBy": {
        "_id": "64def456...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "dueDate": "2026-02-20T00:00:00.000Z",
      "tags": ["documentation", "project"],
      "createdAt": "2026-02-14T10:00:00.000Z"
    }
  }
}
```

---

### 4. Update Task
**PUT** `/tasks/:id`

Update an existing task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "medium",
  "dueDate": "2026-02-25T00:00:00.000Z"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully!",
  "data": {
    "task": { ... }
  }
}
```

**Authorization:**
- Users can only update their own tasks
- Admins can update any task

---

### 5. Delete Task
**DELETE** `/tasks/:id`

Soft delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully!"
}
```

**Authorization:**
- Users can only delete their own tasks
- Admins can delete any task

---

### 6. Get Task Statistics
**GET** `/tasks/stats`

Get task statistics for current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 25,
      "pending": 10,
      "inProgress": 8,
      "completed": 5,
      "cancelled": 2,
      "highPriority": 7
    }
  }
}
```

---

## 👨‍💼 Admin Endpoints

### 1. Get All Users
**GET** `/admin/users`

Get paginated list of all users (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `role` (string) - Filter by role (user, admin)
- `verified` (boolean) - Filter by verification status
- `search` (string) - Search by name or email

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64abc123...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isEmailVerified": true,
        "accountStatus": "active",
        "createdAt": "2026-02-14T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 2. Get User by ID
**GET** `/admin/users/:id`

Get detailed user information (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true,
      "accountStatus": "active",
      "createdAt": "2026-02-14T10:00:00.000Z"
    },
    "taskStats": {
      "total": 15,
      "completed": 8,
      "pending": 5,
      "inProgress": 2
    }
  }
}
```

---

### 3. Update User Role
**PUT** `/admin/users/:id/role`

Update user role (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User role updated to admin successfully!",
  "data": {
    "user": { ... }
  }
}
```

---

### 4. Update User Status
**PUT** `/admin/users/:id/status`

Suspend or activate user account (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "suspended"
}
```

**Valid Status Values:**
- `active` - User can login
- `suspended` - User cannot login

**Success Response (200):**
```json
{
  "success": true,
  "message": "User account suspended successfully!",
  "data": {
    "user": { ... }
  }
}
```

---

### 5. Delete User
**DELETE** `/admin/users/:id`

Soft delete a user (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully!"
}
```

---

### 6. Get System Statistics
**GET** `/admin/stats`

Get system-wide statistics (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "verified": 120,
      "admins": 5,
      "recentRegistrations": 15
    },
    "tasks": {
      "total": 500,
      "completed": 300,
      "pending": 150,
      "completionRate": "60.00"
    }
  }
}
```

---

## 🔒 Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Invalid Token |
| 403 | Forbidden / Insufficient Permissions |
| 404 | Not Found |
| 423 | Locked / Account Locked |
| 429 | Too Many Requests / Rate Limited |
| 500 | Internal Server Error |

---

## 🚦 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Auth Endpoints**: 10 requests per 15 minutes
- **OTP Resend**: 1 request per minute

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. User ID is automatically extracted from JWT token
3. Soft deletes are used (data is not permanently removed)
4. All responses include `success` boolean field
5. Pagination is 1-indexed (first page is 1, not 0)

---

**For more information, refer to the main README.md**
