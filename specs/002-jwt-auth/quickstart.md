# Quickstart: User Authentication & JWT Integration

**Feature**: 002-jwt-auth
**Date**: 2026-02-01

## Prerequisites

- Python 3.12+
- Neon PostgreSQL database (from Spec 1)
- Existing backend from `001-backend-crud-api`

## Environment Setup

### Required Environment Variables

Add these to your `backend/.env` file:

```env
# Existing from Spec 1
DATABASE_URL=postgresql+asyncpg://user:pass@host.neon.tech/dbname?sslmode=require
ENVIRONMENT=development
LOG_LEVEL=INFO

# NEW: Authentication (Spec 2)
BETTER_AUTH_SECRET=your-minimum-32-character-secret-key-here
JWT_EXPIRATION_DAYS=7
```

### Generate a Secure Secret

```bash
# Option 1: Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 2: Using OpenSSL
openssl rand -base64 32
```

**Important**: The `BETTER_AUTH_SECRET` must be:
- At least 32 characters
- Shared between frontend (Better Auth) and backend (FastAPI)
- Never committed to version control

## Installation

### Install New Dependencies

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install "python-jose[cryptography]>=3.3.0" "passlib[bcrypt]>=1.7.4"
pip freeze > requirements.txt
```

Updated `requirements.txt` will include:
```text
# Existing dependencies...
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
```

## Running the Application

### Start Development Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Verify Health Check

```bash
curl http://localhost:8000/health
# Response: {"status": "healthy", "version": "2.0.0"}
```

## Testing Authentication

### 1. Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "securepass123"}'
```

**Expected Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 604800
}
```

### 2. Login with Existing User

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "securepass123"}'
```

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 604800
}
```

### 3. Access Protected Endpoint

```bash
# Save the token from login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# List tasks (authenticated)
curl http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "tasks": [],
  "count": 0
}
```

### 4. Test Unauthorized Access

```bash
# Without token
curl http://localhost:8000/api/tasks

# Expected Response (401 Unauthorized):
# {"detail": "Not authenticated"}
```

### 5. Create a Task (Authenticated)

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "My first authenticated task", "description": "Created with JWT auth"}'
```

**Expected Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "My first authenticated task",
  "description": "Created with JWT auth",
  "completed": false,
  "created_at": "2026-02-01T10:30:00Z",
  "updated_at": "2026-02-01T10:30:00Z"
}
```

## Running Tests

### Run All Tests

```bash
cd backend
pytest -v
```

### Run Auth Tests Only

```bash
pytest tests/test_auth.py -v
```

### Run with Coverage

```bash
pytest --cov=app --cov-report=term-missing
```

## Common Issues

### 1. "Invalid token" Error

**Cause**: Token was signed with a different secret
**Fix**: Ensure `BETTER_AUTH_SECRET` matches between frontend and backend

### 2. "Token expired" Error

**Cause**: Token is older than 7 days
**Fix**: Log in again to get a fresh token

### 3. Database Connection Failed

**Cause**: Invalid DATABASE_URL or Neon connection issue
**Fix**: Verify DATABASE_URL format includes `?sslmode=require`

### 4. bcrypt Installation Error

**Cause**: Missing system dependencies for bcrypt
**Fix**:
```bash
# Ubuntu/Debian
sudo apt-get install build-essential libffi-dev

# macOS
brew install libffi
```

## API Documentation

After starting the server, access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## Security Checklist

- [ ] `BETTER_AUTH_SECRET` is at least 32 characters
- [ ] Environment variables are not committed to git
- [ ] `.env` is in `.gitignore`
- [ ] HTTPS enabled in production
- [ ] CORS configured for frontend domain only
- [ ] Rate limiting enabled for auth endpoints (Spec 4)

## Next Steps

After completing this spec:
1. **Spec 3**: Frontend integration with Better Auth
2. **Spec 4**: Deployment configuration with environment secrets
