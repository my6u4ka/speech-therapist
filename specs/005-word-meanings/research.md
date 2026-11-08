# Research: Word Meanings Game

Phase 0 decisions for [plan.md](plan.md). Each one lists the decision, its rationale, and the
alternatives considered.

## R1. Shared helpers, revisited at the third game

- **Decision**: still share no game logic. `games/meanings/logic.js` has its own `shuffle`,
  `starsFor`, and `summaryLine2`, about 25 lines.
- **Rationale**: feature 003 (R1) said to revisit sharing when a third game needs the same
  helpers. Now:
  - The helpers are tiny and stable: none has changed since it was written, and none has needed a
    fix.
  - Each game's series logic is different: synonym sets, conflict-free antonym rounds, and here one
    entry per word.
  - Sharing would mean refactoring two working, tested games, and their tests would then need the
    shared file loaded first.
  - Principle V's first rule ("every game MUST be self-contained") still favors copies at this
    size. The home control and sounds are shared because they are user-visible behavior that must
    match exactly; these helpers are not.
- **Revisit trigger**: share them as soon as one of these helpers needs a bug fix or a change in
  more than one game, or when a fourth game is added.
- **Alternatives considered**: `assets/shared/play-utils.js`, used by the new game only, which
  would leave three copies anyway; or migrating all three games now. The second option is the
  right one once the trigger fires, not before.

## R2. Highlighting the word in the sentence

- **Decision**: the `sentence` field marks the word in square brackets, for example
  "Баба коси ливадата с [коса]." The brackets may hold an inflected form, such as "[косата]".
  `parseSentence(s)` returns `{ before, word, after }`. The game renders the result with text
  nodes plus a `<mark>` element, using `textContent` only.
- **Rationale**: the owner can easily write and read this format, and it supports Bulgarian
  inflection (the form in the sentence may differ from the headword). It needs no `innerHTML`.
- **Alternatives considered**: auto-finding the headword in the sentence. This fails for inflected
  forms such as "коса" and "косата".

## R3. Entry format and limits

- **Decision**: `{ word, sentence, right, wrong: [w1, w2] }`, with these limits:
  - the word is at most 20 characters;
  - the sentence has exactly one bracketed part, at most 12 words, and at most 90 characters;
  - each explanation is at most 8 words and at most 60 characters;
  - the 3 explanations are distinct.
- **Rationale**: the limits turn FR-002 and FR-003 ("at most about 12 / 8 words") into rules that
  can be tested, and they keep everything readable on a 360 px phone.

## R4. Series building

- **Decision**: `pickSeries(entries, 8, rng)` shuffles the bank and walks it, taking an entry only
  if its normalized `word` is not used yet. It stops at 8, or when the bank runs out (spec edge
  case).
- **Rationale**: a word may have several entries, one per meaning, but it appears only once per
  series.

## R5. Answer flow and sounds

- **Decision**:
  - **Right:** the option becomes `correct` (✓ and green), all options lock, and "Напред"
    appears. The sound is `correct`, or `round` if this is the 8th question (feature 004 FR-011).
  - **Wrong:** the option becomes `ruled-out` (muted, dashed border, the tag "не е това"),
    `disabled`, and `try-again` plays. Input pauses for about 400 ms so a double tap can't count
    twice. The question is marked "not first try".
  - **Summary:** `series` plays.
- **Rationale**: FR-004, FR-005, FR-007, FR-011, and the double-tap edge case.

## R6. Layout

- **Decision**, from top to bottom:
  1. progress "n / 8", centered;
  2. the instruction "Какво означава думата?";
  3. the word, at least 2.4 rem, bold;
  4. the sentence, at least 1.3 rem, with the word as `<mark>`: bold, underlined, and a soft
     highlight;
  5. the 3 options as full-width stacked buttons, at least 56 px tall, left-aligned, with
     wrapping text and a font size of at least 1.2 rem;
  6. the feedback line (`aria-live`);
  7. "Напред".
- **Rationale**: explanations are longer than single words, so full-width rows read best.

## R7. Summary texts

- **Decision**: line 1 is "Браво! Позна значението на всички думи!", because every question ends
  with the right answer. Line 2 is "От първия опит: X от Y.", followed by 1–3 stars.
- **Rationale**: the same as feature 003. The owner approves the wording.

## R8. Initial bank

- **Decision**: draft at least 32 entries for grades 3–4, using words met in school reading.
  - Include 3–4 words with two meanings, each as two entries, for example "коса" (hair and the
    tool) and "ключ" (for a lock and a spring of water).
  - Wrong explanations are plausible: a nearby topic or a common mix-up.

  The owner approves the bank before release (FR-009).
- **Rationale**: SC-006, plus the context skill from FR-002.
