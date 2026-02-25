# Research: User Authentication & JWT Integration

**Feature**: 002-jwt-auth
**Date**: 2026-02-01
**Status**: Complete

## Research Summary

All technical decisions are well-defined by the project constitution and spec. This document captures research findings for JWT authentication integration.

---

## 1. JWT Library Selection (Backend)

### Decision
Use `python-jose` with cryptography backend for JWT encoding/decoding.

### Rationale
- Widely adopted in FastAPI ecosystem
- Supports HS256 (HMAC-SHA256) for symmetric signing
- Active maintenance and security updates
- Compatible with tokens issued by Better Auth

### Alternatives Considered
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| PyJWT | Simple, widely used | Less algorithm support | Rejected |
| python-jose | Full algorithm support, FastAPI common | Slightly more dependencies | **Selected** |
| authlib | Feature-rich | Overkill for simple JWT verify | Rejected |

### Implementation Pattern
```python
from jose import jwt, JWTError
from datetime import datetime, timezone

def verify_token(token: str, secret: str) -> dict:
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

---

## 2. Password Hashing Strategy

### Decision
Use `passlib` with bcrypt algorithm.

### Rationale
- Industry standard for password hashing
- Automatic salting per password
- Configurable work factor (cost)
- Timing-attack resistant comparison

### Configuration
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
hashed = pwd_context.hash("user_password")

# Verify password
is_valid = pwd_context.verify("user_password", hashed)
```

### Security Properties
- Default work factor: 12 rounds (~250ms on modern hardware)
- Salt: 22-character random per password
- Output: 60-character hash string

---

## 3. Better Auth JWT Configuration

### Decision
Configure Better Auth to issue JWT tokens with standard claims.

### Required Claims
| Claim | Purpose | Value |
|-------|---------|-------|
| `sub` | Subject (user ID) | UUID string |
| `email` | User email | Email string |
| `iat` | Issued at | Unix timestamp |
| `exp` | Expiration | iat + 7 days |

### Better Auth Setup (Next.js)
```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
});
```

---

## 4. FastAPI Dependency Injection Pattern

### Decision
Use FastAPI's `Depends` for authentication as middleware.

### Rationale
- Clean separation of concerns
- Reusable across all protected endpoints
- Automatic OpenAPI documentation
- Testable with dependency overrides

### Implementation
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    token = credentials.credentials
    payload = verify_token(token)
    return {"id": payload["sub"], "email": payload["email"]}

# Usage in routes
@router.get("/tasks")
async def list_tasks(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # current_user["id"] is the authenticated user
    ...
```

---

## 5. Endpoint URL Migration Strategy

### Decision
Change from `/api/{user_id}/tasks` to `/api/tasks` with user from token.

### Rationale
- Prevents URL manipulation attacks
- User identity should come from verified token only
- Cleaner API design
- Better security posture

### Migration Impact
| Old Endpoint | New Endpoint | User Source |
|--------------|--------------|-------------|
| `/api/{user_id}/tasks` | `/api/tasks` | Token `sub` claim |
| `/api/{user_id}/tasks/{id}` | `/api/tasks/{id}` | Token `sub` claim |

### Backward Compatibility
- Old endpoints deprecated (can return 410 Gone)
- Tests updated to use new endpoints
- Frontend will use new pattern from start (Spec 3)

---

## 6. Error Response Standards

### Decision
Use consistent error responses for auth failures.

### Error Codes
| Scenario | Status Code | Response Body |
|----------|-------------|---------------|
| No token | 401 | `{"detail": "Not authenticated"}` |
| Invalid token | 401 | `{"detail": "Invalid token"}` |
| Expired token | 401 | `{"detail": "Token expired"}` |
| Invalid credentials | 401 | `{"detail": "Invalid credentials"}` |
| Email exists | 409 | `{"detail": "Email already registered"}` |
| Validation error | 422 | FastAPI default validation response |

### Security Considerations
- Same error for "user not found" and "wrong password" (prevents enumeration)
- No token details in error messages
- Log authentication failures for monitoring

---

## 7. Token Storage (Frontend)

### Decision
Better Auth handles token storage automatically.

### Options Available
| Storage | Pros | Cons |
|---------|------|------|
| HTTP-only cookie | XSS-safe | CSRF needed |
| localStorage | Simple | XSS vulnerable |
| Memory + refresh | Most secure | Complex |

### Better Auth Default
- Uses HTTP-only cookies by default
- Automatic CSRF protection
- Token refresh handled internally

---

## Conclusion

All technical decisions are clear and align with constitution requirements. No blockers identified. Ready for Phase 1 (data model and contracts).
