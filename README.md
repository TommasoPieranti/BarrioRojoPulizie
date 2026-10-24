# Gestione Casa (Coliving House Manager)

[![CI](https://github.com/TommasoPieranti/BarrioRojoPulizie/actions/workflows/ci.yml/badge.svg)](https://github.com/TommasoPieranti/BarrioRojoPulizie/actions/workflows/ci.yml)

Phone-first installable web app (PWA) for housemates: cleaning rota, shared shopping list, points and scoreboard. Italian interface.

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
npm ci
cp .env.example .env   # then fill in the Supabase values
npm run dev
```

## Commands

- `npm run dev` start the dev server
- `npm run check` typecheck, lint, tests and build
- `npm test` unit and property tests
- `npm run test:e2e` Playwright end-to-end tests
- `npm run smoke:supabase` check the Supabase project is reachable

See `CLAUDE.md` for conventions and `implementation_plan.md` for the roadmap.
