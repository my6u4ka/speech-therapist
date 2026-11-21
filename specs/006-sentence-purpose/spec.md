# Feature Specification: Sentence Purpose Game

**Feature Branch**: `feature/006-sentence-purpose`

**Created**: 2026-11-21

**Status**: Draft

**Input**: User description: "A game: guess the type of the sentence by the purpose of the
utterance."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Name the type of a sentence (Priority: P1)

The child sees one sentence and the buttons for the sentence types taught in school by the purpose
of the utterance (по цел на изказването):
- **съобщително**: it tells something;
- **въпросително**: it asks something;
- **подбудително**: it asks or tells someone to do something;
- **възклицателно**: it expresses a strong feeling.

The child taps the type they think fits and gets kind, immediate feedback. After a correct answer,
the game briefly reminds the child why the answer is right (e.g. "Пита за нещо."), so the rule
sticks.

**Why this priority**: this is the whole game. It trains the child to notice what a sentence is
for. The same skill helps the child choose the right punctuation mark when writing (written
expression).

**Independent Test**: open the game, answer one sentence right and one wrong, and check that the
feedback is correct and friendly.

**Acceptance Scenarios**:

1. **Given** a new question, **When** it appears, **Then** the child sees the instruction "Какво
   е изречението?", the sentence, written large, and one large button per sentence type, in a
   fixed order, none of them chosen.
2. **Given** a question, **When** the child taps the right type, **Then** the button is shown as
   correct (✓ and a color), the success sound plays, a one-line reason is shown, and "Напред"
   appears.
3. **Given** a question, **When** the child taps a wrong type, **Then** that button is gently
   shown as "not this one" and can no longer be chosen, the try-again sound plays, and the child
   chooses again with no penalty.
4. **Given** a question, **When** it appears, **Then** the sentence is shown with its correct end
   punctuation mark (FR-003).

---

### User Story 2 - Play a series of sentences (Priority: P2)

A game is a short series of sentences. The series mixes all the sentence types and never repeats
a sentence. After the last sentence the child sees a friendly summary, as in the other games.

**Why this priority**: a series is real practice. One question already works on its own.

**Independent Test**: play a full series, and check that the types are mixed, that no sentence
repeats, that the summary appears, and that "Играй пак" starts a new series.

**Acceptance Scenarios**:

1. **Given** a question is answered, **When** the child taps "Напред", **Then** the next sentence
   has not been used yet in this series.
2. **Given** a series, **When** it is played, **Then** every sentence type appears at least once.
3. **Given** the last sentence is answered, **When** the summary appears, **Then** it praises the
   child and shows how many sentences were right on the first try, with 1–3 stars and never
   "failed" wording.
4. **Given** the summary, **When** the child taps "Играй пак", **Then** a new series starts.
5. **Given** any moment, **When** the child taps the home control, **Then** the portal opens.

---

### User Story 3 - The game is on the portal (Priority: P3)

The game appears on the portal as a tile with its own picture and the name "Какво е
изречението?".

**Why this priority**: it makes the game reachable for the child. The game can be tested directly
by its address without it.

**Independent Test**: open the portal, check that the tile is there, and tap it to open the game.

**Acceptance Scenarios**:

1. **Given** the portal, **When** it loads, **Then** the new tile with its picture is shown after
   the existing games.
2. **Given** the portal, **When** the child taps the tile, **Then** the game opens.

---

### Edge Cases

- **A sentence that could fit two types** (e.g. "Затвори вратата!" is both an order and said with
  feeling): the bank MUST NOT contain sentences whose type is arguable. Each sentence has one
  clear type at the child's level.
- **A question without a question word** (e.g. "Ще дойдеш ли?") and **a polite request phrased as
  a question** (e.g. "Ще ми подадеш ли молива?"): the question is fine and is typed
  "въпросително". The polite request is left out of the bank, because its type is arguable.
- **Double tap or rapid taps**: one answer is handled at a time.
- **Long sentences**: they wrap and stay readable on a 360-pixel-wide phone, with no sideways
  scrolling.
- **The bank has fewer sentences of a type than a series needs**: the series is shortened or
  rebalanced, and it never repeats a sentence.
- **The child leaves mid-series**: nothing is saved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each question MUST show the instruction "Какво е изречението?", one sentence, and
  one button per sentence type, always in the same order and with the same labels, so the child
  learns where each one is.
- **FR-002**: The sentence types MUST be the four taught in school, with the buttons always in this
  order: **съобщително**, **въпросително**, **подбудително**, **възклицателно** (e.g. "Колко
  красиво е навън!").
- **FR-003**: The sentence MUST be shown with its correct end punctuation mark from the start. The
  mark is a fair clue. Because both подбудително and възклицателно sentences often end with
  "!", the child must still read the meaning to tell them apart.
- **FR-004**: Feedback MUST be immediate. A right answer shows ✓ and a color, plays `correct`,
  shows a one-line reason for that type, and reveals "Напред". A wrong answer shows a gentle "не
  е това" state, disables that button, plays `try-again`, and lets the child choose again. States
  MUST NOT rely on color alone.
- **FR-005**: The reason line MUST be one fixed, owner-approved sentence per type, for example
  "Съобщава нещо.", "Пита за нещо.", "Подканва някого да направи нещо." and "Изразява силно
  чувство.".
- **FR-006**: There MUST be no penalty, lost points, sad sounds, or time limit (constitution I;
  feature 004 FR-003).
- **FR-007**: A series MUST consist of 8 sentences with no repeats: exactly 2 of each of the 4
  types, in shuffled order.
- **FR-008**: The summary MUST praise the child and show "От първия опит: X от Y." with 1–3 stars,
  never 0 (as in features 003 and 005).
- **FR-009**: Sentences MUST be stored as content separate from the game logic, each with its
  type, so the owner can add or edit them without changing how the game works (constitution
  II).
- **FR-010**: Every sentence MUST be reviewed and approved by the owner, MUST be correct standard
  Bulgarian, and MUST have exactly one clear type (see Edge Cases).
- **FR-011**: The game is intended for grades 3–4 (constitution: Target age). Sentences may be
  somewhat longer and richer, but MUST stay within the reach of a grade-3 reader.
- **FR-012**: The game MUST show the home control (feature 001) and the sound control, and MUST
  use the shared sounds (feature 004):
  - `correct` for the right answer;
  - `try-again` for a wrong answer;
  - `round` when the last sentence of the series is answered right;
  - `series` when the summary appears.
- **FR-013**: The game MUST be listed on the portal with its own picture (feature 001, FR-007).
- **FR-014**: The game MUST NOT store anything on the device or send anything anywhere
  (constitution IV).

### Key Entities

- **Sentence entry**: one Bulgarian sentence (with its correct end mark) and its type. All entries
  are owner-approved.
- **Sentence type**: one of the types in FR-002, each with a fixed label and a fixed reason line.
- **Series**: 8 sentences with mixed types, plus the summary. It lives only in memory.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child in grades 3–4 plays a full series on their own after at most one
  adult explanation.
- **SC-002**: A full series takes 2–5 minutes.
- **SC-003**: 100% of published sentences are owner-approved, have no spelling or punctuation
  mistakes, and have exactly one clear type.
- **SC-004**: The game opens in under 2 seconds on an ordinary mobile connection. Every sentence
  and button is readable and tappable on a 360-pixel-wide phone without sideways scrolling.
- **SC-005**: Adding a sentence takes the owner under 2 minutes and changes no game logic.
- **SC-006**: The first published bank has at least 10 sentences of each of the 4 types (40 in total), so several series
  in a row feel fresh.
- **SC-007**: After a few series, the owner's children can say what makes a sentence a question, a
  request, or a statement.

## Assumptions

- The game is for grades 3–4. Grade-2 children may play with a parent.
- The hardest pair is подбудително vs възклицателно, because both may end with "!". The bank
  includes clear examples of both, such as "Затвори прозореца!" and "Колко е студено!".
- The type names and the reason lines follow the terms used in Bulgarian primary school:
  съобщително, въпросително, подбудително, and възклицателно.
- The sentences are short (at most about 10 words) and use everyday topics such as school, home,
  family, animals, and nature.
- There is no audio for reading the sentence aloud. Intonation is left to the child's own reading.
- The look, controls, sounds, and summary follow the existing games.
- The initial bank is drafted for the owner's review, and the owner approves it before release.
