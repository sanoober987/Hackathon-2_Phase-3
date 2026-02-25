---
id: 004
title: WSL2 DrvFs errno -4094 Next.js Permanent Fix
stage: general
date: 2026-02-25
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 003-frontend-integration
user: sanoober
command: devops debug - errno -4094 webpack-runtime.js WSL2 Next.js
labels: ["wsl2", "devops", "nextjs", "filesystem", "errno-4094", "windows", "drvfs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/next.config.js
  - frontend/package.json
  - frontend/.nvmrc
  - frontend/.npmrc
  - .gitattributes
  - .nvmrc
  - scripts/windows-defender-exclusions.ps1
  - scripts/clean-reinstall.sh
tests: []
---

## Prompt

WSL2 + Windows 10 + Next.js 14 + D: drive project.
UNKNOWN: unknown error, open '.next/server/webpack-runtime.js' errno: -4094

## Root Cause and Full Fix Summary

See the full written response for complete detail. All config files applied.
