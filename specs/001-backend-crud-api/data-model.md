# Data Model: Core Web Application & Backend Setup

**Feature**: 001-backend-crud-api
**Date**: 2026-02-01
**Status**: Complete

## Entity Overview

```
┌─────────────────────────────────────────────────────────────┐
│                          Task                                │
├─────────────────────────────────────────────────────────────┤
│ id: UUID (PK)                                               │
│ user_id: String (indexed, NOT NULL)                         │
│ title: String(255) (NOT NULL)                               │
│ description: String(2000) (nullable)                        │
│ completed: Boolean (default: false)                         │
│ created_at: DateTime (auto, UTC)                            │
│ updated_at: DateTime (auto on update, UTC)                  │
└─────────────────────────────────────────────────────────────┘
```

## Entities

### Task

Represents a work item to be tracked by a user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, default uuid4 | Unique task identifier |
| `user_id` | String | NOT NULL, indexed | Owner of the task |
| `title` | String(255) | NOT NULL | Task title (required) |
| `description` | String(2000) | nullable | Optional task details |
| `completed` | Boolean | default false | Completion status |
| `created_at` | DateTime | auto, UTC | Creation timestamp |
| `updated_at` | DateTime | auto on update, UTC | Last modification timestamp |

#### SQLModel Definition

```python
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)}
    )
```

#### Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `ix_tasks_user_id` | user_id | B-tree | Fast user task lookups |
| `pk_tasks` | id | Primary | Unique task identification |

## Request/Response Schemas

### TaskCreate (Request)

Used for POST `/api/{user_id}/tasks`

```python
class TaskCreate(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
```

### TaskUpdate (Request)

Used for PUT `/api/{user_id}/tasks/{task_id}`

```python
class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
```

### TaskResponse (Response)

Used for all task responses

```python
class TaskResponse(SQLModel):
    id: UUID
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
```

### TaskListResponse (Response)

Used for GET `/api/{user_id}/tasks`

```python
class TaskListResponse(SQLModel):
    tasks: list[TaskResponse]
    count: int
```

## Validation Rules

### Title
- Required field
- Minimum length: 1 character
- Maximum length: 255 characters
- UTF-8 characters allowed

### Description
- Optional field
- Maximum length: 2000 characters
- UTF-8 characters allowed
- `null` stored as `None`

### User ID
- Required in URL path
- Any non-empty string accepted (auth validation in Spec 2)
- Indexed for query performance

## State Transitions

### Task Completion

```
┌──────────────┐    toggle     ┌──────────────┐
│  incomplete  │ ──────────►   │   complete   │
│ completed=F  │               │ completed=T  │
└──────────────┘   ◄──────────  └──────────────┘
                    toggle
```

- Toggle operation flips `completed` boolean
- `updated_at` timestamp updated on toggle

## Database Migrations

### Initial Migration (001_create_tasks_table)

```sql
-- Up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_tasks_user_id ON tasks(user_id);

-- Down
DROP TABLE IF EXISTS tasks;
```

## Data Integrity Constraints

| Constraint | Type | Description |
|------------|------|-------------|
| Non-null user_id | NOT NULL | Every task must have an owner |
| Non-null title | NOT NULL | Every task must have a title |
| Title length | CHECK | Max 255 characters |
| Description length | CHECK | Max 2000 characters |

## Query Patterns

### List Tasks by User
```sql
SELECT * FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC;
```

### Get Single Task (with user check)
```sql
SELECT * FROM tasks WHERE id = :task_id AND user_id = :user_id;
```

### Update Task (with user check)
```sql
UPDATE tasks
SET title = :title, description = :description, updated_at = NOW()
WHERE id = :task_id AND user_id = :user_id
RETURNING *;
```

### Delete Task (with user check)
```sql
DELETE FROM tasks WHERE id = :task_id AND user_id = :user_id;
```

### Toggle Completion
```sql
UPDATE tasks
SET completed = NOT completed, updated_at = NOW()
WHERE id = :task_id AND user_id = :user_id
RETURNING *;
```
