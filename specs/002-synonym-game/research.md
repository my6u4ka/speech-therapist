# Research: Synonym Game

Phase 0 decisions for [plan.md](plan.md). Each one lists the decision, its rationale, and the
alternatives considered.

## R1. Word bank format

- **Decision**: `games/synonyms/words.js` assigns `globalThis.SYNONYM_SETS = [ ... ]`. Each set is
  `{ word, synonyms: [...], distractors: [...] }`.
- **Rationale**: it works from `file://` (as `games.js` does), and the same file can be loaded by
  Node in tests, because `globalThis` exists in both. Synonyms and distractors are listed
  separately, which is easy for the owner to review and edit (SC-005).
- **Alternatives considered**:
  - JSON with `fetch`: fails from `file://`.
  - One list of candidates with a flag on each word: noisier to edit by hand.

## R2. Separating rules from the screen

- **Decision**: `logic.js` holds pure functions with no DOM access: `validateSet`, `shuffle`,
  `pickSeries`, `checkRound`, and `instructionText`. It exposes them as `globalThis.SynonymLogic`
  and also as `module.exports` when run under Node. `game.js` handles only drawing and events.
- **Rationale**: the game now has real rules (two-step checking, Bulgarian plural forms, series
  picking), and these are worth testing automatically. Pure functions are testable without a
  browser.
- **Alternatives considered**:
  - One file: simpler, but untestable without a browser.
  - ES modules: break `file://` loading.

## R3. Tests

- **Decision**: `tests/synonyms.test.js` uses `node:test` and `node:assert`, and runs with
  `node --test tests/`. It covers:
  - `checkRound` for both checks, and `instructionText` for 1 and several words;
  - `pickSeries`, which must give no repeats and stay short when the bank is small;
  - `shuffle`, which must keep every word;
  - a structural check of every set in `words.js`, against the word-set contract;
  - a check that the bank has at least 20 sets (SC-006).
- **Rationale**: there is no install and no `package.json`, and Node is already on the machine. The
  constitution allows tests that need neither a server nor a build step for the site. This
  revisits research R7 of feature 001, which deferred automated tests until a game had real
  logic.
- **Alternatives considered**:
  - Playwright UI tests: they need npm packages and browsers, which is too heavy for now. Manual
    quickstart checks cover the UI.
  - No tests: the word bank will grow, and a structural check catches errors such as a synonym
    also listed as a distractor.

## R4. Randomness

- **Decision**: use a Fisher–Yates shuffle with an injectable random function, so tests are
  repeatable (`Math.random` by default). `pickSeries` shuffles the bank and takes the first 5 sets,
  or all of them if fewer.
- **Rationale**: this is an unbiased shuffle, and tests can pass a fixed sequence.
- **Alternatives considered**: `sort(() => Math.random() - 0.5)`, which is biased.

## R5. The two-step check

- **Decision**: the first check marks correct marks as `correct`, which locks them, and wrong marks
  as `wrong`. Wrong marks are shown with a gentle style for a moment and then unmarked. The game
  says "Още N" when synonyms are missing. If there were no mistakes, the round ends at once. The
  second check ends the round and adds `missed` to synonyms that are still unmarked. The details
  are in [round-flow.md](contracts/round-flow.md).
- **Rationale**: it matches the amended FR-005 and FR-007, and it makes the second try meaningful,
  because the answer is not revealed after the first check.
- **Alternatives considered**: unlimited tries. Rejected: rounds become guessing, by tapping every
  word until all are green.

## R6. Showing state without relying on color

- **Decision**: each state gets an icon or text as well as a color:
  - marked: ✓ before the word, a thick border, and `aria-pressed="true"`;
  - correct: green with ✓, and locked;
  - wrong: a muted look with a short shake, then back to unmarked. The "Опитай пак!" text is shown
    once, near the button.
  - missed: a dashed gold border with a ★ and the label "и тази" beside it.

  Feedback text goes to an `aria-live` region.
- **Rationale**: FR-003 and accessibility. It also keeps the feedback kind: no red ✗.
- **Alternatives considered**: red and green only, which fails for color-blind children and
  feels harsh.

## R7. Bulgarian instruction text

- **Decision**: `instructionText(n)` returns "Намери 1 дума с близко значение" when n is 1, and
  "Намери N думи с близко значение" when n is 2 or more. The missing-count line follows the same
  rule: "Остава още 1 дума" / "Остават още N думи".
- **Rationale**: correct agreement for both forms (FR-008, Principle II). The owner approves the
  wording.

## R8. Layout

- **Decision**: the reference word is large and centered at the top, below the clear home-control
  area. Candidates are in a flexible grid (`repeat(auto-fill, minmax(140px, 1fr))`), each button at
  least 56 px tall, with text that can wrap. The main action button ("Провери" or "Напред") is
  full-width at the bottom of the content.
- **Rationale**: 2 columns on a 360 px phone and 3–4 on desktop, with no sideways scrolling, even
  for long words (spec edge case, SC-004).

## R9. Celebration and summary

- **Decision**: a short CSS animation for a perfect round (the reference word bounces, and ⭐
  appears), with no sound. The summary shows "Браво! Намери X от Y думи." plus 1–3 stars by share
  found (any share earns at least 1 star), then "Играй пак".
- **Rationale**: positive feedback only (Principle I). There is no "failed" outcome.
- **Alternatives considered**: percentage scores, which feel like grading.

## R10. Initial word bank

- **Decision**: draft at least 20 sets for grades 2–4 during implementation. Each set has 2–4
  synonyms and 6–8 distractors (8–12 candidates in total). At least 2 of the distractors are
  "thinking" distractors: an opposite or a word from the same topic. The owner reviews and
  approves the bank before the release (FR-011). An approval task is in `tasks.md`.
- **Rationale**: SC-006 asks for at least 20 sets. The distractor mix makes the child think about
  meaning instead of guessing by topic.
