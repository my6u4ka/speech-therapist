# Implementation Plan: Sentence Builder Game

**Branch**: `feature/007-sentence-builder` | **Date**: 2026-11-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-sentence-builder/spec.md`

## Summary

A self-contained game in `games/builder/`. Each sentence becomes a row of empty slots and a pool of
shuffled word cards. The cards show no punctuation, and the first word is lowercase unless it is a
name. The child moves the cards by dragging, with touch or a mouse, or by tapping or using the
keyboard. "Провери" locks the words that are in the right place and gently marks the rest. When
the sentence is right, it is shown written correctly. A series has 6 sentences, from shorter to
longer, and ends with the usual summary.

Technical approach:
- The architecture is the same as the other games. `words.js` holds the content, `logic.js` holds
  the pure rules (tested with `node --test`), and `game.js` holds the screen.
- `game.js` also has a small drag module built on **Pointer Events**, which handle touch, mouse,
  and pen with a single API. It uses no library, and it does not use the HTML5 drag-and-drop API,
  because that API does not work with touch (research R1).
- It uses the shared helpers (`assets/shared/play.js`), the shared home control, and the shared
  sounds.

## Technical Context

**Language/Version**: HTML5, CSS3, and JavaScript (ES2020) as classic scripts. The browser API is
Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `setPointerCapture`),
which all current evergreen browsers support, iOS Safari included.

**Primary Dependencies**: none in the site. Development uses only Node's `node:test`.

**Storage**: none (FR-015).

**Testing**:
- `tests/builder.test.js` covers tokenizing, the display form, validation, the "never solved"
  shuffle, checking the board, and series picking.
- The drag and drop is checked manually and with synthetic pointer events in the browser, per
  [quickstart.md](quickstart.md).

**Target Platform**: the same as the other games, with phones and tablets as the main targets for
dragging.

**Project Type**: a static website that adds one game folder.

**Performance Goals**:
- dragging follows the finger at the screen's frame rate (SC-004), because only `transform` moves
  and nothing is re-laid out during a drag;
- the game loads in under 2 s, and its files, excluding the cover, stay under 40 KB.

**Constraints**:
- no build step, no external requests, and no storage;
- relative URLs only;
- the top-left and top-right areas of 80×80 px stay clear;
- dragging must not scroll the page (spec edge case), which `touch-action: none` on the cards
  ensures.

**Scale/Scope**: one game, with at least 30 sentences at first (SC-007).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | How this plan complies | Status |
|---|---|---|
| I. Child-Centered | Big cards and slots, forgiving drop targets, and tap as an alternative to dragging. A check locks the right words and gently marks the rest, so the child can check again without limit. There is no penalty and no timer. | Pass |
| II. Content separate from code | The sentences live in `games/builder/words.js`. Tests enforce the structural rules (4–8 words, no commas). The owner checks the language and that each sentence has a single natural order (FR-006, FR-011). | Pass |
| III. Static site on GitHub Pages | Plain JS and Pointer Events, with no library. | Pass |
| IV. Privacy by default | Nothing is stored or sent. | Pass |
| V. Simplicity, independent games | Everything is in `games/builder/`, plus one `games.js` entry and the shared assets. The drag code is local to this game; it becomes shared only if a second game needs it. | Pass |
| Target age | Grades 3–4, with 4–8 words per sentence (FR-012), enforced by tests. | Pass |
| Devices / readability | Cards are at least 48 px tall with a font of at least 1.3 rem. Slots wrap onto several lines, and states use ✓ and a tag, not color alone. | Pass |
| Workflow | Work happens on `feature/007-sentence-builder`. | Pass |

**Post-design re-check (after Phase 1)**: Pass. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/007-sentence-builder/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── sentence-entry.md   # format and rules of words.js
│   └── board-flow.md       # moves, drag behavior, check, states, sounds, texts
└── tasks.md
```

### Source Code (repository root)

```text
games.js                    # + { id: "builder", name: "Подреди изречението", image: "games/builder/cover.svg" }
games/builder/
├── index.html              # home + sound controls, instruction, #slots, #pool, check/next button, result, summary
├── game.css
├── words.js                # globalThis.BUILDER_SENTENCES = [...]
├── logic.js                # tokenize, displayWord, validateEntry, validateBank, scramble, checkBoard,
│                           # pickSeries; wrappers over PlayKit
├── game.js                 # board state, moves, drag module (Pointer Events), tap/keyboard, flow
└── cover.svg
tests/
└── builder.test.js
```

**Structure Decision**: the same as the other games. The drag module lives inside `game.js`,
because one game uses it (Principle V).

## Complexity Tracking

No violations; nothing to justify.
