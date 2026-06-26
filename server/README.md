# Backend Server - EduHub Ebook Platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Change `JWT_SECRET` to a secure random string in production
   - Add your Google OAuth credentials if using Google login

## Running the Server

### Development (with auto-reload):
```bash
npm run dev:server
```

### Production:
```bash
node server.js
```

The server will start on `http://localhost:5000` (or the port specified in `.env`)

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
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
```

#### Google Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google-oauth-token"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Health Check
```http
GET /api/health
```

## Response Format

All responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... }  // optional
}
```

## User Roles

- **user**: Regular user (default)
- **admin**: Administrator (automatically assigned if email contains 'admin')

## Notes

- Passwords are stored in plain text (for development only). Use bcrypt in production!
- JWT tokens expire in 7 days
- New users receive 100,000 balance for testing
- User data is stored in memory (resets on server restart). Use a database in production!

## Tech Stack

- Express.js
- JWT for authentication
- Google OAuth 2.0
- In-memory storage (development)