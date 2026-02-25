# Data Model: User Authentication & JWT Integration

**Feature**: 002-jwt-auth
**Date**: 2026-02-01
**Status**: Complete

## Entity Overview

```
┌─────────────────────────────────────────────────────────────┐
│                          User                                │
├─────────────────────────────────────────────────────────────┤
│ id: UUID (PK)                                               │
│ email: String (unique, indexed, normalized)                 │
│ password_hash: String (NOT NULL)                            │
│ created_at: DateTime (auto, UTC)                            │
│ updated_at: DateTime (auto on update, UTC)                  │
└─────────────────────────────────────────────────────────────┘
              │
              │ 1:N (user owns tasks)
              ▼
┌─────────────────────────────────────────────────────────────┐
│                          Task                                │
├─────────────────────────────────────────────────────────────┤
│ id: UUID (PK)                                               │
│ user_id: UUID (FK → User.id, indexed)                       │
│ title: String(255) (NOT NULL)                               │
│ description: String(2000) (nullable)                        │
│ completed: Boolean (default: false)                         │
│ created_at: DateTime (auto, UTC)                            │
│ updated_at: DateTime (auto on update, UTC)                  │
└─────────────────────────────────────────────────────────────┘
```

## Entities

### User (NEW)

Represents a registered account in the system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, default uuid4 | Unique user identifier |
| `email` | String | UNIQUE, NOT NULL, indexed | User's email (normalized to lowercase) |
| `password_hash` | String | NOT NULL | Bcrypt-hashed password |
| `created_at` | DateTime | auto, UTC | Account creation timestamp |
| `updated_at` | DateTime | auto on update, UTC | Last modification timestamp |

#### SQLModel Definition

```python
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
```

### Task (UPDATED)

Updated to reference User.id as foreign key.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique task identifier |
| `user_id` | UUID | FK → User.id, indexed | Owner user ID |
| `title` | String(255) | NOT NULL | Task title |
| `description` | String(2000) | nullable | Optional description |
| `completed` | Boolean | default false | Completion status |
| `created_at` | DateTime | auto, UTC | Creation timestamp |
| `updated_at` | DateTime | auto on update, UTC | Last update timestamp |

**Note**: The `user_id` field changes from `str` to `UUID` to match the User.id type.

### Authentication Token (Runtime Only)

JWT tokens are not stored in the database (stateless design).

| Claim | Type | Description |
|-------|------|-------------|
| `sub` | String (UUID) | User ID (subject) |
| `email` | String | User's email |
| `iat` | Integer | Issued at (Unix timestamp) |
| `exp` | Integer | Expiration (Unix timestamp) |

## Request/Response Schemas

### UserCreate (Request)

Used for POST `/api/auth/register`

```python
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
```

### UserLogin (Request)

Used for POST `/api/auth/login`

```python
class UserLogin(BaseModel):
    email: EmailStr
    password: str
```

### TokenResponse (Response)

Used for successful login/register

```python
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds until expiration
```

### UserResponse (Response)

Used when returning user info

```python
class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime
```

## Validation Rules

### Email
- Required field
- Must be valid email format (RFC 5322)
- Normalized to lowercase before storage
- Must be unique across all users

### Password
- Required field
- Minimum length: 8 characters
- No maximum length enforced
- Stored as bcrypt hash (never plain text)

## Indexes

| Table | Index Name | Columns | Type | Purpose |
|-------|------------|---------|------|---------|
| users | `pk_users` | id | Primary | Unique identification |
| users | `ix_users_email` | email | UNIQUE B-tree | Fast email lookup, uniqueness |
| tasks | `pk_tasks` | id | Primary | Unique identification |
| tasks | `ix_tasks_user_id` | user_id | B-tree | Fast user task queries |

## Database Migrations

### Migration 002: Add Users Table

```sql
-- Up
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX ix_users_email ON users(email);

-- Down
DROP TABLE IF EXISTS users;
```

### Migration 003: Update Tasks user_id Type

```sql
-- Up (only if needed - depends on existing data)
-- If user_id was previously a string, it needs migration
-- For fresh installs, this is handled by SQLModel create_all

-- Down
-- Revert user_id column type if needed
```

## Query Patterns

### Register User
```sql
INSERT INTO users (email, password_hash, created_at, updated_at)
VALUES (:email, :password_hash, NOW(), NOW())
RETURNING *;
```

### Get User by Email
```sql
SELECT * FROM users WHERE email = :email;
```

### Get User by ID
```sql
SELECT * FROM users WHERE id = :user_id;
```

### List Tasks for User (with auth)
```sql
SELECT * FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC;
```

### Get Task with Ownership Check
```sql
SELECT * FROM tasks WHERE id = :task_id AND user_id = :user_id;
```
