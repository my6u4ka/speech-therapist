---

description: "Task list for the Game Portal feature"
---

# Tasks: Game Portal

**Input**: Design documents from `/specs/001-game-portal/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: no automated tests. The spec does not request them, and research R7 chose manual
checks. Verification is the [quickstart.md](quickstart.md) scenarios, run in the Polish phase.

**Organization**: tasks are grouped by user story so each story can be implemented and checked
on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: the user story the task belongs to (US1, US2)
- Paths are relative to the repository root (static site at root, per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: prepare the repository to be served as a static site.

- [x] T001 Create an empty `.nojekyll` file at the repository root, so GitHub Pages serves files
  as-is and does not hide `games/_template/` (research R8)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: a game page that tiles can open, needed to check both stories.

- [x] T002 [P] Create `games/_template/index.html`: a minimal game page with
  `<html lang="bg">`, `<meta charset="utf-8">`,
  `<meta name="viewport" content="width=device-width, initial-scale=1">`, the title
  `Шаблон за игра`, a heading `Шаблон за игра`, and an HTML comment (in English) explaining that
  new games start by copying this folder to `games/<id>/` (contract game-entry.md, "Adding a
  game")
- [x] T003 [P] Create `games/_template/cover.svg`: a square (viewBox 0 0 512 512), simple,
  friendly placeholder picture, "at most 100 KB" (research R9), with no text inside the picture

**Checkpoint**: there is a page to open; the user stories can start.

---

## Phase 3: User Story 1 - Choose and open a game (Priority: P1) 🎯 MVP

**Goal**: the start page shows every game as a tile with only a large picture and its Bulgarian
name; one tap opens the game.

**Independent Test**: with one entry in `games.js`, open `index.html`, tap the tile, and check that
the game opens in the same window (quickstart scenarios 1–4, 7, 8, 10–13).

### Implementation for User Story 1

- [ ] T004 [P] [US1] Create `games.js` that defines `window.GAMES = [];` with a header comment
  (in English) copying the field rules from data-model.md verbatim:
  - `id`: lowercase Latin letters, digits, and hyphens (`^[a-z0-9-]+$`); unique; equals the
    folder name under `games/`; never starts with `_`.
  - `name`: Bulgarian, at most 24 characters.
  - `image`: a relative path inside the game's folder; square; at least 512×512 px; at most
    100 KB; WebP, SVG, or PNG.
  - `href`: optional; defaults to `games/<id>/`; must point inside this site, with no `http://`,
    `https://`, or `//`.
  - The order in the file is the order of tiles.
- [ ] T005 [P] [US1] Create `assets/portal/portal.css`:
  - colors as CSS custom properties on `:root`, with high contrast, and `body` given an explicit
    background;
  - the font stack `system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (R6);
  - a 16 px page gutter and a tile grid of `repeat(auto-fill, minmax(140px, 1fr))` (R5);
  - square pictures (`aspect-ratio: 1`, `object-fit: cover`) and names of at least `1.4rem`,
    centered below the picture;
  - large rounded tiles with a visible `:focus-visible` outline and a pressed state;
  - `overflow-x: hidden` safety, so there is no sideways scrolling at 360 px (SC-004);
  - a `.tile--no-image` style that shows the name alone, larger, when the picture fails (R4).
- [ ] T006 [US1] Create `index.html` (the portal, FR-001):
  - `<html lang="bg">`, charset and viewport metas, and the title and page heading `Игри с думи`
    (the owner approves the wording);
  - load `assets/portal/portal.css`, then `games.js` and `assets/portal/portal.js` as plain
    `<script defer>` (no modules), all with relative paths;
  - an empty tile container (`<main id="games">`);
  - a `<noscript>` message in Bulgarian asking to turn on JavaScript;
  - no other content, links, or choices before the tiles (FR-002, FR-005).
- [ ] T007 [US1] Create `assets/portal/portal.js`, which reads `window.GAMES` and renders one tile
  per valid entry, in file order:
  - each tile is an `<a class="tile" href="...">` (R2) containing
    `<img src="..." alt="" width="512" height="512" loading="lazy">` and
    `<span class="tile-name">`, with text set through `textContent` only (never `innerHTML`);
  - `href` defaults to `games/<id>/`;
  - validate each entry against data-model.md and skip invalid ones with `console.warn`: `id`
    matches `^[a-z0-9-]+$`, is unique, and does not start with `_`; `name` is non-empty and at
    most 24 characters; `image` is non-empty; `href`/`image` must not start with `http:`,
    `https:`, `//`, or `javascript:`;
  - on an image `error` event, remove the image and add `tile--no-image` to the tile (R4);
  - if `window.GAMES` is missing or not an array, render nothing and warn;
  - store nothing and make no network requests of its own (FR-008).
- [ ] T008 [US1] Add the temporary test entry from quickstart.md to `games.js`:
  `{ id: "test-game", name: "Проба", image: "games/_template/cover.svg", href: "games/_template/" }`
  (removed in T015)
- [ ] T009 [P] [US1] Create `404.html`: `lang="bg"`, a friendly Bulgarian message that this game
  could not be found (e.g. `Опа! Тази игра не е тук.`), and a link back to the portal at the
  absolute path `/speech-therapist/`. Styles are inline in the page, because Pages serves it at
  any depth (contract home-control.md); no technical error text.

**Checkpoint**: User Story 1 works on its own. Opening `index.html` shows the "Проба" tile, and
tapping it opens the template game.

---

## Phase 4: User Story 2 - Return to the portal from any game (Priority: P2)

**Goal**: every game shows the same home control at the top-left, and it returns to the portal.

**Independent Test**: open `games/_template/index.html`, check the control at the top-left, tap it,
and check that the portal opens (quickstart scenarios 5, 6, 9).

### Implementation for User Story 2

- [ ] T010 [P] [US2] Create `assets/home/home.svg`: a simple, bold house icon in a square viewBox,
  readable at 40 px, using `currentColor` or a high-contrast fill
- [ ] T011 [P] [US2] Create `assets/home/home.css` per contract home-control.md:
  - `.home-control` fixed at the top-left, above the game content (high `z-index`);
  - a tap area of at least 64×64 px, the icon centered, a high-contrast background, and rounded
    corners;
  - a visible `:focus-visible` outline;
  - stays visible while the page scrolls.
- [ ] T012 [US2] Add the home control to `games/_template/index.html` exactly as in contract
  home-control.md: `<link rel="stylesheet" href="../../assets/home/home.css">` and
  `<a class="home-control" href="../../" aria-label="Начало"><img src="../../assets/home/home.svg" alt=""></a>`
  as the first element in `<body>`. Add an HTML comment saying that games MUST NOT cover the
  top-left 80×80 px area.
- [ ] T013 [US2] Add the home control to `404.html` with absolute paths:
  `<link rel="stylesheet" href="/speech-therapist/assets/home/home.css">` and
  `<a class="home-control" href="/speech-therapist/" aria-label="Начало">` with
  `/speech-therapist/assets/home/home.svg` (contract home-control.md)

**Checkpoint**: both stories work. The portal opens the template game, and the template game's
home control returns to the portal.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T014 Run quickstart.md scenarios 1–8 and 10–13 in two browsers (Chrome or Edge, plus
  Firefox or Safari) at 360 px, tablet landscape, and desktop widths. Record any failure and fix
  it before continuing. Scenario 9 needs the published site and is checked after the first
  release.
- [ ] T015 Remove the temporary `test-game` entry from `games.js`, leaving `window.GAMES = [];`
  (spec: no "coming soon" tiles; quickstart: test data must not be merged)
- [ ] T016 [P] Create `README.md` (in English): what the project is, the live URL
  `https://my6u4ka.github.io/speech-therapist/`, how to open it locally (double-click
  `index.html`), how to add a game (link to `specs/001-game-portal/contracts/game-entry.md`), and
  the git flow and Spec Kit workflow (link to `.specify/memory/constitution.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: after Setup. It blocks both stories, which need a page to open.
- **US1 (Phase 3)** and **US2 (Phase 4)**: both start after Foundational and are independent of
  each other. US2 is checked by opening the template directly, and US1 needs no home control.
- **Polish (Phase 5)**: after both stories. T014 must finish before T015.

### Within Each User Story

- US1: T004, T005, and T009 in parallel → T006 → T007 → T008.
- US2: T010 and T011 in parallel → T012 and T013 (different files, so they can also run in
  parallel once T010 and T011 are done).

### Parallel Opportunities

- T002 and T003.
- T004, T005, and T009.
- T010 and T011, and then T012 and T013.
- T016 alongside T014.

---

## Parallel Example: User Story 1

```text
Task: "Create games.js with window.GAMES = [] and field-rule header comment"
Task: "Create assets/portal/portal.css (grid, tiles, font stack, no-image state)"
Task: "Create 404.html with friendly Bulgarian message and absolute link to /speech-therapist/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 (T001) and Phase 2 (T002–T003).
2. Phase 3 (T004–T009).
3. **Stop and check**: quickstart scenarios 1–4, 7, 8, and 10–13.

### Incremental Delivery

1. MVP as above.
2. Add US2 (T010–T013) and check scenarios 5 and 6.
3. Polish (T014–T016), then merge `feature/001-game-portal` into `develop` with `--no-ff`.
4. The portal is released to `main` only together with the first real game (spec: Assumptions).

---

## Notes

- 16 tasks: Setup 1, Foundational 2, US1 6, US2 4, Polish 3.
- Commit after each phase on `feature/001-game-portal`.
- The page title `Игри с думи` and the 404 wording are content: the owner approves them
  (Principle II).
