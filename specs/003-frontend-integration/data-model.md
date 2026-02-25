# Data Model: Frontend Integration

## Overview
This document defines the data models for the frontend integration, based on the entities identified in the feature specification.

## Primary Entities

### Task
Represents a user's todo item with properties including title, description, completion status, and creation timestamp.

**Fields:**
- `id`: string | Unique identifier for the task
- `title`: string | Title of the task (required)
- `description`: string | Detailed description of the task (optional)
- `completed`: boolean | Completion status (default: false)
- `createdAt`: Date | Timestamp when task was created
- `updatedAt`: Date | Timestamp when task was last updated
- `userId`: string | Foreign key linking to the owner user

**Validation:**
- Title must be 1-200 characters
- Description must be 0-1000 characters if provided
- Completed must be boolean
- createdAt and updatedAt must be valid ISO date strings

### User
Represents an authenticated user who owns tasks and can perform CRUD operations on their own tasks.

**Fields:**
- `id`: string | Unique identifier for the user
- `email`: string | User's email address
- `name`: string | User's display name (optional)
- `createdAt`: Date | Timestamp when user account was created

**Validation:**
- Email must be valid email format
- Name must be 1-100 characters if provided

## Frontend-Specific Types

### TaskFormData
Used for form submissions and validation.

**Fields:**
- `title`: string
- `description`: string | Optional

### ApiError
Standardized error response format.

**Fields:**
- `message`: string | Human-readable error message
- `statusCode`: number | HTTP status code
- `details`: object | Additional error details (optional)

## State Management Models

### TaskState
Manages the state of tasks in the frontend application.

**Fields:**
- `tasks`: Array<Task> | List of user's tasks
- `loading`: boolean | Loading state indicator
- `error`: string | Error message if any
- `selectedTask`: Task | Currently selected task for editing (optional)

## UI Component Props

### TaskItemProps
Props for individual task components.

**Fields:**
- `task`: Task | Task object to display
- `onToggle`: Function | Handler for toggling completion status
- `onEdit`: Function | Handler for editing the task
- `onDelete`: Function | Handler for deleting the task

### TaskListProps
Props for task list components.

**Fields:**
- `tasks`: Array<Task> | Array of tasks to display
- `onTaskAction`: Function | Handler for task actions
- `loading`: boolean | Whether tasks are loading