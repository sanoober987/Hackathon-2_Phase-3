# Tasks: Core Web Application & Backend Setup

**Input**: Design documents from `/specs/001-backend-crud-api/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are included as requested in the spec (SC-006: "All endpoints pass automated tests").

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/`, `backend/tests/`
- Paths shown below follow the plan.md structure

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize FastAPI project structure and dependencies

- [x] T001 Create backend directory structure per plan.md at backend/
- [x] T002 Create requirements.txt with runtime dependencies in backend/requirements.txt
- [x] T003 [P] Create .env.example with DATABASE_URL template in backend/.env.example
- [x] T004 [P] Create backend/app/__init__.py with package initialization
- [x] T005 Create environment configuration module in backend/app/config.py
- [x] T006 Create FastAPI application entry point in backend/app/main.py

**Checkpoint**: Project structure ready, FastAPI app initializes without errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create async database engine and session management in backend/app/database.py
- [x] T008 Create Task SQLModel in backend/app/models/task.py
- [x] T009 [P] Create backend/app/models/__init__.py with Task export
- [x] T010 Create Pydantic request/response schemas in backend/app/schemas/task.py
- [x] T011 [P] Create backend/app/schemas/__init__.py with schema exports
- [x] T012 Create database session dependency in backend/app/api/deps.py
- [x] T013 [P] Create backend/app/api/__init__.py
- [x] T014 [P] Create backend/app/api/routes/__init__.py
- [x] T015 [P] Create backend/app/services/__init__.py
- [x] T016 Create pytest fixtures and test database setup in backend/tests/conftest.py
- [x] T017 [P] Create backend/tests/__init__.py

**Checkpoint**: Database connection works, Task model created, test infrastructure ready

---

## Phase 3: User Story 1 & 2 - Create Task & List Tasks (Priority: P1) MVP

**Goal**: Enable users to create tasks and view their task list - the minimum viable product

**Independent Test**: Create a task via POST, then retrieve it via GET list endpoint

### Tests for User Stories 1 & 2

- [x] T018 [P] [US1] Write test for POST /api/{user_id}/tasks success case in backend/tests/test_tasks.py
- [x] T019 [P] [US1] Write test for POST /api/{user_id}/tasks validation error (missing title) in backend/tests/test_tasks.py
- [x] T020 [P] [US2] Write test for GET /api/{user_id}/tasks returns user's tasks in backend/tests/test_tasks.py
- [x] T021 [P] [US2] Write test for GET /api/{user_id}/tasks returns empty list when no tasks in backend/tests/test_tasks.py
- [x] T022 [P] [US2] Write test for user isolation (user A cannot see user B's tasks) in backend/tests/test_tasks.py

### Implementation for User Stories 1 & 2

- [x] T023 [US1] Implement create_task service method in backend/app/services/task_service.py
- [x] T024 [US2] Implement list_tasks service method in backend/app/services/task_service.py
- [x] T025 [US1] Implement POST /api/{user_id}/tasks endpoint in backend/app/api/routes/tasks.py
- [x] T026 [US2] Implement GET /api/{user_id}/tasks endpoint in backend/app/api/routes/tasks.py
- [x] T027 Register task router in FastAPI app in backend/app/main.py
- [x] T028 Run database table creation on startup in backend/app/main.py

**Checkpoint**: Can create tasks and list them - MVP complete. Run: `pytest backend/tests/test_tasks.py -k "create or list"`

---

## Phase 4: User Story 3 - View Specific Task (Priority: P2)

**Goal**: Enable users to view details of a specific task by ID

**Independent Test**: Create a task, then retrieve it by ID via GET /api/{user_id}/tasks/{task_id}

### Tests for User Story 3

- [x] T029 [P] [US3] Write test for GET /api/{user_id}/tasks/{task_id} success case in backend/tests/test_tasks.py
- [x] T030 [P] [US3] Write test for GET /api/{user_id}/tasks/{task_id} returns 404 for non-existent task in backend/tests/test_tasks.py
- [x] T031 [P] [US3] Write test for GET /api/{user_id}/tasks/{task_id} returns 404 for other user's task in backend/tests/test_tasks.py

### Implementation for User Story 3

- [x] T032 [US3] Implement get_task service method in backend/app/services/task_service.py
- [x] T033 [US3] Implement GET /api/{user_id}/tasks/{task_id} endpoint in backend/app/api/routes/tasks.py

**Checkpoint**: Can retrieve individual tasks by ID. Run: `pytest backend/tests/test_tasks.py -k "get_task"`

---

## Phase 5: User Story 4 - Update Task (Priority: P2)

**Goal**: Enable users to update task title and description

**Independent Test**: Create a task, update its title via PUT, verify changes persisted

### Tests for User Story 4

- [x] T034 [P] [US4] Write test for PUT /api/{user_id}/tasks/{task_id} updates title in backend/tests/test_tasks.py
- [x] T035 [P] [US4] Write test for PUT /api/{user_id}/tasks/{task_id} updates description only in backend/tests/test_tasks.py
- [x] T036 [P] [US4] Write test for PUT /api/{user_id}/tasks/{task_id} returns 404 for non-existent task in backend/tests/test_tasks.py

### Implementation for User Story 4

- [x] T037 [US4] Implement update_task service method in backend/app/services/task_service.py
- [x] T038 [US4] Implement PUT /api/{user_id}/tasks/{task_id} endpoint in backend/app/api/routes/tasks.py

**Checkpoint**: Can update tasks. Run: `pytest backend/tests/test_tasks.py -k "update"`

---

## Phase 6: User Story 5 - Delete Task (Priority: P2)

**Goal**: Enable users to delete tasks they no longer need

**Independent Test**: Create a task, delete it via DELETE, verify it no longer appears in list

### Tests for User Story 5

- [x] T039 [P] [US5] Write test for DELETE /api/{user_id}/tasks/{task_id} success case in backend/tests/test_tasks.py
- [x] T040 [P] [US5] Write test for DELETE /api/{user_id}/tasks/{task_id} returns 404 for non-existent task in backend/tests/test_tasks.py
- [x] T041 [P] [US5] Write test for DELETE /api/{user_id}/tasks/{task_id} returns 404 for other user's task in backend/tests/test_tasks.py

### Implementation for User Story 5

- [x] T042 [US5] Implement delete_task service method in backend/app/services/task_service.py
- [x] T043 [US5] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint in backend/app/api/routes/tasks.py

**Checkpoint**: Can delete tasks. Run: `pytest backend/tests/test_tasks.py -k "delete"`

---

## Phase 7: User Story 6 - Toggle Task Completion (Priority: P3)

**Goal**: Enable users to mark tasks as complete or incomplete

**Independent Test**: Create a task (incomplete), toggle completion, verify status changed to complete

### Tests for User Story 6

- [x] T044 [P] [US6] Write test for PATCH /api/{user_id}/tasks/{task_id}/complete toggles incomplete to complete in backend/tests/test_tasks.py
- [x] T045 [P] [US6] Write test for PATCH /api/{user_id}/tasks/{task_id}/complete toggles complete to incomplete in backend/tests/test_tasks.py
- [x] T046 [P] [US6] Write test for PATCH /api/{user_id}/tasks/{task_id}/complete returns 404 for non-existent task in backend/tests/test_tasks.py

### Implementation for User Story 6

- [x] T047 [US6] Implement toggle_task_completion service method in backend/app/services/task_service.py
- [x] T048 [US6] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint in backend/app/api/routes/tasks.py

**Checkpoint**: Can toggle task completion. Run: `pytest backend/tests/test_tasks.py -k "toggle or complete"`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [x] T049 [P] Add structured logging to all endpoints in backend/app/api/routes/tasks.py
- [x] T050 [P] Add service layer unit tests in backend/tests/test_task_service.py
- [x] T051 [P] Create backend/README.md with setup instructions
- [x] T052 Run full test suite and verify all tests pass
- [x] T053 Verify quickstart.md scenarios work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3)
  - Within each story: Tests → Service → Endpoint
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Priority | Depends On | Can Parallel With |
|-------|----------|------------|-------------------|
| US1+US2 (Create/List) | P1 | Foundational | - |
| US3 (Get) | P2 | Foundational | US4, US5 |
| US4 (Update) | P2 | Foundational | US3, US5 |
| US5 (Delete) | P2 | Foundational | US3, US4 |
| US6 (Toggle) | P3 | Foundational | - |

### Within Each User Story

1. Tests MUST be written first (TDD approach per spec requirement)
2. Service methods before endpoints
3. Register routes after implementation
4. Story complete = all tests pass

### Parallel Opportunities

- All [P] tasks within a phase can run in parallel
- Tests for different user stories can be written in parallel
- P2 user stories (US3, US4, US5) can run in parallel after P1 complete

---

## Parallel Execution Examples

### Phase 2: Foundational (parallel tasks)

```bash
# Can run simultaneously:
Task: "Create backend/app/models/__init__.py"
Task: "Create backend/app/schemas/__init__.py"
Task: "Create backend/app/api/__init__.py"
Task: "Create backend/app/api/routes/__init__.py"
Task: "Create backend/app/services/__init__.py"
Task: "Create backend/tests/__init__.py"
```

### Phase 3: User Stories 1 & 2 Tests (parallel)

```bash
# Can run simultaneously:
Task: "Write test for POST create task success"
Task: "Write test for POST create task validation error"
Task: "Write test for GET list tasks"
Task: "Write test for GET list empty"
Task: "Write test for user isolation"
```

### P2 Stories in Parallel (after P1 complete)

```bash
# US3, US4, US5 can start simultaneously:
Developer A: User Story 3 (Get Task)
Developer B: User Story 4 (Update Task)
Developer C: User Story 5 (Delete Task)
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Stories 1 & 2
4. **STOP and VALIDATE**: Run `pytest -v`, verify create and list work
5. MVP ready - can demo creating and viewing tasks

### Incremental Delivery

1. Setup + Foundational → Backend infrastructure ready
2. Add US1+US2 → MVP: Create and List tasks
3. Add US3 → Can view individual tasks
4. Add US4 → Can update tasks
5. Add US5 → Can delete tasks
6. Add US6 → Can toggle completion
7. Polish → Production ready

### Suggested Execution Order

```
T001-T006 (Setup) → T007-T017 (Foundational) →
T018-T028 (US1+US2 MVP) → T029-T033 (US3) →
T034-T038 (US4) → T039-T043 (US5) → T044-T048 (US6) →
T049-T053 (Polish)
```

---

## Task Summary

| Phase | Tasks | Parallel Tasks |
|-------|-------|----------------|
| Setup | 6 | 2 |
| Foundational | 11 | 7 |
| US1+US2 (P1) | 11 | 5 |
| US3 (P2) | 5 | 3 |
| US4 (P2) | 5 | 3 |
| US5 (P2) | 5 | 3 |
| US6 (P3) | 5 | 3 |
| Polish | 5 | 3 |
| **Total** | **53** | **29** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Tests written before implementation (TDD per spec SC-006)
- Each user story independently testable after completion
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
