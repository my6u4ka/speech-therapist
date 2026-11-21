---

description: "Task list for the Sentence Purpose Game feature"
---

# Tasks: Sentence Purpose Game

**Input**: Design documents from `/specs/006-sentence-purpose/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: included.
- New suites: `tests/play.test.js` (shared helpers) and `tests/sentences.test.js`.
- The existing suites (synonyms, antonyms, meanings, sound) MUST pass **unchanged** after the
  migration. They are the proof that the migration changed nothing.
- The UI is checked manually per quickstart.md.

**Organization**: the shared helpers and their migration are foundational. After that, tasks are
grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1, US2, or US3 from spec.md
- Paths are relative to the repository root.
- UI text is Bulgarian, exactly as in [contracts/question-flow.md](contracts/question-flow.md).
  Code comments are English.
- `games/meanings/` is the reference implementation for the new game's page, flow, controls, and
  summary.

---

## Phase 1: Setup

- [ ] T001 Create `games/sentences/index.html` from `games/meanings/index.html`.
  - Keep the home control, the sound control, the icon link, `sound.css`, and the `sound.js`
    script tag exactly as they are.
  - Set `<title>Какво е изречението?</title>`.
  - `#round` contains, in this order:
    - `#progress`;
    - the instruction `<p>` "Какво е изречението?";
    - `#sentence`, a card;
    - `#types`, the button container;
    - `#feedback`, with `aria-live="polite"`;
    - `#action`, hidden.
  - Add a `#summary`, hidden, the same as in meanings.
  - Load the scripts as classic `<script defer>`, in this order:
    `../../assets/sound/sound.js`, `../../assets/shared/play.js`, `words.js`, `logic.js`,
    `game.js`.
  - Add a Bulgarian `<noscript>`.
- [ ] T002 [P] Create `games/sentences/game.css` as its own copy of the shared look in
  `games/meanings/game.css`: tokens, body padding, font, progress, action, summary, and
  reduced-motion. Add:
  - `#sentence`: a soft card with a font size of at least `1.6rem`, centered, with wrapping text;
  - `#types`: one column below 480 px wide, and a 2×2 grid from 480 px;
  - `.type`: buttons at least 56 px tall, font size at least `1.2rem`, centered;
  - `.type.correct`: green, with "✓ " via `::before`;
  - `.type.ruled-out`: muted, with a dashed border and a `<span class="tag">` added by JS;
  - `.type.locked`: dimmed;
  - nothing in the top corners' 80×80 px areas, and no sideways scrolling at 360 px.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: add the shared helpers, migrate the existing games to them, and build the rules and
content core of the new game.

- [x] T003 [P] Create `assets/shared/play.js` per contracts/play-helpers.md.
  - It is a classic script with an IIFE that defines `shuffle(list, rng = Math.random)`
    (Fisher–Yates, returns a new array), `starsFor(found, total)`, and `firstTryLine(x, y)`.
  - `starsFor` MUST return exactly what the games' current copies return: 3 at 0.8 or more, 2 at
    0.5 or more, otherwise 1, and 1 when `total` is not greater than 0.
  - It sets `globalThis.PlayKit`, and also `module.exports` when
    `typeof module !== "undefined"`.

  First read the three existing copies in `games/{synonyms,antonyms,meanings}/logic.js`. If they
  differ from each other in any way, STOP and report.
- [x] T004 Create `tests/play.test.js` (`node:test`, `node:assert/strict`). It requires
  `assets/shared/play.js` and tests:
  - `shuffle` keeps every item, does not mutate its input, and is deterministic with a fixed rng;
  - `starsFor` at the boundaries (0/10 → 1, 5/10 → 2, 8/10 → 3, 10/10 → 3, 0/0 → 1), and never
    returns 0;
  - `firstTryLine(7, 8)` returns "От първия опит: 7 от 8.".

  Depends on T003.
- [x] T005 Migrate `games/synonyms/` to the shared helpers.
  - In `index.html`, add `<script defer src="../../assets/shared/play.js"></script>` before
    `words.js`.
  - In `logic.js`, resolve
    `var Kit = globalThis.PlayKit || (typeof require === "function" ? require("../../assets/shared/play.js") : null);`.
  - Replace the bodies of `shuffle` and `starsFor` with `Kit.shuffle` and `Kit.starsFor`.
  - Keep every exported name and every other function unchanged. Do not change `game.js` or
    `tests/synonyms.test.js`.

  Depends on T003.
- [x] T006 [P] Migrate `games/antonyms/` the same way: `shuffle`, `starsFor`, and `summaryLine2`
  (which becomes `Kit.firstTryLine`) in `logic.js`, plus the script tag in `index.html`. Do not
  change `game.js` or `tests/antonyms.test.js`.

  Depends on T003.
- [x] T007 [P] Migrate `games/meanings/` the same way: `shuffle`, `starsFor`, and `summaryLine2`.
  Do not change `game.js` or `tests/meanings.test.js`.

  Depends on T003.
- [ ] T008 Create `games/sentences/logic.js`. It is pure, with no DOM access, and exposes
  `globalThis.SentenceLogic` plus `module.exports` under Node. It resolves `Kit` as in T005 and
  implements:
  - `normalize(s)`;
  - `wordCount(s)`, which ignores punctuation;
  - `validateEntry(entry, types)`, which returns `null` or an English reason and enforces
    data-model.md verbatim:
    - `text` is non-empty, "starts with a capital letter", has "at most 12 words and at most 90
      characters", and "ends with a mark allowed for its type";
    - `type` is one of the ids in `types`;
  - `validateBank(entries, types)`, which returns a list of problems: invalid entries, duplicate
    texts (compared after trimming and lowercasing), and any type with fewer than 10 entries;
  - the wrappers `shuffle`, `starsFor`, and `summaryLine2` (→ `Kit.firstTryLine`).
- [ ] T009 [P] Create `games/sentences/words.js` with:
  - `globalThis.SENTENCE_TYPES`, exactly as the table in data-model.md (ids, labels, reasons,
    marks, in that order);
  - `globalThis.SENTENCE_ENTRIES`, at least 40 entries, at least 10 per type, for grades 3–4 (R8).
    Each type needs typical forms:
    - questions with and without a question word;
    - requests as commands and with "Моля, …";
    - exclamations starting with "Колко…!" and "Какъв/Каква/Какво…!".
  - A header comment in English that points to
    `specs/006-sentence-purpose/contracts/sentence-entry.md` and says
    "DRAFT: awaiting owner approval (T021)".

  Leave out every sentence whose type is arguable, such as polite requests phrased as questions,
  or orders that sound like exclamations. When in doubt, leave it out.
- [ ] T010 Create `tests/sentences.test.js` (`node:test`, `node:assert/strict`). It requires
  `games/sentences/logic.js` and `games/sentences/words.js` and tests:
  - `wordCount`;
  - `validateEntry`: one valid entry per type, plus one broken entry for each rule, including a
    mark that doesn't match the type (e.g. a question ending in ".");
  - that `validateBank` detects a duplicate and a type with too few entries;
  - that `SENTENCE_TYPES` has the 4 ids in order;
  - that the real bank has no problems.

  Depends on T008 and T009.

**Checkpoint**: `node --test` passes, and **all existing suites still pass unchanged**.

---

## Phase 3: User Story 1 - Name the type of a sentence (Priority: P1) 🎯 MVP

**Goal**: one fully playable question with immediate feedback, the reason line, and sounds.

**Independent Test**: quickstart scenarios 1–4, 11, and 12.

- [ ] T011 [US1] Create `games/sentences/game.js` with:
  - valid entries only; invalid ones are skipped with `console.warn`;
  - the guarded `sfx()` helper;
  - one random question, which renders:
    - `#sentence` with `textContent`;
    - `#types` as 4 `<button type="button" class="type">` elements from `SENTENCE_TYPES`, in
      order, with their labels;
  - the answer flow per contracts/question-flow.md:
    - **right**: `correct`, all others `locked`, "Браво! " followed by the reason,
      `sfx("correct")`, and "Напред" shown (in this story, it shows another random question);
    - **wrong**: `ruled-out`, a "не е това" tag span, `disabled`, `sfx("try-again")`,
      "Опитай пак!", `firstTry = false`, and busy for 400 ms;
  - taps ignored while busy or after the question is answered.
- [ ] T012 [P] [US1] Check `games/sentences/game.css` against the button states in
  question-flow.md, and add anything missing.

**Checkpoint**: one question plays end to end.

---

## Phase 4: User Story 2 - Play a series of sentences (Priority: P2)

**Goal**: 8 sentences, 2 of each type, then a summary.

**Independent Test**: quickstart scenarios 5–9.

- [ ] T013 [US2] Add tests to `tests/sentences.test.js` for `buildSeries(entries, 2, rng)`:
  - with the real bank and a fixed seed, it returns 8 entries, exactly 2 per type, with no
    repeats;
  - a small bank, such as 1 entry of one type, gives fewer and never throws;
  - a different rng gives a different order.
- [ ] T014 [US2] Implement `buildSeries` in `games/sentences/logic.js` per research R4, so that the
  T013 tests pass.
- [ ] T015 [US2] In `games/sentences/game.js`, replace the random question with a series:
  - call `buildSeries(validEntries, 2)` and show the progress "n / 8";
  - play `sfx("round")` instead of `sfx("correct")` on the last question;
  - make "Напред" go to the next question, and after the last one show `#summary`, play
    `sfx("series")`, and show "Браво! Позна вида на всички изречения!",
    `summaryLine2(firstTry, total)`, and the `starsFor` stars;
  - make "Играй пак" start a new series;
  - store nothing.

---

## Phase 5: User Story 3 - The game is on the portal (Priority: P3)

- [ ] T016 [P] [US3] Create `games/sentences/cover.svg`: square (viewBox 0 0 512 512), "at most
  100 KB", friendly, with no letters or words. It should suggest sentence types, for example 4
  speech bubbles holding the marks `.`, `?`, `!` and a pointing hand. Punctuation marks are
  allowed.
- [ ] T017 [US3] Add
  `{ id: "sentences", name: "Какво е изречението?", image: "games/sentences/cover.svg" }` to
  `window.GAMES` in `games.js`, after "meanings".

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T018 Run `node --test` and confirm that every suite passes, both the new ones and the
  unchanged existing ones.
- [ ] T019 Run quickstart.md scenarios 1–13 on the local preview server at 360 px and on desktop.
  This includes scenario 13: one series each of Синоними, Антоними, and Какво означава? after the
  migration. Record the results under this task and fix any failures.
- [ ] T020 [P] Update `README.md`:
  - add "Какво е изречението?" to the Games table (`games/sentences/`, grades 3–4, what the child
    does, and the content file `games/sentences/words.js`);
  - add a short note that the shared game helpers live in `assets/shared/play.js`, with a link to
    `specs/006-sentence-purpose/contracts/play-helpers.md`.
- [ ] T021 **Owner**: review and correct every sentence, label, and reason in
  `games/sentences/words.js` (quickstart scenario 14, FR-010), then remove the "DRAFT" note. This
  is required before release.

---

## Dependencies & Execution Order

- **Phase 1**: T001 and T002 can run in parallel.
- **Phase 2**:
  - T003, then T004.
  - T005, T006, and T007 each come after T003. They touch different game folders, so they can run
    in parallel.
  - T008 comes after T003. T009 can run in parallel with it, and T010 comes after both.
  - This phase blocks the user stories.
- **US1**: T011, with T012 in parallel.
- **US2**: comes after US1: T013 → T014 → T015.
- **US3**: can run any time after Phase 1.
- **Polish**: T018 and T019 come last, with T020 in parallel. T021 must be done before release.
- **Same-file chains**:
  - `games/sentences/logic.js`: T008 → T014;
  - `tests/sentences.test.js`: T010 → T013;
  - `games/sentences/game.js`: T011 → T015.

## Implementation Strategy

1. Do the shared helpers and the migration first (T003–T007). Confirm that every existing suite
   still passes before going on.
2. **MVP**: the rest of Phase 2, then US1.
3. Then US2, US3, and the polish tasks. The owner approves the content (T021), then the branch
   merges into `develop`.

## Notes

- There are 21 tasks: Setup 2, Foundational 8 (of which migration is 5), US1 2, US2 3, US3 2,
  Polish 4.
- Commit after each phase, and keep the migration (T003–T007) in its own commit so it is easy to
  review or revert.
