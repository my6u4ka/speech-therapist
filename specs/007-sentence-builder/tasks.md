---

description: "Task list for the Sentence Builder Game feature"
---

# Tasks: Sentence Builder Game

**Input**: Design documents from `/specs/007-sentence-builder/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: included.
- Unit tests for `logic.js` and a structural check of the bank, run with `node --test`.
- Dragging and the UI are checked in the browser per quickstart.md, including synthetic pointer
  events.

**Organization**: tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1, US2, or US3 from spec.md
- Paths are relative to the repository root.
- UI text is Bulgarian, exactly as in [contracts/board-flow.md](contracts/board-flow.md). Code
  comments are English.
- `games/sentences/` is the reference for the page, controls, shared helpers, summary, and `sfx()`.
  Do not modify any existing game or shared asset.

---

## Phase 1: Setup

- [ ] T001 Create `games/builder/index.html` from `games/sentences/index.html`:
  - keep the home control, the sound control, the icon link, `sound.css`, and the script tags for
    `sound.js` and `play.js` exactly as they are;
  - set `<title>Подреди изречението</title>`;
  - `#round` contains `#progress`, the instruction `<p>` "Подреди думите в изречение", `#slots`,
    `#pool`, `#full` (a `<p>`, hidden), `#feedback` (`aria-live="polite"`), and `#action`;
  - `#action` is the main button: "Провери" before solving, "Напред" after;
  - add `#summary` (hidden), as in sentences;
  - load the scripts as classic `<script defer>`, in this order: `sound.js`, `play.js`,
    `words.js`, `logic.js`, `game.js`;
  - add a Bulgarian `<noscript>`.
- [ ] T002 [P] Create `games/builder/game.css`, a copy of the shared look in
  `games/sentences/game.css`, and add:
  - `#slots` and `#pool`: flex-wrap rows with a 10 px gap, centered. `#pool` has a soft
    background and a minimum height of 72 px, so it stays a drop target when it is empty.
  - `.slot`: at least 80 px wide and 56 px tall, with a dashed outline when empty and a
    highlighted outline in `.slot.over`.
  - `.card`: a button at least 48 px tall, with a font of at least 1.3 rem, rounded corners,
    `touch-action: none`, and `user-select: none`.
  - `.card.dragging`: `position: fixed`, `pointer-events: none`, a shadow, `scale(1.05)`, and a
    high `z-index`.
  - `.card.locked`: green, with "✓ " via `::before`.
  - `.card.retry`: a dashed border and a `.tag` span (added by JS).
  - `#full`: the solved sentence, at least 1.4 rem, centered.
  - Nothing in the 80×80 px areas at the top corners, and no sideways scrolling at 360 px.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T003 [P] Create `games/builder/logic.js`. It is pure (no DOM) and exposes
  `globalThis.BuilderLogic`, plus `module.exports` under Node. It resolves `Kit` like
  `games/sentences/logic.js` and implements:
  - `tokenize(text)`: splits on single spaces and strips `.?!`, returning the words.
  - `displayWord(word, index, entry)`: lowercases the first character of word 0, unless
    `entry.firstIsName` is true; returns every other word unchanged.
  - `validateEntry(entry)`: returns `null` or an English reason, and enforces data-model.md
    verbatim:
    - the sentence "starts with a capital letter and ends with `.`, `?`, or `!`, with no other
      punctuation";
    - it has "4–8 words separated by single spaces", and "each word has at most 14 letters";
    - `firstIsName` is boolean if present.
  - `validateBank(entries)`: returns a list of problems, covering invalid entries, duplicate texts
    (after trimming and lowercasing), and "at least 30 entries".
  - The wrappers `shuffle`, `starsFor`, and `summaryLine2`, which delegate to `Kit`.
- [ ] T004 [P] Create `games/builder/words.js` with `globalThis.BUILDER_SENTENCES = [...]`:
  - **at least 30** sentences for grades 3–4 (R10), with 4–8 words and no commas or other inner
    punctuation;
  - a mix of statements, questions, and exclamations;
  - `firstIsName: true` only where the first word is a name;
  - a header comment in English that points to
    `specs/007-sentence-builder/contracts/sentence-entry.md` and says
    "DRAFT: awaiting owner approval (T020)".

  **Every sentence MUST have only one natural word order** (FR-006). Prefer orders that the
  grammar fixes, such as preposition + noun, adjective + noun, or a question word first. Avoid
  movable time or place phrases, and subject–verb–object sentences whose reversed order is
  equally natural. When in doubt, leave the sentence out.
- [ ] T005 Create `tests/builder.test.js` (`node:test`, `node:assert/strict`). It requires
  `games/builder/logic.js` and `games/builder/words.js`, and tests:
  - `tokenize`, including the end marks `?` and `!`;
  - `displayWord`, with and without `firstIsName`, and for a mid-sentence name that keeps its
    capital;
  - `validateEntry`, with a valid entry and one broken entry per rule (a comma, 3 words, 9
    words, a long word, a lowercase start, a missing end mark);
  - that `validateBank` detects a duplicate;
  - that the real bank has no problems.

  Depends on T003 and T004.

**Checkpoint**: `node --test` passes for all suites.

---

## Phase 3: User Story 1 - Arrange the words into a sentence (Priority: P1) 🎯 MVP

**Goal**: one sentence playable with dragging (touch and mouse), tapping, and the keyboard, with
checking.

**Independent Test**: quickstart scenarios 1–10, 15, and 16.

- [ ] T006 [US1] Add tests to `tests/builder.test.js` for:
  - `scramble(words, rng)`: returns the same multiset of words, and its order differs from the
    input whenever at least 2 distinct words exist. Test it with several seeds.
  - `checkBoard(target, slotWords)`: all right, some wrong, and a repeated word that is right in
    either place.
- [ ] T007 [US1] Implement `scramble` and `checkBoard` in `games/builder/logic.js` per research R6,
  so that the T006 tests pass.
- [ ] T008 [US1] Create `games/builder/game.js`, part 1: the board and moves.
  - Take valid entries only, with a `console.warn` for each invalid one, and add the guarded
    `sfx()`.
  - For a random entry, build the cards from `scramble(tokenize(text))`, labeled with
    `displayWord`, as `<button type="button" class="card">`. Each card gets an `aria-label` with
    its word and place, e.g. "котката, място 2".
  - Render N empty `.slot` elements.
  - Implement the move functions per contracts/board-flow.md "Moves":
    - `placeInSlot(card, i)`, with replace or swap semantics;
    - `returnToPool(card)`;
    - `firstEmptySlot()`.

    Every successful move re-renders the board, clears the card's `retry` state, plays
    `sfx("tap")`, and updates "Провери" (enabled only when every slot is filled).
  - Tap, click, Enter, or Space on a pool card places it in the first empty slot. On a slot card
    that is not locked, it returns the card to the pool.
- [ ] T009 [US1] In `games/builder/game.js`, implement the drag module per research R1 and R3:
  - On `pointerdown` on a card that is not locked, record the start point and call
    `setPointerCapture`.
  - After more than 8 px of movement, start the drag:
    - add `.dragging`;
    - position the card with `transform`, following the pointer;
    - hit-test with `document.elementFromPoint` to find a `.slot` or `#pool`;
    - toggle `.over` on the target.
  - On `pointerup`:
    - drop according to the R3 table;
    - reject drops on a locked slot or outside any target;
    - clean up the styles;
    - suppress the click that follows a drag, so it is not treated as a tap.
  - `pointercancel` returns the card. Use no library and not the HTML5 drag-and-drop API.
- [ ] T010 [US1] In `games/builder/game.js`, implement the check per contracts/board-flow.md
  "Check":
  - **All right:** lock every card, show `#full` with `entry.text` (`textContent`), show
    "Браво!", play `sfx("correct")`, and turn the button into "Напред". In this story, "Напред"
    shows another random sentence.
  - **Some wrong:** lock the right cards. Give the wrong ones `retry` with a
    `<span class="tag">опитай пак</span>`. Show "Почти! Премести думите с „опитай пак“.", play
    `sfx("try-again")`, and set `firstTry = false`.
- [ ] T011 [P] [US1] Check `games/builder/game.css` against the card states in board-flow.md and add
  anything missing. Make sure a dragged card stays visible above the other content on mobile.

**Checkpoint**: one sentence can be solved by dragging, by tapping, and with the keyboard.

---

## Phase 4: User Story 2 - Play a series of sentences (Priority: P2)

**Goal**: 6 sentences from shorter to longer, then the summary.

**Independent Test**: quickstart scenarios 11–13.

- [ ] T012 [US2] Add tests to `tests/builder.test.js` for `pickSeries(entries, 6, rng)`:
  - with the real bank and a fixed seed, it returns 6 entries with no repeats, sorted by word count
    (ascending);
  - a small bank gives fewer entries and never throws.
- [ ] T013 [US2] Implement `pickSeries` in `games/builder/logic.js` per research R7, so that the
  T012 tests pass.
- [ ] T014 [US2] In `games/builder/game.js`, replace the random sentence with a series:
  - call `pickSeries(validEntries, 6)` and show the progress "n / 6";
  - on the last sentence, play `sfx("round")` instead of `"correct"`;
  - "Напред" goes to the next sentence. After the last one, show `#summary` with
    `sfx("series")`, "Браво! Подреди всички изречения!", `summaryLine2`, and the stars;
  - "Играй пак" starts a new series;
  - store nothing.

---

## Phase 5: User Story 3 - The game is on the portal (Priority: P3)

- [ ] T015 [P] [US3] Create `games/builder/cover.svg`: square (viewBox 0 0 512 512), "at most 100
  KB", friendly, with no readable words. It should suggest arranging words, for example colorful
  word cards with blank lines and an arrow moving one card into a row.
- [ ] T016 [US3] Add
  `{ id: "builder", name: "Подреди изречението", image: "games/builder/cover.svg" }` to
  `window.GAMES` in `games.js`, after "sentences".

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T017 Run `node --test` and confirm that every suite passes.
- [ ] T018 Run quickstart.md scenarios 1–16 on the local preview server at 360 px (with touch
  emulation where possible) and on desktop. Include dragging with synthetic pointer events, and
  record the results under this task. Fix any failure.
- [ ] T019 [P] Update `README.md`: add "Подреди изречението" to the Games table, with
  `games/builder/`, grades 3–4, what the child does (drag or tap), and the content file
  `games/builder/words.js`.
- [ ] T020 **Owner**: review every sentence in `games/builder/words.js` (quickstart scenario 17,
  FR-006 and FR-011), with special attention to "only one natural word order". Then remove the
  "DRAFT" note. This is required before the release.

---

## Dependencies & Execution Order

- **Phase 1**: T001 and T002 can run in parallel.
- **Phase 2**: T003 and T004 can run in parallel; T005 depends on both. This phase blocks all
  user stories.
- **US1**: T006 → T007 → T008 → T009 → T010, with T011 in parallel.
- **US2**: after US1. T012 → T013 → T014.
- **US3**: any time after Phase 1.
- **Polish**: T017 and T018 last, with T019 in parallel. T020 is required before the release.
- **Same-file chains**:
  - `logic.js`: T003 → T007 → T013;
  - `tests/builder.test.js`: T005 → T006 → T012;
  - `game.js`: T008 → T009 → T010 → T014.

## Implementation Strategy

1. **MVP**: Phases 1–3. One sentence is playable with every input method.
2. Then US2 and US3.
3. Polish, the owner's approval (T020), and the merge into `develop`.

## Notes

- 20 tasks: Setup 2, Foundational 3, US1 6, US2 3, US3 2, Polish 4.
- Commit after each phase on `feature/007-sentence-builder`.
