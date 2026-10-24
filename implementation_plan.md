# Implementation Plan: Coliving House Manager (working title)

## 1. Overview

This plan builds the Fair Share House app described in `requirements.md` and `design.md`, using the stack in `technology_decisions.md`: a React + Vite + TypeScript PWA, Supabase (PostgreSQL, anonymous auth, storage, scheduled jobs), Tailwind + shadcn/ui, hosted on Vercel, tested with Vitest, fast-check and Playwright.

The first goal is a 4-week pilot in the author's own house of 3 people, so the plan puts the riskiest things (reliable reminders, one-tap logging, fair scoring) early and keeps v1 small. Everything is built with Claude Code.

**Key approach decisions**
- **Rules live in plain TypeScript functions** in a shared module (points, grades, normalized score, rotation, away handling), tested with Vitest and fast-check against design properties P1 to P12.
- **Authority on the server.** Anything that affects fairness (final grade after 48 hours, occurrence creation, photo deletion) runs in scheduled Supabase jobs that call the same shared module, so the phone and the server can never disagree.
- **Row-level security from day one.** Every table is limited to members of the same house.
- **Each phase ends with something testable and deployed** to Vercel.

## 2. Phase 0: Technology Stack Decisions

Complete. See `technology_decisions.md` (TD-001 to TD-008).

## 3. Phases

### Phase 1: Scaffolding, tooling and deployment
**Goal**: A deployed, installable, empty Italian PWA with tests and CI running.

**Tasks**
1. Create the GitHub repository and the Vite + React + TypeScript project.
2. Add Tailwind CSS and shadcn/ui, with color tokens for light and dark themes.
3. Add the PWA plugin (manifest, icons, service worker shell) and verify home-screen install.
4. Add the central Italian text file and a simple helper for using it.
5. Add Vitest, fast-check and Playwright (iPhone-sized viewport), each with one passing sample test.
6. Add `.gitattributes` (LF line endings), `.gitignore`, `.env.example` and `npm` scripts for dev, build, test and lint.
7. Add GitHub Actions CI on Linux that runs lint, unit tests and Playwright.
8. Connect the repository to Vercel and deploy to a free address.
9. Create the Supabase project and add its URL and public key to Vercel and a local `.env`.
10. Add the Dependabot configuration and auto-merge workflow (see Maintenance).
11. Add `naming_conventions.md` to the repository and reference it from `CLAUDE.md`.

**Deliverable**: An empty app that installs on iPhone and Android, deploys on every push, and passes CI.

### Phase 2: Database schema, security and houses
**Goal**: Members can create a house, invite others and join, with data isolated per house.

**Tasks**
1. Write database migrations for houses, members, invites, chores, occurrences, grades, away periods, proposals, shopping items and settings.
2. Write row-level security rules so each person sees only their own house's data.
3. Add SQL tests for the security rules against a test Supabase project.
4. Implement anonymous sign-in on first open and keep the session.
5. Implement house creation, long random invite codes and links, regenerating codes and joining with a display name (Requirement 1).
6. Implement the recovery flow: rejoin under an existing name after the other members confirm (Requirement 1.7).
7. Add rate limiting for join attempts.
8. Build the first-run screens (create house, join house) in Italian.

**Deliverable**: Three phones can join one house through an invite link. A person outside the house cannot read its data.

### Phase 3: Core rules module
**Goal**: All fairness rules exist as tested pure functions.

**Tasks**
1. Implement points calculation from weight and grade multiplier, with the editable multiplier table (Requirements 6 and 7; properties P1, P2).
2. Implement grade timing rules: 24-hour change window and 48-hour default to Good (P3, P4).
3. Implement days present and the normalized score, including zero days present (P5).
4. Implement rotation with absences, member additions and removals (P6, P7).
5. Implement schedule calculation for daily, every N days, weekly and monthly chores.
6. Write unit tests and fast-check property tests for each rule.
7. Define and document the "on time" rule and the open question defaults in `requirements.md`.

**Deliverable**: A shared module with passing example and property tests for P1 to P7. No user interface yet.

### Phase 4: Chores, occurrences and the home screen
**Goal**: The chore catalog exists, rotation creates occurrences automatically, and each member sees their tasks.

**Tasks**
1. Build the chore catalog screens: create, edit, archive, description, room, schedule, weight (Requirement 2).
2. Add the suggested default chores for the author to accept or edit.
3. Implement the scheduled job that creates occurrences and assigns them using the shared rules (Requirement 3).
4. Build the home screen: my upcoming and overdue occurrences, open chores.
5. Implement overdue marking.
6. Build the away-mode screen and the reassignment logic (Requirement 4).
7. Add integration tests for creating and assigning occurrences and for away reassignment.

**Deliverable**: Chores rotate automatically across housemates, skipping anyone away, and show up on the home screen.

### Phase 5: Completing, grading, swaps and open chores
**Goal**: The core loop works end to end: do a chore, get it graded, earn points.

**Tasks**
1. Implement one-tap completion with provisional points and undo (Requirement 5).
2. Implement grading by another member with the six grades, comments, a 24-hour change window and the Not done reopening (Requirement 6).
3. Implement the scheduled job that applies the 48-hour default to Good.
4. Implement swap offers and acceptance, releasing to open chores, and claiming (Requirement 10).
5. Handle duplicate claims and duplicate synchronization safely.
6. Add integration tests for the complete-and-grade flow and for swap and claim races.
7. Add the first Playwright flow: join, mark done, grade.

**Deliverable**: Three people can complete, grade, swap and claim chores, and points are awarded correctly.

### Phase 6: Scoreboard, history and weight proposals
**Goal**: Points become visible, comparable and group-controlled.

**Tasks**
1. Build the weekly, monthly and all-time scoreboards using the normalized score, with ties and away status (Requirement 8).
2. Build the end-of-week and end-of-month job: winner banner, history of winners, streaks.
3. Build the history screen with filters and per-member totals by chore (Requirement 13).
4. Implement weight proposals, voting, expiry after 7 days and notification triggers (Requirement 9).
5. Add the points reconciliation check (property P9) as a test and a visible warning if it ever fails.
6. Add Playwright flows for the scoreboard and for a weight proposal.

**Deliverable**: A working scoreboard and history, with group-approved weight changes.

### Phase 7: Shopping list and photos
**Goal**: Shared supplies are tracked and buying earns points.

**Tasks**
1. Build the shopping list with quick-add items, claim, release and bought (Requirement 11).
2. Award the fixed shopping points to the buyer only (property P10) and keep a history of bought items.
3. Add photo capture, on-device compression to about 200 KB, and private storage with signed links (Requirement 5.4).
4. Add the scheduled job that deletes photos after 30 days and keeps grades and points.
5. Add tests for single claimant rules and shopping points.

**Deliverable**: A working shopping list, and optional photos on completed chores.

### Phase 8: Notifications and offline
**Goal**: Reminders are reliable and the app works with a poor connection.

**Tasks**
1. Implement push subscriptions, including the iPhone home-screen requirement and a clear explanation when notifications are unavailable (Requirement 12.6).
2. Implement the morning reminder and evening follow-up (Requirement 12.1, 12.2).
3. Implement notifications for grading, swaps, proposals, shopping items and chores awaiting grading.
4. Add per-person notification settings and quiet hours.
5. Support completing an occurrence directly from a notification.
6. Implement offline reading of the last loaded data and a queue for completions and shopping changes that applies each action once on reconnect (Requirement 16.6, 16.7; property P12).
7. Add tests for offline queueing and duplicate protection.
8. Test notifications by hand on real iPhone and Android devices.

**Deliverable**: Reminders and notifications arrive on both phone types, and actions made offline sync correctly.

### Phase 9: Scoring switch, pilot metrics and polish
**Goal**: The app is ready for a measurable pilot.

**Tasks**
1. Implement the scoring on/off switch and its behavior (Requirement 14; property P11).
2. Build the pilot metrics screen: on-time completion, members active, grades given, side-by-side scoring on/off comparison (Requirement 15).
3. Build the weekly one-question fairness check-in and its average.
4. Add the short first-run guide (Requirement 16.4).
5. Check accessibility against WCAG AA in both themes, including contrast and tap target size.
6. Check the visual style and choose the final palette (the color-palette toolkit can generate one).
7. Review copy in Italian for tone and consistency.

**Deliverable**: A polished app with a way to run and measure the pilot.

### Phase 10: Hardening and pilot launch
**Goal**: A stable production release that the three housemates start using.

**Tasks**
1. Run the full unit, property, integration and end-to-end suites on Linux in CI.
2. Review the row-level security rules and the invite code protections.
3. Clear test data and set up production configuration (and consider a second Supabase project).
4. Add a basic backup: scheduled export of the database.
5. Write a short setup guide for the housemates (install, notifications, joining).
6. Deploy to production, invite the housemates and start the 4-week pilot.
7. Record the pilot plan: weeks with scoring on and off, and what outcomes decide the next step.

**Deliverable**: The app live, all three housemates joined, and the pilot running.

## 4. Phase Dependencies

```
Phase 1 (Scaffolding)
   └── Phase 2 (Schema, security, houses)
          └── Phase 3 (Core rules module)  ← can start in parallel with Phase 2 after Phase 1
                 └── Phase 4 (Chores, occurrences, home)
                        └── Phase 5 (Complete, grade, swap)
                               ├── Phase 6 (Scoreboard, history, proposals)
                               ├── Phase 7 (Shopping, photos)
                               └── Phase 8 (Notifications, offline)
                                      └── Phase 9 (Scoring switch, metrics, polish)
                                             └── Phase 10 (Hardening, pilot launch)
```

Phases 6, 7 and 8 depend on Phase 5 and can be done in any order. Phase 8 is the riskiest and should not be left to the end if earlier phases go smoothly.

## 5. Risk Areas and Mitigation

| Risk | Mitigation |
|------|------------|
| **iPhone push notifications** only work after adding the app to the home screen, and are the main driver of A1 | Test on a real iPhone early (during Phase 1 with a test notification). Show a clear install guide. Provide in-app pending actions as a fallback. |
| **Rules duplicated between phone and server** drift apart | One shared TypeScript module used by both. Property tests on that module. |
| **Row-level security mistakes** expose one house's data to another | SQL tests in Phase 2. Review in Phase 10. Use test data with multiple houses. |
| **Weighted scoring causes arguments** (A3) | Weights set by group vote, visible history, a weekly fairness check-in, and a scoring on/off switch. |
| **One housemate stops using the app** (A1) | One-tap completion, reminders from notifications, fast join. Metrics show who is active; discuss at pilot check-ins. |
| **Free-tier limits** (storage, paused project, scheduled jobs) | 200 KB photos with 30-day deletion. Daily use avoids project pausing. Monitor usage during the pilot. |
| **Anonymous identity lost** when browser data is cleared | Documented recovery flow (Requirement 1.7). Install to the home screen. |
| **Windows development vs Linux hosting** | CI runs on Linux. Consistent file name casing. `npm` scripts only. |
| **Dev and pilot data share one database** | Use clearly named test houses, then clear them before launch (Phase 10), or add a second Supabase project. |
| **Time zone and scheduling errors** (day boundaries, daily reminders) | Store one house time zone. Test schedule rules with property tests across day boundaries. |
| **Scope growth** (expenses, rewards, chat bot) | Out of v1 per `requirements.md`. Revisit after the pilot. |

## 6. Success Criteria

- [ ] All 16 requirements in `requirements.md` pass their acceptance criteria.
- [ ] Correctness properties P1 to P12 have passing automated tests.
- [ ] The app installs on both iPhone and Android and opens full screen.
- [ ] Reminders and notifications arrive on real iPhone and Android devices.
- [ ] Row-level security tests show one house cannot read another's data.
- [ ] Core flows (join, complete, grade, scoreboard, shopping claim) pass Playwright tests at phone size.
- [ ] CI is green on Linux and every push to the main branch deploys to Vercel.
- [ ] Accessibility checks for WCAG AA pass in light and dark themes.
- [ ] All three housemates have joined and used the app in the first week.
- [ ] The 4-week pilot has run, with the weekly fairness check-in and scoring on/off comparison recorded.

## Maintenance

### Dependency Updates

**Dependabot configuration**: create `.github/dependabot.yml` during Phase 1 (scaffolding):
- Schedule: `monthly` (not daily/weekly, to reduce noise for a one-person project).
- Group all dependencies into a single PR per ecosystem (npm, github-actions).
- Set `open-pull-requests-limit: 5`.

**Auto-merge workflow**: create `.github/workflows/dependabot-auto-merge.yml`:
- Auto-merge patch and minor version bumps when CI passes (squash merge).
- Major version bumps require manual review.
- Uses `dependabot/fetch-metadata` to detect the update type.

**Pinning strategy**:
- Use compatible-release pins where possible (`^3.2.0` for npm).
- Exact pins only for tools where behavior changes break the build (linters, formatters).

### Quarterly Maintenance Cycle

Pick one day per quarter to:
1. Merge any outstanding grouped Dependabot PR.
2. Check for runtime EOL dates (Node) and upgrade if within 6 months of EOL.
3. Review infrastructure announcements (Vercel, Supabase), including free-tier changes.
4. Run the full test suite and deploy.

**Exception**: critical or high security advisories should be handled within 1 week.

### What Doesn't Need Regular Updates

- Infrastructure platforms (Vercel, Supabase): no action unless a breaking change is announced.
- Runtime versions: annually, or when end-of-life approaches.
- Dev tooling (linters, formatters): only when it blocks something.
