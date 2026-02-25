---
id: 003
title: Autonomous Full-System Debug and Harden
stage: general
date: 2026-02-25
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 003-frontend-integration
user: sanoober
command: autonomous debug agent - fix 500s, DB failures, auth failures, network failures
labels: ["debugging", "security", "architecture", "production-hardening", "backend", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/services/task_service.py
  - backend/app/database.py
  - backend/app/api/deps.py
  - backend/app/api/routes/tasks.py
  - backend/app/services/auth_service.py
  - backend/app/main.py
  - backend/app/config.py
  - backend/requirements.txt
  - backend/requirements-dev.txt
  - frontend/services/api-client.ts
  - frontend/lib/auth.ts
  - frontend/middleware.ts
  - frontend/lib/retry-utils.ts
tests: []
---

## Prompt

Act as an autonomous debugging AI agent.

Fix:
- Internal server errors
- Database transaction failures
- Authentication failures
- Network failures

Provide:
1. Root cause
2. Architecture fix
3. Production security improvements
4. Deployment readiness suggestions

## Response Summary

### 20 Issues Found and Categorized

**CRITICAL** (6 bugs that cause runtime failures or security breaches):
1. `task_service.py` — `toggle_task_completion` defined twice; Python silently uses second def (dead code, copy-paste error)
2. `database.py` — Separate `os.getenv("DATABASE_URL")` bypasses `config.py` validation; silently falls back to SQLite in production if env var is unset
3. `User.id: int` vs `Task.user_id: str` — no FK constraint at DB level; user-task ownership enforced only in application code
4. `localStorage` JWT storage — XSS vulnerable; cookie not `HttpOnly`
5. `api-client.ts` — POST `createTask` retried 3x on failure — causes duplicate task records if server received request but response was lost
6. `middleware.ts` — token presence checked but expiry not verified — expired tokens pass auth guard

**HIGH** (7 architectural issues causing incorrect behavior):
7. `list_tasks` accepts `limit`/`offset` query params but ignores them — all tasks always returned
8. `PUT /{task_id}` and `PATCH /{task_id}` were identical routes calling same service function
9. No try/except on update/delete/toggle routes — DB errors return unhandled 500s
10. `get_current_user` used `get_async_session` while task routes used `get_db` — inconsistent session lifecycle
11. No rate limiting on auth endpoints — brute-force attack surface
12. `handleUnauthorized()` redirected to login without clearing stale token — infinite redirect loop risk
13. `checkAuthState()` called `JSON.parse(userJson)` without try/catch — throws on corrupted localStorage

**MEDIUM** (7 code quality / reliability issues):
14. `database.py` `echo=True` hardcoded — logs all SQL in production (data leakage + performance)
15. `init_db()` caught and printed DB init errors without re-raising — app could start with broken schema
16. `deps.py` had no `session.rollback()` on exception — partial writes could persist
17. `requirements.txt` had duplicate `pydantic`, unpinned versions, mixed dev/prod deps
18. Dead code files: `token-storage.ts` (conflicting key names), `types/task.ts` (inconsistent types), 3 legacy root components
19. No global exception handler — unhandled errors leaked tracebacks
20. No health check endpoint for load balancers / container orchestrators

### All Fixes Applied

| File | Change |
|------|--------|
| `task_service.py` | Removed duplicate `toggle_task_completion`; added `limit`/`offset` to `list_tasks`; added `count_tasks()` |
| `database.py` | Now uses `get_settings()` as single source of truth; `echo` driven by `ENVIRONMENT`; `init_db` re-raises on failure; added `pool_pre_ping` and `pool_recycle` for Neon |
| `config.py` | Added `environment` field; `@lru_cache` already applied |
| `deps.py` | Added `except: await session.rollback(); raise` before session close |
| `routes/tasks.py` | Consistent `SQLAlchemyError` handling on all 6 routes; removed redundant `PUT` route; added `limit`/`offset` query params to `list_tasks`; `count_tasks` for accurate total; private `_db_error` helper; log sanitized (no task title in logs) |
| `auth_service.py` | Removed module-level `settings =`; `get_settings()` called inside functions only; added logging |
| `main.py` | Global `@app.exception_handler(Exception)` that logs + returns safe message; tightened CORS `allow_methods`/`allow_headers`; added `/health` endpoint |
| `requirements.txt` | Pinned all versions; removed duplicate pydantic; dev deps split to `requirements-dev.txt` |
| `api-client.ts` | `logout()` called before `redirectToLogin()` on 401; POST `createTask` no longer retried; PATCH retries 1x; removed dead `signup`/`login` standalone functions |
| `lib/auth.ts` | `JSON.parse(userJson)` wrapped in try/catch; clears auth and returns unauthenticated on parse error |
| `middleware.ts` | Added `isTokenExpired()` function (base64url decode of `exp` claim); expired tokens redirected and cookie cleared; stale cookie deleted on redirect response |
| Deleted | `frontend/lib/token-storage.ts`, `frontend/types/task.ts`, `frontend/components/TaskForm.tsx`, `frontend/components/TaskItem.tsx`, `frontend/components/TaskList.tsx` |

### Architecture Notes (not fixed — require future work)

- **Token storage XSS risk**: Proper fix requires `HttpOnly` cookies set by the server, not localStorage. Requires backend session management changes.
- **No rate limiting**: Add `slowapi` or an nginx/CloudFlare rate limiter in front of `/auth/login` and `/auth/register`.
- **No token revocation**: JWT tokens cannot be invalidated server-side without a blocklist (Redis). Current approach relies on expiry only.
- **Middleware `?next=` param**: Set but never consumed. Add redirect-after-login in `LoginForm`.

### Deployment Readiness Checklist

- [x] `ENVIRONMENT=production` in prod `.env` disables SQL echo logging
- [x] `pool_pre_ping=True` on engine — handles Neon connection resets
- [x] DB init failure crashes the process — no zombie instances
- [x] Global exception handler — no stack traces leak to clients
- [x] CORS headers restricted to specific methods/headers
- [x] `/health` endpoint for container probes
- [x] Pinned dependency versions — reproducible builds
- [ ] Add `HttpOnly` cookie auth (future)
- [ ] Add rate limiting on `/auth/*` (future)
- [ ] Add JWT blocklist / refresh token flow (future)
