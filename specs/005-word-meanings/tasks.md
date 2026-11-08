---

description: "Task list for the Word Meanings Game feature"
---

# Tasks: Word Meanings Game

**Input**: Design documents from `/specs/005-word-meanings/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: included.
- Unit tests for `logic.js` and a structural check of the word bank, run with `node --test`.
- The UI is checked manually per quickstart.md.

**Organization**: tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1, US2 or US3 from spec.md
- Paths are relative to the repository root.
- UI text is Bulgarian and must match [contracts/question-flow.md](contracts/question-flow.md)
  exactly. Code comments are in English.
- `games/antonyms/` is the reference implementation: copy its conventions, the sound helper
  `sfx()`, the controls and the summary. Do not modify any existing game, and do not import from
  one (research R1).

---

## Phase 1: Setup

- [x] T001 Create `games/meanings/index.html` from `games/antonyms/index.html`:
  - keep the home control, the sound control, the `sound.css` link and the `sound.js` script tag
    exactly as they are;
  - set `<title>Какво означава?</title>`;
  - in `#round`, include:
    - `#progress`;
    - the instruction `<p>`: "Какво означава думата?";
    - `#word` (h1);
    - `#sentence` (p);
    - `#options` (a vertical stack);
    - `#feedback` with `aria-live="polite"`;
    - the `#action` button, hidden at first;
  - add `#summary` (hidden) with `#summary-line1`, `#summary-line2`, `#summary-stars` and
    `#again`;
  - load `../../assets/sound/sound.js`, then `words.js`, `logic.js` and `game.js`, as classic
    `<script defer>`;
  - add a Bulgarian `<noscript>`.
- [x] T002 [P] Create `games/meanings/game.css` as its own copy of the shared look in
  `games/antonyms/game.css`: tokens, body padding, font, the in-flow progress, the action button,
  the summary and the reduced-motion rules. Add:
  - `#word`: at least `2.4rem`, bold, centered;
  - `#sentence`: at least `1.3rem`, centered, with a `mark` that is bold and underlined, on a soft
    highlight background;
  - `#options`: a vertical stack with a 12 px gap;
  - `.option`: full width, at least 56 px tall, left-aligned, wrapping text, at least `1.2rem`;
  - `.option.correct`: green, with "✓ " before the text via `::before`;
  - `.option.ruled-out`: muted, dashed border, and a small "не е това" tag. The tag is a real
    `<span>` added by JS, not CSS content, so screen readers announce it;
  - `.option.locked`: dimmed;
  - nothing in the top-left or top-right 80×80 px areas;
  - no sideways scrolling at 360 px.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 [P] Create `games/meanings/logic.js`. It is pure (no DOM) and exposes
  `globalThis.MeaningLogic`, plus `module.exports` under Node. Implement:
  - `normalize(s)`;
  - `parseSentence(s)`: returns `{ before, word, after }` if `s` has exactly one `[...]` with
    non-empty content inside, otherwise `null`;
  - `wordCount(s)`: counts words with brackets and punctuation ignored;
  - `validateEntry(e)`: returns `null` or an English reason, enforcing data-model.md verbatim:
    - `word` is text, "at most 20 characters";
    - `sentence` has "exactly one `[...]` part" and is "at most 12 words and at most 90
      characters, counted without the brackets", and "ends with `.`, `!` or `?`";
    - `right` and each of the 2 `wrong` items are "at most 8 words and at most 60 characters";
    - `wrong` is a list of exactly 2;
    - `right` and both `wrong` are "distinct, compared after trimming and lowercasing";
  - `validateBank(entries)`: returns a list of problems, covering invalid entries, "the same
    `word` and the same `right`", "at least 32 entries" and "at least 8 distinct words";
  - `shuffle(list, rng = Math.random)`: Fisher–Yates, returns a new array.
- [x] T004 [P] Create `games/meanings/words.js` with `globalThis.MEANING_ENTRIES = [...]`:
  - **at least 32** entries for grades 3–4 (R8, SC-006);
  - 3–4 words with two meanings, each given as two entries (e.g. "коса", "ключ");
  - plausible wrong explanations;
  - correct standard Bulgarian;
  - each word marked in its sentence with `[ ]`, inflected forms allowed;
  - a header comment (English) pointing to
    `specs/005-word-meanings/contracts/meaning-entry.md` and saying
    "DRAFT: awaiting owner approval (T020)".

  Make sure no entry has two explanations that are both right for the sentence. When in doubt,
  leave the entry out.
- [x] T005 Create `tests/meanings.test.js` with `node:test` and `node:assert/strict`. It requires
  `games/meanings/logic.js` and `games/meanings/words.js`, and tests:
  - `parseSentence`, for one part, zero parts, two parts and an empty `[]`;
  - `wordCount`;
  - `validateEntry`, for a valid entry and one broken entry per rule;
  - that `validateBank` detects a duplicate word+right pair;
  - that `shuffle` keeps every item and does not mutate its input;
  - that the real bank has no problems.

  Depends on T003 and T004.

**Checkpoint**: `node --test` passes for all suites.

---

## Phase 3: User Story 1 - Choose the meaning of a word (Priority: P1) 🎯 MVP

**Goal**: one fully playable question with immediate feedback and sounds.

**Independent Test**: quickstart scenarios 1–7, 14 and 15.

- [x] T006 [US1] Add a test to `tests/meanings.test.js` for `buildOptions(entry, rng)`: it returns 3
  items `{ text, isRight }`, exactly one with `isRight`, and every explanation exactly once.
- [x] T007 [US1] Implement `buildOptions` in `games/meanings/logic.js` so that the T006 test passes.
- [x] T008 [US1] Create `games/meanings/game.js`, part 1:
  - take the valid entries and skip the invalid ones with `console.warn`;
  - add `function sfx(name) { if (globalThis.GameSound) globalThis.GameSound.play(name); }`;
  - show one random question. Render `#word` and `#sentence` from `parseSentence`, as a text node,
    then a `<mark>`, then a text node, using `textContent` only;
  - render `#options` as `<button type="button" class="option">` from `buildOptions`.
- [x] T009 [US1] In `games/meanings/game.js`, implement the answer flow per
  contracts/question-flow.md:
  - **Right:** `correct`, all others `locked`, `sfx("correct")`, "Браво!", and show "Напред".
    In this story "Напред" shows another random question.
  - **Wrong:** `ruled-out` with a `<span class="tag">не е това</span>`, `disabled`,
    `sfx("try-again")`, "Опитай пак!", set `firstTry = false`, and `busy` for 400 ms.
  - Ignore taps while `busy` or after the question is answered.
- [x] T010 [P] [US1] Check `games/meanings/game.css` against the option states in
  contracts/question-flow.md and add anything that is missing.

**Checkpoint**: one question plays end to end with sounds.

---

## Phase 4: User Story 2 - Play a series of questions (Priority: P2)

**Goal**: 8 questions with different words, then the summary.

**Independent Test**: quickstart scenarios 8–12.

- [ ] T011 [US2] Add tests to `tests/meanings.test.js`:
  - `pickSeries(entries, 8, rng)`, with a fixed seed: it returns 8 entries, no word repeats, and
    it shortens to the number of distinct words when the bank is smaller;
  - `starsFor(found, total)` returns 1–3 and never 0;
  - `summaryLine2(x, y)` returns `"От първия опит: x от y."`.
- [ ] T012 [US2] Implement `pickSeries`, `starsFor` and `summaryLine2` in `games/meanings/logic.js`,
  so that the T011 tests pass.
  - `pickSeries` follows research R4.
  - `starsFor` gives 3 stars at 80% or more, 2 at 50% or more, otherwise 1, and 1 if `total` is
    0.
- [ ] T013 [US2] In `games/meanings/game.js`, replace the random question with a series:
  - start it with `pickSeries(validEntries, 8)`;
  - show progress as "n / 8";
  - on a right answer to the last question, play `sfx("round")` instead of `sfx("correct")`;
  - "Напред" goes to the next question, and after the last one shows `#summary` with
    `sfx("series")`, "Браво! Позна значението на всички думи!", `summaryLine2(firstTry, total)`
    and the `starsFor` stars;
  - "Играй пак" starts a new series;
  - store nothing (FR-013).
- [ ] T014 [P] [US2] Make sure the summary styles in `games/meanings/game.css` match the other
  games.

---

## Phase 5: User Story 3 - The game is on the portal (Priority: P3)

- [ ] T015 [P] [US3] Create `games/meanings/cover.svg`: square (viewBox 0 0 512 512), "at most 100
  KB", friendly, with no text. It should suggest "what does it mean?", for example an open book
  with a big question mark, or a magnifying glass over a word card with no letters.
- [ ] T016 [US3] Add `{ id: "meanings", name: "Какво означава?", image: "games/meanings/cover.svg" }`
  to `window.GAMES` in `games.js`, after "antonyms".

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T017 Run `node --test` and confirm that every suite passes.
- [ ] T018 Run quickstart.md scenarios 1–15 on the local preview server at 360 px and desktop
  widths. Record the results under this task and fix any failure.
- [ ] T019 [P] Update `README.md`: add "Какво означава?" to the Games table, with the folder
  `games/meanings/`, grades 3–4, what the child does, and the word bank
  `games/meanings/words.js`.
- [ ] T020 **Owner**: review and correct every entry in `games/meanings/words.js` (quickstart
  scenario 16, FR-009), then remove the "DRAFT" note. This is required before the release.

---

## Dependencies & Execution Order

- **Phase 1**: T001 and T002 can run in parallel.
- **Phase 2**: T003 and T004 can run in parallel; T005 needs both. Phase 2 blocks all user
  stories.
- **US1**: T006 → T007 → T008 → T009, with T010 in parallel.
- **US2**: comes after US1, because it changes `game.js`. Order T011 → T012 → T013, with T014 in
  parallel.
- **US3**: can be done at any time after Phase 1.
- **Polish**: T017 and T018 come last, with T019 in parallel. T020 must be done before the
  release.
- **Same-file chains**:
  - `logic.js`: T003 → T007 → T012;
  - `tests/meanings.test.js`: T005 → T006 → T011;
  - `game.js`: T008 → T009 → T013.

## Implementation Strategy

1. **MVP**: Phases 1–3, which give one playable question.
2. Then US2 and US3.
3. Then Polish, the owner's approval (T020), and the merge into `develop`.

## Notes

- 20 tasks: Setup 2, Foundational 3, US1 5, US2 4, US3 2, Polish 4.
- Commit after each phase on `feature/005-word-meanings`.
