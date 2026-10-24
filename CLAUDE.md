# CLAUDE.md

Project guide for Claude Code. Keep this file short; details live in the documents listed at the end.

## What this is

"Gestione Casa" (Coliving House Manager): a phone-first installable web app (PWA) for 3 friends sharing a flat. It handles the cleaning rota with turns and descriptions, a shared shopping list, and points with a scoreboard (bragging rights only). The interface is Italian only. Personal project, free hosting, built only through Claude Code.

## Stack (see `technology_decisions.md`)

- React + Vite + TypeScript (strict), PWA via `vite-plugin-pwa`
- Tailwind CSS 4 + shadcn-style components in `src/components/ui/`
- Supabase: Postgres, anonymous auth plus invite code, private Storage, scheduled jobs
- Vercel Hobby hosting from GitHub (non-commercial use only)
- Vitest + fast-check (property tests) + Playwright; GitHub Actions CI on Linux
- Windows dev machine, cloud Supabase project, no Docker

## Commands

| Command                | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Dev server on port 5173 (no service worker)       |
| `npm run check`        | Typecheck, lint, unit and property tests, build   |
| `npm test`             | Unit and property tests (Vitest)                  |
| `npm run test:e2e`     | Playwright (starts dev and preview servers)       |
| `npm run format`       | Prettier write (`format:check` to verify)         |
| `npm run generate-icons` | Regenerate PWA icons from `public/icon.svg`     |
| `npm run smoke:supabase` | Check the Supabase project answers (needs `.env`) |

## Folder map

- `src/` app code; `src/components/ui/` shadcn-style primitives (lowercase file names)
- `src/shared/rules/` pure rules functions (points, grades, rotation). No I/O, no React, no Supabase
- `src/i18n/it.ts` every user-facing Italian string, used through `t()`
- `src/lib/` env validation and the lazy Supabase client
- `e2e/` Playwright specs (`home.spec.ts` on the dev server, `pwa.spec.ts` on the production build)

## Rules

- All user-facing text comes from `src/i18n/it.ts`. Never hard-code text in components. Identifiers are English.
- Read `naming_conventions.md` before writing UI, API, database or test code (test IDs, modal props, error state, date fields).
- Scoring and rotation logic stays as pure functions in `src/shared/rules/` with unit and property tests.
- Tests first for new behavior: write a failing test, then the code.
- Security: never commit `.env` or any secret. Only the public anon key is used in client code. NEVER use the Supabase `service_role` key in client code, in Vercel, or in the repository. Row-level security protects data per house.
- Accessibility: WCAG AA, tap targets at least 44x44 px, light and dark follow the phone setting, use the color tokens in `src/index.css` (no hard-coded colors).
- Keep line endings LF (`.gitattributes`). CI runs on Linux, so file name case must match imports exactly.

## Workflow

1. Phases are listed in `implementation_plan.md`. One branch per phase (`phase-<n>-implementation`).
2. Plan with `/plan-phase`, build with `/execute-phase`, commit with `/commit-phase`.
3. `npm run check` and `npm run test:e2e` must pass, and CI must be green, before merging to `main`.
4. Pushing to `main` deploys to production on Vercel. Pull requests get preview deployments.
5. Commit and push only when the user asks.

## Documents

- `ideation.md` background, assumptions A1-A9, hypotheses
- `requirements.md` numbered requirements
- `design.md` correctness properties, flows, error handling, testing strategy
- `technology_decisions.md` TD-001 to TD-008
- `naming_conventions.md` required naming and test ID patterns
- `implementation_plan.md` phases and maintenance policy
