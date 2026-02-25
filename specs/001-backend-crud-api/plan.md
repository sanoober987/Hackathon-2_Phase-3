# Implementation Plan: Core Web Application & Backend Setup

**Branch**: `001-backend-crud-api` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-backend-crud-api/spec.md`

## Summary

Implement a FastAPI backend with SQLModel ORM connected to Neon Serverless PostgreSQL, providing full CRUD operations for tasks. Each task is scoped to a user ID passed in the URL path. The architecture is designed to support future JWT authentication integration without restructuring endpoints.

## Technical Context

**Language/Version**: Python 3.12
**Primary Dependencies**: FastAPI, SQLModel, Pydantic, uvicorn, asyncpg, python-dotenv
**Storage**: Neon Serverless PostgreSQL (connection pooling enabled)
**Testing**: pytest, pytest-asyncio, httpx (for async test client)
**Target Platform**: Linux server (containerized deployment ready)
**Project Type**: Web application (backend-only for this spec)
**Performance Goals**: <500ms response time for all operations under normal load
**Constraints**: User isolation (100% data separation), stateless API, no hardcoded secrets
**Scale/Scope**: Multi-user task management, ~1000 concurrent users initial target

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Security | User data isolation | ✅ PASS | Tasks filtered by user_id in URL; JWT deferred to Spec 2 |
| II. Modularity | Clear layer separation | ✅ PASS | Backend-only; API contracts defined |
| III. Reproducibility | Spec-driven development | ✅ PASS | Following /sp.specify → /sp.plan → /sp.tasks workflow |
| IV. Responsiveness | N/A for backend | ✅ PASS | Frontend handled in Spec 3 |
| V. Maintainability | RESTful API, proper HTTP codes, env vars | ✅ PASS | All requirements addressed in design |

**Gate Result**: PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-crud-api/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI spec)
│   └── openapi.yaml
├── checklists/          # Validation checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Environment configuration
│   ├── database.py          # Database connection and session management
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task SQLModel
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── task.py          # Pydantic request/response schemas
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependency injection (db session, future auth)
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── tasks.py     # Task CRUD endpoints
│   └── services/
│       ├── __init__.py
│       └── task_service.py  # Business logic layer
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures
│   ├── test_tasks.py        # Endpoint tests
│   └── test_task_service.py # Service layer tests
├── requirements.txt
├── .env.example
└── README.md
```

**Structure Decision**: Web application structure (Option 2) selected. Backend-only for this spec; frontend directory will be added in Spec 3. Services layer provides business logic separation for future auth integration.

## Complexity Tracking

> No violations - design adheres to constitution principles.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Services Layer | Included | Enables clean auth injection point in Spec 2 |
| Schemas separate from Models | Yes | Pydantic schemas for API, SQLModel for DB - cleaner separation |
| Async throughout | Yes | Neon Serverless benefits from async connections |

## Architecture Decisions

### 1. URL Structure with User ID

**Decision**: Use `/api/{user_id}/tasks` pattern
**Rationale**: Explicitly scopes all operations to a user. In Spec 2, middleware will validate that the JWT user matches the URL user_id.
**Trade-off**: Slightly longer URLs, but clearer intent and easier auth integration.

### 2. SQLModel for ORM

**Decision**: Use SQLModel (Pydantic + SQLAlchemy)
**Rationale**: Constitution mandates SQLModel; provides type safety and validation.
**Benefits**: Single model can serve as both database model and API schema base.

### 3. Service Layer Pattern

**Decision**: Implement services/task_service.py between routes and database
**Rationale**: Isolates business logic; auth checks will be injected here in Spec 2.
**Alternative Rejected**: Direct DB access in routes - harder to add auth later.

### 4. Async Database Operations

**Decision**: Use async SQLModel with asyncpg driver
**Rationale**: Neon Serverless PostgreSQL optimized for serverless/async patterns.
**Dependencies**: sqlalchemy[asyncio], asyncpg

## API Endpoints Summary

| Method | Endpoint | Description | Success | Errors |
|--------|----------|-------------|---------|--------|
| GET | `/api/{user_id}/tasks` | List all tasks | 200 | - |
| POST | `/api/{user_id}/tasks` | Create task | 201 | 400 |
| GET | `/api/{user_id}/tasks/{task_id}` | Get single task | 200 | 404 |
| PUT | `/api/{user_id}/tasks/{task_id}` | Update task | 200 | 400, 404 |
| DELETE | `/api/{user_id}/tasks/{task_id}` | Delete task | 204 | 404 |
| PATCH | `/api/{user_id}/tasks/{task_id}/complete` | Toggle completion | 200 | 404 |

## Dependencies

### Runtime Dependencies

```text
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
asyncpg>=0.29.0
python-dotenv>=1.0.0
pydantic>=2.5.0
pydantic-settings>=2.1.0
```

### Development Dependencies

```text
pytest>=7.4.0
pytest-asyncio>=0.23.0
httpx>=0.26.0
```

## Environment Configuration

```bash
# .env.example
DATABASE_URL=postgresql+asyncpg://user:password@host.neon.tech/dbname?sslmode=require
ENVIRONMENT=development
LOG_LEVEL=INFO
```

## Post-Design Constitution Re-Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Security | ✅ | User isolation via URL scoping; auth-ready structure |
| II. Modularity | ✅ | Clear separation: routes → services → models → database |
| III. Reproducibility | ✅ | Plan follows spec; all code from Claude Code |
| IV. Responsiveness | N/A | Backend only |
| V. Maintainability | ✅ | RESTful design, proper HTTP codes, env vars, logging ready |

**Final Gate Result**: PASS - Ready for Phase 1 artifacts
