# Implementation Plan: Sound Effects

**Branch**: `feature/004-sound-effects` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-sound-effects/spec.md`

## Summary

Add five short sounds (`tap`, `correct`, `try-again`, `round`, `series`) and an on/off control to
both games.

The sounds are **synthesized in the browser** with the Web Audio API (research R1). There are no
sound files, no licenses, and no download, and the whole sound module is about 3 KB.

A new shared module, `assets/sound/`, contains:
- `sound.js`: the sound recipes as pure data, plus a tiny player;
- `sound.css`: styles for the speaker control;
- two speaker icons.

Each game adds three lines to its HTML (a script tag, a stylesheet tag, and the control button) and
a few `GameSound.play(...)` calls in `game.js` at the existing feedback points. For "Синоними",
the choice of sound after a check is a pure function in `logic.js`, so it can be unit-tested.

The progress indicator ("n / 5") moves from the top-right corner into the page flow, so the sound
control can take that corner.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020) as classic scripts; Web Audio API
(`AudioContext`, `OscillatorNode`, `GainNode`), which is supported in all current evergreen
browsers

**Primary Dependencies**: none. Development uses only Node's `node:test`.

**Storage**: none. The on/off setting is a variable in memory (FR-009).

**Testing**:
- `tests/sound.test.js` checks the recipe data: durations within the FR-002 limits, and a quieter
  `try-again` than `correct` with no falling contour (FR-003).
- A new test in `tests/synonyms.test.js` covers `checkSound` (FR-004).
- Manual listening checks per [quickstart.md](quickstart.md).

**Target Platform**: same as before. Mobile browsers need a user gesture before audio can start,
which is handled in R3.

**Project Type**: static website (shared asset and changes to two games)

**Performance Goals**: at most 30 KB more per game (SC-004); the expected cost is about 4 KB in
total. Silencing takes effect within 0.1 s (SC-003).

**Constraints**:
- no files from outside the site, and no storage;
- games must stay fully playable with no audio support (FR-011, SC-005);
- the home control's top-left 80×80 px area stays clear.

**Scale/Scope**: 5 sounds, 2 games; future games reuse the module.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | How this plan complies | Status |
|---|---|---|
| I. Child-Centered | Sounds are short and soft. `try-again` is two soft same-pitch notes, quieter than `correct`, with no falling melody or buzzer (FR-003), and the test suite enforces this. Sound is on by default, and one tap turns it off. | Pass |
| II. Content separate from code | No language content changes. Sound recipes are data in `sound.js`, separate from the player code. | Pass |
| III. Static site on GitHub Pages | Uses only the browser's built-in Web Audio, with no libraries or files. | Pass |
| IV. Privacy by default | No storage; the setting resets on each game page (FR-009). No requests. | Pass |
| V. Simplicity, independent games | `assets/sound/` is shared code used by both games, which the constitution allows, as for the home control. Each game still works if the module fails to load, because every call is guarded (R5). | Pass |
| Devices / readability | The control is 64×64 px, fixed at the top-right, and away from the home control. | Pass |
| Workflow | Work on `feature/004-sound-effects`. Specs and plans 002/003 get a note that "no sound" is superseded. | Pass |

**Post-design re-check (after Phase 1)**: Pass. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/004-sound-effects/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── sound-api.md        # GameSound API and where each game calls it
│   └── sound-control.md    # The on/off control: markup, place, look
└── tasks.md
```

### Source Code (repository root)

```text
assets/sound/
├── sound.js                # globalThis.GameSound (player) + GameSound.RECIPES (data); module.exports for tests
├── sound.css               # .sound-control styles
├── speaker-on.svg
└── speaker-off.svg
games/synonyms/
├── index.html              # + sound.css, sound.js, control button
├── game.css                # progress indicator moved into the flow
├── logic.js                # + checkSound(result)
└── game.js                 # + GameSound.play(...) calls
games/antonyms/
├── index.html              # + sound.css, sound.js, control button
├── game.css                # progress indicator moved into the flow
└── game.js                 # + GameSound.play(...) calls
tests/
├── sound.test.js           # recipe rules (FR-002, FR-003)
└── synonyms.test.js        # + checkSound tests (FR-004)
specs/002-synonym-game/plan.md, specs/003-antonym-pairs/plan.md   # note: "no sound" superseded by 004
```

**Structure Decision**: a shared asset next to `assets/home/`, because both games need the same
sounds and the same control in the same place. Game changes are limited to calling the module.

## Complexity Tracking

No violations; nothing to justify.
