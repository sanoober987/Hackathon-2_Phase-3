---
id: 001
title: Todo App Constitution Ratification
stage: constitution
date: 2026-02-01
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: /sp.constitution
labels: ["constitution", "governance", "project-setup", "security", "architecture"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

Project: Todo Full-Stack Web Application (Multi-User, Secure, Web-Based)

Core principles:
- Security: Every user can only access their own tasks, enforced via JWT auth
- Modularity: Clear separation of frontend, backend, and database layers
- Reproducibility: All features implemented via Claude Code based on specs
- Responsiveness: Frontend must be fully functional across devices
- Maintainability: Clear API structure, proper error handling, environment configuration

Key standards:
- Frontend: Next.js 16+ (App Router), responsive design
- Backend: Python FastAPI with SQLModel ORM
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth issuing JWT tokens
- API: RESTful, all endpoints must enforce auth and user isolation
- Security: JWT verification, token expiry, stateless backend
- Coding: No manual coding; all code generated via Claude Code
- Documentation: Clear setup, environment variable instructions, and testing guide

Constraints:
- JWT tokens must expire (e.g., after 7 days)
- All endpoints must enforce task ownership; unauthorized access returns 401
- Environment variable BETTER_AUTH_SECRET must be shared between frontend and backend
- CRUD endpoints required: list, create, retrieve, update, delete, toggle completion
- Frontend API client must attach JWT token automatically to requests
- Project must be fully testable and deployable with documented instructions

Success criteria:
- All CRUD operations functional for each authenticated user
- API returns proper HTTP codes for success and error conditions
- JWT auth correctly implemented: token verification, expiration, stateless enforcement
- Frontend displays correct task data per user and handles errors properly
- Application responsive and functional on multiple devices
- Secure and ready for deployment with documented setup and environment configuration
- Full-stack integration tested with verified task isolation, auth, and API communication

## Response snapshot

Created constitution v1.0.0 for Todo Full-Stack Web Application with 5 core principles:

1. **Security (NON-NEGOTIABLE)**: JWT auth, user isolation, 7-day token expiry, 401 on unauthorized
2. **Modularity**: Clear separation - Next.js frontend, FastAPI backend, Neon PostgreSQL, Better Auth
3. **Reproducibility**: All code via Claude Code, spec-driven workflow (spec → plan → tasks → implement)
4. **Responsiveness**: Mobile-first, touch-friendly (44x44px targets), adaptive navigation
5. **Maintainability**: RESTful API, proper HTTP codes, env vars for config, structured logging

Included technology stack table, required CRUD endpoints, environment variables, JWT requirements, testing requirements, and governance rules.

## Outcome

- ✅ Impact: Established foundational governance document for entire project
- 🧪 Tests: N/A (constitution document)
- 📁 Files: .specify/memory/constitution.md (created)
- 🔁 Next prompts: /sp.specify for first feature, project structure setup
- 🧠 Reflection: Constitution provides clear guardrails for security-first multi-user app development

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Standard constitution creation
- Next experiment (smallest change to try): Validate constitution against first feature spec
