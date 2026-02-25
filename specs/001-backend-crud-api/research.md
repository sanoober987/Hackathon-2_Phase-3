# Research: Core Web Application & Backend Setup

**Feature**: 001-backend-crud-api
**Date**: 2026-02-01
**Status**: Complete

## Research Summary

All technical decisions for this feature are well-defined by the project constitution and spec. No NEEDS CLARIFICATION items were identified. This document captures the research findings that informed the implementation plan.

---

## 1. FastAPI + SQLModel Integration

### Decision
Use FastAPI with SQLModel for async database operations.

### Rationale
- SQLModel is mandated by the constitution
- Combines Pydantic validation with SQLAlchemy ORM
- Native async support via `sqlalchemy[asyncio]`
- Type hints provide IDE support and documentation

### Alternatives Considered
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| SQLAlchemy direct | More flexible | More boilerplate, no Pydantic integration | Rejected - constitution mandates SQLModel |
| Tortoise ORM | Django-like, async-first | Less ecosystem support, not in constitution | Rejected |
| SQLModel | Type-safe, Pydantic integration, constitution-mandated | Newer, fewer resources | **Selected** |

### Key Findings
- SQLModel 0.0.14+ supports async sessions via `AsyncSession`
- Use `create_async_engine` with `asyncpg` driver for Neon
- Connection pooling configured via engine parameters

---

## 2. Neon Serverless PostgreSQL Connection

### Decision
Use asyncpg driver with connection pooling optimized for serverless.

### Rationale
- Neon recommends asyncpg for Python async applications
- Serverless requires careful connection management
- Pool size should be conservative (5-10 connections)

### Best Practices for Neon
```python
# Connection string format
DATABASE_URL=postgresql+asyncpg://user:pass@ep-xyz.region.neon.tech/dbname?sslmode=require

# Engine configuration for serverless
engine = create_async_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
)
```

### Key Findings
- Always use `sslmode=require` for Neon connections
- Enable `pool_pre_ping` to handle connection drops
- Neon auto-scales compute, but connections need management

---

## 3. UUID Generation Strategy

### Decision
Use UUID v4 for task identifiers, generated at database level.

### Rationale
- Globally unique without coordination
- No sequential exposure (security)
- PostgreSQL native UUID support

### Implementation
```python
from sqlmodel import Field
from uuid import UUID, uuid4

class Task(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
```

### Alternatives Considered
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Auto-increment integer | Simple, ordered | Exposes count, not globally unique | Rejected |
| UUID v4 | Globally unique, no coordination | Larger storage | **Selected** |
| ULID | Sortable, globally unique | Extra dependency | Rejected - UUID sufficient |

---

## 4. Error Handling Pattern

### Decision
Use FastAPI's HTTPException with consistent error response schema.

### Rationale
- Constitution requires human-readable error messages
- Consistent error format across all endpoints
- Proper HTTP status codes (400, 404, 500)

### Error Response Schema
```json
{
  "detail": "Task not found",
  "status_code": 404
}
```

### HTTP Status Code Mapping
| Scenario | Status Code |
|----------|-------------|
| Validation error (missing title) | 400 Bad Request |
| Task not found | 404 Not Found |
| Task belongs to different user | 404 Not Found (not 403, to avoid info leak) |
| Database error | 500 Internal Server Error |
| Service unavailable | 503 Service Unavailable |

---

## 5. Authentication-Ready Architecture

### Decision
Include service layer and dependency injection for future auth integration.

### Rationale
- Spec 2 will add JWT authentication
- Clean injection point needed
- URL contains user_id for explicit scoping

### Future Auth Flow (Spec 2 Preview)
```python
# In api/deps.py (Spec 2)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    user_id: str = Path(...),
) -> str:
    # Verify JWT, check user_id matches token.sub
    return verified_user_id

# In routes/tasks.py (Spec 2)
@router.get("/api/{user_id}/tasks")
async def list_tasks(
    user_id: str = Depends(get_current_user),  # Auth injected
    db: AsyncSession = Depends(get_db),
):
    ...
```

### Key Findings
- Keep user_id in URL for explicit scoping
- Service layer accepts user_id as parameter
- Dependency injection enables clean auth addition

---

## 6. Testing Strategy

### Decision
Use pytest with pytest-asyncio and httpx for async API testing.

### Rationale
- httpx provides async test client compatible with FastAPI
- pytest-asyncio enables async test functions
- Separate unit tests (service) from integration tests (endpoints)

### Test Structure
```text
tests/
├── conftest.py          # Fixtures: test client, test database
├── test_tasks.py        # API endpoint tests
└── test_task_service.py # Service layer unit tests
```

### Key Testing Patterns
- Use test database (separate from production)
- Transaction rollback between tests for isolation
- Test both success and error scenarios

---

## Conclusion

All technical decisions are clear and aligned with the constitution. No blockers identified. Ready to proceed to Phase 1 (data model and contracts).
