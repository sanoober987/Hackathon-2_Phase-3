---
id: 005
title: Failed to Fetch - Full Stack Root Cause and Fix
stage: general
date: 2026-02-25
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 003-frontend-integration
user: sanoober
command: debug failed-to-fetch signin signup 500 task creation
labels: ["debugging", "failed-to-fetch", "timestamptz", "asyncpg", "api-client", "cors", "auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/models/task.py
  - backend/app/api/routes/auth.py
  - backend/app/schemas/auth.py
  - frontend/services/api-client.ts
  - frontend/lib/auth.ts
tests: []
---

## Root Causes Found (all confirmed with live test execution)

### 1. CRITICAL — Task creation 503: `TIMESTAMP WITHOUT TIME ZONE` + timezone-aware datetime
- `task.py` model used `datetime.now(timezone.utc)` (aware) but column was `TIMESTAMP WITHOUT TIME ZONE`
- asyncpg raises: `DataError: can't subtract offset-naive and offset-aware datetimes`
- **Fix**: `sa_type=DateTime(timezone=True)` on both `created_at` and `updated_at`
- **Migration**: `ALTER TABLE tasks ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'` (run and confirmed)

### 2. CRITICAL — `api-client.ts` missing `updateTask` method
- `useTasks.ts` calls `taskApi.updateTask(id, data)` — method was removed in a previous session
- Result: `TypeError: taskApi.updateTask is not a function` at runtime on every edit
- **Fix**: Restored `updateTask()` method pointing to `PATCH /{id}`

### 3. HIGH — "Failed to fetch" on signin/signup: venv on Windows DrvFs has no packages
- Backend `venv` at `D:\Hackathon-2\phase-2\backend\venv` had 0 packages installed
- `pip install` on DrvFs (9P mount) produces broken installs silently
- Backend could not start → every fetch from frontend fails with network error
- **Fix**: Created working venv at `~/projects/phase-2/backend/venv` on native Linux ext4 FS
- Installed all packages successfully: fastapi, uvicorn, sqlmodel, asyncpg, PyJWT, bcrypt, etc.

### 4. MEDIUM — `lib/auth.ts` and `api-client.ts` fallback URL used `localhost:8000`
- `localhost` can resolve differently from `127.0.0.1` in some browser/WSL configurations
- `.env.local` correctly sets `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`
- Fallback was wrong if env var not loaded
- **Fix**: Changed both fallback strings to `http://127.0.0.1:8000`

### 5. MEDIUM — No try/catch around `fetch()` in `lib/auth.ts` login/signup
- If backend is down, `fetch()` throws `TypeError: Failed to fetch`
- Error was propagated as-is to the UI — not user-friendly
- **Fix**: Wrapped fetch in try/catch, throwing: "Cannot reach the server. Make sure backend is running on http://127.0.0.1:8000"

### 6. MEDIUM — No `GET /auth/me` endpoint
- Frontend had no way to validate a stored JWT token without making a task API call
- **Fix**: Added `GET /auth/me` → returns `{id, email}` — returns 401 if token invalid/expired

### All Tests Passing After Fixes
- `GET /health` → `{"status": "ok"}`
- `OPTIONS /auth/login` → 200 with correct CORS headers including `access-control-allow-origin: http://localhost:3000`
- `POST /auth/register` → 201 with JWT token
- `POST /auth/login` → 200 with JWT token
- `GET /auth/me` → 200 with `{"id":"2","email":"testuser999@example.com"}`
- `POST /api/tasks` → 201 with task (TIMESTAMPTZ fix confirmed)
- `GET /api/tasks` → 200 with task list

## Correct Startup Commands

```bash
# Backend (MUST run from native Linux FS — NOT from /mnt/d)
cd ~/projects/phase-2/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Frontend (can run from /mnt/d with polling mode, or native FS for best stability)
cd /mnt/d/Hackathon-2/phase-2/frontend
npm run dev
# → http://localhost:3000
# → API: http://127.0.0.1:8000/docs
```
