# Phase 1a: Local Foundation (sub-phase of Phase 1: Scaffolding, tooling and deployment)

Scope: tasks 1, 2, 4, 5 and 6 of Phase 1 in `implementation_plan.md`. Phase 1b (PWA, CI, Dependabot, Vercel, Supabase project, `CLAUDE.md`) is planned separately. No external accounts are needed for 1a.

## Summary

| # | Task | Requirements |
|---|------|-------------|
| 1 | Create the Vite + React + TypeScript project and Git repository (local) | Req 16.8 (phone-first), TD-002, TD-003 |
| 2 | Add Tailwind CSS, shadcn/ui and light/dark color tokens | Req 16.8, TD-008 |
| 3 | Add the central Italian text file and helper | Req 16.2, 16.3 |
| 4 | Add Vitest, fast-check and Playwright with one passing sample test each | TD-007, design testing strategy |
| 5 | Add project hygiene files and `npm` scripts | TD-003 (line endings, `npm` scripts), `naming_conventions.md` |

## Dependencies

- [ ] Node.js LTS and npm installed on Windows 11 (check with `node -v` and `npm -v`)
- [ ] Git installed (check with `git --version`)
- [ ] Working directory is `C:\Users\tomma\Desktop\App pulizie`, which already holds `ideation.md`, `requirements.md`, `design.md`, `technology_decisions.md`, `implementation_plan.md` and `naming_conventions.md`. These must not be overwritten or deleted.
- [ ] No GitHub, Vercel or Supabase account is needed in this sub-phase.

---

## Tasks

### Task 1: Create the Vite + React + TypeScript project and local Git repository

**What:** Scaffold a Vite React TypeScript project in the existing project folder, with strict TypeScript, ESLint and Prettier, and initialize a local Git repository.

**Files:**
- Create: `package.json` — name `coliving-house-manager`, `"type": "module"`, scripts added in Task 5
- Create: `index.html` — `lang="it"`, phone viewport meta tag (`width=device-width, initial-scale=1, viewport-fit=cover`), title in Italian
- Create: `vite.config.ts`
- Create: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — `strict: true`, path alias `@/*` pointing to `src/*`
- Create: `eslint.config.js` — TypeScript and React hooks rules
- Create: `.prettierrc` — shared formatting settings
- Create: `src/main.tsx`
- Create: `src/App.tsx` — minimal placeholder screen
- Create: `src/vite-env.d.ts`
- Create: `.git/` via `git init`, with an initial commit after all Phase 1a tasks pass

**AC:**
- [ ] `npm install` completes without errors on Windows 11
- [ ] `npm run dev` serves the placeholder screen at `localhost` and it renders in a browser
- [ ] `npm run build` produces a production build without errors
- [ ] `npm run typecheck` passes with `strict` enabled
- [ ] `npm run lint` passes with no errors
- [ ] `index.html` has `lang="it"` and the viewport meta tag (Req 16.8)
- [ ] Existing documents (`*.md`) in the folder are unchanged
- [ ] The `@/` alias resolves in both Vite and TypeScript
- [ ] A local Git repository exists and `git status` shows a clean tree after the initial commit

---

### Task 2: Add Tailwind CSS, shadcn/ui and light/dark color tokens

**What:** Install Tailwind CSS and shadcn/ui, define color tokens for light and dark themes that follow the phone setting, and build a phone-first placeholder layout with one shadcn Button.

**Files:**
- Modify: `package.json` — add `tailwindcss`, `@tailwindcss/vite`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`
- Modify: `vite.config.ts` — add the Tailwind plugin
- Create: `components.json` — shadcn/ui configuration with the `@` alias
- Create: `src/index.css` — Tailwind import, color tokens as CSS variables for light and dark (`:root` and `@media (prefers-color-scheme: dark)`), base `body` background
- Create: `src/lib/utils.ts` — `cn()` helper
- Create: `src/components/ui/button.tsx` — shadcn Button, tap target of at least 44 px
- Modify: `src/main.tsx` — import `index.css`
- Modify: `src/App.tsx` — phone-first layout with a heading and a Button, using tokens only

**AC:**
- [ ] The placeholder screen uses Tailwind classes and renders correctly at an iPhone-sized viewport (e.g. 390 x 844) with no horizontal scroll (Req 16.8)
- [ ] The screen switches between light and dark when the system theme changes, with no flash of the wrong theme
- [ ] All colors come from CSS variable tokens, with no hard-coded hex values in components
- [ ] Text and the Button meet WCAG AA contrast in both themes (4.5:1 for normal text)
- [ ] The Button's tap target is at least 44 x 44 px (TD-008)
- [ ] The final palette is marked as a placeholder to be decided in Phase 9 (comment in `index.css`)
- [ ] `npm run build` and `npm run lint` still pass

---

### Task 3: Add the central Italian text file and helper

**What:** Create one typed file that holds every user-facing string, plus a small helper to read them, and use it in the placeholder screen.

**Files:**
- Create: `src/i18n/it.ts` — exported `it` object grouped by feature (e.g. `common`, `home`), `as const`; initial strings for the app name and the placeholder screen
- Create: `src/i18n/index.ts` — `t(key)` helper with typed dot-path keys, returns the Italian string; throws a clear error for an unknown key in development
- Modify: `src/App.tsx` — replace any hard-coded text with `t(...)`
- Modify: `eslint.config.js` — add a rule or comment-checked convention discouraging string literals in JSX (a warning is acceptable)

**AC:**
- [ ] All user-facing text in `src/` comes from `src/i18n/it.ts` (Req 16.2, 16.3)
- [ ] `t()` only accepts valid keys, and an invalid key is a TypeScript compile error
- [ ] `t()` returns the expected Italian string for a known key
- [ ] The app displays only Italian text
- [ ] The strings follow the naming conventions in `naming_conventions.md` (English identifiers, Italian values)

---

### Task 4: Add Vitest, fast-check and Playwright with one passing sample test each

**What:** Install and configure the three test tools so each runs one real sample test, and the Playwright test runs at an iPhone-sized viewport against the dev server.

**Files:**
- Modify: `package.json` — add `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `@playwright/test`
- Create: `vitest.config.ts` (or extend `vite.config.ts`) — jsdom environment, `src/**/*.test.ts(x)` pattern, setup file
- Create: `src/test/setup.ts` — registers `@testing-library/jest-dom`
- Create: `src/i18n/index.test.ts` — unit test for `t()` (known key returns the Italian string)
- Create: `src/shared/rules/sample.property.test.ts` — one fast-check property test on a trivial pure function (e.g. a placeholder `clamp` function in `src/shared/rules/sample.ts`) to prove the tool works; it will be removed or replaced in Phase 3
- Create: `src/shared/rules/sample.ts` — the trivial function used by the property test
- Create: `playwright.config.ts` — iPhone-sized viewport (390 x 844) as the primary project, `webServer` that starts `npm run dev`, `e2e/` as the test directory, `*.spec.ts` pattern
- Create: `e2e/home.spec.ts` — opens the app and checks the placeholder heading by `data-testid`
- Modify: `src/App.tsx` — add `data-testid="home-title"` on the heading

**AC:**
- [ ] `npm run test` runs Vitest and passes (unit test and property test)
- [ ] The property test runs at least 100 generated cases
- [ ] `npx playwright install` has been run and `npm run test:e2e` passes at an iPhone-sized viewport on Windows
- [ ] The Playwright test selects by `data-testid` and not by visible text (naming conventions)
- [ ] Vitest ignores the `e2e/` folder, and Playwright ignores `src/`
- [ ] Test files follow the naming patterns: `*.test.ts(x)`, `*.property.test.ts`, `*.spec.ts`
- [ ] A deliberately broken assertion fails the corresponding test (checked once, then reverted)

---

### Task 5: Add project hygiene files and `npm` scripts

**What:** Add Git and environment hygiene files and the standard `npm` scripts so every command works the same on Windows and Linux.

**Files:**
- Create: `.gitattributes` — `* text=auto eol=lf`, binary rules for images and fonts
- Create: `.gitignore` — `node_modules`, `dist`, `.env`, `.env.local`, Playwright reports and test results, editor folders
- Create: `.env.example` — `VITE_SUPABASE_URL=` and `VITE_SUPABASE_ANON_KEY=` with empty values and a comment that real values go in an uncommitted `.env`
- Create: `.prettierignore`
- Create: `.nvmrc` or set `engines.node` in `package.json` — the Node LTS version in use
- Modify: `package.json` — scripts: `dev`, `build`, `preview`, `typecheck` (`tsc -b`), `lint`, `format`, `format:check`, `test` (`vitest run`), `test:watch`, `test:e2e` (`playwright test`), `check` (typecheck, lint, test and build in sequence)

**AC:**
- [ ] `.gitattributes` makes Git store files with LF line endings (TD-003)
- [ ] `.env` is ignored by Git, and `git check-ignore .env` confirms it
- [ ] `.env.example` contains no real secrets
- [ ] All scripts are plain `npm` scripts with no shell-specific syntax, so they run on Windows and Linux
- [ ] `npm run check` passes from a clean checkout
- [ ] Re-running `npm install` after deleting `node_modules` works and a lockfile (`package-lock.json`) is committed

---

## Tests

| Test | File | Verifies |
|------|------|---------|
| `t()` returns Italian string for a known key | `src/i18n/index.test.ts` | Central Italian text helper works (Req 16.3) |
| `clamp` stays within bounds for any input | `src/shared/rules/sample.property.test.ts` | fast-check runs properly with 100+ generated cases (TD-007) |
| Home screen shows the title at phone size | `e2e/home.spec.ts` | Playwright runs against the dev server at an iPhone-sized viewport and the app renders (Req 16.8) |
| Manual: theme follows the system | n/a | Light and dark both render and meet contrast (TD-008) |
