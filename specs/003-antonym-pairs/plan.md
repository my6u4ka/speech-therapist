# Implementation Plan: Antonym Pairs Game

**Branch**: `feature/003-antonym-pairs` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-antonym-pairs/spec.md`

## Summary

A self-contained game in `games/antonyms/`. Each round shows two shuffled columns of 5 words, and
every word has exactly one opposite in the other column. The child taps one word and then a word in
the other column. A correct pair locks at once, with a matching color and number. A wrong pair
shows "Опитай пак!" briefly and comes apart. A round ends when all 5 pairs are made. A series is 5
rounds with 25 distinct pairs and ends with a summary that counts first-try pairs.

Technical approach: the same architecture as the synonym game (feature 002):
- `words.js`: content;
- `logic.js`: pure rules, unit-tested with `node --test`;
- `game.js`: screen and taps;
- `game.css`: styles.

The new logic is series building with conflict rules, so a round never offers a word two possible
opposites. No code is shared with the synonym game (research R1).

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020) as classic scripts, no modules

**Primary Dependencies**: none in the site. Development only: Node.js built-in `node:test`

**Storage**: none on the device. The series state lives in memory (FR-015).

**Testing**: unit tests for `logic.js` and a structural check of the word bank in
`tests/antonyms.test.js`, run with `node --test`. Manual checks per [quickstart.md](quickstart.md).

**Target Platform**: same as features 001 and 002

**Project Type**: static website, adding one game folder

**Performance Goals**: game page under 2 s (SC-004). Game files, excluding the cover, under 40 KB.

**Constraints**: no build step, no external requests, no storage or sound, relative URLs, and a clear
top-left 80×80 px area

**Note**: Sound: superseded by feature 004 (sound effects); sad or punishing sounds remain forbidden.

**Scale/Scope**: one game, at least 40 pairs at first (SC-006)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | How this plan complies | Status |
|---|---|---|
| I. Child-Centered | Immediate, gentle feedback. A wrong pair shows "Опитай пак!" and comes apart, with no penalty or timer. The summary only praises. | Pass |
| II. Content separate from code | Pairs live in `games/antonyms/words.js` only. Tests check the structure, and the owner approves the words (FR-011). | Pass |
| III. Static site on GitHub Pages | Static files only; Node is used only for tests. | Pass |
| IV. Privacy by default | Nothing is stored or sent. | Pass |
| V. Simplicity, independent games | Everything is in `games/antonyms/` plus one `games.js` entry. Shared code is allowed once two games use it, but it is deliberately not introduced (R1): the overlap is about 15 lines, and sharing would couple two working games. | Pass |
| Target age | Grades 2–4 (FR-012), enforced by owner review. | Pass |
| Devices / readability | Two columns side by side at 360 px (each at least 150 px). Buttons are at least 56 px tall with wrapping text. Selected and paired states use an icon or number as well as color (FR-003, FR-006). | Pass |
| Workflow | Work on `feature/003-antonym-pairs`. | Pass |

**Post-design re-check (after Phase 1)**: Pass. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/003-antonym-pairs/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── antonym-pair.md   # Format and rules of words.js, conflict rules
│   └── round-flow.md     # Pairing flow, states, on-screen texts
└── tasks.md
```

### Source Code (repository root)

```text
games.js                   # + { id: "antonyms", name: "Антоними", image: "games/antonyms/cover.svg" }
games/antonyms/
├── index.html             # Home control, two columns, feedback line, action button, summary
├── game.css               # Styles (same look as games/synonyms, own copy)
├── words.js               # globalThis.ANTONYM_PAIRS = [...]
├── logic.js               # validatePair, validateBank, conflicts, shuffle, buildSeries,
│                          # buildColumns, isPair, firstTryCount, starsFor, texts
├── game.js                # Screen and taps
└── cover.svg              # Tile picture
tests/
└── antonyms.test.js       # node:test: logic rules + structural check of words.js
```

**Structure Decision**: mirrors `games/synonyms/`, so both games are equally easy to understand and
change, and either can be removed without affecting the other.

## Complexity Tracking

No violations; nothing to justify.
