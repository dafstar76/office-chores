# Office Chore Manager

A calendar-based task management app for scheduling and tracking office chores. Fully client-side — no backend, no auth, all data persisted in browser LocalStorage.

## Tech Stack

- **React 19** (function components + hooks only, no class components)
- **Vite 7** — dev server and build tool
- **date-fns 4** — all date manipulation
- **Pure CSS** — Fluent-inspired design system via CSS custom properties
- **ESLint 9** — flat config format
- **ES Modules** throughout (`"type": "module"`)

## Project Structure

```
src/
├── components/          # React components (Calendar, ChoreModal, Sidebar, etc.)
├── hooks/               # Custom hooks (useChores — the main state container)
├── utils/               # Helpers (calendarHelpers — date grid builders, categories, recurrence)
├── App.jsx              # Root component, orchestrates state and layout
├── App.css              # All styles + CSS custom properties design system
└── main.jsx             # Entry point, renders <App /> in StrictMode
```

- `public/` — static assets served by Vite
- `dist/` — production build output (base path: `/office-chores/` for GitHub Pages)

## Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useChores.js` | Central state: CRUD operations, LocalStorage persistence, category filtering |
| `src/utils/calendarHelpers.js` | Date grid generation, navigation, category config, recurrence expansion |
| `src/components/Calendar.jsx` | View switcher (Month/Week/Day) with chore expansion |
| `src/components/ChoreModal.jsx` | Create/edit form with controlled inputs |
| `src/App.jsx` | Root layout, all top-level state and memoized callbacks |
| `vite.config.js` | Vite + React plugin, base path config |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

No test framework is configured.

## Data Model

Chore objects (defined in `src/components/ChoreModal.jsx:4-14`):

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Generated: `Date.now().toString(36) + random` |
| `title` | string | Required |
| `assignee` | string | Free text, not tied to user accounts |
| `date` | string | Format: `yyyy-MM-dd` |
| `startTime` / `endTime` | string | Format: `HH:mm` |
| `category` | string | One of: cleaning, kitchen, supplies, maintenance, other |
| `recurrence` | string | One of: none, daily, weekly, monthly |
| `completed` | boolean | Default: false |
| `notes` | string | Optional |

## Categories

Defined in `src/utils/calendarHelpers.js:20-26`. Each has a `label` and `color`. Used for filtering (Sidebar), display (ChoreItem), and form options (ChoreModal).

## Important Conventions

- All event handlers in App.jsx are wrapped in `useCallback` with correct dependency arrays
- Filtered chores use `useMemo` in useChores hook
- `e.stopPropagation()` is used on nested clickable elements (ChoreItem, ChoreModal overlay)
- No routing library — views managed via `view` state in App.jsx
- LocalStorage key: `'office-chores-data'` (`src/hooks/useChores.js:3`)

## Additional Documentation

Check these files for deeper context on specific topics:

- [Architectural Patterns](.claude/docs/architectural_patterns.md) — design decisions, component patterns, state management approach, recurring patterns across files
