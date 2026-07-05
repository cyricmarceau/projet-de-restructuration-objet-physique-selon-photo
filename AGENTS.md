# Project Agent Contract

This file is a repo-local override for Codex. Keep it short, concrete, and specific to this project.

## Read First

- `README.md`
- local issue or PRD files relevant to the task
- existing tests around the code being changed

## Project Overview

Next.js 15 web app (App Router, TypeScript). User uploads or takes a photo of a room; the `/api/analyze` route sends it to Claude Opus 4.8 with vision and streams back concrete redesign advice in French.

Key files:
- `src/app/page.tsx` — client UI.
- `src/app/api/analyze/route.ts` — streaming Anthropic API call.
- `src/app/globals.css` — styles.

Requires `ANTHROPIC_API_KEY` in `.env.local`.

## Project Commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start (prod): `npm start`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`

## Rules

- Preserve user work.
- Prefer existing patterns.
- Make surgical changes.
- Validate the affected behavior before claiming completion.
- Do not add new dependencies or major architecture without explicit approval.

## Useful Global Skills

- `$starter-review` for reviewing changes.
- `$implement` for scoped implementation work.
- `$tdd` for test-first changes.
- `$diagnosing-bugs` for failures and regressions.
- `$grill-me` for sharpening a plan.
- `$improve-codebase-architecture` for architecture friction.
