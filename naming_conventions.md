# Naming Conventions

Claude: Read this before generating UI components, API code, database migrations or tests.

## UI Foundations

Accessibility: WCAG AA (contrast, tap targets of at least 44x44 px, labels for screen readers)
Reference site: none specified
Component library: Tailwind CSS + shadcn/ui
Color scheme: light and dark, following the phone setting (colors defined as design tokens)
Language: Italian only. Every user-facing string comes from the central text file (`src/i18n/it.ts`). NOT hard-coded in components.
Layout: phone-first, usable on larger screens

## REQUIRED: Test IDs

Use `data-testid` in lowercase kebab-case: `{feature}-{element}[-{id}]`. Test IDs are English, never translated.

```tsx
<button data-testid="occurrence-done-button">...</button>
<li data-testid={`occurrence-card-${occurrence.id}`}>...</li>
<select data-testid="grade-select">...</select>
<div data-testid="scoreboard-row-{memberId}">...</div>
<input data-testid="shopping-item-name-input" />
<button data-testid="shopping-item-claim-button">...</button>
<button data-testid="invite-code-copy-button">...</button>
```

NOT: `data-testid="DoneButton"`, `data-testid="done_button"`, Italian text in test IDs, or selecting by visible text in tests.

## REQUIRED: Modal Props

```ts
interface ModalProps {
  open: boolean;
  onClose: () => void;          // always onClose
  onSubmit: (data: T) => void;  // always onSubmit, when the modal submits data
}
```

NOT: `onCancel`, `onDismiss`, `handleClose`, `onSave`, `onConfirm` as prop names.

## REQUIRED: Error State

```ts
const [error, setError] = useState<string | null>(null);              // general error
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // per-field
```

NOT: `errorMessage`, `err`, `errors` (for the general error), `formErrors`.

Error messages shown to the user come from the central Italian text file.

## REQUIRED: Date and Timestamp Fields

| Meaning | Pattern | Example |
|---------|---------|---------|
| A point in time (full timestamp) | `*At` (TS), `*_at` (DB) | `completedAt`, `completed_at` |
| A calendar day (no time) | `*Date` (TS), `*_date` (DB) | `dueDate`, `due_date` |

NOT: `completedDate` for a timestamp, `due_at` for a calendar day, `date` or `time` alone.

All times are stored in UTC. The house has one time zone setting (`timeZone`) used to decide day boundaries.

## Naming Patterns

| Item | Pattern | Example |
|------|---------|---------|
| React component | PascalCase | `OccurrenceCard` |
| Component file | PascalCase, `.tsx` | `OccurrenceCard.tsx` |
| shadcn/ui component file (exception) | lowercase, in `src/components/ui/` | `button.tsx` (component itself is still PascalCase: `Button`) |
| Hook | `use` prefix, camelCase | `useOccurrences` |
| Hook file | camelCase | `useOccurrences.ts` |
| Pure rules function | camelCase verb phrase | `calculatePoints`, `nextAssignee` |
| Rules module file | camelCase, in `src/shared/rules/` | `points.ts` |
| Constant | UPPER_SNAKE_CASE | `DEFAULT_GRADE_MULTIPLIERS` |
| TS type / interface | PascalCase, no `I` prefix | `Occurrence`, `GradeMultipliers` |
| TS variable / property | camelCase | `dueDate`, `weight` |
| DB table | snake_case, plural | `occurrences`, `away_periods` |
| DB column | snake_case | `house_id`, `graded_at` |
| DB enum value | lowercase snake_case | `poorly_done`, `not_done` |
| Foreign key | `{singular_table}_id` | `member_id`, `chore_id` |
| Migration file | `YYYYMMDDHHMMSS_description.sql` | `20261101120000_create_houses.sql` |
| Scheduled job / Edge Function | kebab-case | `create-occurrences`, `auto-grade` |
| Test file (unit) | `*.test.ts(x)` next to the code | `points.test.ts` |
| Property test | `*.property.test.ts` | `points.property.test.ts` |
| E2E test | `*.spec.ts` in `e2e/` | `complete-chore.spec.ts` |
| Event handler prop | `on` + Event | `onSubmit`, `onClaim` |
| Event handler function | `handle` + Event | `handleClaim` |
| Boolean | `is`, `has`, `can` prefix | `isAway`, `hasPhoto` |
| Env variable (client) | `VITE_` prefix, UPPER_SNAKE_CASE | `VITE_SUPABASE_URL` |

Grade names in code (English, used across TS and DB): `perfect`, `good`, `done`, `poorly_done`, `bad`, `not_done`. Italian labels come only from the text file.

NOT: Italian identifiers in code, mixing `camelCase` into DB columns, or `snake_case` into TS properties (convert at the data-access boundary).

## Toolset-Enforced (No Action Needed)

| Convention | Enforced by |
|------------|-------------|
| Code formatting | Prettier |
| Lint rules and unused variables | ESLint |
| TypeScript strictness | `tsc` with `strict` enabled |
| Import sorting | ESLint |
| Test file discovery (`*.test.ts(x)`) | Vitest |
| E2E test discovery (`*.spec.ts`) | Playwright config |
| Line endings (LF) | `.gitattributes` |
| Row access per house | Supabase row-level security |
