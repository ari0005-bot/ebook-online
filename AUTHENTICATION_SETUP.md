# Authentication Setup - EduHub Ebook Platform

## Overview

Authentication has been successfully fixed and is now working with a proper backend server!

## What Was Fixed

### 1. Backend Server Created
- **Location**: `server/server.js`
- **Port**: 5000
- **Technology**: Express.js with JWT authentication

### 2. Authentication Endpoints

#### Register (POST /api/auth/register)
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login (POST /api/auth/login)
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Google Login (POST /api/auth/google)
```json
{
  "token": "google-oauth-token"
}
```

### 3. Features
- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Google OAuth login support
- ✅ Password validation (minimum 6 characters)
- ✅ Email uniqueness check
- ✅ Automatic admin role assignment (if email contains 'admin')
- ✅ New users get 100,000 balance for testing
- ✅ JWT tokens expire in 7 days
- ✅ Protected routes with token verification

## How to Run

### Option 1: Run Both Servers (Recommended)
```bash
npm run dev:all
```
This starts both frontend (port 3001) and backend (port 5000) simultaneously.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Access Points

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Testing Authentication

1. Open http://localhost:3001
2. Click "Masuk" or "Registrasi" button
3. Try registering a new account:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Or login with existing credentials
5. Try Google login (requires Google OAuth setup)

## Default Test Accounts

You can register new accounts, or use these test scenarios:

**Regular User:**
- Email: user@example.com
- Password: password123

**Admin User:**
- Email: admin@example.com
- Password: password123
- (Automatically gets admin role)

## Environment Variables

Located in `server/.env`:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Important Notes

⚠️ **Development Only:**
- Passwords are stored in plain text (use bcrypt in production)
- User data is stored in memory (resets on server restart)
- JWT secret is hardcoded (change in production)

🔒 **Production Requirements:**
1. Hash passwords with bcrypt
2. Use a database (PostgreSQL, MySQL, MongoDB)
3. Use environment variables for secrets
4. Enable HTTPS
5. Add rate limiting
6. Implement proper CORS policies

## Troubleshooting

**Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Backend not responding:**
- Check if server is running: http://localhost:5000/api/health
- Check console for errors
- Verify .env file exists in server directory

**Frontend can't connect:**
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Verify API URL in src/services/api.ts

## Next Steps

1. Test registration and login
2. Test Google OAuth (requires Google Cloud Console setup)
3. Test purchasing books with the new balance system
4. Consider adding email verification
5. Add password reset functionality
6. Implement proper database (Sequelize/Prisma)

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console for frontend errors
- Network tab for API request/response debugging