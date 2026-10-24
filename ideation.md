# Ideation: Coliving House Manager (working title)

## Meta
- Status: Ready for Kickoff
- Last Updated: 2026-10-24
- Sessions: 1

## 1. Origin
- **Entry Type**: Solution (backtracked to Problem)
- **Initial Statement**: "i want to build an app for people coliving to manage the cleaning scehdule and whole house matters. for example it needs to have a shopping list for things needed in the house (toilet paper etc) a cleaning schedule with turns and a description of each things. i want also a score system to have more points and a scoreboard."
- **Refined Problem Statement**: Housemates who share a home coordinate chores and shared supplies through a WhatsApp message. It gets buried in the chat, nobody is reminded, the turn rotation is manual and unclear, and nobody can see who actually did what. The result is uneven effort, resentment, and shared items (e.g. toilet paper) running out.

## 2. Jobs to be Done
- **Primary Job**: Keep the shared home clean and stocked, with a fair split of effort, without nagging or arguing.
- **Related Jobs**:
  - Make contributions visible and recognized, so fairness is provable.
  - Know what to buy and avoid duplicate purchases.
  - Make chores more fun through light competition.
  - (Possible later) Split shared expenses and bills.
- **Current Alternatives**:
  - WhatsApp group message listing tasks (the user's current setup; "doesn't work").
  - Paper rota or spreadsheet (common, not verified with the user).
  - Chore apps: Homio, ChoreChamp, Nipto (points/leaderboard); Flatastic, Roomies, OurFlat, Tody (rota/lists); Splitwise (money only).
- **Switching Triggers**: A chore dispute or resentment, supplies running out, someone new moving in, or the WhatsApp list being ignored again.

## 3. User Segments

### Segment 1: Friends sharing a flat (3 people)
- **Context**: A small household of friends. They know each other well, so competition is likely to feel playful rather than awkward. Chores and supplies are coordinated informally in a chat.
- **Motivation**: A fair, automatic system that removes nagging, makes effort visible, and makes chores a bit fun through points and a scoreboard.
- **Ability Barriers**: All housemates must install and use the app (a single non-adopter breaks the system). Logging completed chores adds friction. Existing free apps lower the incentive to switch. Points may feel childish or unfair if weighting is wrong.
- **Potential Prompts**: A fight about uneven chores, running out of toilet paper, a daily or weekly reminder when a turn comes up, and a new housemate or new lease.

### Segment 2: Larger or mixed households (to validate)
- **Context**: 4+ people, including strangers or less close housemates.
- **Motivation**: Neutral accountability, so nobody has to confront a housemate directly.
- **Ability Barriers**: Lower trust and varied engagement. Gamification may feel awkward between non-friends.
- **Potential Prompts**: Move-in, a conflict over cleanliness.

## 4. Market Landscape

### Direct Competitors
| Competitor | What They Do | Strengths | Weaknesses | Pricing |
|------------|--------------|-----------|------------|---------|
| [Nipto](https://apps.apple.com/us/app/id1504877473) | Points-based chore splitting; weekly winner and reward | Free tier, ~4.7 stars (Google Play, ~6.3K reviews), gamified | Missed reminders, no long-term tracking, scheduling needs Premium, slow support, no web/Chromebook; family/kid focus; no shopping list found | Free; Premium ~$1.99/mo or ~$12.99/yr (user-reported) |
| [Flatastic](https://www.flatastic-app.com/en/premium/) | Chores, shopping lists, shared expenses for flatmates | All-in-one, roommate-focused, free plan, ~4.5 stars | Chore history, notes and multiple shopping lists are Premium; ads on free tier; limited expense splitting; reviews mixed by source | Free; Premium $1.99/mo or $18.49/yr, group plan $34.99/yr (App Store listing) |
| [Homio](https://alternativeto.net/software/homio/?p=3) | Expense splitting, chores with points leaderboard, shared shopping list | Closest feature match to this idea | Little reviewable detail found; pricing and traction not verified | not found |
| [ChoreChamp](https://mwm.ai/apps/cleaning-games-chorechamp/6751862451) | Points, leaderboards, recurring or randomized chores, completion log | Gamification-first | iOS-only per listing; no shopping list mentioned; reviews not examined | not found |
| [Roomies](https://apps.apple.com/us/app/-/id6753794415) | Expenses, cleaning rota, real-time grocery list | Covers rota + groceries | No leaderboard mentioned; new, little data | not found |
| [OurFlat](https://apps.apple.com/us/app/-/id1530007409) | Chores, groceries, bills, polls | Broad, praised by some users | No points system seen | not found |

### Indirect Competitors
| Solution | How it's used for this job | Gap it leaves |
|----------|---------------------------|---------------|
| WhatsApp group message (current) | Task list posted in chat | Buried by new messages, no rotation, no reminders, no record of who did what |
| Spreadsheet or Airtable template | Shared rota, tick-off sheet, [sign-off by peers](https://www.airtable.com/templates/roommate-house-management/expX0kSO1OdA4swiU) | Manual upkeep, no notifications, no scoring, poor on phones |
| Paper chart on the fridge | Visible per-person tally, hard to dodge | Only works if everyone is home and honest; no shopping integration |
| Tody | Room-based cleaning frequency | Cleaning only; no shared supplies list (per roommate guides, not verified) |
| Splitwise | Splitting costs | Money only; does not touch chores |

### Market Signals
- A record [6.8 million US households](https://eyeonhousing.org/2025/04/house-sharing-is-not-just-for-young-adults/) shared housing with unrelated people in 2023 (NAHB); ages 25-34 are the largest group (about 23%). Still below the 2019 peak in share terms.
- [Affordability pressure](https://sites.lsa.umich.edu/mje/2026/01/11/inflation-housing-affordability-and-the-reshaping-of-young-adult-independence/) drives sharing; it could recede if affordability improves.
- [Shared housing startups](https://news.crunchbase.com/news/shared-housing-startups-are-taking-off/) are attracting funding, but that is mostly housing operators, not chore apps (not examined in detail).
- Data is US-centric; the user's market (location) is unknown.

### Opportunity Gaps
- **Free, complete bundle for small friend groups:** the useful bits are split across Premium tiers (Flatastic locks chore history and multiple lists; Nipto locks scheduling). A fully free, ad-free app with chores + history + shopping list + points is a gap.
- **Fair scoring:** competitors award flat points per chore; none observed weights chores by effort or time, or rebalances when someone is away. This targets the "it's unfair" pain directly. (Not verified across all competitors.)
- **Low-friction accountability:** missed reminders are a documented complaint (Nipto). Reliable reminders plus easy one-tap completion would address the "people ignore it" pain.
- **Friends-oriented tone:** most gamified apps target families and kids; a playful adult-roommate tone is less served.
- **Supplies that run out:** the shopping list tied to chores (e.g. "low on toilet paper" alerts, who buys it) is only partly covered.

## 5. Assumptions Log

| ID | Assumption | Category | Importance | Confidence | Evidence | Validation Strategy |
|----|------------|----------|------------|------------|----------|---------------------|
| A1 | All housemates will install and keep using the app (one non-adopter breaks the system) | User | High | Low | No evidence found; WhatsApp already fails on engagement | Pilot with the 3 housemates for 4 weeks; measure weekly active use per person |
| A2 | Points and a scoreboard increase chore completion among adults who are friends | Solution | High | Low | Searched: no long-term study on adult household chores; small short-term studies only; one study found feedback style did not strongly change motivation | Pilot A/B in own house: weeks with vs without scoring; compare completion rate |
| A3 | Scoring can be made feel fair (weighted by effort) without becoming a source of new arguments | Solution | High | Low | No competitor evidence of weighted scoring found | Prototype weights; ask housemates to rate fairness each week |
| A4 | The WhatsApp message fails because of burying, no rotation and no visibility, which an app fixes | Problem | High | Medium | User stated it; consistent with generic roommate guides (not WhatsApp-specific) | Observe which failure mode dominates in the pilot |
| A5 | Existing apps do not already solve this well enough (people would switch) | Market | High | Medium | Many apps exist with the same feature set (Homio, Nipto, Flatastic); user had apparently not tried them | Have the housemates try 1-2 existing apps for a week; list what is missing |
| A6 | A shared shopping list that prevents running out is valued as much as the chores part | Problem | Medium | Medium | Included in user's initial brief; no outside data | Track how often items run out before and after |
| A7 | Shared housing demand is stable or growing | Market | Medium | High | NAHB 6.8M US households (2023); could recede with affordability | Monitor; low priority |
| A8 | Free or low price is needed; housemates will not pay for a subscription | Market | Medium | Medium | Competitors price Premium at roughly $2/month | Ask users; decide monetization at kickoff |
| A9 | The user's own house is representative of the wider market (3 friends) | User | Medium | Low | Single data point | Interview a few other households before scaling |

### Priority Matrix
- **Test First** (High Importance, Low Confidence): A1, A2, A3
- **Monitor** (High Importance, High/Medium Confidence): A4, A5
- **Validate Later** (Lower priority): A6, A7, A8, A9

## 6. Solution Hypotheses

### Hypothesis 1: Fair Share House (Recommended)
- **Description**: A standalone mobile-first app (installable web app or native) for a household. Features: chore rota with descriptions and rotation, one-tap "done" from a reminder notification, effort-weighted points (each chore has a weight; absences adjust targets), a scoreboard, and a shared shopping list where a "running low" item can become a "buy it" task that earns points. Chore history and notes are free.
- **Key Differentiator**: Fairness-first scoring (effort weights plus absence adjustment) and a free, complete bundle for friend groups, versus flat points and Premium-gated history in Nipto and Flatastic.
- **Target Segment**: Segment 1 (friends sharing a flat, 3 people).
- **Validates Assumptions**: A1, A2, A3, A5, A6, A8
- **Key Risks**: Feature set is easy to copy and already common (A5). All housemates must install it (A1). Weighted scoring may cause new arguments (A3). Retention drops after setup if onboarding is slow.
- **Prior Art**: Nipto, Flatastic, Homio and ChoreChamp cover most of the features but not weighted, absence-aware scoring (not exhaustively verified). Research on app abandonment points to onboarding friction and slow time-to-value as main retention risks; chores are periodic, so daily opens are not required.

### Hypothesis 2: Chat-Native Housemate
- **Description**: A bot inside the group chat the household already uses (WhatsApp, or Telegram as an easier start). It posts whose turn it is, accepts "done" replies, keeps a running score, maintains the shopping list through chat commands, and posts a weekly scoreboard.
- **Key Differentiator**: Zero install and no new habit, which directly attacks the adoption risk (A1).
- **Target Segment**: Segment 1, and also Segment 2 (larger or mixed households) where installing an app is a bigger ask.
- **Validates Assumptions**: A1, A4
- **Key Risks**: WhatsApp's bot and API restrictions and costs were not investigated and could block it. Chat-only UI is poor for scoreboards, history and descriptions. Chat messages still get buried, which is the original problem (A4).
- **Prior Art**: Open-source Telegram bots exist ([Duty Rotator](https://zff.dev/tippfehlr/dutyrotator), Dyżur-bot, [Housematee](https://github.com/tasszz2k/housematee-tgbot)), and Duty Rotator's newer version supports task weights. A commercial WhatsApp "AI housemate" exists but I found no technical details. Lesson: rotation bots are proven; scoring and stickiness are not.

### Hypothesis 3: Plain Rota Baseline (test control)
- **Description**: A minimal app with only the rotation, reminders and shopping list, and no points. Intended as a control, or as the first release with scoring switched on later.
- **Key Differentiator**: Simplicity and speed to build; isolates whether the real value is organization rather than gamification.
- **Target Segment**: Segment 1.
- **Validates Assumptions**: A2 (by comparison), A4, A6
- **Key Risks**: No differentiation from free spreadsheets and existing apps; may not address the "unfair" pain.
- **Prior Art**: Many rota apps (Flatastic free tier, Roomies, OurFlat) already do this.

### Recommendation
**Pursue Hypothesis 1 (Fair Share House)**, built so it can later add a chat integration (Hypothesis 2) and so scoring can be switched off for the control test (Hypothesis 3), because:
- It targets the clearest opportunity gap: fair, effort-weighted scoring and a free complete bundle.
- It lets you test the highest-risk assumptions (A1, A2, A3) in your own house first.
- It fits the closest user segment (friends sharing a flat), where a playful scoreboard is most likely to work.

Key risks to monitor: copyability of the feature set, onboarding friction, and fairness disputes caused by scoring.
Critical assumptions to validate early: A1, A2, A3. A cheap way is to run the household for a few weeks on a spreadsheet or Telegram bot with weighted points before building the full app.

## 7. Open Questions for /kickoff

### Requirements Questions
- [ ] How are chore weights set: by the group together, by default templates, or by time estimate?
- [ ] How should absences, holidays and swaps be handled in rotation and scoring?
- [ ] Does chore completion need peer verification, or is trust enough?
- [ ] Is there a reward or end-of-period outcome for the winner (as in Nipto), or is the scoreboard purely for status?
- [ ] Is expense splitting in scope, or explicitly out for v1?
- [ ] How are shopping items assigned and who buys them (and how are they credited)?

### Technical Questions
- [ ] Platform: native iOS/Android, cross-platform, or installable web app (PWA)? Which housemates use which phones?
- [ ] Backend and sync: how do 3 users share real-time data (accounts, invite links)?
- [ ] Notifications: how to make reminders reliable (a documented complaint about Nipto)?
- [ ] If a chat bot is pursued: what are WhatsApp's current API restrictions and costs versus Telegram?

### Business Questions
- [ ] Is this a personal project for your own house, or a product for the public? This changes everything below.
- [ ] If public: pricing model (free, ads, Premium at roughly $2/month like competitors)?
- [ ] If public: which country or market first (the market data found is US-only)?

### User Research Gaps
- [ ] A1: Will all 3 housemates keep using it? Run a 4-week pilot and measure weekly use per person.
- [ ] A2: Do points change behavior? Compare weeks with and without scoring.
- [ ] A3: Does the weighted scoring feel fair? Ask each housemate weekly.
- [ ] A5: What do existing apps miss? Have the housemates try Nipto or Flatastic for a week.
- [ ] A9: Interview a few other households to check the findings generalize.

## 8. Research Log
| Date | Topic | Source | Key Findings |
|------|-------|--------|--------------|
| 2026-10-24 | Prior attempts: chat bots | [Duty Rotator](https://zff.dev/tippfehlr/dutyrotator), [Housematee](https://github.com/tasszz2k/housematee-tgbot), Dyżur-bot, Codewords template | Open-source Telegram rotation bots exist, one with task weights; no open-source WhatsApp bot found; WhatsApp API limits not investigated |
| 2026-10-24 | Prior attempts: app abandonment | KTH thesis on household app onboarding, JMIR review, HackerNoon | No chore-app shutdowns found; onboarding friction and slow time-to-value are the main retention risks (mostly vendor and general-app evidence) |
| 2026-10-24 | Competitor deep dive: Flatastic | [Flatastic Premium](https://www.flatastic-app.com/en/premium/), App Store | Premium gates chore history, notes, multiple lists; sources conflict on ratings and pricing |
| 2026-10-24 | Competitor deep dive: Nipto | [App Store](https://apps.apple.com/us/app/id1504877473), Croma, JustUseApp | Free + ~$1.99/mo Premium; missed reminders, slow support |
| 2026-10-24 | Indirect alternatives | [Airtable template](https://www.airtable.com/templates/roommate-house-management/expX0kSO1OdA4swiU), Uniplaces, Greystar | Spreadsheets and charts used; no WhatsApp-specific data found |
| 2026-10-24 | Assumption validation: gamification | [NTNU thesis](https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/3068083), [IFIP 2015](https://dl.ifip.org/IFIP-LNCS-9353/hal-01758462), [SciTePress 2020](https://www.scitepress.org/Papers/2020/93401) | No long-term evidence that points work for adult chores |
| 2026-10-24 | Market signals | [NAHB](https://eyeonhousing.org/2025/04/house-sharing-is-not-just-for-young-adults/), [UMich](https://sites.lsa.umich.edu/mje/2026/01/11/inflation-housing-affordability-and-the-reshaping-of-young-adult-independence/) | 6.8M US shared households in 2023; affordability-driven |
| 2026-10-24 | Landscape scan | [Homio](https://alternativeto.net/software/homio/?p=3), [ChoreChamp](https://mwm.ai/apps/cleaning-games-chorechamp/6751862451), [Roomies](https://apps.apple.com/us/app/-/id6753794415), [OurFlat](https://apps.apple.com/us/app/-/id1530007409), [HomeCo](https://hunted.space/product/homeco), [Jhozy](https://www.producthunt.com/products/jhozy) | Crowded space. Chores + shopping list + points already exist (Homio, ChoreChamp, Nipto). Flatastic, Roomies and OurFlat cover rota and lists without clear gamification. OurHome is family-focused and possibly abandoned (unverified). Pricing and ratings not verified. |
