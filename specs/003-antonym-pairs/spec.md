# Feature Specification: Antonym Pairs Game

**Feature Branch**: `feature/003-antonym-pairs`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "A second game, antonyms: the child has to connect words into pairs
with opposite meanings."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Match words with their opposites (Priority: P1)

The child sees two columns of words. Each word on the left has exactly one opposite on the right
(e.g. "горещ" – "студен"), and the right column is shuffled. The child taps a word in one column,
then a word in the other, to make a pair. When all words are paired, the round is complete.

**Why this priority**: this is the whole game. One round already exercises the child's active
understanding of opposite meanings.

**Independent Test**: open the game, pair all words in one round, and check that correct and
incorrect pairings get the right feedback.

**Acceptance Scenarios**:

1. **Given** a new round, **When** it appears, **Then** the child sees an instruction ("Свържи
   думите с противоположно значение") and two columns with the same number of words. The order of
   both columns is random, and no word is paired yet.
2. **Given** no word is selected, **When** the child taps a word, **Then** it is shown as selected.
   **When** they tap the same word again, **Then** it is no longer selected. **When** they tap
   another word in the same column, **Then** the selection moves to that word.
3. **Given** a word is selected, **When** the child taps its opposite in the other column, **Then**
   the two words are joined as a correct pair and can no longer be changed.
4. **Given** a word is selected, **When** the child taps a word in the other column that is not its
   opposite, **Then** both words gently show "Опитай пак!" and then go back to unpaired, with no
   penalty (FR-005).
5. **Given** all words are correctly paired, **When** the last pair is made, **Then** the game
   celebrates the round and offers "Напред".
6. **Given** a pair is shown as correct, **When** the child looks at it, **Then** both words are
   clearly marked as belonging together, by matching color plus a number or symbol, not color
   alone.

---

### User Story 2 - Play a series of rounds (Priority: P2)

A game is a short series of rounds with different word pairs. After the last round, the child sees
a friendly summary and can play again or go home. This works the same way as in the synonym game.

**Why this priority**: a series is a real practice session. One round already works without it.

**Independent Test**: play a full series, and check that no pair repeats within it, that the
summary appears, and that "Играй пак" starts a new series.

**Acceptance Scenarios**:

1. **Given** a round is complete, **When** the child taps "Напред", **Then** the next round starts
   with pairs not yet used in this series.
2. **Given** the last round is complete, **When** the summary appears, **Then** it praises the
   child in encouraging language and never says "failed".
3. **Given** the summary is shown, **When** the child taps "Играй пак", **Then** a new series starts.
4. **Given** any moment in the game, **When** the child taps the home control, **Then** the portal
   opens.

---

### User Story 3 - The game is on the portal (Priority: P3)

The game appears on the portal as a tile with its own picture and the name "Антоними".

**Why this priority**: it makes the game reachable for the child. The game can be tested directly
by its address without it.

**Independent Test**: open the portal, check that the "Антоними" tile is there, and tap it to open
the game.

**Acceptance Scenarios**:

1. **Given** the portal is open, **When** it loads, **Then** an "Антоними" tile with its own picture
   is shown next to the existing games.
2. **Given** the portal is open, **When** the child taps the tile, **Then** the antonym game opens.

---

### Edge Cases

- **Tapping two words in the same column**: the selection moves to the second word. It never forms
  a pair.
- **Tapping an already correctly paired word**: nothing happens, because correct pairs are fixed.
- **Rapid taps**: one pairing is evaluated at a time, and a double tap never pairs a word with
  itself.
- **Long words**: both columns stay fully readable and tappable on a 360-pixel-wide phone, with no
  sideways scrolling.
- **A word that has several possible opposites** (e.g. "стар" – "млад" or "нов"): within one round,
  every word has exactly one opposite among the shown words, so the round is never ambiguous.
- **The bank has fewer pairs than one series needs**: the series is shortened. Pairs never repeat
  within a series.
- **The child leaves mid-round**: nothing is saved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each round MUST show 5 word pairs as two columns of 5 words. Each word in the left
  column has exactly one opposite in the right column, and vice versa.
- **FR-002**: Both columns MUST be in random order every time a round is shown, so a word is never
  placed next to its opposite by design.
- **FR-003**: The child MUST be able to make a pair by tapping one word in each column, in either
  order (left then right, or right then left). The selected word MUST be clearly visible without
  relying on color alone.
- **FR-004**: The game MUST show a short instruction at the top of each round: "Свържи думите с
  противоположно значение".
- **FR-005**: When the child pairs two words, the game MUST give feedback right away. A correct pair
  stays joined. A wrong pair is shown briefly with a gentle "Опитай пак!" and then comes apart, so
  both words can be paired again. There is no "Провери" button, and the round ends only when every
  pair is correct.
- **FR-006**: Correct pairs MUST stay joined and MUST NOT be changeable. Each correct pair is shown
  with its own matching mark (color plus a number or symbol).
- **FR-007**: All feedback MUST be positive and encouraging. There MUST be no penalty, lost points,
  sad sounds, or time limit (constitution I).
  *Note*: Sound: superseded by feature 004 (sound effects); sad or punishing sounds remain forbidden.
- **FR-008**: A series MUST consist of 5 rounds with no pair repeated, picked at random from the
  word bank. It ends with a summary that offers "Играй пак" and the home control.
- **FR-009**: The summary MUST praise the child and SHOULD reflect how many pairs were made right
  on the first try, without any "failed" wording. A pair counts as "first try" when neither of its
  words was part of a wrong pairing earlier in the round.
- **FR-010**: Word pairs MUST be stored as content separate from the game logic, so the owner can
  add or edit pairs without changing how the game works (constitution II).
- **FR-011**: Every pair MUST be reviewed and approved by the owner before it is published, and
  every word MUST be correct standard Bulgarian (constitution II).
- **FR-012**: This game is intended for grades 2–4, like the synonym game (constitution: Target
  age). Pairs may include less concrete opposites (e.g. "смел" – "страхлив"), but every word MUST
  be one a grade-2 child knows or can learn from context.
- **FR-013**: The game MUST show the home control in the shared place (feature 001, FR-006).
- **FR-014**: The game MUST be listed on the portal as "Антоними", with its own picture
  (feature 001, FR-007).
- **FR-015**: The game MUST NOT store anything on the device or send anything anywhere
  (constitution IV).

### Key Entities

- **Antonym pair**: two Bulgarian words with opposite meanings, e.g. "ден" – "нощ" or "отварям" –
  "затварям". It may also note words it must not be shown with in the same round, when one of them
  could be a second opposite (e.g. "стар" – "млад" must not share a round with "нов"). All pairs
  are owner-approved.
- **Round**: 5 pairs, shown as two shuffled columns, plus which pairs are already made.
- **Series**: 5 rounds without repeated pairs, plus the summary. It lives only in memory.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child of the intended grades understands how to make a pair after at most one adult
  explanation, and plays a full series on their own.
- **SC-002**: A full series takes 3–7 minutes for a child of the intended grades.
- **SC-003**: 100% of published pairs are approved by the owner, have no spelling mistakes, and no
  round can show a word with two possible opposites.
- **SC-004**: The game opens in under 2 seconds on an ordinary mobile connection. Every word is
  tappable without sideways scrolling on a 360-pixel-wide phone.
- **SC-005**: Adding a new pair takes the owner under 2 minutes and changes no game logic.
- **SC-006**: The first published word bank has at least 40 pairs, so that 1–2 series in a row do
  not repeat a pair. Each series uses 25 pairs.
- **SC-007**: In a trial with the owner's children, each child finishes a series and wants to play
  again.

## Assumptions

- The game is for grades 2–4. Grade-1 children may play with a parent.
- "Opposite" means a word with the contrary meaning in common use: adjectives ("висок" – "нисък"),
  verbs ("влизам" – "излизам"), nouns ("ден" – "нощ"), and adverbs ("рано" – "късно"). The owner has
  the final say.
- Pairing is done by tapping, not dragging, because tapping is easier and more reliable for young
  children on phones, tablets, and with a mouse.
- 5 pairs per round and 5 rounds per series match the synonym game and can be changed later by a
  spec change.
- Words are text only; there is no audio and there are no pictures per word in this feature.
- The initial word bank is drafted for the owner's review, and the owner approves it before
  release.
- The game looks and behaves like the synonym game where possible (colors, buttons, summary), so
  the child feels at home.
