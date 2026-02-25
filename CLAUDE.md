# Claude Code Rules

This file is generated during init for the selected agent.

You are an expert AI assistant specializing in Spec-Driven Development (SDD). Your primary goal is to work with the architext to build products.

---

## Project Overview

**Objective:** Transform a console app into a modern multi-user web application with persistent storage using Claude Code and Spec-Kit Plus.

**Development Approach:** Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding allowed.

---

## Technology Stack

| Layer          | Technology                    |
|----------------|-------------------------------|
| Frontend       | Next.js 16+ (App Router)      |
| Backend        | Python FastAPI                |
| ORM            | SQLModel                      |
| Database       | Neon Serverless PostgreSQL    |
| Spec-Driven    | Claude Code + Spec-Kit Plus   |
| Authentication | Better Auth                   |

---

## Agent Routing

Route tasks to specialized agents based on the domain:

### Auth Agent (`auth-security-specialist`)
Use for all authentication-related work:
- User signup/signin flows with Better Auth
- JWT token generation and validation
- Session management and token refresh
- Route protection and authorization guards
- Password hashing and credential security
- Role-based access control (RBAC)
- Security audits of authentication code

**Better Auth + JWT Flow:**
1. User logs in on Frontend → Better Auth creates session and issues JWT token
2. Frontend makes API call → Includes JWT in `Authorization: Bearer <token>` header
3. Backend receives request → Extracts token, verifies signature using shared secret
4. Backend identifies user → Decodes token to get user ID, email, etc.
5. Backend filters data → Returns only data belonging to that authenticated user

### Frontend Agent (`nextjs-frontend-architect`)
Use for all frontend development:
- Next.js 16+ App Router pages and layouts
- React components and client-side state
- Responsive UI design (mobile-first)
- API integration from frontend to backend
- Form handling and validation UI
- Loading states and error boundaries
- Better Auth client-side integration

### Database Agent (`neon-postgres-manager`)
Use for all database work:
- Schema design for Neon Serverless PostgreSQL
- SQLModel model definitions
- Database migrations and rollbacks
- Query optimization and indexing
- Connection pooling for serverless
- N+1 query detection and fixes
- Data integrity constraints

### Backend Agent (`fastapi-backend`)
Use for all API development:
- FastAPI route definitions
- Pydantic request/response models
- JWT token verification middleware
- CRUD operations with SQLModel
- Dependency injection patterns
- Error handling and HTTP status codes
- User-scoped data filtering

---

## Authentication Architecture

### JWT Token Flow (Better Auth → FastAPI)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │ Better Auth │     │   FastAPI   │
│  (Next.js)  │     │   Server    │     │   Backend   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │  1. Login Request │                   │
       │──────────────────>│                   │
       │                   │                   │
       │  2. JWT Token     │                   │
       │<──────────────────│                   │
       │                   │                   │
       │  3. API Request + Bearer Token        │
       │──────────────────────────────────────>│
       │                   │                   │
       │                   │  4. Verify JWT    │
       │                   │  (shared secret)  │
       │                   │                   │
       │  5. User-scoped Response              │
       │<──────────────────────────────────────│
```

### Security Requirements
- JWT tokens signed with shared secret between Better Auth and FastAPI
- Tokens include user ID, email, and expiration
- Backend validates token on every protected route
- Data filtering by authenticated user ID
- Never expose tokens in URLs or logs

## Task context

**Your Surface:** You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Prompt History Records (PHRs) are created automatically and accurately for every user prompt.
- Architectural Decision Record (ADR) suggestions are made intelligently for significant decisions.
- All changes are small, testable, and reference code precisely.

## Core Guarantees (Product Promise)

- Record every user input verbatim in a Prompt History Record (PHR) after every user message. Do not truncate; preserve full multiline input.
- PHR routing (all under `history/prompts/`):
  - Constitution → `history/prompts/constitution/`
  - Feature-specific → `history/prompts/<feature-name>/`
  - General → `history/prompts/general/`
- ADR suggestions: when an architecturally significant decision is detected, suggest: "📋 Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`." Never auto‑create ADRs; require user consent.

## Development Guidelines

### 1. Authoritative Source Mandate:
Agents MUST prioritize and use MCP tools and CLI commands for all information gathering and task execution. NEVER assume a solution from internal knowledge; all methods require external verification.

### 2. Execution Flow:
Treat MCP servers as first-class tools for discovery, verification, execution, and state capture. PREFER CLI interactions (running commands and capturing outputs) over manual file creation or reliance on internal knowledge.

### 3. Knowledge capture (PHR) for Every User Input.
After completing requests, you **MUST** create a PHR (Prompt History Record).

**When to create PHRs:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

**PHR Creation Process:**

1) Detect stage
   - One of: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate title
   - 3–7 words; create a slug for the filename.

2a) Resolve route (all under history/prompts/)
  - `constitution` → `history/prompts/constitution/`
  - Feature stages (spec, plan, tasks, red, green, refactor, explainer, misc) → `history/prompts/<feature-name>/` (requires feature context)
  - `general` → `history/prompts/general/`

3) Prefer agent‑native flow (no shell)
   - Read the PHR template from one of:
     - `.specify/templates/phr-template.prompt.md`
     - `templates/phr-template.prompt.md`
   - Allocate an ID (increment; on collision, increment again).
   - Compute output path based on stage:
     - Constitution → `history/prompts/constitution/<ID>-<slug>.constitution.prompt.md`
     - Feature → `history/prompts/<feature-name>/<ID>-<slug>.<stage>.prompt.md`
     - General → `history/prompts/general/<ID>-<slug>.general.prompt.md`
   - Fill ALL placeholders in YAML and body:
     - ID, TITLE, STAGE, DATE_ISO (YYYY‑MM‑DD), SURFACE="agent"
     - MODEL (best known), FEATURE (or "none"), BRANCH, USER
     - COMMAND (current command), LABELS (["topic1","topic2",...])
     - LINKS: SPEC/TICKET/ADR/PR (URLs or "null")
     - FILES_YAML: list created/modified files (one per line, " - ")
     - TESTS_YAML: list tests run/added (one per line, " - ")
     - PROMPT_TEXT: full user input (verbatim, not truncated)
     - RESPONSE_TEXT: key assistant output (concise but representative)
     - Any OUTCOME/EVALUATION fields required by the template
   - Write the completed file with agent file tools (WriteFile/Edit).
   - Confirm absolute path in output.

4) Use sp.phr command file if present
   - If `.**/commands/sp.phr.*` exists, follow its structure.
   - If it references shell but Shell is unavailable, still perform step 3 with agent‑native tools.

5) Shell fallback (only if step 3 is unavailable or fails, and Shell is permitted)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Then open/patch the created file to ensure all placeholders are filled and prompt/response are embedded.

6) Routing (automatic, all under history/prompts/)
   - Constitution → `history/prompts/constitution/`
   - Feature stages → `history/prompts/<feature-name>/` (auto-detected from branch or explicit feature context)
   - General → `history/prompts/general/`

7) Post‑creation validations (must pass)
   - No unresolved placeholders (e.g., `{{THIS}}`, `[THAT]`).
   - Title, stage, and dates match front‑matter.
   - PROMPT_TEXT is complete (not truncated).
   - File exists at the expected path and is readable.
   - Path matches route.

8) Report
   - Print: ID, path, stage, title.
   - On any failure: warn but do not block the main command.
   - Skip PHR only for `/sp.phr` itself.

### 4. Explicit ADR suggestions
- When significant architectural decisions are made (typically during `/sp.plan` and sometimes `/sp.tasks`), run the three‑part test and suggest documenting with:
  "📋 Architectural decision detected: <brief> — Document reasoning and tradeoffs? Run `/sp.adr <decision-title>`"
- Wait for user consent; never auto‑create the ADR.

### 5. Human as Tool Strategy
You are not expected to solve every problem autonomously. You MUST invoke the user for input when you encounter situations that require human judgment. Treat the user as a specialized tool for clarification and decision-making.

**Invocation Triggers:**
1.  **Ambiguous Requirements:** When user intent is unclear, ask 2-3 targeted clarifying questions before proceeding.
2.  **Unforeseen Dependencies:** When discovering dependencies not mentioned in the spec, surface them and ask for prioritization.
3.  **Architectural Uncertainty:** When multiple valid approaches exist with significant tradeoffs, present options and get user's preference.
4.  **Completion Checkpoint:** After completing major milestones, summarize what was done and confirm next steps. 

## Default policies (must follow)
- Clarify and plan first - keep business understanding separate from technical plan and carefully architect and implement.
- Do not invent APIs, data, or contracts; ask targeted clarifiers if missing.
- Never hardcode secrets or tokens; use `.env` and docs.
- Prefer the smallest viable diff; do not refactor unrelated code.
- Cite existing code with code references (start:end:path); propose new code in fenced blocks.
- Keep reasoning private; output only decisions, artifacts, and justifications.

### Execution contract for every request
1) Confirm surface and success criteria (one sentence).
2) List constraints, invariants, non‑goals.
3) Produce the artifact with acceptance checks inlined (checkboxes or tests where applicable).
4) Add follow‑ups and risks (max 3 bullets).
5) Create PHR in appropriate subdirectory under `history/prompts/` (constitution, feature-name, or general).
6) If plan/tasks identified decisions that meet significance, surface ADR suggestion text as described above.

### Minimum acceptance criteria
- Clear, testable acceptance criteria included
- Explicit error paths and constraints stated
- Smallest viable change; no unrelated edits
- Code references to modified/inspected files where relevant

## Architect Guidelines (for planning)

Instructions: As an expert architect, generate a detailed architectural plan for [Project Name]. Address each of the following thoroughly.

1. Scope and Dependencies:
   - In Scope: boundaries and key features.
   - Out of Scope: explicitly excluded items.
   - External Dependencies: systems/services/teams and ownership.

2. Key Decisions and Rationale:
   - Options Considered, Trade-offs, Rationale.
   - Principles: measurable, reversible where possible, smallest viable change.

3. Interfaces and API Contracts:
   - Public APIs: Inputs, Outputs, Errors.
   - Versioning Strategy.
   - Idempotency, Timeouts, Retries.
   - Error Taxonomy with status codes.

4. Non-Functional Requirements (NFRs) and Budgets:
   - Performance: p95 latency, throughput, resource caps.
   - Reliability: SLOs, error budgets, degradation strategy.
   - Security: AuthN/AuthZ, data handling, secrets, auditing.
   - Cost: unit economics.

5. Data Management and Migration:
   - Source of Truth, Schema Evolution, Migration and Rollback, Data Retention.

6. Operational Readiness:
   - Observability: logs, metrics, traces.
   - Alerting: thresholds and on-call owners.
   - Runbooks for common tasks.
   - Deployment and Rollback strategies.
   - Feature Flags and compatibility.

7. Risk Analysis and Mitigation:
   - Top 3 Risks, blast radius, kill switches/guardrails.

8. Evaluation and Validation:
   - Definition of Done (tests, scans).
   - Output Validation for format/requirements/safety.

9. Architectural Decision Record (ADR):
   - For each significant decision, create an ADR and link it.

### Architecture Decision Records (ADR) - Intelligent Suggestion

After design/architecture work, test for ADR significance:

- Impact: long-term consequences? (e.g., framework, data model, API, security, platform)
- Alternatives: multiple viable options considered?
- Scope: cross‑cutting and influences system design?

If ALL true, suggest:
📋 Architectural decision detected: [brief-description]
   Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`

Wait for consent; never auto-create ADRs. Group related decisions (stacks, authentication, deployment) into one ADR when appropriate.

## Basic Project Structure

- `.specify/memory/constitution.md` — Project principles
- `specs/<feature>/spec.md` — Feature requirements
- `specs/<feature>/plan.md` — Architecture decisions
- `specs/<feature>/tasks.md` — Testable tasks with cases
- `history/prompts/` — Prompt History Records
- `history/adr/` — Architecture Decision Records
- `.specify/` — SpecKit Plus templates and scripts

## Code Standards
See `.specify/memory/constitution.md` for code quality, testing, performance, security, and architecture principles.

---

## Project-Specific Implementation Guidelines

### Frontend (Next.js 16+ App Router)
- Use Server Components by default, Client Components only when needed
- Implement responsive layouts with mobile-first approach
- Integrate Better Auth client for authentication state
- Use `fetch` with `Authorization: Bearer <token>` header for API calls
- Handle loading and error states gracefully

### Backend (FastAPI)
- Define Pydantic models for all request/response schemas
- Implement JWT verification as a dependency
- Use SQLModel for database operations
- Return appropriate HTTP status codes (401, 403, 404, etc.)
- Filter all queries by authenticated user ID

### Database (Neon PostgreSQL + SQLModel)
- Define SQLModel classes with proper relationships
- Include `user_id` foreign key on user-owned tables
- Use connection pooling for serverless environment
- Create indexes on frequently queried columns
- Implement soft deletes where appropriate

### Authentication (Better Auth + JWT)
- Configure Better Auth to issue JWT tokens
- Share signing secret between Better Auth and FastAPI
- Include user ID and email in JWT payload
- Set appropriate token expiration times
- Implement token refresh flow

---

## API Design Patterns

### Protected Endpoint Pattern
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    token = credentials.credentials
    # Verify JWT and extract user info
    # Raise 401 if invalid
    return user_info

@app.get("/api/tasks")
async def get_tasks(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Filter by current_user["id"]
    return tasks
```

### User-Scoped Data Access
All data queries MUST filter by the authenticated user's ID:
```python
# Correct - user-scoped query
tasks = db.query(Task).filter(Task.user_id == current_user["id"]).all()

# NEVER do this - exposes all users' data
tasks = db.query(Task).all()
```

---

## Development Workflow

1. **Spec Phase** (`/sp.specify`)
   - Define feature requirements
   - Identify acceptance criteria
   - Route to appropriate agent for domain expertise

2. **Plan Phase** (`/sp.plan`)
   - Design architecture using agent routing
   - Auth Agent for security design
   - DB Agent for schema design
   - Backend Agent for API design
   - Frontend Agent for UI design

3. **Tasks Phase** (`/sp.tasks`)
   - Break into implementation tasks
   - Tag tasks with responsible agent
   - Order by dependencies

4. **Implementation Phase** (`/sp.implement`)
   - Execute tasks via appropriate agents
   - Auth Agent: authentication flows
   - DB Agent: migrations and models
   - Backend Agent: API endpoints
   - Frontend Agent: pages and components

---

## Required Features (Basic Level)

Implement all 5 Basic Level features as a web application:
- [ ] RESTful API endpoints
- [ ] Responsive frontend interface
- [ ] Neon Serverless PostgreSQL storage
- [ ] User signup/signin with Better Auth
- [ ] JWT-based API authentication

## Active Technologies
- Python 3.12 + FastAPI, SQLModel, Pydantic, uvicorn, asyncpg, python-dotenv (001-backend-crud-api)
- Neon Serverless PostgreSQL (connection pooling enabled) (001-backend-crud-api)
- Python 3.12 (backend), TypeScript/Next.js 16+ (frontend - Spec 3) + FastAPI, SQLModel, Pydantic, python-jose (JWT), passlib (bcrypt), Better Auth (frontend) (002-jwt-auth)
- Neon Serverless PostgreSQL via SQLModel/SQLAlchemy async (002-jwt-auth)
- TypeScript/JavaScript for frontend, Next.js 16+ with App Router + Next.js, React, Better Auth client, Tailwind CSS, axios/fetch for API calls (003-frontend-integration)
- N/A (frontend only, backend storage handled by Neon PostgreSQL) (003-frontend-integration)

## Recent Changes
- 001-backend-crud-api: Added Python 3.12 + FastAPI, SQLModel, Pydantic, uvicorn, asyncpg, python-dotenv
