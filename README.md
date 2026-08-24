# Patch Notes

A single-page video game collection diary. Catalog physical and digital titles, track their
status (Not Started / In Progress / Completed / Dropped), and jot a short note per game — all
persisted to `localStorage`, no backend, no login.

## Stack

React 19 + TypeScript (strict) + Vite + Tailwind CSS v4, tested with Vitest + React Testing
Library. No router, no state library, no UI kit — the collection is small enough that a single
hook and a few pure functions cover it.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm test           # run the test suite
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## Project structure

```
src/
  components/   GameCard, GameModal, SummaryBar, FilterSidebar, ErrorBoundary
  hooks/        useGames — the one stateful seam: owns the collection and every localStorage write
  lib/          storage (load/save + validation), filters (query/filter/count), seed data
  types.ts      Game, Filters, and the Platform/Format/Status union types
  icons.tsx     inline SVG icons
  App.tsx       layout and wiring
  main.tsx      mounts <App> inside <ErrorBoundary>
  *.test.ts(x)  logic.test.ts (pure filter/storage logic), app.test.tsx (component flows),
                ErrorBoundary.test.tsx
```

`storage.ts` and `filters.ts` are pure functions over plain data, so the collection logic is
tested without rendering anything. `useGames` is the only place state is mutated or written to
`localStorage` — components never touch storage directly.

**Error handling:** `storage.ts` treats `localStorage` as untrusted — corrupt JSON, a non-array
value, or entries with an invalid `status`/`platform`/`format` are dropped rather than crashing
or getting coerced, and a failed write (quota, private mode) degrades to in-memory-only. The
add/edit form rejects a blank title inline before it ever reaches storage. `ErrorBoundary` wraps
the whole app as the last line of defense — if something still throws, it shows a reload prompt
instead of a blank page; the collection itself is untouched since it already lives in
`localStorage`.

## Design

Visual design follows the "High-Tech Archivist" system — dark glassmorphic surfaces,
Electric Purple / Neon Cyan accents, Sora + Hanken Grotesk type.

## Size budget

The challenge caps scored commits at 40KB of raw source (markdown and images excluded). Current
source (`index.html` + `src/**` + config files) is **~38KB**, checked with:

```bash
find src index.html vite.config.ts tsconfig.json package.json -type f | xargs wc -c | tail -1
```
