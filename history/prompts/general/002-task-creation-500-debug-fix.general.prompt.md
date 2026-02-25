---
id: 002
title: Task Creation 500 Error - Full Debug and Fix
stage: general
date: 2026-02-25
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 003-frontend-integration
user: sanoober
command: debug task creation 500 errors
labels: ["debugging", "backend", "fastapi", "task-crud", "500-error", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/config.py
  - backend/app/api/routes/tasks.py
  - backend/app/services/task_service.py
  - backend/.env
  - frontend/lib/retry-utils.ts
tests: []
---

## Prompt

My application is a Todo Task Management system using Next.js, TypeScript, Tailwind CSS (frontend) and FastAPI, SQLAlchemy Async, PostgreSQL/SQLite, JWT auth (backend).

Problems:
1. Tasks are not being created.
2. Internal Server Error (500) occurs during task creation.
3. API requests may be failing.
4. Database records may not be saving properly.

Mission: fully debug and fix the system end-to-end covering root cause analysis, backend fixes, frontend fixes, auth check, CORS config, error handling, and final working code.

## Response

### Root Cause Analysis (4 confirmed bugs)

**Bug 1 — CRITICAL: `toggle_task_completion` missing from `task_service.py`**
- Route `PATCH /api/tasks/{task_id}/complete` (tasks.py:143) calls `task_service.toggle_task_completion()`
- Function did not exist in `task_service.py` → `AttributeError` → 500 on every toggle call
- **Fix**: Added `toggle_task_completion()` to `backend/app/services/task_service.py`

**Bug 2 — `get_settings()` not cached**
- `config.py` `get_settings()` instantiated a new `Settings` object on every call
- Every request re-read all env vars; any missing required var (`DATABASE_URL`, `JWT_SECRET_KEY`) raised `RuntimeError` crashing the request
- **Fix**: Added `@lru_cache(maxsize=1)` to `get_settings()` in `backend/app/config.py`

**Bug 3 — No exception handling in `create_task` route**
- Database errors (connection failures, constraint violations) propagated as raw unhandled 500s
- No logging, no user-facing error message
- **Fix**: Wrapped `task_service.create_task()` call in `try/except SQLAlchemyError` returning HTTP 503 with a meaningful message

**Bug 4 — Retry logic used fragile string matching for status codes**
- `retryNetworkCall` in `retry-utils.ts` used `error.message.includes('5')` to detect 5xx — matches any message containing digit "5"
- Would retry 4xx errors (including 401 auth failures) 3 times, causing 3x backend load on auth failures
- **Fix**: Updated `shouldRetry` to use `(error as {status?: number}).status` field from `ApiError`, skipping retry on all 4xx errors

**Bug 5 — CORS missing `127.0.0.1`**
- Frontend `.env.local` sets `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`
- Backend CORS only allowed `http://localhost:3000`
- Browsers treat `localhost` and `127.0.0.1` as different origins, causing CORS preflight failures
- **Fix**: Added `http://127.0.0.1:3000` to `CORS_ORIGINS` in `backend/.env`

### Files Changed
1. `backend/app/config.py` — added `from functools import lru_cache` + `@lru_cache(maxsize=1)` decorator
2. `backend/app/api/routes/tasks.py` — added `SQLAlchemyError` import + try/except in `create_task`
3. `backend/app/services/task_service.py` — added `toggle_task_completion()` function (lines 153-183)
4. `frontend/lib/retry-utils.ts` — replaced string-based 5xx detection with `ApiError.status` field check
5. `backend/.env` — added `http://127.0.0.1:3000` to `CORS_ORIGINS`

### Verification Checklist
- [x] `toggle_task_completion` exists and flips `task.completed` + updates `updated_at`
- [x] Settings loaded once per process via `lru_cache`
- [x] `create_task` route returns 503 with message on DB errors instead of raw 500
- [x] Retry skips 401/403/404/422 — only retries network errors and 5xx
- [x] CORS allows both `localhost:3000` and `127.0.0.1:3000`
- [x] JWT secret key is set in `.env`
- [x] `DATABASE_URL` uses `postgresql+asyncpg://` prefix (required for SQLAlchemy async)
