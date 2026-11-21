# Research: Sentence Purpose Game

Phase 0 decisions for [plan.md](plan.md). Each one lists the decision, its rationale, and the
alternatives considered.

## R1. Shared helpers: the trigger has fired

- **Decision**: create `assets/shared/play.js` with three pure helpers:
  - `shuffle(list, rng)`: Fisher–Yates, returning a new array;
  - `starsFor(found, total)`: 3 stars at 80% or more, 2 at 50% or more, otherwise 1, and 1 when
    `total` is 0;
  - `firstTryLine(x, y)`: returns `"От първия опит: x от y."`.

  The new game and the three existing games use it. Each game's `logic.js` keeps its exported
  names (`shuffle`, `starsFor`, `summaryLine2` where it exists), so `game.js` and the existing
  tests stay unchanged.
- **Loading**:
  - In the browser, each game page loads `../../assets/shared/play.js` before its own scripts.
  - In Node, `logic.js` resolves the kit as
    `globalThis.PlayKit || require("../../assets/shared/play.js")`.
  - Under Node, `play.js` also sets `module.exports`, so tests can `require` it directly.
- **Rationale**:
  - Feature 005 (R1) set the trigger: "when a fourth game is added". This game is the fourth.
  - The helpers are identical in three games and would be in the fourth.
  - One place to change the star thresholds or the first-try wording.
  - Keeping each game's API means the change is invisible to `game.js` and to 42+ existing tests,
    and those tests prove the migration changed nothing.
- **Not shared**: series building and validation stay per game, because they really differ.
- **Alternatives considered**:
  - Copy again, which ignores the agreed trigger.
  - Change every `game.js` to call `PlayKit` directly, which touches more files for no gain.

## R2. Content format: types and sentences in `words.js`

- **Decision**: `words.js` defines both `globalThis.SENTENCE_TYPES` and
  `globalThis.SENTENCE_ENTRIES`:
  - `SENTENCE_TYPES` is a fixed, ordered list of
    `{ id, label, reason, marks }` for `statement`, `question`, `request`, and `exclamation`;
  - `SENTENCE_ENTRIES` is a list of `{ text, type }`.
- **Rationale**: the labels and reason lines are Bulgarian content that the owner approves
  (FR-005), so they belong with the sentences, not in code (Principle II). Ids stay in English,
  for stable code.

## R3. Validation that matches punctuation and type

- **Decision**: `validateEntry` checks the following:
  - `text` is non-empty, has at most 12 words and at most 90 characters, and starts with a
    capital letter;
  - `type` is a known id;
  - the end mark matches the type's allowed `marks`:
    - `statement`: `.`;
    - `question`: `?`;
    - `request`: `!` or `.` (e.g. "Моля, седни.");
    - `exclamation`: `!`.

  `validateBank` checks that texts are unique (after normalizing) and that each type has at
  least 10 sentences.
- **Rationale**: the end mark is shown (FR-003), so a mismatch, such as a question ending in
  ".", would teach a wrong rule. A test catches it. The rule cannot check meaning, so the owner's
  review covers whether the type is clear (FR-010).

## R4. Building a series

- **Decision**: `buildSeries(entries, perType = 2, rng)` takes the following steps:
  1. Group the entries by type.
  2. Shuffle each group.
  3. Take `perType` entries from each group, or fewer if the group is smaller (spec edge case).
  4. Shuffle the result.
- **Rationale**: FR-007 asks for exactly 2 of each type, in mixed order, with no repeats.

## R5. Answer flow and sounds

- **Decision**:
  - **Correct**:
    - the button shows ✓ and green, and all buttons lock;
    - the feedback reads "Браво! " followed by the reason line;
    - the sound is `correct`, or `round` if this is the last question;
    - "Напред" appears.
  - **Wrong**:
    - the button becomes `ruled-out`, muted with a dashed border, with the tag "не е това", and is
      disabled;
    - the sound is `try-again` and the feedback is "Опитай пак!";
    - the question is no longer counted as a first try;
    - input is ignored for about 400 ms (`busy`).
  - **Summary**: the sound is `series`.
- **Rationale**: the same flow as feature 005, with the reason line added (FR-004, FR-005).

## R6. Layout

- **Decision**, from top to bottom:
  1. the progress line "n / 8";
  2. the instruction "Какво е изречението?";
  3. the sentence, at least 1.6rem, centered, inside a soft card;
  4. the 4 type buttons, at least 56 px tall, with text of at least 1.2rem: one column under 480 px,
     a 2×2 grid above;
  5. the feedback line (`aria-live`);
  6. "Напред".
- **Rationale**: the labels are long ("възклицателно"), and a single column keeps them readable on
  phones.

## R7. Summary texts

- **Decision**:
  - line 1: "Браво! Позна вида на всички изречения!";
  - line 2: `firstTryLine(x, y)`;
  - 1–3 stars.

  The owner approves these texts.

## R8. Initial bank

- **Decision**: draft at least 40 sentences for grades 3–4, at least 10 per type, at most 12 words
  each, on everyday topics. Each type has typical forms:
  - questions: with a question word ("Кога…?") and without one ("Ще дойдеш ли…?");
  - requests: commands and "Моля, …";
  - exclamations: "Колко…!" and "Какъв…!".

  Leave out any sentence whose type is arguable, such as a polite request phrased as a question.
  The owner approves the bank before release.
- **Rationale**: SC-006, the spec edge cases, and the hard pair of request versus exclamation.
