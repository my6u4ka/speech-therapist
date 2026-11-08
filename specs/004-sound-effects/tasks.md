---

description: "Task list for the Sound Effects feature"
---

# Tasks: Sound Effects

**Input**: Design documents from `/specs/004-sound-effects/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: included.
- Recipe rules (FR-002, FR-003) and `checkSound` (FR-004) are unit-tested with `node --test`.
- Listening is checked manually per quickstart.md.

**Organization**: tasks are grouped by user story. US1 is the sounds in both games; US2 is the
on/off control.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 or US2 from spec.md
- Paths are relative to the repository root. UI text is in Bulgarian; code comments are in English.
- In the two games, change only what each task names. Do not change game rules, texts, or word banks.

---

## Phase 1: Setup

- [x] T001 [P] Create `assets/sound/speaker-on.svg`: a bold white speaker with two sound waves, in a
  square viewBox, readable at 40 px (same style as `assets/home/home.svg`).
- [x] T002 [P] Create `assets/sound/speaker-off.svg`: the same speaker with a white ✕ instead of the
  waves.
- [x] T003 [P] Create `assets/sound/sound.css` per contracts/sound-control.md:
  - `.sound-control`:
    - fixed at `top: 8px; right: 8px`, with a high `z-index`;
    - 64×64 px, with no padding inside the button;
    - the same background, radius, and shadow as `.home-control` in `assets/home/home.css`;
    - a border-less button reset;
    - `cursor: pointer`;
  - the image inside is 40×40 px;
  - a `:focus-visible` outline of `5px solid #b91c1c`, as for the home control.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Create `assets/sound/sound.js`, part 1. It is a classic script with an IIFE that defines
  `RECIPES` exactly as in research R2 and data-model.md:
  - `tap`: sine, gain 0.15, notes `[{freq:880,start:0,dur:0.07}]`.
  - `correct`: triangle, gain 0.30, notes
    `[{freq:784,start:0,dur:0.12},{freq:1047,start:0.12,dur:0.2}]`.
  - `try-again`: sine, gain 0.15, notes
    `[{freq:392,start:0,dur:0.12},{freq:392,start:0.18,dur:0.12}]`.
  - `round`: triangle, gain 0.30, notes C5, E5, G5, C6 (523, 659, 784, 1047). They start at 0,
    0.12, 0.24, and 0.36; the first three last 0.12 s and the last one 0.35 s.
  - `series`: triangle, gain 0.30. It is the `round` arpeggio, then a chord of 523, 659, and 784,
    all starting at 0.75 and lasting 0.8 s.

  Also define `LIMITS = { tap: 0.15, correct: 0.5, "try-again": 0.5, round: 1.2, series: 2 }`.
  When `typeof module !== "undefined"`, set `module.exports = { RECIPES, LIMITS }` and return
  before touching any browser API, so Node can load the file.
- [x] T005 Create `tests/sound.test.js` (`node:test`, `node:assert/strict`). It requires
  `assets/sound/sound.js` and checks:
  - the recipe names are exactly `tap`, `correct`, `try-again`, `round`, and `series`;
  - every `wave` is `sine` or `triangle`;
  - every gain satisfies 0 < gain ≤ 0.3;
  - every freq is in 200–2000;
  - each recipe's total length (`max(start + dur)`) is below its `LIMITS` entry;
  - the gain of `try-again` is lower than the gain of `correct`;
  - "never falling": with notes ordered by `start`, each note's freq is at least the freq of the
    last note with an earlier `start`. Notes with the same `start` form a chord and are exempt
    among themselves.

  Depends on T004.
- [x] T006 Extend `assets/sound/sound.js` with the browser player, per contracts/sound-api.md and
  research R3–R5:
  - **State:** `on = true` on load (FR-008), kept in memory only and never stored (FR-009).
  - **Unlock:** a one-time capture listener for `pointerdown` and `keydown` creates the
    `AudioContext` (`window.AudioContext || window.webkitAudioContext`) and calls `resume()`.
    Every step is wrapped in try/catch, so an unsupported browser stays silent.
  - **`play(name)`:**
    - it is a no-op if the sound is off, the context is missing, or the name is unknown;
    - if `name` is `tap`, it stops a `tap` that is still playing;
    - for any other name, it stops everything that is playing;
    - for each note it creates an oscillator and a gain node with a 10 ms linear attack to the
      peak gain, then an exponential release to 0.0001 at the note's end;
    - it tracks the nodes so they can be stopped;
    - it never throws.
  - **`isOn()`, `setOn(bool)`, `toggle()`:** `setOn(false)` stops all playing nodes at once.
    `setOn` updates every `.sound-control`: `aria-pressed`, and the image `src` swapped between
    `speaker-on.svg` and `speaker-off.svg`, keeping the folder part of the current `src`.
  - **Wiring:** on `DOMContentLoaded` (or at once, if the page has already loaded), attach a click
    handler that calls `toggle()` to every `.sound-control`.
  - Expose `globalThis.GameSound = { play, isOn, setOn, toggle, RECIPES }`.

**Checkpoint**: `node --test` passes, and the module loads in a browser with no errors.

---

## Phase 3: User Story 1 - Hear feedback while playing (Priority: P1) 🎯 MVP

**Goal**: both games play the right sound at each moment (FR-001, FR-004, FR-005).

**Independent Test**: quickstart scenarios 2–7, 11, 12.

- [ ] T007 [US1] Add tests to `tests/synonyms.test.js` for `checkSound(result, perfect)` per
  contracts/sound-api.md:
  - `done` → "round";
  - not done, with a `wrong` status → "try-again";
  - not done, with no `wrong` status → "correct".

  Use results built with the existing `checkRound`.
- [ ] T008 [US1] Implement `checkSound(result, perfect)` in `games/synonyms/logic.js`, and add it to
  the exported API, so that the T007 tests pass. Do not change any other function.
- [ ] T009 [US1] In `games/synonyms/index.html`, add
  `<script defer src="../../assets/sound/sound.js"></script>` before `words.js`.

  In `games/synonyms/game.js`:
  - add the helper `function sfx(name) { if (globalThis.GameSound) globalThis.GameSound.play(name); }`;
  - call `sfx("tap")` in `toggle()` after a mark or unmark;
  - in `check()`, right after `checkRound`, call
    `sfx(L.checkSound(res, ...))` exactly once;
  - when the first-check "only wrong marks, nothing missing" case ends the round after the delay,
    do not play a second sound;
  - call `sfx("series")` in `showSummary()`.
- [ ] T010 [P] [US1] In `games/antonyms/index.html`, add the same `sound.js` script tag before
  `words.js`.

  In `games/antonyms/game.js`, add the same `sfx` helper and call:
  - `sfx("tap")` on select, unselect, and selection move;
  - in `evaluate()`, for a correct pair, `sfx("round")` if it completes the round, otherwise
    `sfx("correct")`;
  - for a wrong pair, `sfx("try-again")` once;
  - `sfx("series")` in `showSummary()`.

  No sound plays while `busy` taps are ignored.

**Checkpoint**: with sound on, both games play the right sounds.

---

## Phase 4: User Story 2 - Turn sound on and off (Priority: P2)

**Goal**: a speaker control in the top-right of every game (FR-006, FR-007), on by default, and
nothing stored.

**Independent Test**: quickstart scenarios 1, 8–10.

- [ ] T011 [US2] In `games/synonyms/index.html`:
  - add `<link rel="stylesheet" href="../../assets/sound/sound.css">`;
  - right after the home control, add the button from contracts/sound-control.md
    (`class="sound-control"`, `aria-pressed="true"`, `aria-label="Звук"`, with an image of
    `../../assets/sound/speaker-on.svg`).

  In `games/synonyms/game.css`, change `.progress` from absolute top-right into the normal flow:
  `position: static`, centered, above the reference word. Keep its font size and weight.
- [ ] T012 [P] [US2] Make the same changes in `games/antonyms/index.html` and
  `games/antonyms/game.css`.

**Checkpoint**: the control toggles sound in both games, and nothing overlaps.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T013 [P] Add a note under the constraints in `specs/002-synonym-game/plan.md` and
  `specs/003-antonym-pairs/plan.md`: "Sound: superseded by feature 004 (sound effects); sad or
  punishing sounds remain forbidden." Add the same note after FR-006 in
  `specs/002-synonym-game/spec.md` and `specs/003-antonym-pairs/spec.md`.
- [ ] T014 Run `node --test` and confirm that every test passes for all three suites.
- [ ] T015 Run quickstart.md scenarios 1–14 on the local preview server and record the results under
  this task. The owner must do the listening judgment for scenarios 2–7 (whether the sounds are
  friendly and nothing is sad or annoying).
- [ ] T016 [P] Update `README.md`: describe `assets/sound/` (shared sounds synthesized in the
  browser, with no audio files, and on/off per page with nothing stored), and how a new game adds
  sound. Point to `specs/004-sound-effects/contracts/`.

---

## Dependencies & Execution Order

- **Phase 1**: T001, T002, and T003 can run in parallel.
- **Phase 2**: T004 → T005, and T004 → T006. This phase blocks both stories.
- **US1**: T007 → T008 → T009 (synonyms) and T010 (antonyms) in parallel with them.
- **US2**: after Phase 1 and T006. T011 and T012 can run in parallel. T011 and T009 both edit
  `games/synonyms/index.html`, so T011 runs after T009; T012 runs after T010 for the same
  reason.
- **Polish**: T013 and T016 at any time; T014 and T015 at the end.

## Implementation Strategy

1. **MVP**: Phases 1–3. Both games make sounds, and you turn them off with the device volume.
2. Then US2, the on/off control.
3. Polish, the owner's listening check, then merge into `develop`.

## Notes

- 16 tasks: Setup 3, Foundational 3, US1 4, US2 2, Polish 4.
- Commit after each phase on `feature/004-sound-effects`.
