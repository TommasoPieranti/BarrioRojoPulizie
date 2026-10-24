# Design: Coliving House Manager (working title)

## 1. Overview

Housemates who share a home coordinate chores and supplies through a WhatsApp message that gets buried, never rotates, sends no reminders and keeps no record. This leads to uneven effort, resentment and shared items running out.

The solution (hypothesis **Fair Share House** in `ideation.md`) is a personal-first, Italian-language installable web app (PWA) for one household of about three people. It combines automatic chore rotation, effort-weighted points with a quality grade from a housemate, a weekly and monthly scoreboard that normalizes for days away, and a shared shopping list where buying earns points. The first release is a 4-week pilot in the author's own house to test A1, A2 and A3.

## 2. Key Design Principles

1. **One tap, low friction.** Logging a chore and acting on a reminder must take one tap. Friction is the main adoption risk (A1).
2. **Fair by construction.** Points reflect effort (weights) and quality (grades), and absence never hurts anyone (A3).
3. **Trust first, check lightly.** Chores count by default and a housemate can grade them. Nothing stalls waiting for approval (A1, A3).
4. **Transparent and group-owned.** Weights, history and rules are visible to everyone, and changes need the group's agreement (A3).
5. **Playful, not punishing.** Bragging rights only, no in-app prizes or penalties beyond grades. A control mode lets scoring be switched off (A2).
6. **Lean for now.** Built for one house, with no accounts, payments or analytics services. Simple choices keep the pilot cheap and easy to change.

## 3. Technology Approach

To be populated by `/tech-stack`. Decisions already made at kickoff:
- Installable web app (PWA) for iPhone and Android.
- Invite-link sign-in with no passwords.
- Free-tier hosted backend, with no server to maintain.
- Italian only, with all text kept in one place.

Open for `/tech-stack`: framework, backend service, push notification approach (including the iPhone home-screen requirement), offline storage and scheduling of recurring occurrences.

## 4. Correctness Properties

| # | Property | Validates |
|---|----------|-----------|
| P1 | For any occurrence, the points awarded SHALL equal the chore weight at completion time multiplied by the multiplier of its final grade, rounded to the nearest whole number. | Req 6, 7 |
| P2 | For any occurrence graded Not done, the points awarded SHALL be zero and the occurrence SHALL return to an open state. | Req 6 |
| P3 | For any occurrence, the grader SHALL be a member other than the member who completed it. | Req 6 |
| P4 | For any occurrence not graded within 48 hours of completion, the final grade SHALL be Good. | Req 6 |
| P5 | For any member and period, the normalized score SHALL equal total points divided by days present, where days present excludes all away days, and SHALL be not applicable when days present is zero. | Req 4, 7, 8 |
| P6 | For any new occurrence, the assignee SHALL be a member who is present on the occurrence's due date. | Req 3, 4 |
| P7 | For any set of members and any sequence of occurrences of one chore with no absences, the assignments SHALL cycle through the members so that counts differ by at most one. | Req 3 |
| P8 | For any approved weight proposal, the points of occurrences completed before approval SHALL be unchanged. | Req 2, 9 |
| P9 | For any member, the total of their points SHALL equal the sum of the points of their graded occurrences plus shopping points, and no points SHALL exist without a source record. | Req 7, 11, 13 |
| P10 | For any shopping item, it SHALL have at most one claimant at a time, and shopping points SHALL be awarded only to the member who marked it bought. | Req 11 |
| P11 | For any period in which scoring is off, no points SHALL be awarded, and completions SHALL still be recorded. | Req 14 |
| P12 | For any offline action later synchronized, the result SHALL be the same as if the action had happened online at its original time, and no action SHALL be applied twice. | Req 16 |

## 5. Business Logic Flows

### Flow: Create occurrences and assign
**Trigger**: A chore's schedule reaches its next due date (or a chore is created).
**Preconditions**: The chore is active and the house has at least one present member.

1. Create an occurrence for the chore with a due date.
2. Find the present members on the due date.
3. Choose the next member in the chore's rotation order who is present.
   - If no member is present: leave the occurrence open.
4. Assign the occurrence and notify the assignee.

**Postconditions**: The occurrence has an assignee, or is open, and appears on the home screen.

### Flow: Complete and grade
**Trigger**: A member taps "done" on an occurrence.
**Preconditions**: The occurrence is assigned or open, and not yet completed.

1. Record the doer and time. Award provisional points at the Good multiplier.
2. Notify the other members that the occurrence can be graded.
3. A member other than the doer grades it.
   - If the grade is Not done: remove the points and reopen the occurrence for the original assignee.
   - Otherwise: set the points to weight multiplied by the grade multiplier.
4. The grader may change their grade within 24 hours.
5. If nobody grades within 48 hours: set the grade to Good.
6. Notify the doer of the final grade.

**Postconditions**: The occurrence has a final grade (or is reopened), and the scoreboard reflects it.

### Flow: Set away period
**Trigger**: A member saves an away period.
**Preconditions**: The member is in the house.

1. Store the start and end dates.
2. For each occurrence assigned to the member within the period that is not completed:
   - Reassign it to the next present member in rotation.
   - Notify the new assignee.
3. Exclude the period from the member's days present.

**Postconditions**: No occurrence in the period is assigned to the away member.

### Flow: Weight proposal
**Trigger**: A member proposes a new weight for a chore.
**Preconditions**: The chore is active.

1. Notify all other members and open the proposal for 7 days.
2. Collect approvals and rejections.
   - If all other members approve: apply the new weight to future occurrences.
   - If any member rejects: keep the existing weight and notify the proposer.
   - If 7 days pass without a decision: close the proposal and keep the weight.

**Postconditions**: The weight is changed only if all others approved, and history is unchanged.

### Flow: Shopping item
**Trigger**: A member adds an item.
**Preconditions**: The member is in the house.

1. Add the item as needed and notify the others.
2. A member claims it ("I'll buy it"). The item shows the claimant.
   - The claimant may release it back to needed.
3. The claimant marks it bought.
4. Award the fixed shopping points to the claimant and move the item to history.

**Postconditions**: Points go only to the buyer, and the item is in history.

### Flow: End of week or month
**Trigger**: A scoring period ends.
**Preconditions**: Scoring is on.

1. Close the period, finalizing any grades that reach the 48-hour limit.
2. Calculate each member's normalized score.
3. Announce the winner (ties shown as tied) and update streaks.
4. Save the result to the history of winners.

**Postconditions**: The winner is recorded and the next period starts.

## 6. Error Handling Strategy

**Philosophy**: Never lose a completion or a grade. Prefer a gentle prompt over blocking. Fail visibly on data integrity problems.

| Situation | System response |
|-----------|-----------------|
| Device is offline when marking a chore done | Save locally, show as pending sync, and send when the connection returns |
| The same action is synced twice | Ignore the duplicate and keep a single record |
| Two members claim the same open chore or item | Keep the first claim, tell the second member it was taken |
| A member tries to grade their own chore | Block with a short explanation |
| Invite code is wrong or has been regenerated | Show a clear message and how to get a new link |
| Display name already taken | Ask for a different name |
| Push notifications not permitted or unsupported | Show pending actions on the home screen and explain how to enable notifications |
| Away period overlaps existing assignments | Reassign them automatically and tell the affected members |
| Division by zero in normalized score | Show "n/a" |
| Scoring off while a member opens the scoreboard | Show a message that scoring is off and hide points |
| Photo upload fails or exceeds the limit | Keep the completion, skip the photo and tell the member |
| Backend unavailable | Show the last loaded data with an offline indicator and retry in the background |
| Data inconsistency detected (e.g. points without a source) | Log it, show a visible warning and do not silently correct it |

## 7. Testing Strategy

**Unit tests** for pure logic:
- points calculation from weight and grade multiplier
- normalized score and days present, including away periods and zero days
- rotation with absences, additions and removals
- grade timing (24-hour change window, 48-hour default to Good)
- weight proposal outcomes

**Property-based tests** (generate random members, chores, absences, grades and sequences) for the correctness properties:
- P1, P5 and P9 (points and scores always reconcile)
- P6 and P7 (assignment is always to a present member, and cycles fairly)
- P10 (single claimant and points only to the buyer)
- P12 (offline actions apply once and give the same result)

**Integration tests** for the end-to-end flows in section 5 (create and assign, complete and grade, away period, weight proposal, shopping item, end of period) against a test backend.

**End-to-end tests** on a phone-sized viewport for the main paths: join via invite link, mark a chore done in one tap, grade, view the scoreboard and claim a shopping item. Notification delivery and installation on real iPhone and Android devices are checked manually during the pilot.

**Pilot as validation**: the 4-week pilot (Requirement 15) tests A1, A2 and A3 with real housemates, using the weekly check-in and the on/off scoring comparison.
