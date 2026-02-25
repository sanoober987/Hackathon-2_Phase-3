# API Contracts: Frontend-Backend Integration

## Overview
This document defines the API contracts between the Next.js frontend and the FastAPI backend for the task management functionality. These contracts ensure proper communication and data exchange between the two systems.

## Authentication Headers
All protected API requests must include the following header:
```
Authorization: Bearer {jwt_token}
```

## Task Management Endpoints

### 1. Get User Tasks
- **Endpoint**: `GET /api/tasks`
- **Description**: Retrieve all tasks belonging to the authenticated user
- **Headers**:
  - Authorization: Bearer {jwt_token}
- **Response Codes**:
  - 200: Success - Returns array of user's tasks
  - 401: Unauthorized - Invalid or missing JWT token
  - 500: Internal Server Error
- **Response Body** (200):
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "completed": true,
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string",
      "userId": "string"
    }
  ]
  ```

### 2. Create Task
- **Endpoint**: `POST /api/tasks`
- **Description**: Create a new task for the authenticated user
- **Headers**:
  - Authorization: Bearer {jwt_token}
  - Content-Type: application/json
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string"
  }
  ```
- **Response Codes**:
  - 201: Created - Task successfully created
  - 400: Bad Request - Invalid request body
  - 401: Unauthorized - Invalid or missing JWT token
  - 500: Internal Server Error
- **Response Body** (201):
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "completed": false,
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string",
    "userId": "string"
  }
  ```

### 3. Update Task
- **Endpoint**: `PUT /api/tasks/{id}`
- **Description**: Update an existing task for the authenticated user
- **Headers**:
  - Authorization: Bearer {jwt_token}
  - Content-Type: application/json
- **Path Parameters**:
  - id: Task ID to update
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string"
  }
  ```
- **Response Codes**:
  - 200: Success - Task updated successfully
  - 400: Bad Request - Invalid request body
  - 401: Unauthorized - Invalid or missing JWT token
  - 404: Not Found - Task does not exist or belongs to another user
  - 500: Internal Server Error
- **Response Body** (200):
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "completed": false,
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string",
    "userId": "string"
  }
  ```

### 4. Delete Task
- **Endpoint**: `DELETE /api/tasks/{id}`
- **Description**: Delete a task for the authenticated user
- **Headers**:
  - Authorization: Bearer {jwt_token}
- **Path Parameters**:
  - id: Task ID to delete
- **Response Codes**:
  - 204: No Content - Task deleted successfully
  - 401: Unauthorized - Invalid or missing JWT token
  - 404: Not Found - Task does not exist or belongs to another user
  - 500: Internal Server Error
- **Response Body**: None

### 5. Toggle Task Completion
- **Endpoint**: `PATCH /api/tasks/{id}/toggle`
- **Description**: Toggle the completion status of a task
- **Headers**:
  - Authorization: Bearer {jwt_token}
- **Path Parameters**:
  - id: Task ID to toggle
- **Response Codes**:
  - 200: Success - Task completion status updated
  - 401: Unauthorized - Invalid or missing JWT token
  - 404: Not Found - Task does not exist or belongs to another user
  - 500: Internal Server Error
- **Response Body** (200):
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "completed": true,
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string",
    "userId": "string"
  }
  ```

## Error Response Format
All error responses follow this format:
```json
{
  "detail": "Human-readable error message",
  "status_code": 401
}
```

## Frontend API Client Interface
The frontend should implement an API client with these methods:

```typescript
interface TaskApiService {
  getTasks(): Promise<Task[]>;
  createTask(taskData: { title: string; description?: string }): Promise<Task>;
  updateTask(id: string, taskData: { title: string; description?: string }): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  toggleTaskCompletion(id: string): Promise<Task>;
}
```

## Expected Behavior
- All API calls should handle loading states in the UI
- Network errors should display appropriate user feedback
- 401 responses should trigger authentication flow
- Rate limiting should be respected if implemented
- Requests should timeout after 30 seconds if no response