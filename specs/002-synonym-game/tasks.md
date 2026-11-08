---

description: "Task list for the Synonym Game feature"
---

# Tasks: Synonym Game

**Input**: Design documents from `/specs/002-synonym-game/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: included. The plan (research R3) chose unit tests for `logic.js` and a structural check
of the word bank, run with `node --test tests/` (Node built-ins only, no npm). The UI is checked
manually per quickstart.md.

**Organization**: tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1, US2, US3 from spec.md
- Paths are relative to the repository root.
- All UI text is Bulgarian, exactly as in [contracts/round-flow.md](contracts/round-flow.md); code
  comments are English.

---

## Phase 1: Setup

- [x] T001 Create `games/synonyms/index.html` from `games/_template/index.html`:
  - keep the home control and its stylesheet link exactly (`../../assets/home/home.css`,
    `href="../../"`);
  - set `<title>Синоними</title>`;
  - link `game.css`;
  - add empty containers: `#round` (reference word, instruction, candidates, feedback line with
    `aria-live="polite"`, action button) and `#summary` (hidden);
  - load `words.js`, `logic.js`, and `game.js` as classic `<script defer>` in that order;
  - add a Bulgarian `<noscript>` message;
  - keep the content clear of the top-left 80×80 px area.
- [x] T002 [P] Create `games/synonyms/game.css` base:
  - its own color tokens on `:root`, with an explicit `body` background, matching the portal's
    warm palette (no import of portal CSS, Principle V);
  - the system font stack;
  - body padding `88px 16px 16px`;
  - the reference word at least `2.4rem`, bold, and centered;
  - the instruction at least `1.3rem`;
  - the candidate grid `repeat(auto-fill, minmax(140px, 1fr))`;
  - candidate buttons at least 56 px tall, with wrapping text and font at least `1.3rem`;
  - a full-width action button at least 56 px tall;
  - no sideways scrolling at 360 px.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: the rules core and the content that all stories use.

- [x] T003 [P] Create `games/synonyms/logic.js` (pure, no DOM), exposing
  `globalThis.SynonymLogic`, and `module.exports` when `typeof module !== "undefined"`. Implement:
  - `normalize(w)`: trim and lowercase.
  - `validateSet(set)`: returns `null` or an English reason. It enforces data-model.md verbatim:
    - `word` is text "at most 20 characters";
    - `synonyms` has "1–4 words", each "at most 20 characters";
    - `distractors` are text, each "at most 20 characters";
    - "`synonyms` + `distractors` together give 8–12 candidates";
    - "all words in one set are distinct, compared after trimming and lowercasing";
    - "no word appears in both `synonyms` and `distractors`";
    - "the reference `word` does not appear among the candidates".
  - `validateBank(sets)`: returns a list of problems, including duplicate reference words
    ("unique across the bank").
  - `shuffle(list, rng = Math.random)`: a Fisher–Yates shuffle that returns a new array (R4).
- [x] T004 [P] Create `games/synonyms/words.js` with `globalThis.SYNONYM_SETS = [...]`:
  - **at least 20** word sets for grades 2–4 (R10, SC-006);
  - each set has 2–4 synonyms and 6–8 distractors (8–12 candidates in total);
  - at least 2 "thinking" distractors per set (an opposite or a same-topic word);
  - common, correctly spelled standard Bulgarian;
  - a header comment (English) that points to `specs/002-synonym-game/contracts/word-set.md`
    and says "DRAFT: awaiting owner approval (T020)".
- [x] T005 Create `tests/synonyms.test.js` using `node:test` and `node:assert/strict`:
  - load `games/synonyms/logic.js` with `require`, and load `games/synonyms/words.js` with
    `require`, which sets `globalThis.SYNONYM_SETS`;
  - test `validateSet` against a valid set and against one broken set per rule;
  - test that `shuffle` keeps every word and does not mutate its input;
  - check that every set in the bank passes `validateSet`, that `validateBank` returns no
    problems, and that the bank has at least 20 sets.

  Depends on T003 and T004.

**Checkpoint**: `node --test tests/` passes.

---

## Phase 3: User Story 1 - Find the synonyms of a word (Priority: P1) 🎯 MVP

**Goal**: one fully working round with the two-step check.

**Independent Test**: open the game, play a round, and check quickstart scenarios 1–7, 13–15.

### Tests for User Story 1

- [x] T006 [US1] Add tests to `tests/synonyms.test.js` for `checkRound`, following
  contracts/round-flow.md:
  - attempt 1 with a wrong mark and a missing synonym: `correct` and `wrong` statuses, no
    `missed`, `missingCount` greater than 0, and `done` false;
  - attempt 1, perfect: `done` true;
  - attempt 1 with only wrong marks and nothing missing: `done` false;
  - attempt 2: `missed` statuses appear, and `done` is true;
  - `found` counts `correct` statuses.

  Add tests for `instructionText(1)` → "Намери 1 дума с близко значение" and
  `instructionText(3)` → "Намери 3 думи с близко значение", and for `missingText(1)` →
  "Почти! Остава още 1 дума." and `missingText(2)` → "Почти! Остават още 2 думи.".

### Implementation for User Story 1

- [x] T007 [US1] Implement `checkRound(set, marked, attempt)`, `instructionText(n)`, and
  `missingText(n)` in `games/synonyms/logic.js` exactly per contracts/round-flow.md, so that the
  T006 tests pass.
- [x] T008 [US1] Create `games/synonyms/game.js`, part 1: the round screen.
  - Take the valid sets from `SYNONYM_SETS` (skip invalid ones with `console.warn`).
  - Start a round with a random set.
  - Render the reference word, `instructionText(synonyms.length)`, and the shuffled candidates as
    `<button type="button" aria-pressed="false">`. A tap toggles the mark (it shows ✓ and the
    marked class).
  - "Провери" is disabled until at least one word is newly marked (FR-004). Locked words can't be
    toggled.
  - Set all text with `textContent` only.
- [x] T009 [US1] In `games/synonyms/game.js`, implement the check flow per contracts/round-flow.md
  "States".
  - **First check with mistakes:** mark correct words `correct` and lock them, and mark wrong
    words `wrong` with "Опитай пак!" shown once. After about 1 s, clear the wrong marks. Write
    `missingText` (or the "wrong marks only" text) to the `aria-live` line, then start attempt 2.
  - **Perfect first check:** "Браво! Намери всички!", a celebration class, then "Напред".
  - **Second check:** show `correct`, `wrong`, and `missed` (★ and the label "и тази"), the text
    "Ето всички думи с близко значение.", and "Напред".
  - In this story, "Напред" starts another random round. US2 replaces this with a series.
- [x] T010 [P] [US1] Add state styles to `games/synonyms/game.css` (R6):
  - `.marked`: ✓ and a thick border, distinguishable in grayscale;
  - `.correct`: green with ✓, locked look;
  - `.wrong`: muted, with a short shake;
  - `.missed`: a dashed gold border with ★, and a small "и тази" label;
  - a disabled look for the action button;
  - a bounce animation on the reference word for `.celebrate`;
  - all animations turned off under `@media (prefers-reduced-motion: reduce)`.

**Checkpoint**: one round can be played end to end, with correct feedback for every case.

---

## Phase 4: User Story 2 - Play a series of rounds (Priority: P2)

**Goal**: 5 rounds without repeats, then a summary with "Играй пак".

**Independent Test**: quickstart scenarios 8–11.

- [x] T011 [US2] Add tests to `tests/synonyms.test.js` for `pickSeries(sets, 5, rng)`:
  - returns 5 distinct sets when the bank is large enough;
  - returns all sets, without repeats, when there are fewer than 5;
  - returns a different order with a different `rng`.

  Add tests for `starsFor(found, total)`: it returns 1–3 and never 0 (R9).
- [x] T012 [US2] Implement `pickSeries(sets, count = 5, rng)` and `starsFor(found, total)` in
  `games/synonyms/logic.js`, so that the T011 tests pass.
- [x] T013 [US2] In `games/synonyms/game.js`, replace the single-round loop with a series:
  - on load, call `pickSeries(validSets, 5)`;
  - show progress such as "1 / 5" near the top (not in the top-left 80 px);
  - "Напред" moves to the next round, and after the last round it shows `#summary`;
  - the summary shows "Браво! Намери {found} от {total} думи." with `starsFor` stars and an
    "Играй пак" button that starts a new `pickSeries`;
  - nothing is stored (FR-015).
- [x] T014 [P] [US2] Add summary and progress styles to `games/synonyms/game.css`: large centered
  summary text, big stars, a full-width "Играй пак" button, and a small progress indicator.

**Checkpoint**: a full series plays through and can be restarted.

---

## Phase 5: User Story 3 - The game is on the portal (Priority: P3)

**Goal**: a "Синоними" tile on the portal.

**Independent Test**: quickstart scenario 12.

- [ ] T015 [P] [US3] Create `games/synonyms/cover.svg`: square (viewBox 0 0 512 512), "at most
  100 KB", friendly, and with no text. It should suggest "words that mean the same", e.g. two
  matching speech bubbles or twin cards with an equals sign.
- [ ] T016 [US3] Add `{ id: "synonyms", name: "Синоними", image: "games/synonyms/cover.svg" }` to
  `window.GAMES` in `games.js`.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T017 Run `node --test tests/` and confirm that every test passes.
- [ ] T018 Run quickstart.md scenarios 1–15 on the local preview server (`/speech-therapist/`) at
  360 px and desktop widths. Record the results under this task and fix any failure. A second
  browser and a real phone are the owner's check.
- [ ] T019 [P] Update `README.md`: list the synonym game, and add a "Tests" section with
  `node --test tests/` and a note that Node is needed only for tests.
- [ ] T020 **Owner**: review and correct every set in `games/synonyms/words.js` (quickstart scenario
  16, FR-011), then remove the "DRAFT" note from its header. This is required before the
  release.

---

## Dependencies & Execution Order

- **Phase 1** (T001, T002): no dependencies.
- **Phase 2**: T003 and T004 can run in parallel, and T005 follows both. This phase blocks all
  stories.
- **US1**: T006 → T007 → T008 → T009. T010 can run in parallel with T008 and T009 (different
  file).
- **US2**: after US1, because it changes `game.js`. Order: T011 → T012 → T013, with T014 in
  parallel.
- **US3**: T015 and T016 can be done at any time after Phase 1; they are independent of US1 and
  US2.
- **Polish**: T017 and T018 after all stories, with T019 in parallel. T020 can happen any time
  after T004, but it must happen before the release.
- **Same-file chains**: tasks that edit `logic.js` (T003 → T007 → T012), `tests/synonyms.test.js`
  (T005 → T006 → T011), and `game.js` (T008 → T009 → T013) must run in order.

## Parallel Example

```text
Phase 2:  T003 logic.js core  ||  T004 words.js bank
US1:      T008/T009 game.js   ||  T010 game.css states
Anytime:  T015 cover.svg
```

## Implementation Strategy

1. **MVP**: Phases 1–3. One round works, and you can check it with the owner's children.
2. Add US2 (series and summary), then US3 (portal tile).
3. Polish, then owner approval (T020), then merge into `develop`.
4. Then the first release: `release/1.0.0` → `main`. Turn on GitHub Pages, then check portal
   scenario 9 of feature 001 on the live site.

## Notes

- 20 tasks: Setup 2, Foundational 3, US1 5, US2 4, US3 2, Polish 4.
- Commit after each phase on `feature/002-synonym-game`.
