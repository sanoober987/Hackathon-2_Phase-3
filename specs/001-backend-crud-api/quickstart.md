# Quickstart: Core Web Application & Backend Setup

**Feature**: 001-backend-crud-api
**Date**: 2026-02-01

## Prerequisites

- Python 3.12+
- Neon PostgreSQL database (provisioned)
- Git

## Setup Steps

### 1. Clone and Navigate

```bash
cd /path/to/project
git checkout 001-backend-crud-api
```

### 2. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Create `.env` file in `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your Neon database credentials:

```env
DATABASE_URL=postgresql+asyncpg://username:password@ep-xxx.region.neon.tech/dbname?sslmode=require
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 5. Initialize Database

The database tables are created automatically on first run via SQLModel.

### 6. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7. Verify Installation

Open http://localhost:8000/docs to see the interactive API documentation.

## Quick Test

### Create a Task

```bash
curl -X POST "http://localhost:8000/api/user-123/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task", "description": "Test task"}'
```

Expected response (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user-123",
  "title": "My first task",
  "description": "Test task",
  "completed": false,
  "created_at": "2026-02-01T10:30:00Z",
  "updated_at": "2026-02-01T10:30:00Z"
}
```

### List Tasks

```bash
curl "http://localhost:8000/api/user-123/tasks"
```

### Toggle Completion

```bash
curl -X PATCH "http://localhost:8000/api/user-123/tasks/{task_id}/complete"
```

## Running Tests

```bash
cd backend
pytest -v
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create task |
| GET | `/api/{user_id}/tasks/{task_id}` | Get task |
| PUT | `/api/{user_id}/tasks/{task_id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{task_id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{task_id}/complete` | Toggle completion |

## Interactive Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Troubleshooting

### Connection Error to Neon

1. Verify DATABASE_URL is correct
2. Check that `?sslmode=require` is in the URL
3. Ensure Neon project is active (not suspended)

### Import Errors

```bash
pip install -r requirements.txt --upgrade
```

### Port Already in Use

```bash
uvicorn app.main:app --reload --port 8001
```

## Next Steps

After this spec is complete:
- **Spec 2**: Add JWT authentication (Better Auth integration)
- **Spec 3**: Build Next.js frontend
- **Spec 4**: Deployment configuration
