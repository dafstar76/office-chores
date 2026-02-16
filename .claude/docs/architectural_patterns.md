# Architectural Patterns

## State Architecture: Custom Hook as State Container

The app uses a single custom hook (`src/hooks/useChores.js`) as the central state manager instead of Redux/Zustand/Context. This works because the component tree is shallow (max 3 levels deep).

**Pattern**: Hook returns state + operations, consumed at App level, props drilled one level down.

- State initialization from LocalStorage: `useChores.js:3-16`
- Auto-save via `useEffect`: `useChores.js:28-30`
- Memoized derived state (filtered chores): `useChores.js:61-64`
- App-level consumption: `App.jsx:17-24`

**Why no Context**: The component hierarchy is flat enough that prop passing is simpler and more explicit than Context.

## Component Composition: Flat Hierarchy with Prop Delegation

All components are one level below App. App.jsx acts as the sole orchestrator:

```
App (state owner)
├── CalendarHeader (navigation, view switching)
├── Sidebar (category filters, mini calendar)
├── Calendar (view rendering)
│   ├── MonthView / WeekView / DayView (internal)
└── ChoreModal (create/edit overlay)
```

**Pattern**: App.jsx defines all callbacks (`lines 26-71`), passes them as props. No component manages state that affects siblings — all coordination goes through App.

## View Switching Without a Router

Instead of React Router, views are managed via a `view` state variable (`App.jsx:13`). The Calendar component conditionally renders the appropriate view (`Calendar.jsx:161-167`).

**Rationale**: Single-page app with no deep-linking needs. Three views (month/week/day) are calendar perspectives, not separate pages.

## Recurring Chore Expansion

Chores are stored as single records with a `recurrence` field. At render time, `generateRecurrences()` (`calendarHelpers.js:73-99`) expands them into multiple instances within the visible date range.

**Pattern used in all three views**: `Calendar.jsx:18-24` — `expandChores()` wraps `generateRecurrences()` and is called in MonthView (line 30), WeekView (line 70), DayView (line 113).

Each generated instance gets a `_recurringParentId` linking back to the source chore, so edits/deletes target the original.

## Controlled Form with Generic Updater

`ChoreModal.jsx` uses a single state object for all form fields (`lines 4-14`) with one generic change handler (`lines 17-39`):

```js
function handleChange(field, value) {
  setForm((prev) => ({ ...prev, [field]: value }));
}
```

This avoids N separate `useState` calls or N specific handlers. The form resets to `EMPTY_CHORE` on open, or populates from the editing chore.

## Category Configuration as Shared Constant

`CATEGORIES` object (`calendarHelpers.js:20-26`) is the single source of truth for category metadata. Consumed by:

- `ChoreItem.jsx:1` — color-coded display
- `ChoreModal.jsx:2` — form dropdown options
- `Sidebar.jsx:15` — filter checkboxes

Adding a new category means adding one entry here; all consumers adapt automatically.

## Performance: Memoization Strategy

Two layers of memoization prevent unnecessary re-renders:

1. **useCallback** on all App.jsx handlers (`lines 26-71`) — prevents child re-renders when parent state changes
2. **useMemo** for filtered chores (`useChores.js:61-64`) — avoids recomputing on every render

This is effective because all components receive stable function references via props.

## Event Propagation Control

Nested clickable elements consistently use `e.stopPropagation()`:

- `ChoreItem.jsx:10` — chore pill inside a clickable day cell
- `ChoreModal.jsx:42-43` — modal content inside dismissible overlay

This prevents day-click handlers from firing when clicking a chore, and prevents modal-close when clicking inside the modal.

## CSS Design System

`App.css:8-27` defines CSS custom properties (variables) for the entire color palette, spacing, and layout dimensions. All components reference these variables — no hardcoded colors.

Key variables: `--blue`, `--sidebar-width`, `--header-height`, plus a full grayscale ramp (`--gray-50` through `--gray-900`).

## LocalStorage Persistence

`useChores.js:3-16` handles load/save:

- **Load**: `loadChores()` reads from `'office-chores-data'`, returns empty array on failure
- **Save**: `useEffect` writes to LocalStorage whenever `chores` state changes
- **No versioning or migration** — the stored format matches the current chore object shape directly

## ID Generation

`useChores.js:19`: `Date.now().toString(36) + Math.random().toString(36).slice(2, 7)`

Produces compact, collision-resistant IDs without a UUID library. Sufficient for a single-user LocalStorage app.
