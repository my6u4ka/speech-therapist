# Implementation Plan: Synonym Game

**Branch**: `feature/002-synonym-game` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-synonym-game/spec.md`

## Summary

A self-contained game in `games/synonyms/`. Each round shows a reference word, an instruction with
the number of synonyms to find, and 8–12 shuffled candidate words as large toggle buttons. The
child marks words and taps "Провери". The first check confirms correct marks, gently clears wrong
ones, and says how many are still missing. A second check ends the round and reveals any missed
synonyms. A series is 5 rounds, followed by an encouraging summary with "Играй пак".

Technical approach: plain HTML, CSS, and JavaScript, as in feature 001. The word bank is a
separate data file (`words.js`). The game rules (validation, shuffling, series picking, checking,
Bulgarian instruction text) live in a small pure-logic file (`logic.js`) with no DOM access, so they
can be unit-tested with Node's built-in test runner. A third file (`game.js`) only draws the screen
and handles taps. The game reuses the shared home control and is added to `games.js`.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020) as classic scripts, no modules (works from
`file://`, as in feature 001)

**Primary Dependencies**: none in the site. For development only: Node.js (already installed, v24),
using its built-in `node:test` and `node:assert`, with no npm packages and no `package.json`.

**Storage**: none on the device. The word bank is a static data file in the repository, and the
series state lives only in memory (FR-015).

**Testing**:
- unit tests for `logic.js` and a structural check of the whole word bank, with `node --test`;
- manual acceptance checks per [quickstart.md](quickstart.md) at 360 px and desktop widths.

**Target Platform**: same as feature 001 (GitHub Pages, current evergreen browsers, touch and
mouse)

**Project Type**: static website, adding one game folder

**Performance Goals**: game page under 2 s on an ordinary mobile connection (SC-004). All game files
together, excluding the cover, stay under 40 KB.

**Constraints**:
- no build step and no external requests;
- no `localStorage`, cookies, or sound;
  Note: Sound: superseded by feature 004 (sound effects); sad or punishing sounds remain forbidden.
- relative URLs only;
- the top-left 80×80 px area stays clear for the home control (contract 001 home-control.md).

**Scale/Scope**: one game, at least 20 word sets at first (SC-006), and up to a few hundred sets
later

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | How this plan complies | Status |
|---|---|---|
| I. Child-Centered | Large toggle buttons; no timer, points lost, or sound; a wrong mark is cleared with a gentle "опитай пак" style, never red ✗; the summary only counts what was found. | Pass |
| II. Content separate from code | Word sets are in `games/synonyms/words.js` only. The structure is checked by tests, and the owner approves the language content before release (FR-011). | Pass |
| III. Static site on GitHub Pages | Static files in `games/synonyms/`; no libraries. Node is used only to run tests on the developer's machine and is never needed by the site. | Pass |
| IV. Privacy by default | No storage, no network requests beyond the game's own files. | Pass |
| V. Simplicity, independent games | Everything lives in `games/synonyms/`, except the shared home control (already justified in 001) and one entry in `games.js`. Portal CSS is not reused, so the game does not depend on the portal. | Pass |
| Target age | Spec FR-012: grades 2–4. Word-bank rules (common words) are enforced by owner review. | Pass |
| Devices / readability | Candidate buttons are at least 56 px tall and wrap in a flexible grid; reference word at least 2.4 rem; the marked state shows ✓ plus a thick border, not color alone (FR-003). | Pass |
| Workflow | Work on `feature/002-synonym-game`; this game triggers the first release (`release/1.0.0`). | Pass |
| Development Workflow: automated tests "MUST NOT require a server or a build step for the site" | `node --test` runs the tests directly; the site itself is unchanged. | Pass |

**Post-design re-check (after Phase 1)**: Pass. The data model, contracts, and tests add no runtime
dependency or storage. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/002-synonym-game/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── word-set.md       # Format and rules of words.js
│   └── round-flow.md     # Round states, check results, on-screen texts
└── tasks.md              # /speckit-tasks
```

### Source Code (repository root)

```text
games.js                   # + one entry: { id: "synonyms", name: "Синоними", image: "games/synonyms/cover.svg" }
games/synonyms/
├── index.html             # Page: home control, round screen, summary screen
├── game.css               # Game styles (own tokens; no portal CSS)
├── words.js               # Word bank: globalThis.SYNONYM_SETS = [...]
├── logic.js               # Pure rules: validate, shuffle, pickSeries, checkRound, instructionText
├── game.js                # Screen drawing and tap handling; uses logic.js + words.js
└── cover.svg              # Tile picture for the portal
tests/
└── synonyms.test.js       # node:test: logic.js rules + structural check of words.js
```

**Structure Decision**: follows feature 001 (one folder per game under `games/`). `tests/` at the
repository root holds developer-only tests; GitHub Pages publishes it, which is harmless. Splitting
`logic.js` from `game.js` is what makes the rules testable without a browser.

## Complexity Tracking

No violations; nothing to justify.
