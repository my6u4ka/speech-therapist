# Research: Antonym Pairs Game

Phase 0 decisions for [plan.md](plan.md). Each one lists the decision, its rationale, and the
alternatives considered.

## R1. Shared code with the synonym game

- **Decision**: share no code. `games/antonyms/logic.js` gets its own `shuffle` (Fisher–Yates) and
  `starsFor`, and `game.css` is an own copy of the synonym game's look.
- **Rationale**: the real overlap is about 15 lines (`shuffle`, `starsFor`). The series logic is
  different: the synonym game picks 5 sets, while this game builds 5 rounds of 5 pairs under
  conflict rules. A shared file would mean editing the working synonym game and its tests, and a
  later change for one game could break the other. Principle V allows sharing but does not require
  it. Its first rule ("every game MUST be self-contained") favors copying here.
- **Alternatives considered**: `assets/shared/random.js` used by both games. Revisit it when a third
  game needs the same helpers. At that point the saving is real, and the shape of the shared API
  is clear.

## R2. Word bank format

- **Decision**: `games/antonyms/words.js` sets `globalThis.ANTONYM_PAIRS = [ ... ]`, where each pair
  is `{ a, b, avoid? }`. `avoid` is an optional list of words that must not appear in the same round
  as this pair, because they would be a second possible opposite or a near-synonym of one of its
  words.
- **Rationale**: it is easy for the owner to read and edit (SC-005), it works from `file://`, and Node
  can `require` it.
- **Alternatives considered**:
  - Groups of mutually exclusive pairs: harder to edit.
  - Automatic synonym detection: not possible without a dictionary.

## R3. Conflict rules for a round

- **Decision**: two pairs conflict, and so cannot be in the same round, if either of these is true:
  - they share a word (after trimming and lowercasing), for example "стар–млад" and "стар–нов";
  - a word of one pair is listed in the other pair's `avoid` (in either direction). For example,
    "голям–малък" with `avoid: ["мъничък", "дребен"]` cannot share a round with "огромен–мъничък".
- **Rationale**: this guarantees the spec edge case and SC-003: every shown word has exactly one
  opposite among the shown words.

## R4. Building a series

- **Decision**: `buildSeries(pairs, rounds = 5, perRound = 5, rng)`:
  1. Shuffle the bank.
  2. Fill each round greedily, taking the next unused pair that conflicts with nothing already in
     the round.
  3. Stop when a round can't be filled with `perRound` pairs.
  4. Never reuse a pair within the series.
  5. If the greedy pass yields fewer than `rounds` full rounds, retry with a new shuffle (up to 20
     tries) and keep the best result. A small bank therefore gives a shorter series (spec edge
     case).
- **Rationale**: this is simple and fast for a bank of a few hundred pairs, and it can be tested
  with a seeded random function.
- **Alternatives considered**: exact matching or backtracking search, which is overkill for this
  size.

## R5. Columns

- **Decision**: `buildColumns(roundPairs, rng)`. For each pair, a coin flip decides which word goes
  left. Then both columns are shuffled on their own. Each word keeps its pair's index, for
  checking.
- **Rationale**: FR-002 (random order), and the left column is not always the same kind of word,
  for example always the "positive" one.

## R6. Selection and pairing

- **Decision**:
  - Tapping a word selects it, shown with an outline and a "●" marker plus `aria-pressed`.
  - Tapping the same word again unselects it, and tapping another word in the same column moves
    the selection.
  - Tapping a word in the other column evaluates the pair:
    - **correct**: both words lock and get the next pair number (1–5), a matching color, and
      "✓ n";
    - **wrong**: both show the `wrong` state and "Опитай пак!" for about 0.9 s, input is paused
      (`busy`) so rapid taps can't stack, and then both return to unselected.

  Words that took part in a wrong pairing are remembered for the first-try count (FR-009).
- **Rationale**: FR-003, FR-005, FR-006, and the rapid-tap edge case. Numbers make pairs readable
  without color, and 5 colors are distinguishable.

## R7. Summary

- **Decision**: the summary reads "Браво! Свърза всички двойки!" followed by "От първия опит: X от
  Y.", plus `starsFor(X, Y)` stars (1–3, never 0). Y is the number of pairs in the series.
- **Rationale**: FR-009, with positive framing only. The round always ends with every pair correct,
  so the child truly "connected all pairs".

## R8. Layout

- **Decision**: two columns side by side in a 2-column grid with a 16 px gap. Each word button is at
  least 56 px tall with wrapping text. Above them are the instruction and the progress "n / 5"
  (top-right). Below are the feedback line (`aria-live`) and "Напред", which appears when the round
  is complete.
- **Rationale**: at 360 px each column is about 156 px, enough for the longest expected words
  ("затварям", "страхлив"). Pairs stay side by side, so there is no need to draw lines between
  them.

## R9. Initial word bank

- **Decision**: draft at least 40 pairs for grades 2–4: adjectives, verbs, nouns, and adverbs, with
  `avoid` wherever a word has a close synonym elsewhere in the bank. The owner approves the bank
  before release (FR-011).
- **Rationale**: SC-006. A series needs 25 conflict-free pairs.
