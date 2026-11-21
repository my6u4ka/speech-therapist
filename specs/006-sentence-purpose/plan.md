# Implementation Plan: Sentence Purpose Game

**Branch**: `feature/006-sentence-purpose` | **Date**: 2026-11-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-sentence-purpose/spec.md`

## Summary

A self-contained game in `games/sentences/`. Each question shows one sentence, with its end mark
visible, and 4 type buttons in a fixed order. A correct answer locks with ✓, shows the type's
reason line, and plays `correct` (`round` on the last question). A wrong answer is ruled out with
"не е това" and plays `try-again`, and the child chooses again. A series has 8 sentences, exactly
2 of each type, and ends with the usual summary.

Technical approach: the same architecture as the existing games:
- `words.js` holds the content: the sentences, plus the type labels and reason lines;
- `logic.js` holds pure rules, tested with `node --test`;
- `game.js` holds the screen and taps;
- `game.css` holds the styles.

This is the fourth game, which is the trigger recorded in feature 005 (research R1). So this
feature also introduces a small shared helper module, `assets/shared/play.js` (`shuffle`,
`starsFor`, `firstTryLine`). The three existing games are migrated to it with no change in
behavior (research R1).

## Technical Context

**Language/Version**: HTML5, CSS3, and JavaScript (ES2020) as classic scripts, with no modules.

**Primary Dependencies**: none in the site. Development only uses Node `node:test`.

**Storage**: none. The series state lives in memory only (FR-014).

**Testing**:
- new: `tests/sentences.test.js` and `tests/play.test.js`, the shared helpers;
- unchanged: the existing synonyms, antonyms, meanings, and sound suites, which MUST keep passing
  after the migration;
- manual checks per [quickstart.md](quickstart.md).

**Target Platform**: the same as the other games.

**Project Type**: static website. This feature adds one game folder and one shared asset, and
refactors three games internally.

**Performance Goals**:
- the game opens in under 2 s (SC-004);
- the game files, excluding the cover, stay under 40 KB;
- the shared helper stays under 2 KB.

**Constraints**:
- no build step, no external requests, and no storage;
- relative URLs only;
- the top-left and top-right 80×80 px areas stay clear;
- migrated games MUST behave exactly as before.

**Scale/Scope**: one new game with at least 40 sentences (SC-006), plus a refactor of 3 games
(about 25 lines each).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | How this plan complies | Status |
|---|---|---|
| I. Child-Centered | Immediate, gentle feedback with a reason line that teaches the rule. A wrong answer is ruled out with "не е това". There is no penalty and no timer. | Pass |
| II. Content separate from code | Sentences, type labels, and reason lines live in `games/sentences/words.js`. Tests check the structure, and the owner approves the language (FR-010). | Pass |
| III. Static site on GitHub Pages | Static files only. Node is used only for tests. | Pass |
| IV. Privacy by default | Nothing is stored or sent. | Pass |
| V. Simplicity, independent games | `assets/shared/play.js` is code that 4 games actually use, as the principle allows ("at least two games"). Each game keeps its own exported API, which delegates to the shared helpers, so the game files and tests stay self-describing (R1). | Pass |
| Target age | Grades 3–4 (FR-011). Tests enforce the sentence-length limits; the owner's review covers the level. | Pass |
| Devices / readability | 4 large buttons: one column under 480 px, 2×2 above. Every state has an icon or a tag, not color alone. | Pass |
| Workflow | Work happens on `feature/006-sentence-purpose`. The migration of the 3 games is part of this feature, because the decision to share was taken here. | Pass |

**Post-design re-check (after Phase 1)**: Pass. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/006-sentence-purpose/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── sentence-entry.md   # words.js: TYPES and SENTENCE_ENTRIES
│   ├── question-flow.md    # states, flow, sounds, texts
│   └── play-helpers.md     # assets/shared/play.js API and how games load it
└── tasks.md
```

### Source Code (repository root)

```text
assets/shared/
└── play.js                 # globalThis.PlayKit = { shuffle, starsFor, firstTryLine }; module.exports for Node
games.js                    # + { id: "sentences", name: "Какво е изречението?", image: "games/sentences/cover.svg" }
games/sentences/
├── index.html              # home + sound controls, sentence, 4 type buttons, feedback, action, summary
├── game.css
├── words.js                # globalThis.SENTENCE_TYPES and globalThis.SENTENCE_ENTRIES
├── logic.js                # validateEntry, validateBank, buildSeries, (delegates) shuffle/starsFor/summaryLine2
├── game.js
└── cover.svg
games/synonyms/{index.html, logic.js}   # load play.js; shuffle/starsFor delegate to PlayKit
games/antonyms/{index.html, logic.js}   # load play.js; shuffle/starsFor/summaryLine2 delegate
games/meanings/{index.html, logic.js}   # load play.js; shuffle/starsFor/summaryLine2 delegate
tests/
├── play.test.js
└── sentences.test.js
```

**Structure Decision**: `assets/shared/` sits next to `assets/home/` and `assets/sound/`. Each game
keeps its own `logic.js` API, so `game.js` files and the existing tests do not change.

## Complexity Tracking

No violations; nothing to justify.
