# PRD — Patch Notes: Video Game Collection Diary

## Context

Vibe coding challenge submission. [docs/brief.md](docs/brief.md) asks for a single-page personal
game collection catalog: add/edit/delete games, see counts by status, persist in localStorage,
no backend. [docs/rules.md](docs/rules.md) caps the scored commit at **40KB of raw source**
(markdown and images excluded, zip size irrelevant) — oversized commits are not scored.

A complete design system already exists in [design/](design/): a token spec
([design/patch_notes/DESIGN.md](design/patch_notes/DESIGN.md)) plus two rendered mockups
(dashboard + add-game modal) with full HTML. The deliverable must look like those mockups.

Outcome: a React + Vite + TypeScript SPA that matches the mockups, does full CRUD on a
localStorage-backed collection, is organized into typed modules with a real test suite, and
ships under the byte cap.

---

## 1. Product

**Name:** Patch Notes
**Users:** gamers cataloging physical + digital titles across platforms and tracking play status.
**Value:** one glanceable screen for "what do I own, what am I playing, what did I finish."
**Non-goals:** accounts, sync, cover art upload/fetch, ratings, playtime tracking, IGDB import,
multi-device. No backend, no login — explicitly out of scope per brief.

---

## 2. Domain model & type definitions

One entity. Types live in `src/types.ts` and are the contract every other module imports.

```ts
export const PLATFORMS = ['PC', 'PlayStation 5', 'Nintendo Switch', 'Xbox Series X'] as const;
export const FORMATS   = ['Digital', 'Physical'] as const;
export const STATUSES  = ['Not Started', 'In Progress', 'Completed', 'Dropped'] as const;

export type Platform = typeof PLATFORMS[number];
export type Format   = typeof FORMATS[number];
export type Status   = typeof STATUSES[number];

export interface Game {
  id: string;
  title: string;      // trimmed, 1..80
  platform: Platform;
  format: Format;
  status: Status;
  note: string;       // 0..280, '' when absent
}

export type GameDraft = Omit<Game, 'id'>;          // what the modal produces
export type StatusCounts = Record<Status, number>; // what the summary bar consumes

export interface Filters {
  query: string;
  platforms: Platform[];
  statuses: Status[];
}
```

The `as const` arrays serve double duty: they are the union sources **and** the values the
selects/checkboxes render from. One declaration, no drift between type and UI. A typo like
`'Complete'` fails to compile.

`tsconfig` runs `strict: true`. No `any` in source; casts are confined to the storage parse
boundary (§3) where untrusted data legitimately enters.

**Short platform labels** for the card badge (`PS5`, `Switch`, `Xbox Series X`, `PC`) come from a
`Record<Platform, string>` in `types.ts` — exhaustive by construction, so adding a platform later
is a compile error until the label exists.

---

## 3. Modules

Nine source modules with one job each. The split is by *responsibility*, not by file-count
aesthetics — logic modules are pure and testable without a DOM, components stay presentational.

| Module | Responsibility | Exports |
|---|---|---|
| `src/types.ts` | Domain types, const arrays, platform labels | types + constants above |
| `src/storage.ts` | localStorage read/write, validation of untrusted data | `loadGames()`, `saveGames(games)` |
| `src/filters.ts` | Pure query/filter/count logic | `filterGames(games, filters)`, `countByStatus(games)` |
| `src/useGames.ts` | Hook: state + persistence + CRUD, the only stateful seam | `useGames()` → `{ games, addGame, updateGame, deleteGame }` |
| `src/App.tsx` | Layout, filter state, wiring | default |
| `src/SummaryBar.tsx` | Four status tiles | `<SummaryBar counts>` |
| `src/FilterSidebar.tsx` | Platform/status checkbox groups | `<FilterSidebar filters onChange>` |
| `src/GameCard.tsx` | One card + edit/delete buttons | `<GameCard game onEdit onDelete>` |
| `src/GameModal.tsx` | Add/edit form + validation | `<GameModal game onSave onClose>` |
| `src/icons.tsx` | Inline SVG icon components | named icons |
| `src/index.css` | `@import "tailwindcss"`, `@theme` tokens, glass/hover/pulse classes | — |

**Why these boundaries:** `filters.ts` and `storage.ts` are pure functions over plain data, so
the interesting logic is testable without rendering anything. `useGames` isolates every mutation
and every localStorage write behind one hook — components never touch storage directly, which is
what makes the persistence contract enforceable in one place.

**Persistence contract** (`storage.ts`):
- Key `patch-notes:games`. Read once on mount; write the whole array on each mutation.
- `loadGames()` wraps parse in try/catch: absent, non-JSON, or non-array → `[]`.
- Each entry is validated field-by-field; entries with a missing/invalid `title`, `platform`,
  `format`, or `status` are **dropped**, not coerced. This is the one place untrusted data
  crosses into typed territory, so the cast happens here and nowhere else.
- `saveGames()` wraps in try/catch: a quota or private-mode failure must not break the UI.

---

## 4. Features

### P0 — required

| # | Feature | Acceptance criteria |
|---|---------|---------------------|
| F1 | **Add game** | "Add Game" in the top bar opens the modal from [design/add_game_modal_no_upload/screen.png](design/add_game_modal_no_upload/screen.png). Fields: title, platform select, format segmented toggle, status select, notes textarea. Save appends and closes; empty/whitespace title blocks save with an inline error. |
| F2 | **Edit game** | Pencil icon on a card opens the same modal pre-filled, titled "Edit Game". Save updates in place, keeps `id` and list position. |
| F3 | **Delete game** | Trash icon on a card. Confirm before removing (native `confirm()` is acceptable). Removal is immediate and persisted. |
| F4 | **Card list** | Responsive grid — 1 / 2 / 3 columns at mobile / sm / lg. Each card: platform badge, status pill, title, format label, note (3-line clamp, italic "No notes yet." when empty). Dropped cards render the title struck-through and dimmed, per mockup. |
| F5 | **Summary bar** | Four tiles — Not Started, In Progress, Completed, Dropped — each with count, left accent border, status color. Counts come from `countByStatus` over the **full** collection, not the filtered view. |
| F6 | **Persistence** | State survives refresh. First visit with no stored data seeds ~5 sample games matching the mockup content, so the app never opens empty. |
| F7 | **Search** | Top-bar input filters cards by title substring, case-insensitive. |
| F8 | **Filters** | Sidebar checkbox groups for Platform and Status. Within a group: OR. Across groups: AND. Empty group = no constraint. Combines with search. |
| F9 | **Empty state** | When filters/search match nothing, show a centered message with a "Clear filters" action instead of a bare grid. |

### P1 — only if the byte budget allows
Sort control, note character counter, delete-undo toast. **Cut these first** if source approaches
the cap.

---

## 5. Automated tests

Vitest + React Testing Library + jsdom. Two spec files — logic and UI — mirroring the module
split. `npm test` runs them; they must pass before the commit.

**`src/logic.test.ts`** — pure, no DOM:
- `countByStatus` returns zeros for an empty collection and correct tallies for a mixed one.
- `filterGames`: query matches case-insensitively on a substring; empty query matches all.
- `filterGames`: platform OR within group; status OR within group; platform AND status across
  groups; all-empty filters return the input unchanged.
- `loadGames` returns `[]` for absent key, for `'garbage'`, and for a JSON object that isn't an
  array — the three ways real storage goes bad.
- `loadGames` drops an entry with an invalid `status` while keeping valid siblings alongside it.
- `saveGames` → `loadGames` round-trips a collection intact.

**`src/app.test.tsx`** — component level, storage cleared between tests:
- Add flow: open modal, fill title, save → card appears and the matching summary count increments.
- Validation: save with a whitespace-only title → error shown, modal stays open, no card added.
- Edit flow: open a card's edit, change status, save → card reflects it, collection length unchanged.
- Delete flow: stub `confirm` true → card removed and count decrements.
- Filter flow: check a status → non-matching cards disappear; no match → empty state renders.

Deliberately **not** tested: exact Tailwind class strings, hover/pulse animation, icon SVG paths.
Those are verified by eye against the mockups (§8) — asserting on class names tests the
stylesheet, not the behavior, and breaks on every design tweak.

---

## 6. Design compliance

Source of truth: [design/patch_notes/DESIGN.md](design/patch_notes/DESIGN.md) frontmatter tokens
and the two `code.html` files. Non-negotiable:

- **Palette:** `background #131313`, `primary #ddb7ff`, `secondary #4cd7f6`, `tertiary #4edea3`,
  `error #ffb4ab`, surface-container ladder as specced.
- **Status colors:** Not Started → `outline`, In Progress → `secondary`, Completed → `tertiary`,
  Dropped → `error`. Same mapping in summary tile, card pill, and sidebar checkbox — defined once
  as a `Record<Status, string>` beside the platform labels.
- **Type:** Sora (600/700) for headings and numerals, Hanken Grotesk (400/500/600) for body and
  labels. Labels uppercase with `0.05em` tracking.
- **Glassmorphism:** `.glass-panel` = `rgba(28,27,27,.6)` + `backdrop-filter: blur(16px)` +
  `1px solid rgba(255,255,255,.05)`. Used on sidebar, summary tiles, cards, modal.
- **Shape:** 8px inputs/buttons, 16px cards/panels, full-round status pills and top-bar controls.
- **Motion:** card hover lifts `-2px` with a primary-tinted glow and primary border; In Progress
  gets the 2s pulse dot in both the summary tile and the card pill.
- **Fixed top nav**, glass background, "Patch Notes" in `display-lg` primary, search + Add Game
  right-aligned.

**Icons:** the mockups use the Material Symbols webfont. Inline SVG paths instead (`edit`,
`delete`, `search`, `close`, plus four summary glyphs) in `icons.tsx` — a webfont request for six
glyphs is not worth the dependency.

---

## 7. Technical constraints

- **Stack:** React 19 + Vite + TypeScript (strict) + Tailwind CSS v4 via `@tailwindcss/vite`.
  Vitest + RTL + jsdom for tests. No router, no state library, no form library, no UI kit.
- **Tailwind v4 has no `tailwind.config.js`** — the mockups' token config is ported into an
  `@theme` block in `src/index.css`. This is the one mechanical translation between mockup and
  app; do it once, verify against the screenshot, then leave it alone.
- **Fonts:** Google Fonts `<link>` in `index.html` for Sora + Hanken Grotesk. Network font is
  fine here (it is the design's identity); the icon webfont is not.
- **State:** `useGames` owns the collection; `App` owns filter state. No context, no reducer, no
  memoization until something is measurably slow.
- **Byte budget (hard):** raw source = `index.html` + `src/**` + `vite.config.ts` + `tsconfig.json`
  + `package.json`. Target **≤ 30KB**, cap 40KB. `node_modules`, lockfile, build output excluded.
  Check before committing:
  `find src index.html vite.config.ts tsconfig.json package.json -type f | xargs wc -c | tail -1`
  Over 30KB → drop P1. Over 40KB → the commit is not scored.

**File layout:**

```
index.html            font links, root div
vite.config.ts        react + tailwind + vitest config (one file, not two)
tsconfig.json
package.json
src/main.tsx          mount
src/index.css         @import tailwind; @theme tokens; glass/hover/pulse
src/types.ts          §2
src/storage.ts        load/save + validation
src/filters.ts        filterGames, countByStatus
src/useGames.ts       state + CRUD hook
src/App.tsx           layout, filter state, wiring
src/SummaryBar.tsx    src/FilterSidebar.tsx    src/GameCard.tsx    src/GameModal.tsx
src/icons.tsx
src/logic.test.ts     src/app.test.tsx
```

Vitest config goes in `vite.config.ts` via the `test` field — a separate `vitest.config.ts` is a
second file holding four lines.

---

## 8. Accessibility

Not optional, not P1:
- Icon-only buttons get `aria-label` ("Edit Elden Ring", "Delete Elden Ring") — which is also how
  the component tests find them, so a11y and testability come from the same change.
- Modal: `role="dialog"` + `aria-modal="true"`, focus moves to the title input on open, Escape
  closes, backdrop click closes.
- Every form control has a real `<label>` bound by `htmlFor`/`id`.
- Focus states stay visible — no `outline-none` without a replacement ring.
- Edit/delete buttons are always in the DOM and focusable (the mockup's always-visible variant,
  not the `opacity-0` one) so keyboard users can reach them.

---

## 9. Verification

1. `npm run dev` → app loads seeded with sample games, no console errors.
2. `npm test` → all specs in §5 pass.
3. `npx tsc --noEmit` → zero type errors under strict mode.
4. **CRUD by hand:** add → card appears, count increments. Edit → updates in place. Delete →
   confirm, gone, count decrements.
5. **Persistence:** hard refresh → changes survive. Then set
   `localStorage['patch-notes:games'] = 'garbage'` in DevTools and reload → empty state, no crash.
6. **Filters:** "PC" + "In Progress" → only PC in-progress cards; search narrows further; uncheck
   all → full list; no-match combination → empty state with a working "Clear filters".
7. **Design:** open [design/patch_notes_dashboard/screen.png](design/patch_notes_dashboard/screen.png)
   side by side with the app at ~1600px. Colors, type scale, spacing, badge shapes, hover glow
   should match. Repeat for the modal screenshot.
8. **Responsive:** 375px → single column, sidebar stacks above grid, no horizontal scroll.
9. **Keyboard:** tab through everything — all controls reachable, focus visible, Escape closes
   the modal.
10. **Byte check:** run the `wc -c` command from §7 → under 40KB. Record the number in the commit
    message.

---

## 10. Definition of done

All P0 acceptance criteria pass, verification steps 1–10 pass, `tsc --noEmit` and `npm test` are
clean, source is under the cap, and the app visually matches both mockups. P1 items are
explicitly cut, not half-built.
