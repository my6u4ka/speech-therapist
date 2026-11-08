# Implementation Plan: Word Meanings Game

**Branch**: `feature/005-word-meanings` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-word-meanings/spec.md`

## Summary

A self-contained game in `games/meanings/`. Each question shows:
- a word;
- a short sentence that uses it, with the word highlighted;
- 3 shuffled explanations as large buttons.

A right answer locks with ✓ and plays `correct`; on the last question it plays `round` instead.
A wrong answer is ruled out with "не е това", plays `try-again`, and the child chooses again. A
series is 8 questions with different words, followed by a summary that counts first-try answers.

Technical approach: the same architecture as the existing games:
- `words.js`: content;
- `logic.js`: pure rules, tested with `node --test`;
- `game.js`: screen and taps;
- `game.css`: styles.

It uses the shared home control (001) and the shared sound module (004) from the start. It shares
no game logic with the other games (research R1).

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020) as classic scripts, no modules

**Primary Dependencies**: none in the site. For development only: Node's `node:test`.

**Storage**: none. Series state lives in memory only (FR-013).

**Testing**:
- `tests/meanings.test.js` covers the entry rules, the bank, sentence parsing, `pickSeries`,
  `firstTryCount`, and `starsFor`;
- manual checks follow [quickstart.md](quickstart.md).

**Target Platform**: same as the other games

**Project Type**: static website, adding one game folder

**Performance Goals**: under 2 s to open (SC-004); game files, excluding the cover, under 40 KB

**Constraints**:
- no build step, no external requests, no storage;
- relative URLs only;
- keep the top-left 80×80 px area (home) and the top-right 80×80 px area (sound) clear.

**Scale/Scope**: one game, with at least 32 entries at first (SC-006)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | How this plan complies | Status |
|---|---|---|
| I. Child-Centered | Immediate, gentle feedback. A wrong option is ruled out with "не е това" (no red ✗) and the child tries again. Every question ends with the right meaning visible. No timer and no penalty. | Pass |
| II. Content separate from code | Entries live in `games/meanings/words.js` only. Tests check their structure; the owner approves the language (FR-009). | Pass |
| III. Static site on GitHub Pages | Static files only. Node is used only for tests. | Pass |
| IV. Privacy by default | Nothing is stored or sent. | Pass |
| V. Simplicity, independent games | Everything is in `games/meanings/`, plus one `games.js` entry and the already shared home and sound assets. The game helpers (shuffle, stars) are copied, not shared (R1). | Pass |
| Target age | Grades 3–4 (FR-010). Length limits for the sentence and explanations are enforced by tests; the word level is enforced by owner review. | Pass |
| Devices / readability | Options are full-width stacked buttons at least 56 px tall, with wrapping text. The highlighted word is bold and underlined, not just colored. | Pass |
| Workflow | Work on `feature/005-word-meanings`. | Pass |

**Post-design re-check (after Phase 1)**: Pass. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/005-word-meanings/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── meaning-entry.md   # words.js format and rules
│   └── question-flow.md   # states, flow, sounds, texts
└── tasks.md
```

### Source Code (repository root)

```text
games.js                    # + { id: "meanings", name: "Какво означава?", image: "games/meanings/cover.svg" }
games/meanings/
├── index.html              # home control, sound control, word, sentence, options, feedback, action, summary
├── game.css                # own copy of the shared look (as in the other games)
├── words.js                # globalThis.MEANING_ENTRIES = [...]
├── logic.js                # validateEntry, validateBank, parseSentence, shuffle, pickSeries,
│                           # firstTryCount, starsFor, summaryLine2
├── game.js                 # screen and taps
└── cover.svg               # tile picture
tests/
└── meanings.test.js
```

**Structure Decision**: mirrors `games/synonyms/` and `games/antonyms/`.

## Complexity Tracking

No violations; nothing to justify.
