# Todo Task API Backend

RESTful API for managing user tasks built with FastAPI and SQLModel.

## Features

- Full CRUD operations for tasks
- User-scoped data isolation
- Async database operations with Neon PostgreSQL
- Ready for JWT authentication integration

## Quick Start

### Prerequisites

- Python 3.12+
- Neon PostgreSQL database

### Setup

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your Neon database credentials
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. Open API docs: http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{user_id}/tasks` | List all tasks for user |
| POST | `/api/{user_id}/tasks` | Create new task |
| GET | `/api/{user_id}/tasks/{task_id}` | Get specific task |
| PUT | `/api/{user_id}/tasks/{task_id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{task_id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{task_id}/complete` | Toggle completion |

## Testing

Run the test suite:
```bash
pytest -v
```

Run specific test categories:
```bash
pytest -k "create"      # Create task tests
pytest -k "list"        # List tasks tests
pytest -k "update"      # Update task tests
pytest -k "delete"      # Delete task tests
pytest -k "toggle"      # Toggle completion tests
```

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI application
│   ├── config.py         # Environment configuration
│   ├── database.py       # Database connection
│   ├── models/           # SQLModel database models
│   ├── schemas/          # Pydantic request/response schemas
│   ├── api/              # API routes and dependencies
│   └── services/         # Business logic layer
└── tests/                # Test suite
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `ENVIRONMENT` | development/production | development |
| `LOG_LEVEL` | Logging level | INFO |
