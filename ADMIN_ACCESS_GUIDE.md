# Admin Access Guide

## Admin Login Credentials

To access the admin section and view users, you must log in with an admin account:

**Admin Account:**
- Email: `admin@taskmanagement.com`
- Password: `Admin@123`

**Regular User Account (for testing):**
- Email: `john@example.com`
- Password: `User@123`

## How to Access Admin Section

1. **Logout** if you're currently logged in as a regular user
2. **Login** with the admin credentials above
3. Navigate to **"Manage Users"** from the sidebar
4. You should now see all registered users

## Troubleshooting

### Issue: "Users not showing in admin section"

**Possible Causes:**

1. **Not logged in as admin**
   - Solution: Logout and login with `admin@taskmanagement.com`
   - Only admin users can access `/admin/users` route

2. **Database not initialized**
   - Solution: Run the database initialization script:
     ```bash
     cd backend
     node scripts/initDatabase.js
     ```

3. **Backend not running**
   - Solution: Make sure backend server is running on port 5000
     ```bash
     cd backend
     npm run dev
     ```

4. **Check browser console**
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Check Network tab for failed API requests

### Verify Admin Status

You can verify if you're logged in as admin by:
1. Go to **Profile** page
2. Check if you see "Administrator Access" badge
3. Check if "Manage Users" appears in the sidebar

## API Endpoint

The admin users endpoint is:
```
GET http://localhost:5000/api/admin/users
```

This endpoint requires:
- Valid JWT token in Authorization header
- User role must be 'admin'
- Email must be verified
- Account status must be 'active'

## Testing with Postman/Thunder Client

1. Login as admin to get token:
   ```
   POST http://localhost:5000/api/auth/login
   Body: {
     "email": "admin@taskmanagement.com",
     "password": "Admin@123"
   }
   ```

2. Copy the token from response

3. Get all users:
   ```
   GET http://localhost:5000/api/admin/users
   Headers: {
     "Authorization": "Bearer YOUR_TOKEN_HERE"
   }
   ```

## Common Errors

### 401 Unauthorized
- You're not logged in
- Token is expired or invalid
- Solution: Login again

### 403 Forbidden
- You're logged in but not as admin
- Solution: Login with admin account

### 404 Not Found
- Backend route not registered
- Check if backend is running
- Verify route in `backend/src/index.js`

### Empty Users Array
- Database might be empty
- Run initialization script
- Check MongoDB connection

## Need Help?

If users still don't show:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify you're using admin credentials
4. Ensure database has users (run init script)
