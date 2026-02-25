"""
Task API endpoint tests.

Tests for all CRUD operations on tasks.
"""

import pytest
from httpx import AsyncClient
from uuid import uuid4


# =============================================================================
# User Story 1 & 2: Create Task & List Tasks (P1 - MVP)
# =============================================================================


@pytest.mark.asyncio
async def test_create_task_success(client: AsyncClient):
    """Test creating a task with valid data returns 201 and task details."""
    user_id = "user-123"
    task_data = {"title": "Buy groceries", "description": "Milk, bread, eggs"}

    response = await client.post(f"/api/{user_id}/tasks", json=task_data)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy groceries"
    assert data["description"] == "Milk, bread, eggs"
    assert data["user_id"] == user_id
    assert data["completed"] is False
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


@pytest.mark.asyncio
async def test_create_task_validation_error_missing_title(client: AsyncClient):
    """Test creating a task without title returns 422 validation error."""
    user_id = "user-123"
    task_data = {"description": "Some description"}

    response = await client.post(f"/api/{user_id}/tasks", json=task_data)

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_list_tasks_returns_user_tasks(client: AsyncClient):
    """Test listing tasks returns all tasks for the user."""
    user_id = "user-123"

    # Create multiple tasks
    await client.post(f"/api/{user_id}/tasks", json={"title": "Task 1"})
    await client.post(f"/api/{user_id}/tasks", json={"title": "Task 2"})
    await client.post(f"/api/{user_id}/tasks", json={"title": "Task 3"})

    response = await client.get(f"/api/{user_id}/tasks")

    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 3
    assert len(data["tasks"]) == 3


@pytest.mark.asyncio
async def test_list_tasks_returns_empty_list_when_no_tasks(client: AsyncClient):
    """Test listing tasks returns empty list when user has no tasks."""
    user_id = "user-no-tasks"

    response = await client.get(f"/api/{user_id}/tasks")

    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 0
    assert data["tasks"] == []


@pytest.mark.asyncio
async def test_user_isolation_user_a_cannot_see_user_b_tasks(client: AsyncClient):
    """Test that User A cannot see User B's tasks."""
    user_a = "user-a"
    user_b = "user-b"

    # Create tasks for both users
    await client.post(f"/api/{user_a}/tasks", json={"title": "User A Task"})
    await client.post(f"/api/{user_b}/tasks", json={"title": "User B Task"})

    # User A should only see their own task
    response_a = await client.get(f"/api/{user_a}/tasks")
    data_a = response_a.json()
    assert data_a["count"] == 1
    assert data_a["tasks"][0]["title"] == "User A Task"

    # User B should only see their own task
    response_b = await client.get(f"/api/{user_b}/tasks")
    data_b = response_b.json()
    assert data_b["count"] == 1
    assert data_b["tasks"][0]["title"] == "User B Task"


# =============================================================================
# User Story 3: View Specific Task (P2)
# =============================================================================


@pytest.mark.asyncio
async def test_get_task_success(client: AsyncClient):
    """Test getting a specific task returns task details."""
    user_id = "user-123"

    # Create a task
    create_response = await client.post(
        f"/api/{user_id}/tasks",
        json={"title": "Test Task", "description": "Test description"},
    )
    task_id = create_response.json()["id"]

    # Get the task
    response = await client.get(f"/api/{user_id}/tasks/{task_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Test Task"
    assert data["description"] == "Test description"


@pytest.mark.asyncio
async def test_get_task_returns_404_for_nonexistent_task(client: AsyncClient):
    """Test getting a non-existent task returns 404."""
    user_id = "user-123"
    fake_task_id = str(uuid4())

    response = await client.get(f"/api/{user_id}/tasks/{fake_task_id}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_task_returns_404_for_other_users_task(client: AsyncClient):
    """Test getting another user's task returns 404."""
    user_a = "user-a"
    user_b = "user-b"

    # Create task for User A
    create_response = await client.post(
        f"/api/{user_a}/tasks", json={"title": "User A's Task"}
    )
    task_id = create_response.json()["id"]

    # User B tries to access User A's task
    response = await client.get(f"/api/{user_b}/tasks/{task_id}")

    assert response.status_code == 404


# =============================================================================
# User Story 4: Update Task (P2)
# =============================================================================


@pytest.mark.asyncio
async def test_update_task_updates_title(client: AsyncClient):
    """Test updating a task's title."""
    user_id = "user-123"

    # Create a task
    create_response = await client.post(
        f"/api/{user_id}/tasks", json={"title": "Old Title"}
    )
    task_id = create_response.json()["id"]

    # Update the task
    response = await client.put(
        f"/api/{user_id}/tasks/{task_id}", json={"title": "New Title"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New Title"


@pytest.mark.asyncio
async def test_update_task_updates_description_only(client: AsyncClient):
    """Test updating only the description preserves the title."""
    user_id = "user-123"

    # Create a task
    create_response = await client.post(
        f"/api/{user_id}/tasks",
        json={"title": "Original Title", "description": "Old description"},
    )
    task_id = create_response.json()["id"]

    # Update only description
    response = await client.put(
        f"/api/{user_id}/tasks/{task_id}", json={"description": "New description"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Original Title"
    assert data["description"] == "New description"


@pytest.mark.asyncio
async def test_update_task_returns_404_for_nonexistent_task(client: AsyncClient):
    """Test updating a non-existent task returns 404."""
    user_id = "user-123"
    fake_task_id = str(uuid4())

    response = await client.put(
        f"/api/{user_id}/tasks/{fake_task_id}", json={"title": "New Title"}
    )

    assert response.status_code == 404


# =============================================================================
# User Story 5: Delete Task (P2)
# =============================================================================


@pytest.mark.asyncio
async def test_delete_task_success(client: AsyncClient):
    """Test deleting a task returns 204 and task is removed."""
    user_id = "user-123"

    # Create a task
    create_response = await client.post(
        f"/api/{user_id}/tasks", json={"title": "Task to delete"}
    )
    task_id = create_response.json()["id"]

    # Delete the task
    response = await client.delete(f"/api/{user_id}/tasks/{task_id}")
    assert response.status_code == 204

    # Verify task is deleted
    get_response = await client.get(f"/api/{user_id}/tasks/{task_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_delete_task_returns_404_for_nonexistent_task(client: AsyncClient):
    """Test deleting a non-existent task returns 404."""
    user_id = "user-123"
    fake_task_id = str(uuid4())

    response = await client.delete(f"/api/{user_id}/tasks/{fake_task_id}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_task_returns_404_for_other_users_task(client: AsyncClient):
    """Test deleting another user's task returns 404."""
    user_a = "user-a"
    user_b = "user-b"

    # Create task for User A
    create_response = await client.post(
        f"/api/{user_a}/tasks", json={"title": "User A's Task"}
    )
    task_id = create_response.json()["id"]

    # User B tries to delete User A's task
    response = await client.delete(f"/api/{user_b}/tasks/{task_id}")

    assert response.status_code == 404

    # Verify task still exists for User A
    get_response = await client.get(f"/api/{user_a}/tasks/{task_id}")
    assert get_response.status_code == 200


# =============================================================================
# User Story 6: Toggle Task Completion (P3)
# =============================================================================


@pytest.mark.asyncio
async def test_toggle_task_incomplete_to_complete(client: AsyncClient):
    """Test toggling an incomplete task to complete."""
    user_id = "user-123"

    # Create a task (incomplete by default)
    create_response = await client.post(
        f"/api/{user_id}/tasks", json={"title": "Incomplete Task"}
    )
    task_id = create_response.json()["id"]
    assert create_response.json()["completed"] is False

    # Toggle completion
    response = await client.patch(f"/api/{user_id}/tasks/{task_id}/complete")

    assert response.status_code == 200
    assert response.json()["completed"] is True


@pytest.mark.asyncio
async def test_toggle_task_complete_to_incomplete(client: AsyncClient):
    """Test toggling a complete task back to incomplete."""
    user_id = "user-123"

    # Create and complete a task
    create_response = await client.post(
        f"/api/{user_id}/tasks", json={"title": "Task to toggle"}
    )
    task_id = create_response.json()["id"]

    # Toggle to complete
    await client.patch(f"/api/{user_id}/tasks/{task_id}/complete")

    # Toggle back to incomplete
    response = await client.patch(f"/api/{user_id}/tasks/{task_id}/complete")

    assert response.status_code == 200
    assert response.json()["completed"] is False


@pytest.mark.asyncio
async def test_toggle_task_returns_404_for_nonexistent_task(client: AsyncClient):
    """Test toggling a non-existent task returns 404."""
    user_id = "user-123"
    fake_task_id = str(uuid4())

    response = await client.patch(f"/api/{user_id}/tasks/{fake_task_id}/complete")

    assert response.status_code == 404
