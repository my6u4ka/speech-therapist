# Feature Specification: Synonym Game

**Feature Branch**: `feature/002-synonym-game`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "Synonym game: a reference word is given, and the child has to mark
all of its synonyms in a list of words (about ten words)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find the synonyms of a word (Priority: P1)

The child sees one reference word at the top, written large, and a list of about ten words below
it. The child taps every word that means the same, or nearly the same, as the reference word.
Tapping a marked word unmarks it. When ready, the child taps "Провери". The game then shows,
kindly, which marked words are right, which marked words are not synonyms, and which synonyms
were missed.

**Why this priority**: this is the whole game. One round on its own already exercises the
child's passive vocabulary (recognizing words) and teaches new words through the feedback.

**Independent Test**: open the game, play one round with a known word set, and check that each
correct and incorrect choice gets the right feedback.

**Acceptance Scenarios**:

1. **Given** a new round, **When** it appears, **Then** the child sees the reference word, an
   instruction saying how many synonyms to find, and 8–12 candidate words in random order, none
   of them marked.
2. **Given** a round in progress, **When** the child taps an unmarked word, **Then** it is shown as
   marked; **When** they tap it again, **Then** it is unmarked.
3. **Given** no word is marked, **When** the child looks at "Провери", **Then** it cannot be
   pressed yet.
4. **Given** some words are marked, **When** the child taps "Провери" for the first time, **Then**
   every correctly marked synonym is shown as correct, every marked non-synonym is shown gently
   as "not this one", and the child is told how many synonyms are still missing without
   revealing which, all with positive wording.
5. **Given** all synonyms were found and nothing wrong was marked, **When** the child checks,
   **Then** the game celebrates the round.
6. **Given** the first check had mistakes, **When** the child fixes the marks and checks again,
   **Then** the round ends: every candidate's status is shown, including the missed synonyms,
   and the child can continue (see FR-007).

---

### User Story 2 - Play a series of rounds (Priority: P2)

A game is a short series of rounds, each with a different reference word. After each round the
child moves on with "Напред". After the last round the child sees a friendly summary and can play
again or go home.

**Why this priority**: a series gives a real practice session and a sense of achievement. One
round already works without it.

**Independent Test**: play a full series and check that each round has a new reference word, the
summary appears at the end, and "Играй пак" starts a new series.

**Acceptance Scenarios**:

1. **Given** a round is finished, **When** the child taps "Напред", **Then** the next round starts
   with a reference word not yet used in this series.
2. **Given** the child finishes the last round, **When** the summary appears, **Then** it shows how
   many words the child found, in encouraging language, and never a "failed" message.
3. **Given** the summary is shown, **When** the child taps "Играй пак", **Then** a new series starts
   with word sets in a new order.
4. **Given** any moment in the game, **When** the child taps the home control, **Then** the portal
   opens (feature 001, FR-006).

---

### User Story 3 - The game is on the portal (Priority: P3)

The game appears on the portal as a tile with a picture and the name "Синоними".

**Why this priority**: it makes the game reachable for the child. It is small work, and the game
can be tested directly by its address without it.

**Independent Test**: open the portal and check that the "Синоними" tile is there and opens the
game.

**Acceptance Scenarios**:

1. **Given** the portal is open, **When** it loads, **Then** a "Синоними" tile with its own picture
   is shown.
2. **Given** the portal is open, **When** the child taps the tile, **Then** the synonym game opens.

---

### Edge Cases

- **The child marks every word**: checking still works; synonyms are shown as correct and the rest
  as "not this one", with no special scolding.
- **A word set has more synonyms than usual, or only one**: the game works with any number of
  synonyms from 1 up.
- **A candidate word is long**: it stays fully readable and tappable on a 360-pixel-wide phone,
  with no sideways scrolling.
- **Accidental taps**: marking and unmarking is instant and has no side effect until "Провери" is
  pressed.
- **The word bank has fewer sets than one series needs**: the series is shortened to the sets
  available; the game never repeats a set within a series.
- **The child leaves mid-round** (home control or back): nothing is saved, and the next visit starts
  a fresh series.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each round MUST show one reference word and 8–12 candidate words. Among the candidates
  there are one or more synonyms of the reference word; the rest are distractors.
- **FR-002**: The candidate words MUST be shown in random order every time a round is shown.
- **FR-003**: The child MUST be able to mark and unmark any candidate word by tapping or clicking
  it, and the marked state MUST be clearly visible without relying on color alone.
- **FR-004**: "Провери" MUST be available only when at least one word is marked.
- **FR-005**: After the first "Провери", the game MUST show each marked word as a correct mark or a
  wrong mark, and say how many synonyms are still missing, without revealing which. After the
  round's final check, it MUST also show every missed synonym. Unmarked distractors stay neutral.
- **FR-006**: All feedback MUST be positive and encouraging. There MUST be no penalty, lost
  points, sad sounds, or time limit (constitution I).
- **FR-007**: After a first check with mistakes (a wrong mark or a missed synonym), the child MUST
  get one more try. Correct marks stay fixed, and wrong marks are cleared so they can be
  reconsidered. The second check ends the round. A first check with no mistakes also ends the
  round.
- **FR-008**: Each round MUST tell the child how many synonyms to find, in a short instruction under
  the reference word (e.g. "Намери 3 думи с близко значение"), using the correct Bulgarian form
  for one word ("Намери 1 дума ...") and for several. The instruction is a guide only; the child
  may mark more or fewer words and still check.
- **FR-009**: A series MUST consist of 5 rounds with different reference words, picked at random
  from the word bank. It ends with a summary that offers "Играй пак" and the home control.
- **FR-010**: Word sets MUST be stored as content separate from the game logic, so the owner can add
  or edit sets without changing how the game works (constitution II).
- **FR-011**: Every word set MUST be reviewed and approved by the owner before it is published, and
  every word MUST be correct standard Bulgarian (constitution II).
- **FR-012**: This is one game, intended for grades 2–4 (constitution: Target age). Its words MUST
  be common words a grade-2 child knows or can learn from context. There is a single portal tile
  and no difficulty choice.
- **FR-013**: The game MUST show the home control in the shared place (feature 001, FR-006).
- **FR-014**: The game MUST be listed on the portal as "Синоними", with its own picture
  (feature 001, FR-007).
- **FR-015**: The game MUST NOT store anything on the device or send anything anywhere
  (constitution IV).

### Key Entities

- **Word set**: one round's content. It has a reference word, its synonyms (one or more), and its
  distractors (enough to make 8–12 candidates in total). All words are Bulgarian and approved by
  the owner. A distractor may be a related word that is not a synonym (e.g. an opposite or a word
  from the same topic), which makes the child think about meaning.
- **Series**: one play-through of 5 rounds with different word sets, plus its summary. It lives
  only in memory while the page is open.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child in grades 2–4 understands how to play after at most one adult
  explanation, and plays a full series of 5 rounds on their own.
- **SC-002**: A full series takes 3–7 minutes for a child in grades 2–4.
- **SC-003**: 100% of word sets in the published bank have been approved by the owner, and none of
  them has a spelling mistake.
- **SC-004**: The game opens in under 2 seconds on an ordinary mobile connection, and every
  candidate word is tappable without sideways scrolling on a 360-pixel-wide phone.
- **SC-005**: Adding a new word set takes the owner under 3 minutes and changes no game logic.
- **SC-006**: The first published word bank has at least 20 word sets, so 4 series in a row do not
  repeat a set.
- **SC-007**: In a trial with the owner's children, each child finishes a series and says they
  would like to play again.

## Assumptions

- The game is for grades 2–4. Grade-1 children may play with a parent, but the words are not
  chosen for them.
- "Synonym" means a word with the same or nearly the same meaning in common use (e.g. "голям" →
  "огромен", "едър"). The owner has the final say on what counts.
- Words are shown as text only. There is no audio, and pictures per word are out of scope for this
  feature.
- The initial word bank is drafted for the owner's review, and the owner corrects and approves it
  before publishing. Drafting the bank counts as part of this feature.
- A series is 5 rounds. That length is a reasonable default for children of this age and can be
  changed later with a spec change.
- The first release to `main` (and GitHub Pages) happens with this game, together with the portal
  from feature 001.
- No score is kept between visits; the summary covers only the current series.
