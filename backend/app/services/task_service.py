"""
Task service - Business logic layer for task operations.

Handles all CRUD operations with user isolation.
"""

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


async def create_task(
    db: AsyncSession,
    user_id: str,
    task_data: TaskCreate,
) -> Task:
    """Create a new task for a user."""
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def list_tasks(
    db: AsyncSession,
    user_id: str,
    completed: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
) -> list[Task]:
    """List tasks for a user with optional completion filter and pagination."""
    query = select(Task).where(Task.user_id == user_id)
    if completed is not None:
        query = query.where(Task.completed == completed)
    query = query.order_by(Task.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return list(result.scalars().all())


async def count_tasks(
    db: AsyncSession,
    user_id: str,
    completed: Optional[bool] = None,
) -> int:
    """Count tasks for a user with optional completion filter."""
    from sqlalchemy import func
    query = select(func.count()).select_from(Task).where(Task.user_id == user_id)
    if completed is not None:
        query = query.where(Task.completed == completed)
    result = await db.execute(query)
    return result.scalar_one()


async def get_task(
    db: AsyncSession,
    user_id: str,
    task_id: UUID,
) -> Optional[Task]:
    """Get a specific task by ID for a user."""
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def update_task(
    db: AsyncSession,
    user_id: str,
    task_id: UUID,
    task_data: TaskUpdate,
) -> Optional[Task]:
    """Update a task for a user (partial update — only provided fields are changed)."""
    task = await get_task(db, user_id, task_id)
    if not task:
        return None

    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    task.updated_at = datetime.now(timezone.utc)

    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def delete_task(
    db: AsyncSession,
    user_id: str,
    task_id: UUID,
) -> bool:
    """Delete a task for a user. Returns True if deleted, False if not found."""
    task = await get_task(db, user_id, task_id)
    if not task:
        return False

    await db.delete(task)
    await db.commit()
    return True


async def toggle_task_completion(
    db: AsyncSession,
    user_id: str,
    task_id: UUID,
) -> Optional[Task]:
    """Toggle the completion status of a task."""
    task = await get_task(db, user_id, task_id)
    if not task:
        return None

    task.completed = not task.completed
    task.updated_at = datetime.now(timezone.utc)

    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task
