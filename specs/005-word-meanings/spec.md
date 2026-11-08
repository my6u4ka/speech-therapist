# Feature Specification: Word Meanings Game

**Feature Branch**: `feature/005-word-meanings`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "Words and meanings: a word is given with several possible meanings,
and the child has to choose the correct one."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose the meaning of a word (Priority: P1)

The child sees one word, written large, and below it a few short explanations of what it might
mean. Exactly one explanation is right, and the others sound plausible but are wrong. The child taps
the explanation they think is right and gets kind feedback at once.

**Why this priority**: this is the whole game. It works on the child's passive vocabulary, because
the child must understand what words mean, not just recognize them.

**Independent Test**: open the game, answer one word right and one word wrong, and check that the
feedback is correct and friendly.

**Acceptance Scenarios**:

1. **Given** a new question, **When** it appears, **Then** the child sees:
   - the instruction "Какво означава думата?";
   - the word, written large;
   - a short sentence that uses the word, with the word highlighted;
   - 3 explanations in random order, none of them chosen.
2. **Given** a question, **When** the child taps the right explanation, **Then** it is shown as
   correct (✓, color), a success sound plays, and "Напред" appears.
3. **Given** a question, **When** the child taps a wrong explanation, **Then** it is gently shown as
   "not this one" and can no longer be chosen, the try-again sound plays, and the child picks
   again among the remaining explanations. There is no penalty.
4. **Given** only the right explanation is left, **When** the child taps it, **Then** it is
   accepted as in scenario 2, so every question ends with the right answer.
5. **Given** a question is answered, **When** the feedback is shown, **Then** the right explanation
   stays visible, so the child reads the meaning.

---

### User Story 2 - Play a series of questions (Priority: P2)

A game is a short series of questions with different words. After the last one, the child sees a
friendly summary, as in the other games, and can play again or go home.

**Why this priority**: a series makes a real practice session. One question already works on its
own.

**Independent Test**: play a full series, and check that no word repeats, the summary appears, and
"Играй пак" starts a new series.

**Acceptance Scenarios**:

1. **Given** a question is answered, **When** the child taps "Напред", **Then** the next question has
   a word not yet used in this series.
2. **Given** the last question is answered, **When** the summary appears, **Then** it praises the
   child and shows how many words were right on the first try, never with "failed" wording.
3. **Given** the summary, **When** the child taps "Играй пак", **Then** a new series starts.
4. **Given** any moment, **When** the child taps the home control, **Then** the portal opens.

---

### User Story 3 - The game is on the portal (Priority: P3)

The game appears on the portal as a tile with its own picture and the name "Какво означава?".

**Why this priority**: it makes the game reachable for the child. The game can be tested directly
by its address without it.

**Independent Test**: open the portal, check that the new tile is there, and tap it to open the
game.

**Acceptance Scenarios**:

1. **Given** the portal, **When** it loads, **Then** the "Какво означава?" tile with its picture is
   shown after the existing games.
2. **Given** the portal, **When** the child taps the tile, **Then** the game opens.

---

### Edge Cases

- **Double tap or rapid taps**: one tap is handled at a time, and a double tap never counts as two
  answers.
- **Long explanations**: they wrap and stay fully readable and tappable on a 360-pixel-wide phone,
  with no sideways scrolling.
- **A word with several real meanings** (e.g. "коса": hair, or a tool for cutting grass): the
  sentence decides which meaning is meant. The other meaning MAY be one of the wrong explanations,
  which teaches the child to read the context. No question shows two explanations that are both
  right for the word as used in its sentence.
- **The same word with different meanings in the bank**: it may have several entries, one per
  meaning, each with its own sentence, but it appears at most once in a series.
- **The bank has fewer words than one series needs**: the series is shortened, and words never
  repeat within a series.
- **The child leaves mid-series**: nothing is saved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each question MUST show the instruction "Какво означава думата?", one word, and its
  candidate explanations as large buttons, in random order each time.
- **FR-002**: Each question MUST show a short sentence that uses the word (at most about 12 words,
  with the word highlighted) and exactly 3 explanations: one right for the word as used in that
  sentence, and two plausible but wrong. The sentence decides the meaning, so words with several
  real meanings (e.g. "коса") are allowed, and the child learns to work out meaning from context.
- **FR-003**: Exactly one explanation per question MUST be right. The wrong ones MUST be plausible:
  close in topic or a common mix-up, not absurd. Every explanation MUST be short (at most about 8
  words) and in simple, correct Bulgarian.
- **FR-004**: Feedback MUST be immediate. A right answer shows ✓ and a color, plays the success
  sound, and reveals "Напред". A wrong answer shows a gentle "not this one" state, disables that
  explanation, plays the try-again sound, and lets the child choose again. States MUST NOT rely on
  color alone.
- **FR-005**: There MUST be no penalty, lost points, sad sounds, or time limit (constitution I;
  feature 004 FR-003).
- **FR-006**: A series MUST consist of 8 questions with different words, picked at random from the
  word bank. It ends with a summary that offers "Играй пак" and the home control.
- **FR-007**: The summary MUST praise the child and show how many words were right on the first try
  ("От първия опит: X от Y."), with 1–3 stars and never 0 (as in feature 003).
- **FR-008**: Words and explanations MUST be stored as content separate from the game logic, so the
  owner can add or edit them without changing how the game works (constitution II).
- **FR-009**: Every word and explanation MUST be reviewed and approved by the owner before it is
  published, and all text MUST be correct standard Bulgarian (constitution II).
- **FR-010**: This game is intended for grades 3–4 (constitution: Target age), because reading a
  sentence and three explanations takes confident reading. Words, sentences, and explanations
  MUST suit a grade-3 child.
- **FR-011**: The game MUST show the home control (feature 001) and the sound control, and play the
  shared sounds (feature 004):
  - `tap` is not used, because choosing is the answer;
  - `correct` plays for the right answer;
  - `try-again` plays for a wrong answer;
  - `round` plays after the last question, before the summary is shown;
  - `series` plays on the summary.
- **FR-012**: The game MUST be listed on the portal as "Какво означава?", with its own picture
  (feature 001, FR-007).
- **FR-013**: The game MUST NOT store anything on the device or send anything anywhere
  (constitution IV).

### Key Entities

- **Word entry**: one question's content:
  - the word;
  - a short sentence that uses it;
  - its one right explanation for that sentence;
  - two wrong but plausible explanations.

  All of it is Bulgarian and owner-approved. A word with several meanings may have one entry per
  meaning.
- **Series**: 8 questions with different words, plus the summary. It lives only in memory.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child in grades 3–4 plays a full series on their own after at most one
  adult explanation.
- **SC-002**: A full series takes 3–6 minutes for a child in grades 3–4.
- **SC-003**: 100% of published entries are owner-approved and have no spelling mistakes, and no
  entry has two explanations that are both true.
- **SC-004**: The game opens in under 2 seconds on an ordinary mobile connection. Every explanation
  is readable and tappable with no sideways scrolling on a 360-pixel-wide phone.
- **SC-005**: Adding a word entry takes the owner under 3 minutes and changes no game logic.
- **SC-006**: The first published bank has at least 32 entries, so 4 series in a row do not repeat
  a word.
- **SC-007**: In a trial with the owner's children, each child learns at least one word they did
  not know, which they can explain afterwards.

## Assumptions

- The game is for grades 3–4. Grade-2 children may play with a parent.
- The game uses words a child may meet in school texts, but whose meaning is not obvious to every
  child (e.g. "просторен", "чевръст", "бърлога", "огнище").
- After a wrong answer the child keeps choosing until they find the right one. Only the first try
  counts in the summary.
- There is no audio for reading the word aloud; that would be a separate feature.
- The look, buttons, summary, sounds, and home control follow the existing games, so the child feels
  at home.
- The initial bank is drafted for the owner's review, and the owner approves it before release.
