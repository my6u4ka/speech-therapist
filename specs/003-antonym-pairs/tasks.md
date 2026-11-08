---

description: "Task list for the Antonym Pairs Game feature"
---

# Tasks: Antonym Pairs Game

**Input**: Design documents from `/specs/003-antonym-pairs/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: included. Unit tests cover `logic.js`, and a structural check covers the word bank, run
with `node --test` (Node built-ins only). The UI is checked manually per quickstart.md.

**Organization**: tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1, US2, US3 from spec.md
- Paths are relative to the repository root.
- UI text is Bulgarian, exactly as in [contracts/round-flow.md](contracts/round-flow.md); code
  comments are English.
- `games/synonyms/` is the reference implementation for conventions. Read it first, but do not
  modify it, and do not import from it (research R1).

---

## Phase 1: Setup

- [x] T001 Create `games/antonyms/index.html` from `games/_template/index.html`:
  - keep the home control exactly as it is;
  - set `<title>Антоними</title>` and link `game.css`;
  - add `#round` with:
    - `#progress`;
    - the instruction `<p>` with the text "Свържи думите с противоположно значение";
    - a `.columns` container holding `#left` and `#right`;
    - the `#feedback` line with `aria-live="polite"`;
    - the `#action` button, hidden until the round is complete;
  - add a hidden `#summary` with `#summary-line1`, `#summary-line2`, `#summary-stars`, and the
    `#again` button;
  - load `words.js`, `logic.js`, and `game.js` as classic `<script defer>`;
  - add a Bulgarian `<noscript>` message;
  - keep the top-left 80×80 px area clear.
- [x] T002 [P] Create `games/antonyms/game.css`, an own copy of the look of
  `games/synonyms/game.css` (tokens, body padding `88px 16px 16px`, font stack, action button,
  progress, summary, `prefers-reduced-motion`). Add:
  - `.columns`: a 2-column grid with a 16 px gap; each column is a vertical stack with a 12 px gap;
  - `.word`: buttons at least 56 px tall, font at least `1.3rem`, with wrapping text;
  - `.selected`: a thick outline and a "●" before the word, distinguishable in grayscale;
  - `.wrong`: muted, with a short shake;
  - `.matched` with `.pair-1` … `.pair-5`: 5 distinct, accessible background colors, plus a
    "✓ n" badge;
  - no sideways scrolling at 360 px.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 [P] Create `games/antonyms/logic.js` (pure, no DOM). It exposes `globalThis.AntonymLogic`,
  and also `module.exports` under Node. Implement:
  - `normalize(w)`.
  - `validatePair(p)`, which returns `null` or an English reason, enforcing data-model.md
    verbatim:
    - `a` and `b` are text, "at most 16 characters", and different after normalizing;
    - `avoid` is optional; if present, it is a list of text items, each "at most 16 characters",
      and none of them is `a` or `b`.
  - `validateBank(pairs)`: a list of problems, covering invalid pairs, "the same pair in either
    order", and "at least 40 pairs".
  - `conflicts(p, q)` per research R3: they share a normalized word, or a word of one is in the
    other's `avoid`, in either direction.
  - `shuffle(list, rng = Math.random)`: Fisher–Yates; returns a new array.
- [x] T004 [P] Create `games/antonyms/words.js` with `globalThis.ANTONYM_PAIRS = [...]`:
  - **at least 40** pairs for grades 2–4 (R9, SC-006), mixing adjectives, verbs, nouns, and
    adverbs;
  - common, correctly spelled standard Bulgarian;
  - `avoid` wherever a word has a close synonym or a second opposite elsewhere in the bank;
  - a header comment (English) that points to `specs/003-antonym-pairs/contracts/antonym-pair.md`
    and says "DRAFT: awaiting owner approval (T020)";
  - only clear, everyday opposites. When in doubt, leave a pair out.
- [x] T005 Create `tests/antonyms.test.js` with `node:test` and `node:assert/strict`. It requires
  `games/antonyms/logic.js` and `games/antonyms/words.js` and tests:
  - `validatePair` against a valid pair and against one broken pair per rule;
  - `validateBank` detecting a reversed duplicate;
  - `conflicts`, for a shared word, for `avoid` in each direction, and for no conflict;
  - that `shuffle` keeps every item and does not mutate its input;
  - that the real bank has no problems from `validateBank`.

  Depends on T003 and T004.

**Checkpoint**: `node --test` passes, including the existing synonym tests.

---

## Phase 3: User Story 1 - Match words with their opposites (Priority: P1) 🎯 MVP

**Goal**: one fully playable round with immediate feedback.

**Independent Test**: quickstart scenarios 1–10, 16, 17.

### Tests for User Story 1

- [x] T006 [US1] Add tests to `tests/antonyms.test.js` for:
  - `buildColumns(roundPairs, rng)`: two columns of equal length; every word appears exactly once;
    each item carries its `pairIndex`; each pair has exactly one word on each side;
  - `isPair(itemX, itemY)`: true only for the same `pairIndex` from opposite columns;
  - `firstTryCount(roundPairs, triedWrong)`: counts the pairs where neither word is in
    `triedWrong`.

### Implementation for User Story 1

- [x] T007 [US1] Implement `buildColumns`, `isPair`, and `firstTryCount` in
  `games/antonyms/logic.js` per research R5 and data-model.md, so that the T006 tests pass.
- [x] T008 [US1] Create `games/antonyms/game.js`, part 1:
  - take the valid pairs (skip invalid ones with `console.warn`);
  - build one round from 5 conflict-free pairs (temporary: shuffle the bank and take pairs
    greedily with `conflicts`; US2 replaces this with `buildSeries`);
  - render `#left` and `#right` as `<button type="button" class="word" aria-pressed="false">`,
    using `textContent` only;
  - implement selection per contracts/round-flow.md "Flow": select, tap again to unselect, tap
    in the same column to move the selection.
- [x] T009 [US1] In `games/antonyms/game.js`, implement pairing:
  - tapping in the other column calls `isPair`;
  - **correct**: both words lock as `matched pair-n` with the badge "✓ n" (n = the next number,
    1–5), and the feedback line says "Да!";
  - **wrong**: both get `wrong`, the feedback says "Опитай пак!", input is ignored (`busy`) for
    about 900 ms, then both return to idle; add both words to `triedWrong`;
  - tapping a matched word does nothing;
  - when all 5 are matched, show "Браво! Всички двойки са свързани!", add a celebrate animation,
    and show `#action` "Напред" (in this story, it starts another round).
- [x] T010 [P] [US1] Check `games/antonyms/game.css` against every state in contracts/round-flow.md
  "Word button states", and add anything missing, e.g. the badge position or the celebrate
  keyframes.

**Checkpoint**: one round can be played end to end.

---

## Phase 4: User Story 2 - Play a series of rounds (Priority: P2)

**Goal**: 5 rounds without repeated pairs or conflicts, then a summary.

**Independent Test**: quickstart scenarios 11–14.

- [ ] T011 [US2] Add tests to `tests/antonyms.test.js` for:
  - `buildSeries(pairs, 5, 5, rng)`:
    - with the real bank and a fixed seeded rng: 5 rounds of 5;
    - no pair repeats across the series;
    - no two pairs in one round `conflict`;
    - a small bank (e.g. 7 pairs) gives a shorter series and never throws;
  - `starsFor(found, total)`: returns 1–3 and never 0;
  - `summaryLine2(x, y)`: returns "От първия опит: x от y.".
- [ ] T012 [US2] Implement `buildSeries` (research R4: greedy fill with up to 20 reshuffles, keeping
  the best result), `starsFor` (3 stars at 80% or more, 2 at 50% or more, otherwise 1; 1 if
  `total` is 0), and `summaryLine2` in `games/antonyms/logic.js`, so that the T011 tests pass.
- [ ] T013 [US2] In `games/antonyms/game.js`, replace the temporary round building with a series:
  - on load, call `buildSeries(validPairs, 5, 5)`;
  - show the progress "n / 5";
  - "Напред" goes to the next round, and after the last round it shows `#summary`;
  - the summary shows "Браво! Свърза всички двойки!", `summaryLine2(firstTry, total)`, and
    `starsFor` stars;
  - "Играй пак" starts a new series;
  - nothing is stored (FR-015).
- [ ] T014 [P] [US2] Make sure the summary and progress styles in `games/antonyms/game.css` match
  the synonym game.

**Checkpoint**: a full series plays through and restarts.

---

## Phase 5: User Story 3 - The game is on the portal (Priority: P3)

- [ ] T015 [P] [US3] Create `games/antonyms/cover.svg`: square (viewBox 0 0 512 512), "at most
  100 KB", friendly, with no text. It should suggest opposites, e.g. a sun and a moon, or an up
  arrow and a down arrow, joined in the middle.
- [ ] T016 [US3] Add `{ id: "antonyms", name: "Антоними", image: "games/antonyms/cover.svg" }` to
  `window.GAMES` in `games.js`, after the "synonyms" entry.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T017 Run `node --test` and confirm that every test passes, for both games.
- [ ] T018 Run quickstart.md scenarios 1–17 on the local preview server at 360 px and desktop widths,
  record the results under this task, and fix any failures.
- [ ] T019 [P] Update `README.md`: add "Антоними" to the Games table (folder, grades 2–4, what the
  child does, and the word bank `games/antonyms/words.js`).
- [ ] T020 **Owner**: review and correct every pair in `games/antonyms/words.js` (quickstart
  scenario 18, FR-011), then remove the "DRAFT" note. This is required before the release.

---

## Dependencies & Execution Order

- **Phase 1**: T001 and T002 can run in parallel.
- **Phase 2**: T003 and T004 can run in parallel; T005 follows both. This phase blocks all
  stories.
- **US1**: T006 → T007 → T008 → T009, with T010 in parallel with T008 and T009.
- **US2**: after US1 (it changes `game.js`): T011 → T012 → T013, with T014 in parallel.
- **US3**: T015 and T016 can be done at any time after Phase 1.
- **Polish**: T017 and T018 after all stories, with T019 in parallel. T020 is needed before the
  release.
- **Same-file chains**:
  - `logic.js`: T003 → T007 → T012;
  - `tests/antonyms.test.js`: T005 → T006 → T011;
  - `game.js`: T008 → T009 → T013.

## Parallel Example

```text
Phase 2:  T003 logic.js core  ||  T004 words.js bank
US1:      T008/T009 game.js   ||  T010 game.css states
Anytime:  T015 cover.svg
```

## Implementation Strategy

1. **MVP**: Phases 1–3, which give one playable round.
2. Then US2 (series and summary) and US3 (portal tile).
3. Polish, then owner approval (T020), then merge into `develop`.

## Notes

- 20 tasks: Setup 2, Foundational 3, US1 5, US2 4, US3 2, Polish 4.
- Commit after each phase on `feature/003-antonym-pairs`.
