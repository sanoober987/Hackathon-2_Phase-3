"""
Task service unit tests.

Tests for task_service.py business logic layer.
"""

import pytest
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate
from app.services import task_service


@pytest.mark.asyncio
async def test_create_task_service(db_session: AsyncSession):
    """Test create_task service creates task with correct attributes."""
    user_id = "test-user"
    task_data = TaskCreate(title="Test Task", description="Test description")

    task = await task_service.create_task(db_session, user_id, task_data)

    assert task.title == "Test Task"
    assert task.description == "Test description"
    assert task.user_id == user_id
    assert task.completed is False
    assert task.id is not None


@pytest.mark.asyncio
async def test_list_tasks_service_returns_only_user_tasks(db_session: AsyncSession):
    """Test list_tasks returns only tasks for the specified user."""
    user_a = "user-a"
    user_b = "user-b"

    # Create tasks for both users
    await task_service.create_task(
        db_session, user_a, TaskCreate(title="User A Task")
    )
    await task_service.create_task(
        db_session, user_b, TaskCreate(title="User B Task")
    )

    # List tasks for user A
    tasks = await task_service.list_tasks(db_session, user_a)

    assert len(tasks) == 1
    assert tasks[0].title == "User A Task"


@pytest.mark.asyncio
async def test_get_task_service_returns_task_for_owner(db_session: AsyncSession):
    """Test get_task returns task when user is the owner."""
    user_id = "test-user"
    created = await task_service.create_task(
        db_session, user_id, TaskCreate(title="Test Task")
    )

    task = await task_service.get_task(db_session, user_id, created.id)

    assert task is not None
    assert task.id == created.id


@pytest.mark.asyncio
async def test_get_task_service_returns_none_for_non_owner(db_session: AsyncSession):
    """Test get_task returns None when user is not the owner."""
    owner = "owner-user"
    other = "other-user"

    created = await task_service.create_task(
        db_session, owner, TaskCreate(title="Owner's Task")
    )

    task = await task_service.get_task(db_session, other, created.id)

    assert task is None


@pytest.mark.asyncio
async def test_update_task_service_updates_fields(db_session: AsyncSession):
    """Test update_task updates specified fields."""
    user_id = "test-user"
    created = await task_service.create_task(
        db_session, user_id, TaskCreate(title="Original", description="Original desc")
    )

    updated = await task_service.update_task(
        db_session, user_id, created.id, TaskUpdate(title="Updated")
    )

    assert updated is not None
    assert updated.title == "Updated"
    assert updated.description == "Original desc"  # Unchanged


@pytest.mark.asyncio
async def test_delete_task_service_deletes_task(db_session: AsyncSession):
    """Test delete_task removes the task."""
    user_id = "test-user"
    created = await task_service.create_task(
        db_session, user_id, TaskCreate(title="To Delete")
    )

    result = await task_service.delete_task(db_session, user_id, created.id)

    assert result is True

    # Verify task is deleted
    task = await task_service.get_task(db_session, user_id, created.id)
    assert task is None


@pytest.mark.asyncio
async def test_toggle_completion_service_toggles_status(db_session: AsyncSession):
    """Test toggle_task_completion flips the completed status."""
    user_id = "test-user"
    created = await task_service.create_task(
        db_session, user_id, TaskCreate(title="Toggle Task")
    )
    assert created.completed is False

    # Toggle to complete
    toggled = await task_service.toggle_task_completion(
        db_session, user_id, created.id
    )
    assert toggled.completed is True

    # Toggle back to incomplete
    toggled_again = await task_service.toggle_task_completion(
        db_session, user_id, created.id
    )
    assert toggled_again.completed is False
