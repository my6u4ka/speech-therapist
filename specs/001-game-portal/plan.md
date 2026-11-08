# Implementation Plan: Game Portal

**Branch**: `feature/001-game-portal` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-game-portal/spec.md`

## Summary

The portal is the site's start page. It shows every game in this site as a tile with only a
large picture and a Bulgarian name; one tap opens the game. Every game has a home control in the
same place that returns to the portal.

Technical approach: a plain static page (HTML, CSS, a little JavaScript) at the repository root,
served by GitHub Pages from `main`. The list of games is a separate data file (`games.js`) that a
small script renders into tiles, so adding a game means adding one entry there. The home control
is a small shared stylesheet and icon that every game includes. There is no build step, no
framework, no external request, and nothing is stored on the device.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020, no modules needed), as supported by
current evergreen browsers

**Primary Dependencies**: none (no frameworks, libraries, web fonts, or CDNs)

**Storage**: N/A. The game list is a static data file in the repository; nothing is stored on the
device.

**Testing**: manual acceptance checks in a browser at 360 px and desktop widths, following
[quickstart.md](quickstart.md); no automated tests for this feature (see research R7)

**Target Platform**: GitHub Pages (`https://my6u4ka.github.io/speech-therapist/`), viewed in
current Chrome, Safari, Firefox, and Edge on phones, tablets, and desktops

**Project Type**: static website (multi-page: portal and one folder per game)

**Performance Goals**: portal loads in under 2 s on an ordinary mobile connection (SC-003); page
weight without pictures under 30 KB, each game picture under 100 KB

**Constraints**: no build step; no server; no third-party requests; no device storage; all
relative URLs (the site lives under the `/speech-therapist/` sub-path); works when `index.html` is
opened straight from disk for local checking

**Scale/Scope**: 1 portal page, tens of games over time, a single family of users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | How this plan complies | Status |
|---|---|---|
| I. Child-Centered | Tiles are picture-led and large; one tap opens a game; a missing game shows a friendly Bulgarian page (`404.html`) with a way home; no ads, links out, or purchases. | Pass |
| II. Content separate from code | Game names and pictures live in `games.js` and in the game folders, not in the portal script. The owner reviews each entry when adding it. | Pass |
| III. Static site on GitHub Pages | Plain HTML/CSS/JS at the repo root, published from `main`; no server, accounts, build step, or libraries. | Pass |
| IV. Privacy by default | No analytics, cookies, web fonts, CDNs, or storage; the portal makes no request outside the site. | Pass |
| V. Simplicity, independent games | Each game is its own folder and page. The only shared pieces are the home control (`assets/home/`), which FR-006 requires in every game, and nothing else. | Pass (see note) |
| Devices / readability | Responsive grid with at least 2 columns on 360 px and tiles of at least 140 px; system font stack with `lang="bg"`; high contrast. | Pass |
| Target age | Not applicable to the portal: it has no content level. Each game's spec states its grades. | Pass |
| Language | UI and names in Bulgarian; all documentation in English. | Pass |
| Workflow (git flow) | Work on `feature/001-game-portal`; acceptance checked per quickstart before merging into `develop`. | Pass |

Note on V: "shared code only when at least two games use it". The home control is shared from
the first game because the spec makes it mandatory for every game (FR-006), and a single shared
definition is what keeps its place consistent. No other shared game code is introduced.

**Post-design re-check (after Phase 1)**: Pass. The data model and contracts add no dependency,
storage, or external request. No violations, so Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-game-portal/
├── plan.md              # This file
├── research.md          # Phase 0: decisions and alternatives
├── data-model.md        # Phase 1: Game entry
├── quickstart.md        # Phase 1: how to run and verify
├── contracts/
│   ├── game-entry.md    # Format of an entry in games.js
│   └── home-control.md  # What every game must include
└── tasks.md             # Phase 2 output (/speckit-tasks, not created here)
```

### Source Code (repository root)

```text
index.html               # Portal (start page, FR-001)
404.html                 # Friendly "game not found" page with a way home
games.js                 # Game registry: the only file edited to add a game (FR-007)
.nojekyll                # Tell GitHub Pages to serve files as-is (no Jekyll)
assets/
├── portal/
│   ├── portal.css       # Portal layout and tiles
│   └── portal.js        # Renders tiles from games.js
└── home/
    ├── home.css         # Shared home control style (contract: home-control.md)
    └── home.svg         # House icon
games/
├── _template/           # Starter for new games: page with the home control; never listed
│   ├── index.html
│   └── cover.svg        # Placeholder cover, also used as test data (quickstart)
└── <game-id>/           # One folder per game, added by later features
    ├── index.html
    └── cover.webp       # The game's tile picture (or .svg/.png)
```

**Structure Decision**: a single static site at the repository root, matching the existing
"за да, защото, заради" project, so GitHub Pages can serve `main` from `/`. Spec Kit folders
(`.specify/`, `.claude/`, `specs/`) are published too; that is harmless because the repository is
public anyway. Each game lives in `games/<game-id>/` so it can be added or removed independently
(Principle V).

## Complexity Tracking

No violations; nothing to justify.
