# Requirements: Coliving House Manager (working title)

## 1. Introduction

This is a personal-first app for a household of three friends who share a flat. Today they coordinate chores and shared supplies through a WhatsApp message that gets buried, never rotates, sends no reminders and leaves no record of who did what (see `ideation.md`, sections 1-3). The result is uneven effort, resentment and shared items such as toilet paper running out.

The app is an installable web app (PWA), in Italian only, that provides:
- a chore rota with descriptions and automatic rotation
- effort-weighted points with a quality grade for each completed chore
- weekly and monthly scoreboards with bragging rights for the winner
- a shared shopping list where claiming and buying earns points

The recommended hypothesis from ideation is **Fair Share House**. The first goal is a 4-week pilot in the author's own house to test the riskiest assumptions: A1 (everyone keeps using it), A2 (points change behavior) and A3 (scoring feels fair). The decision about releasing publicly is deferred until after the pilot.

**Scope decisions made during kickoff**
- Personal first: one household, sized for 3 people and up to about 6. No multi-household accounts, store release or monetization in v1.
- Platform: installable web app (PWA) that works on iPhone and Android.
- Sign-in: invite link or code, no passwords. Hosting on a free tier.
- Language: Italian only, with all text kept in one place so translation can be added later.
- Out of v1: expense splitting, rewards defined inside the app, chat-bot integration.

**Defaults applied without being asked** (to be confirmed in review)
- Reminders are sent on the morning of a due chore and again in the evening if it is not done.
- A fixed number of points is awarded for buying a shopping item.
- Full history is kept indefinitely (small data volume).
- The grade multipliers are those in Requirement 6 and can be edited later.

## 2. Glossary

| Term | Definition |
|------|------------|
| House | The single shared household that all members belong to. |
| Member | A person in the house, identified by a display name and a device sign-in. |
| Chore | A recurring task with a description, a room or area, a schedule and a weight. |
| Weight | The base points a chore is worth before the grade multiplier is applied. |
| Occurrence | One scheduled instance of a chore (for example, "bathroom, week 43") assigned to one member. |
| Rotation | The automatic order in which a chore's occurrences move through the members. |
| Away mode | A date range during which a member is marked absent and skipped by rotation. |
| Grade | A quality rating of a completed occurrence: Perfect, Good, Done, Poorly done, Bad or Not done. |
| Multiplier | The percentage of the chore's weight awarded for a given grade. |
| Open chore | An occurrence with no assignee that any member can claim. |
| Score | Points earned in a period. |
| Normalized score | Points divided by the number of days the member was present in the period. |
| Scoreboard | The ranking of members by normalized score for a week, a month or all time. |
| Proposal | A requested change to a chore weight that the other members must approve. |
| Shopping item | An entry in the shared shopping list, with a state of needed, claimed or bought. |
| Pilot | The 4-week trial in the author's household. |

## 3. Requirements

### Requirement 1: House creation and invite

**Traces to**: A1, A9

**User story**: As the person setting up the house, I want to create it and invite my housemates with a link, so that everyone can join without creating a password.

**Acceptance criteria**
1. THE System SHALL let a person create a house by entering a house name and their own display name.
2. THE System SHALL generate an invite link and a short invite code for the house.
3. WHEN a person opens the invite link or enters the code, THE System SHALL let them choose a display name and join the house without a password.
4. THE System SHALL keep a member signed in on their device until they sign out or clear the app data.
5. WHEN a display name is already used in the house, THE System SHALL ask the person to choose a different one.
6. THE System SHALL let a member regenerate the invite link, which invalidates the previous one.
7. THE System SHALL let a member who has lost their sign-in rejoin by using the invite code and choosing their existing display name, after the other members confirm.

### Requirement 2: Chore catalog

**Traces to**: A4, A5

**User story**: As a member, I want each chore to have a clear description, so that everyone knows what "done" means.

**Acceptance criteria**
1. THE System SHALL let a member create a chore with a name, a description, a room or area, a schedule (daily, every N days, weekly on chosen days, or monthly) and a weight.
2. THE System SHALL start with a set of suggested default chores and weights that members can accept, edit or delete.
3. THE System SHALL let a member edit a chore's name, description, room and schedule.
4. THE System SHALL let a member archive a chore, which stops new occurrences but keeps its history.
5. WHEN a chore is edited, THE System SHALL leave points already awarded unchanged.

### Requirement 3: Rotation and assignment

**Traces to**: A3, A4

**User story**: As a member, I want turns to rotate automatically, so that nobody has to manage the rota by hand.

**Acceptance criteria**
1. THE System SHALL create occurrences for each active chore according to its schedule.
2. THE System SHALL assign each new occurrence to the next present member in the chore's rotation order.
3. THE System SHALL rotate each chore independently, so that one person is not always given the same chores.
4. WHEN a member is added to or removed from the house, THE System SHALL update each chore's rotation without reassigning occurrences already completed.
5. THE System SHALL show each member their upcoming and overdue occurrences on the home screen.
6. WHEN an occurrence is not completed within its due period, THE System SHALL mark it overdue and keep it assigned to the same member.

### Requirement 4: Away mode

**Traces to**: A3

**User story**: As a member who is travelling, I want to mark myself away, so that I am not given turns or penalized in the scoreboard.

**Acceptance criteria**
1. THE System SHALL let a member set an away period with a start and end date, including a period in the past, which other members can see.
2. WHILE a member is away, THE System SHALL skip them when assigning new occurrences.
3. WHEN a member sets an away period that covers occurrences already assigned to them, THE System SHALL reassign those occurrences to the next present member in rotation.
4. THE System SHALL exclude away days from the member's days present when calculating the normalized score.
5. THE System SHALL show a member's away status on the scoreboard.

### Requirement 5: Completing a chore

**Traces to**: A1, A4

**User story**: As a member, I want to mark a chore done in one tap, so that logging is not a burden.

**Acceptance criteria**
1. THE System SHALL let the assigned member mark an occurrence done with a single tap from the home screen or from a reminder notification.
2. WHEN an occurrence is marked done, THE System SHALL award provisional points equal to the chore's weight at the default Good multiplier until a grade is given.
3. THE System SHALL record who completed the occurrence and when.
4. THE System SHALL let the member add an optional short note or photo to a completed occurrence.
5. WHEN a different member completes an occurrence assigned to someone else, THE System SHALL credit the points to the member who actually did it.
6. THE System SHALL let a member undo marking an occurrence done until it has been graded.

### Requirement 6: Grading

**Traces to**: A3, A2

**User story**: As a member, I want to grade my housemates' work, so that quality counts and points are fair.

**Acceptance criteria**
1. THE System SHALL let one member other than the doer grade a completed occurrence as Perfect, Good, Done, Poorly done, Bad or Not done.
2. THE System SHALL apply the multiplier for the grade to the chore's weight: Perfect 120%, Good 100%, Done 80%, Poorly done 50%, Bad 20%, Not done 0%.
3. THE System SHALL store the multiplier table in one editable setting for the house.
4. WHEN an occurrence is graded Not done, THE System SHALL return it to the original assignee as an open task and award no points.
5. IF nobody has graded an occurrence within 48 hours of completion, THEN THE System SHALL treat it as graded Good.
6. THE System SHALL not let a member grade their own occurrence.
7. THE System SHALL let the grader change their grade within 24 hours, after which the grade is final.
8. THE System SHALL let the doer see the grade and the grader's optional comment.

### Requirement 7: Points calculation

**Traces to**: A3, A2

**User story**: As a member, I want points to reflect effort and quality, so that the scoreboard feels fair.

**Acceptance criteria**
1. THE System SHALL calculate the points for a graded occurrence as the chore's weight at completion time multiplied by the grade multiplier.
2. THE System SHALL round points to the nearest whole number.
3. THE System SHALL calculate a member's normalized score for a period as total points divided by the number of days present in that period.
4. THE System SHALL ensure that points once awarded are changed only by a grade change allowed in Requirement 6 or by an approved correction.
5. WHEN a member has zero days present in a period, THE System SHALL show their normalized score as not applicable rather than dividing by zero.

### Requirement 8: Scoreboard

**Traces to**: A2

**User story**: As a member, I want to see a scoreboard, so that friendly competition keeps me motivated.

**Acceptance criteria**
1. THE System SHALL show a weekly scoreboard, a monthly scoreboard and an all-time total, ranking members by normalized score.
2. THE System SHALL show total points and days present next to each member's normalized score.
3. WHEN a week or month ends, THE System SHALL announce the winner with a banner and keep the result in a history of winners.
4. THE System SHALL show each member's current streak of consecutive weeks with all assigned chores completed.
5. WHEN two members have equal normalized scores, THE System SHALL show them as tied.
6. THE System SHALL not attach any prize in the app to the winner (bragging rights only).

### Requirement 9: Weight proposals

**Traces to**: A3

**User story**: As a member, I want to propose a change to a chore's weight, so that the group decides together what is fair.

**Acceptance criteria**
1. THE System SHALL let any member propose a new weight for a chore with an optional reason.
2. THE System SHALL notify the other members of the proposal.
3. WHEN all other members approve, THE System SHALL apply the new weight to future occurrences.
4. IF any member rejects the proposal, THEN THE System SHALL keep the existing weight and tell the proposer.
5. IF a proposal has not been resolved within 7 days, THEN THE System SHALL close it and keep the existing weight.
6. THE System SHALL not change the points of occurrences completed before the new weight applies.

### Requirement 10: Swaps and open chores

**Traces to**: A4, A3

**User story**: As a member, I want to swap a turn or pick up an open chore, so that the rota stays flexible without confusion.

**Acceptance criteria**
1. THE System SHALL let a member offer an assigned occurrence to a specific housemate, who can accept or decline.
2. WHEN a swap is accepted, THE System SHALL reassign the occurrence and record the swap in history.
3. THE System SHALL let a member release an occurrence as an open chore, visible to everyone.
4. THE System SHALL let any present member claim an open chore, and the claimer then becomes its assignee.
5. WHEN an occurrence is returned as Not done, THE System SHALL show it as open if the original assignee is away.

### Requirement 11: Shopping list

**Traces to**: A6

**User story**: As a member, I want a shared shopping list, so that toilet paper never runs out unnoticed.

**Acceptance criteria**
1. THE System SHALL let any member add a shopping item with a name and an optional quantity or note.
2. THE System SHALL offer a quick-add list of common household items.
3. WHEN an item is added, THE System SHALL notify the other members.
4. THE System SHALL let a member claim an item with "I'll buy it", which shows who is responsible.
5. WHEN a claimed item is marked bought, THE System SHALL award the buyer the fixed shopping points.
6. THE System SHALL let a member release a claimed item back to needed.
7. THE System SHALL not award shopping points to the member who added an item unless they also bought it.
8. THE System SHALL keep a history of bought items.
9. THE System SHALL not record prices or split costs.

### Requirement 12: Reminders and notifications

**Traces to**: A1, A4

**User story**: As a member, I want reliable reminders, so that I do not forget my turn and the rota does not depend on nagging.

**Acceptance criteria**
1. THE System SHALL send a push notification to the assigned member on the morning of an occurrence's due date.
2. IF the occurrence is not completed by the evening, THEN THE System SHALL send a second reminder.
3. THE System SHALL notify a member when an occurrence of theirs has been graded, when a swap is offered to them, and when a weight proposal needs their vote.
4. THE System SHALL notify a member when another member completes a chore they could grade.
5. THE System SHALL let each member choose which notification types they receive and set quiet hours.
6. IF push notifications are unavailable on a member's device, THEN THE System SHALL show pending actions on the home screen and explain how to enable notifications.
7. THE System SHALL let a member complete an occurrence directly from a notification.

### Requirement 13: History and visibility

**Traces to**: A4, A5

**User story**: As a member, I want to see who did what and when, so that fairness can be proven and disputes are easy to settle.

**Acceptance criteria**
1. THE System SHALL keep a chronological history of completed occurrences with chore, member, grade, points and date.
2. THE System SHALL let a member filter the history by member, chore and period.
3. THE System SHALL show per-member totals of points earned by chore, so that imbalances are visible.
4. THE System SHALL keep history indefinitely.
5. THE System SHALL let any member see the full history for the house.

### Requirement 14: Scoring switch for the pilot

**Traces to**: A2

**User story**: As the person running the pilot, I want to switch scoring off and on, so that I can compare weeks with and without points.

**Acceptance criteria**
1. THE System SHALL let a member turn scoring on or off for the house, with the other members notified.
2. WHILE scoring is off, THE System SHALL hide points and the scoreboard but keep rotation, grading-free completion, reminders and the shopping list working.
3. WHILE scoring is off, THE System SHALL keep recording completions so that completion rates can be compared between periods.
4. WHEN scoring is turned back on, THE System SHALL not award points retroactively for the off period.

### Requirement 15: Pilot metrics

**Traces to**: A1, A2, A3

**User story**: As the person running the pilot, I want simple weekly numbers, so that I can tell whether the app is working.

**Acceptance criteria**
1. THE System SHALL show, for each week, the share of occurrences completed on time, the number of members who opened the app, and the number of grades given.
2. THE System SHALL show completion rates side by side for scoring-on and scoring-off weeks.
3. THE System SHALL provide a one-question weekly check-in asking each member whether the scoring felt fair, on a scale of 1 to 5.
4. THE System SHALL show the average fairness rating per week.
5. THE System SHALL not send usage data to any third-party analytics service.

### Requirement 16: Installability and language

**Traces to**: A1

**User story**: As a member, I want to install the app from a link and use it in Italian, so that getting started is easy.

**Acceptance criteria**
1. THE System SHALL be installable to the home screen on iPhone and Android and open full screen like an app.
2. THE System SHALL present all text in Italian.
3. THE System SHALL keep all user-facing text in one place so that another language can be added later.
4. THE System SHALL show a short first-run guide explaining chores, grading, away mode and the shopping list.
5. THE System SHALL reach a usable home screen within 3 taps of opening the invite link on a new device.
6. THE System SHALL show the most recently loaded data when the device is offline and indicate that it is offline.
7. WHILE the device is offline, THE System SHALL queue completions and shopping changes and send them when the connection returns.
8. THE System SHALL be usable on a phone screen as the primary layout, and remain usable on a larger screen.

## 4. Assumption Traceability

| Assumption | Requirements |
|------------|--------------|
| A1: All housemates keep using it | 1, 5, 12, 15, 16 |
| A2: Points change adult behavior | 6, 7, 8, 14, 15 |
| A3: Scoring feels fair | 3, 4, 6, 7, 9, 10, 15 |
| A4: WhatsApp fails from burying, no rotation, no visibility | 2, 3, 5, 10, 12, 13 |
| A5: Existing apps are not good enough | 2, 13 |
| A6: A shared shopping list prevents running out | 11 |
| A7: Shared housing demand is stable | None (market assumption) |
| A8: Free or low price is needed | None (free hosting and no subscription in v1) |
| A9: The author's house represents the market | 1 (single house, deferred decision) |

## 5. Open Questions

- [ ] What is the initial list of chores and their default weights for your house? (Needed to seed Requirement 2.)
- [ ] What fixed number of points should buying a shopping item earn (suggested: 3)?
- [ ] Should "Not done" return the occurrence to the same person, or should it also cost them points?
- [ ] What counts as being "on time" for each schedule type (end of the due day, end of the week)?
- [ ] Should photos on completed chores be stored, and if so how long (storage limits on the free tier)?
- [ ] Which specific free hosting service will be used (to be decided in `/tech-stack`)?
