# Technology Decisions

## Purpose

This file records the technology choices for the Coliving House Manager (working title), with the reasoning behind each, so later phases (`/plan-phase`, `/execute-phase`) build on decisions already made.

## Decision-Making Philosophy

- Understanding over "best practices": each choice should be explained in plain language.
- Fit the project: a personal app for one house of about 3 people, built and maintained by one person.
- Prefer free tiers, few moving parts and little ongoing maintenance.
- Be honest about tradeoffs: every choice gives something up.

## Confirmed Constraints (from `/kickoff`)

| Constraint | Source |
|------------|--------|
| Installable web app (PWA) for iPhone and Android | Kickoff Q2 |
| Personal first: one house, about 3 people, sized up to about 6; no multi-house accounts, store release or monetization in v1 | Kickoff Q1 |
| Sign-in with an invite link or code, no passwords | Kickoff Q9 |
| Free-tier hosted backend, no server to maintain | Kickoff Q9 |
| Italian only, all text kept in one place | Kickoff Q10 |
| Push notifications needed (works on iPhone only after adding to the home screen) | Requirements 12 |
| Works offline with queued actions, no duplicate application | Requirements 16, property P12 |
| No third-party analytics | Requirements 15 |
| Developer machine: Windows 11 | Environment |

## Decision Log

### TD-001 — Backend and Database: Supabase (hosted PostgreSQL, backend-as-a-service)

- **Decision**: Backend and Database - Supabase, covering the PostgreSQL database, sign-in, real-time updates, file storage and scheduled jobs.
- **Date**: 2026-10-24
- **Options Considered**:
  - Supabase: hosted PostgreSQL with built-in auth, real-time, storage and scheduled jobs.
  - Firebase: document database with strong offline support and built-in push messaging.
  - Own small server (e.g. Node.js or Python with a database): full control, most maintenance.
- **Rationale**: Points, normalized scores (points per day present), rotation and the scoreboard are sums and joins, which suit a relational database. A hosted service means no server to maintain, and the free tier is more than enough for about 3 people. The developer has deep Python experience, some app experience through Claude Code, and will build with Claude Code only, so a service with a clear API and generated SQL is easy to work with. No custom Python backend is required.
- **Key Tradeoffs Accepted**: Some lock-in to Supabase (mitigated because it is standard PostgreSQL and can be exported). Must learn row-level security rules to keep one house's data private. Free projects pause after about a week of inactivity, which daily use should avoid.
- **Dependencies**: Drives the sign-in approach (invite link on top of Supabase auth), file storage for photos, scheduled jobs for occurrence creation and the 48-hour auto-grade, and the frontend's data client.
- **Environment Notes**: Supabase can run locally on Windows with Docker if needed. Decided in Category 4.

### TD-002 — Frontend: React with Vite and TypeScript

- **Decision**: Frontend Framework - React with Vite and TypeScript, built as a PWA.
- **Date**: 2026-10-24
- **Options Considered**:
  - React with Vite and TypeScript: most widely used, static build, mature PWA tooling.
  - Next.js: adds server rendering and API routes, more concepts, not needed here.
  - SvelteKit or Vue: simpler and pleasant, but a smaller ecosystem and less Claude Code coverage.
- **Rationale**: The app is a static, phone-first PWA that talks directly to Supabase. React with Vite is the best-supported combination for building with Claude Code, needs no server, is free to host and has mature plugins for installability, offline caching and push notifications. TypeScript catches mistakes early, which matters when the code is AI-written.
- **Key Tradeoffs Accepted**: JavaScript/TypeScript instead of Python on the frontend. Some React concepts (components, state) to learn when reviewing code. Slightly more setup than a no-framework page.
- **Dependencies**: Uses the Supabase JavaScript client (TD-001). Static hosting in Category 5. A PWA plugin handles installability, offline queue and push. Italian text kept in one file (Requirement 16). Testing framework (Category 10) should be Vite-friendly.
- **Environment Notes**: Node.js on Windows 11 is fully supported.

### TD-003 — Local Development: Windows + Node.js, cloud Supabase project

- **Decision**: Local Development Environment - Windows 11 with Node.js (LTS), running the Vite dev server locally and connecting to a free cloud Supabase project. No Docker or WSL2.
- **Date**: 2026-10-24
- **Options Considered**:
  - Windows + Node.js with a cloud Supabase project: fewest moving parts.
  - Windows + Node.js with Supabase running locally in Docker: separate local database, more setup and memory use.
  - Everything inside WSL2: closest to Linux servers, slower file access, extra layer.
- **Rationale**: Single developer on one Windows PC building with Claude Code, for a 3-person pilot. Least setup and fewest failure points. The app is a static site, so the Windows/Linux difference between dev and hosting is low risk.
- **Key Tradeoffs Accepted**: Dev and pilot data share one cloud database at first (use test data and clean it before the pilot, or add a second Supabase project later). Database migrations are tested against the cloud project rather than a local copy.
- **Dependencies**: Uses TD-001 and TD-002. Hosting (Category 5) must be a Linux static host. Testing (Category 10) should run on Linux in CI to catch OS differences.
- **Environment Notes**:
  - Add a `.gitattributes` to normalize line endings (LF in the repository).
  - Use `npm` scripts instead of shell scripts so they work on Windows.
  - Keep import and file name casing consistent (Windows ignores case, Linux does not).
  - Dev OS (Windows) differs from the host OS (Linux) with no containers, so CI must run tests on Linux.

### TD-004 — Hosting and Environments: Dev + Prod on Vercel

- **Decision**: Hosting Platform and Deployment Environments - two environments (Dev and Prod). The static React app is hosted on Vercel (Hobby plan), deployed from a GitHub repository. Supabase hosts the backend.
- **Date**: 2026-10-24
- **Options Considered**:
  - Vercel: easiest setup, deploys on every push, free Hobby plan (non-commercial).
  - Cloudflare Pages: free with friendlier commercial terms, slightly more setup.
  - Netlify: similar to Vercel, free tier.
  - GitHub Pages: free and simple, fewer features and no preview deployments.
  - Environments: local only (does not meet the goal), Dev + Prod, Dev + Staging + Prod (overkill).
- **Rationale**: A personal pilot for 3 people needs one live version and a local development copy. Vercel is the simplest to set up with Claude Code and gives HTTPS (required for a PWA), automatic deploys from GitHub and a free web address.
- **Key Tradeoffs Accepted**: The Hobby plan is non-commercial only, so going public as a paid product would need a paid plan or a move to Cloudflare Pages. No staging copy, so changes are checked locally and in Vercel preview deployments before going live. Dev and Prod may share one Supabase project at first (see TD-003).
- **Dependencies**: Requires a GitHub repository and account (also used by Dependabot in the maintenance policy). Builds on TD-002 (static React app) and TD-003. CI should run tests on Linux before deploying.
- **Environment Notes (TD-004)**: Vercel builds on Linux while development is on Windows, so keep file name casing consistent and use `npm` scripts. Environment variables (Supabase URL and public key) are set in Vercel for production and in a local `.env` file for development, which must not be committed.

### TD-005 — File Storage: Supabase Storage

- **Decision**: File Storage - Supabase Storage for optional photos on completed chores.
- **Date**: 2026-10-24
- **Options Considered**:
  - Supabase Storage: built in, same access rules as the database, about 1 GB free.
  - Skip photos in v1 (text notes only): simplest, no upload or privacy questions.
  - Separate service such as Cloudinary: extra features, extra account, not needed.
- **Rationale**: A photo is the strongest evidence for grading a disputed chore (Requirements 5 and 6). Supabase Storage needs no extra service, and its access rules keep each house's photos private. The free tier is ample for 3 people if photos are compressed.
- **Key Tradeoffs Accepted**: Photos must be resized on the phone before upload (target about 200 KB). Photos are deleted after 30 days to protect the free quota, while grades, notes and points are kept. Photos of the home are personal data, so storage must be private with signed links, never public.
- **Dependencies**: Uses TD-001 (Supabase) and TD-002 (image resizing happens in the React app). A scheduled job deletes expired photos. Resolves the photo question in `requirements.md` (store photos, 30-day retention).
- **Environment Notes**: None. Image resizing runs in the browser on both iPhone and Android.

### TD-006 — Authentication: Supabase anonymous sign-in plus invite code

- **Decision**: Authentication - Supabase anonymous sign-in combined with a house invite code. No passwords and no email.
- **Date**: 2026-10-24
- **Options Considered**:
  - Anonymous sign-in plus invite code: built into Supabase, matches the no-password goal.
  - Magic-link email sign-in: recoverable on any device, needs an email service and adds friction.
  - Email and password: familiar, most friction, contradicts the kickoff decision.
- **Rationale**: Opening the invite link creates an anonymous account on the device and joins the person to the house with the code and a chosen display name. It needs no extra service and keeps joining to a couple of taps (Requirement 16.5). Row-level security limits each person to their own house's data.
- **Key Tradeoffs Accepted**: Identity lives on the device, so clearing browser data or changing phone loses it. Recovery is manual: the person rejoins with the invite code and their existing name after the other members confirm (Requirement 1.7). The invite code is the only gate to the house.
- **Dependencies**: Uses TD-001 (Supabase). Row-level security rules depend on house membership. Email service (Category 7) is skipped as a result. Push notification subscriptions are tied to the device session.
- **Environment Notes**: Invite codes must be long and random (at least 8 characters from a large set) to resist guessing, and regenerating one must invalidate the old one (Requirement 1.6). Consider rate-limiting join attempts. Anonymous sessions need to be persisted on iPhone, where browser storage can be cleared by the system if the app is unused for long; installing to the home screen reduces this risk.

### TD-007 — Testing: Vitest + fast-check, Playwright

- **Decision**: Testing Framework - Vitest for unit tests, fast-check for property-based tests, and Playwright for end-to-end tests. GitHub Actions runs them on Linux.
- **Date**: 2026-10-24
- **Options Considered**:
  - Vitest + fast-check: Vite-native, fast, property-based testing for the correctness properties.
  - Jest: older standard, extra configuration with Vite, no advantage here.
  - Playwright: real browser at phone size, Windows and Linux, failure traces.
  - Cypress: capable alternative, heavier and less suited to multi-browser testing.
- **Rationale**: The design defines 12 correctness properties (for example points = weight × grade multiplier, normalized score, fair rotation, single claimant). Property-based tests with fast-check check these against many random inputs. Vitest works with Vite with almost no setup. Playwright covers the key phone flows (join via invite link, mark done, grade, scoreboard, shopping claim).
- **Key Tradeoffs Accepted**: End-to-end tests are slower, so they cover only key flows. Push notifications and home-screen installation cannot be reliably automated and are checked by hand on real iPhone and Android devices during the pilot.
- **Dependencies**: Scoring, rotation and grading rules should be written as plain TypeScript functions so Vitest and fast-check can test them directly (design properties P1 to P12). Row-level security rules get a small set of SQL tests against a test Supabase project (TD-001). CI on GitHub Actions runs on Linux, which covers the Windows-to-Linux mismatch from TD-003, and gates deployment to Vercel (TD-004).
- **Environment Notes**: Vitest and Playwright both run on Windows 11 and Linux. Playwright browsers must be installed with `npx playwright install` on first use. Run Playwright at an iPhone-sized viewport as the primary layout.

### TD-008 — UI/UX Foundations: WCAG AA, Tailwind CSS + shadcn/ui, light/dark

- **Decision**: UI/UX Foundations - WCAG AA accessibility baseline, Tailwind CSS with shadcn/ui components, light and dark themes following the phone setting, no reference site.
- **Date**: 2026-10-24
- **Options Considered**:
  - Component library: Tailwind CSS with shadcn/ui (accessible components you own), MUI (complete but heavy, distinct look), Tailwind only (most freedom, most to build).
  - Color scheme: light and dark following the system, or light only.
  - Accessibility: WCAG AA baseline.
- **Rationale**: shadcn/ui gives accessible dialogs, forms and buttons that Claude Code writes well, and the code lives in the project with no heavy dependency. WCAG AA (readable contrast, large tap targets, screen reader labels) suits one-handed phone use. Dark mode helps evening use. Defining colors as design tokens makes both themes straightforward.
- **Key Tradeoffs Accepted**: More initial setup than a no-library page. Two themes to check for contrast. No reference site, so the playful visual style is decided during the first UI phase (the color-palette toolkit can generate a palette then).
- **Dependencies**: Uses TD-002 (React, Vite). Contrast checks apply to both themes. Italian text is kept in the central text file (Requirement 16). Tap targets and layout are phone-first, tested at an iPhone-sized viewport (TD-007).
- **Environment Notes**: None.
