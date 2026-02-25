# Tasks: User Authentication & JWT Integration

**Input**: Design documents from `/specs/002-jwt-auth/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests**: Not explicitly requested - test tasks included for critical auth flows only.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- All paths relative to repository root

## User Stories Summary (from spec.md)

| Story | Priority | Description |
|-------|----------|-------------|
| US1 | P1 | New User Registration |
| US2 | P1 | User Login |
| US3 | P1 | Protected Task Access |
| US4 | P2 | Token-Based Identity Verification |
| US5 | P2 | Secure Credential Storage |

---

## Phase 1: Setup (Dependencies & Configuration)

**Purpose**: Add new dependencies and configure authentication settings

- [ ] T001 Add python-jose[cryptography] and passlib[bcrypt] to backend/requirements.txt
- [ ] T002 [P] Add BETTER_AUTH_SECRET and JWT_EXPIRATION_DAYS to backend/app/config.py
- [ ] T003 [P] Update backend/app/models/__init__.py to export User model

---

## Phase 2: Foundational (Auth Infrastructure)

**Purpose**: Core authentication infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create User SQLModel in backend/app/models/user.py per data-model.md
- [ ] T005 Create password hashing utilities in backend/app/services/auth_service.py (hash_password, verify_password)
- [ ] T006 [P] Create JWT utilities in backend/app/services/auth_service.py (create_access_token, verify_token)
- [ ] T007 [P] Create auth schemas in backend/app/schemas/auth.py (UserCreate, UserLogin, TokenResponse, UserResponse)
- [ ] T008 Implement get_current_user dependency in backend/app/api/deps.py
- [ ] T009 [P] Create auth test fixtures in backend/tests/conftest.py (test user, mock tokens)

**Checkpoint**: Foundation ready - auth utilities and User model available for all user stories

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: Enable new users to create accounts with email/password and receive JWT token

**Independent Test**: POST /api/auth/register with valid email/password returns 201 with access_token

### Implementation for User Story 1

- [ ] T010 [US1] Create register_user function in backend/app/services/auth_service.py
- [ ] T011 [US1] Implement POST /api/auth/register endpoint in backend/app/api/routes/auth.py
- [ ] T012 [US1] Add email validation (format check, normalize to lowercase) in auth_service.py
- [ ] T013 [US1] Add duplicate email rejection (409 Conflict) in register_user function
- [ ] T014 [US1] Add password minimum length validation (8 chars) in UserCreate schema
- [ ] T015 [US1] Register auth router in backend/app/main.py

**Checkpoint**: User registration works - users can create accounts and receive tokens

---

## Phase 4: User Story 2 - User Login (Priority: P1)

**Goal**: Enable registered users to authenticate and receive JWT token

**Independent Test**: POST /api/auth/login with valid credentials returns 200 with access_token

### Implementation for User Story 2

- [ ] T016 [US2] Create authenticate_user function in backend/app/services/auth_service.py
- [ ] T017 [US2] Implement POST /api/auth/login endpoint in backend/app/api/routes/auth.py
- [ ] T018 [US2] Implement generic "Invalid credentials" error (prevents user enumeration)
- [ ] T019 [US2] Add logging for failed login attempts in auth_service.py

**Checkpoint**: User login works - registered users can authenticate and receive tokens

---

## Phase 5: User Story 3 - Protected Task Access (Priority: P1)

**Goal**: Protect all task endpoints with JWT authentication and user-scoped data access

**Independent Test**: GET /api/tasks with valid token returns only that user's tasks; without token returns 401

### Implementation for User Story 3

- [ ] T020 [US3] Refactor task routes from /api/{user_id}/tasks to /api/tasks in backend/app/api/routes/tasks.py
- [ ] T021 [US3] Add get_current_user dependency to all task endpoints in tasks.py
- [ ] T022 [US3] Update task_service.py to accept user_id parameter from authenticated user
- [ ] T023 [US3] Verify task ownership returns 404 (not 403) for non-owned tasks
- [ ] T024 [US3] Update TaskResponse schema to use UUID for user_id in backend/app/schemas/task.py

**Checkpoint**: Task endpoints protected - only authenticated users can access their own tasks

---

## Phase 6: User Story 4 - Token-Based Identity Verification (Priority: P2)

**Goal**: Implement stateless JWT verification with proper expiration handling

**Independent Test**: Tokens signed with correct secret verify successfully; wrong secret or expired tokens fail

### Implementation for User Story 4

- [ ] T025 [US4] Implement token expiration check (7 days) in verify_token function
- [ ] T026 [US4] Add distinct error messages for expired vs invalid tokens in get_current_user
- [ ] T027 [US4] Verify stateless operation (no session storage) in auth implementation

**Checkpoint**: Token verification robust - expired and tampered tokens properly rejected

---

## Phase 7: User Story 5 - Secure Credential Storage (Priority: P2)

**Goal**: Ensure passwords are securely hashed with bcrypt and salted

**Independent Test**: Password hashes in database are bcrypt format; same password produces different hashes

### Implementation for User Story 5

- [ ] T028 [US5] Verify bcrypt configuration in auth_service.py (work factor, auto-salt)
- [ ] T029 [US5] Add password hash format validation test in backend/tests/test_auth.py
- [ ] T030 [US5] Verify timing-safe password comparison is used

**Checkpoint**: Credentials secure - passwords properly hashed and verified

---

## Phase 8: Integration & Polish

**Purpose**: Cross-cutting concerns and final validation

- [ ] T031 [P] Update existing task tests for authenticated requests in backend/tests/test_tasks.py
- [ ] T032 [P] Create auth endpoint tests in backend/tests/test_auth.py
- [ ] T033 Update backend/app/main.py version to 2.0.0
- [ ] T034 Run quickstart.md validation (all curl commands work)
- [ ] T035 [P] Update backend/app/api/__init__.py with auth router export

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────────┐
                                                              │
Phase 2 (Foundational) ──────────────────────────────────────┤
                                                              │
                    ┌─────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────┬───────────────┬───────────────┐
    │               │               │               │
Phase 3 (US1)   Phase 4 (US2)   Phase 5 (US3)      │
Registration       Login         Task Access        │
    │               │               │               │
    └───────┬───────┴───────┬───────┘               │
            │               │                       │
            ▼               ▼                       │
      Phase 6 (US4)   Phase 7 (US5)                 │
      Token Verify    Secure Storage                │
            │               │                       │
            └───────┬───────┘                       │
                    │                               │
                    ▼                               │
              Phase 8 (Polish) ◄────────────────────┘
```

### User Story Dependencies

- **US1 (Registration)**: Depends on Phase 2 (User model, password hashing, JWT creation)
- **US2 (Login)**: Depends on Phase 2 + benefits from US1 (needs users to exist)
- **US3 (Protected Access)**: Depends on Phase 2 (get_current_user dependency)
- **US4 (Token Verify)**: Depends on US1 or US2 (needs tokens to verify)
- **US5 (Secure Storage)**: Depends on US1 (needs password hashes to verify)

### Within Each User Story

1. Service functions before route handlers
2. Core functionality before edge cases
3. Error handling integrated throughout

---

## Parallel Opportunities

### Phase 1 (All can run in parallel after T001)
```
T002: Config settings
T003: Model exports
```

### Phase 2 (After T004 and T005)
```
T006: JWT utilities (independent of password hashing)
T007: Auth schemas (independent)
T009: Test fixtures (independent)
```

### Phase 3-5 (After Phase 2)
```
US1, US2, US3 can be worked on in parallel by different developers
Each story is independently testable
```

### Phase 8 (All can run in parallel)
```
T031: Update task tests
T032: Create auth tests
T035: Router exports
```

---

## Implementation Strategy

### MVP First (Minimum Viable Authentication)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T009)
3. Complete Phase 3: User Story 1 - Registration (T010-T015)
4. **STOP and VALIDATE**: Test registration endpoint works
5. Demo/Deploy if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Registration) → Users can create accounts → Demo
3. Add US2 (Login) → Users can authenticate → Demo
4. Add US3 (Protected Access) → Tasks are secure → Demo
5. Add US4 + US5 → Enhanced security → Final Demo
6. Polish phase → Production ready

### Suggested Parallel Assignment

| Developer | Stories |
|-----------|---------|
| Dev A | US1 (Registration) + US5 (Secure Storage) |
| Dev B | US2 (Login) + US4 (Token Verify) |
| Dev C | US3 (Protected Access) + Polish |

---

## Task Summary

| Phase | Tasks | Parallel | Description |
|-------|-------|----------|-------------|
| 1 | 3 | 2 | Setup & dependencies |
| 2 | 6 | 4 | Foundational infrastructure |
| 3 | 6 | 0 | US1: Registration |
| 4 | 4 | 0 | US2: Login |
| 5 | 5 | 0 | US3: Protected Access |
| 6 | 3 | 0 | US4: Token Verification |
| 7 | 3 | 0 | US5: Secure Storage |
| 8 | 5 | 3 | Integration & Polish |
| **Total** | **35** | **9** | |

---

## Notes

- [P] tasks = different files, no dependencies, can run concurrently
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable after completion
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Task IDs are sequential (T001-T035) for execution tracking
