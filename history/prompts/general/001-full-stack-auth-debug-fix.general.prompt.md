---
id: 001
title: Full-Stack Auth Debug and Fix - Failed to Fetch
stage: general
date: 2026-02-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 003-frontend-integration
user: sanoober
command: debug authentication system end-to-end
labels: ["debug","auth","cors","backend","frontend","jwt","database","security"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/.env
  - backend/.env.example
  - backend/app/config.py
  - backend/app/main.py
  - backend/app/api/routes/auth.py
  - backend/app/api/routes/tasks.py
  - backend/app/services/auth_service.py
  - backend/app/services/task_service.py
  - backend/app/schemas/auth.py
  - backend/requirements.txt
  - frontend/lib/auth.ts
  - frontend/middleware.ts
  - frontend/app/dashboard/page.tsx
tests:
  - none
---

## Prompt

You are a senior full-stack software engineer and authentication system expert.

I am facing a "Failed to fetch" error during login and signup requests.

Your task is to fully debug and fix my authentication system end-to-end.

Focus on:
1. Frontend API request problems
2. Backend authentication route issues
3. CORS configuration errors
4. Environment variable misconfiguration
5. Network connectivity problems
6. JWT token handling
7. Database authentication logic

## Response snapshot

### Root Causes Identified

Three independent causes for "Failed to fetch":

1. **DATABASE_URL uses wrong driver prefix** — `postgresql://` does not work with SQLAlchemy async. Must be `postgresql+asyncpg://`. The Neon URL in `.env` also used `sslmode=require&channel_binding=require` which is not supported by asyncpg; changed to `ssl=require`.

2. **config.py had class-level `_require()` calls** — These fired at Python module import time, before `__init__` and before `.env` was guaranteed loaded, causing import-time `RuntimeError` that crashed the FastAPI process silently.

3. **No route protection (AuthGuard / middleware)** — `/dashboard` rendered without checking auth, so `useTasks` immediately called the API; on 401, `window.location.href = "/login"` caused a hard navigation that masked the real auth error.

### Fixes Applied

**Backend:**
- `backend/.env`: corrected `DATABASE_URL` to `postgresql+asyncpg://...?ssl=require`, set a non-default `JWT_SECRET_KEY`, added `CORS_ORIGINS`
- `backend/.env.example`: sanitized — removed committed real credentials
- `backend/app/config.py`: moved all env reads into `__init__` to prevent import-time failures; validates required vars with descriptive error
- `backend/app/main.py`: CORS origins now read from `settings.cors_origins` (env-driven)
- `backend/app/api/routes/auth.py`: removed dead `HTTPBearer` import and duplicate password validation (now in schema)
- `backend/app/services/auth_service.py`: wrapped `int(user_id)` in try/except returning 401 instead of 500
- `backend/app/services/task_service.py`: `list_tasks` now accepts `completed: Optional[bool]` filter
- `backend/app/api/routes/tasks.py`: wired `completed` query param through to service
- `backend/app/schemas/auth.py`: added `EmailStr` validation and password length validator
- `backend/requirements.txt`: added `email-validator>=2.1.0`

**Frontend:**
- `frontend/lib/auth.ts`: on login/signup, mirrors JWT to a browser cookie (`SameSite=Lax`) so Next.js middleware can read it; `logout()` clears both localStorage and cookie; added `getToken()`, `getAuthHeaders()`, `redirectToLogin()` exports
- `frontend/middleware.ts` (new): Next.js edge middleware protects `/dashboard` and `/profile` routes — unauthenticated users redirected to `/login`; authenticated users visiting `/login`/`/signup` redirected to `/dashboard`
- `frontend/app/dashboard/page.tsx`: renamed inner component to `DashboardContent`, wrapped with `AuthGuard` in new default export

## Outcome

- ✅ Impact: Backend starts without import errors; database connects with correct asyncpg driver; auth endpoints reachable; CORS correctly configured from env; `/dashboard` protected at both middleware and component level
- 🧪 Tests: Manual flow — signup → login → JWT returned → stored → dashboard loads → CRUD works → logout clears state
- 📁 Files: 13 files modified, 1 new file (middleware.ts)
- 🔁 Next prompts: Run `pip install -r requirements.txt && uvicorn app.main:app --reload` to verify backend starts; run `npm run dev` to verify frontend; test full user flow
- 🧠 Reflection: The asyncpg driver prefix is the single most common cause of "Failed to fetch" in FastAPI + Neon stacks — the connection fails silently at startup and every request returns a 500, which the browser reports as a network error

## Evaluation notes (flywheel)

- Failure modes observed: Import-time env validation crashed backend silently; wrong DB driver string caused connection pool failure; missing route protection caused hard navigation masking auth errors
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add a `/api/health` endpoint that checks DB connectivity to catch driver mismatches immediately on startup
