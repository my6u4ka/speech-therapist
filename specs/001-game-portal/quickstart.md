# Quickstart: Game Portal

How to run the portal and prove it meets the [spec](spec.md). Field rules and formats are in
[data-model.md](data-model.md) and [contracts/](contracts/).

## Prerequisites

- Any current browser (Chrome or Edge, plus Firefox or Safari for the second check).
- The repository checked out on `feature/001-game-portal`.

## Run locally

Open `index.html` from the repository root directly in the browser (double-click it). No server
or build step is needed (research R1).

To check at phone width: open DevTools, turn on device emulation, and choose a 360 px wide
device.

## Test data

Until the first real game exists, add a temporary entry to `games.js` that points to the
template, and remove it before merging:

```js
{ id: "test-game", name: "Проба", image: "games/_template/cover.svg", href: "games/_template/" }
```

## Validation scenarios

| # | Spec ref | Steps | Expected |
|---|---|---|---|
| 1 | US1-1, FR-002 | Open the portal. | Every entry is a tile with a large picture and its name, and nothing else. |
| 2 | US1-2, FR-004 | Tap or click a tile. | The game opens in the same window. |
| 3 | US1-3, FR-003 | Show the portal to a grade-1 child. | They point to a game by its picture. |
| 4 | US1-4, FR-005 | Open the portal in a fresh private window. | The games appear at once, with no grade, level, or profile question. |
| 5 | US2-1, FR-006 | Open the game. | The home control is at the top-left. |
| 6 | US2-2 | Tap the home control. | The portal opens. |
| 7 | Edge | Double-tap a tile quickly. | Only one game opens, and Back returns to the portal once. |
| 8 | Edge | Change an entry's `image` to a missing file. | The tile shows the name and still opens the game. |
| 9 | Edge | Open `/speech-therapist/no-such-game/` on the published site. | A friendly Bulgarian page appears with the home control. |
| 10 | Edge, SC-004 | Check at 360 px, a tablet in landscape, and desktop; add enough test entries to overflow the screen. | At least 2 columns on the phone; tiles never shrink below 140 px; vertical scrolling only. |
| 11 | FR-008, IV | DevTools → Network and Application. | No request leaves the site; no cookies or local storage are written. |
| 12 | SC-003 | DevTools → Network, "Fast 4G" throttling, reload. | The portal is usable in under 2 s. |
| 13 | Data model | Add an entry with `href: "https://example.com"`. | The entry is skipped with a console warning, and the other tiles render. |

All 13 must pass in two browsers before `feature/001-game-portal` is merged into `develop`
(constitution: Development Workflow).
