# Feature Specification: Sentence Builder Game

**Feature Branch**: `feature/007-sentence-builder`

**Created**: 2026-11-21

**Status**: Draft

**Input**: User description: "A game, arrange the sentence. It shows the words of a sentence in a
shuffled order, and the child drags them into the right order so that they form a sentence."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Arrange the words into a sentence (Priority: P1)

The child sees the words of one sentence as large cards in a shuffled row. The child drags the
cards into a row of empty slots, or reorders them inside it, until they think the sentence is
right, and then taps "Провери". Words in the right place lock with ✓. The other words stay
movable, and the child tries again until the whole sentence is right.

**Why this priority**: this is the whole game. It trains word order and sentence structure, which
are the core of written expression.

**Independent Test**: open the game, build one sentence with a mistake, check it, fix it, and check
again. The feedback must be correct and friendly.

**Acceptance Scenarios**:

1. **Given** a new sentence, **When** it appears, **Then** the child sees the instruction "Подреди
   думите в изречение", a row of empty slots (one per word), and the word cards below it in
   shuffled order. The shuffled order is never already correct.
2. **Given** a card, **When** the child drags it onto a slot, **Then** it drops there. If the slot
   was taken, the two cards swap. While dragging, the card follows the finger or mouse, and the
   slot under it is highlighted.
3. **Given** a card in a slot, **When** the child drags it back to the word area or onto another
   slot, **Then** it moves there.
4. **Given** a child who finds dragging hard, **When** they tap a card, **Then** it goes to the
   first empty slot. Tapping a card in a slot sends it back to the word area. The game also works
   with the keyboard (FR-004).
5. **Given** some slots are empty, **When** the child looks at "Провери", **Then** it cannot be
   pressed yet.
6. **Given** all slots are filled, **When** the child taps "Провери", **Then** every word in the
   right place locks with ✓ and a color. Every other word is gently marked "опитай пак" and stays
   movable, and the try-again sound plays. There is no penalty.
7. **Given** the whole sentence is right, **When** it is checked, **Then** the sentence is shown in
   full and correctly written (capital letter and end mark), the success sound plays, and
   "Напред" appears.
8. **Given** a new sentence, **When** the cards appear, **Then** they show no punctuation, and the
   first word is lowercase unless it is a proper name (FR-007).

---

### User Story 2 - Play a series of sentences (Priority: P2)

A game is a short series of sentences that do not repeat. After the last sentence, the child sees
a friendly summary, as in the other games.

**Why this priority**: a series is real practice. One sentence already works on its own.

**Independent Test**: play a full series, and check that sentences don't repeat, that the summary
appears, and that "Играй пак" starts a new series.

**Acceptance Scenarios**:

1. **Given** a sentence is complete, **When** the child taps "Напред", **Then** the next sentence has
   not been used yet in this series.
2. **Given** the last sentence is complete, **When** the summary appears, **Then** it praises the
   child and shows how many sentences were right on the first check, with 1–3 stars and no
   "failed" wording.
3. **Given** the summary, **When** the child taps "Играй пак", **Then** a new series starts.
4. **Given** any moment, **When** the child taps the home control, **Then** the portal opens.

---

### User Story 3 - The game is on the portal (Priority: P3)

The game appears on the portal as a tile with its own picture and the name "Подреди изречението".

**Why this priority**: it makes the game reachable for the child. The game can be tested directly by
its address without it.

**Independent Test**: open the portal, check that the tile is there, and tap it to open the game.

**Acceptance Scenarios**:

1. **Given** the portal, **When** it loads, **Then** the "Подреди изречението" tile with its picture
   is shown after the existing games.
2. **Given** the portal, **When** the child taps the tile, **Then** the game opens.

---

### Edge Cases

- **Several correct orders**: Bulgarian word order is flexible. Only one order is accepted (FR-006),
  so sentences that a child could rightly build in another order are left out of the bank. This
  is checked in the owner's review.
- **Commas**: sentences with commas are left out, because the cards show no punctuation and a
  comma can hint at, or change, the order.
- **The same word twice** in a sentence (e.g. "Малкото коте гони малката топка."): either copy is
  right in either matching place.
- **Dropping a card outside any slot or the word area**: the card returns to where it came from.
- **Scrolling on touch screens**: dragging a card MUST NOT scroll the page, but the page can still
  be scrolled outside the cards.
- **Long words or many words**: the slots wrap onto several lines and stay readable and droppable on
  a 360-pixel-wide phone, with no sideways scrolling.
- **The child leaves mid-series**: nothing is saved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each question MUST show the instruction "Подреди думите в изречение", one empty slot
  per word, and the word cards in a shuffled order that is never already correct.
- **FR-002**: The child MUST be able to move cards by dragging, with touch and with a mouse: from
  the word area to a slot, between slots (swapping when the slot is taken), and from a slot back to
  the word area.
- **FR-003**: The child MUST also be able to move cards by tapping. Tapping a card in the word area
  sends it to the first empty slot, and tapping a card in a slot sends it back. Dragging is the
  main way, and tapping is the always-available alternative.
- **FR-004**: The game MUST be playable with the keyboard. Cards are focusable, and Enter or Space
  acts like a tap.
- **FR-005**: "Провери" MUST be available only when every slot holds a word.
- **FR-006**: A sentence MUST count as right only when the order matches the one order given in
  the content. Therefore the bank MUST contain only sentences whose word order is clearly fixed
  for a grade-3 child: any other order must be clearly wrong or must clearly change the meaning.
  For example, "Вчера ходихме на кино." is left out because "Ходихме на кино вчера." is equally
  right.
- **FR-007**: The word cards MUST give no punctuation or capital-letter clues:
  - all punctuation is removed, including the end mark;
  - the sentence's first word is shown in lowercase, unless it is a proper name (e.g. "Иван",
    "София"), which always keeps its capital letter so the child never sees a wrong spelling.

  After the sentence is solved, the full, correctly written sentence (capital letter and end mark)
  MUST be shown, so the child sees how it is written.
- **FR-008**: After "Провери":
  - every word in a right position MUST lock with ✓ and a color, and the success sound plays if
    the whole sentence is right;
  - every word in a wrong position MUST be marked gently ("опитай пак"), not only by color, and
    stays movable, and the try-again sound plays once;
  - the child can check again as many times as needed.
- **FR-009**: There MUST be no penalty, lost points, sad sounds, or time limit (constitution I;
  feature 004 FR-003).
- **FR-010**: A series MUST consist of 6 sentences with no repeats, in shuffled order. It ends with
  a summary showing "От първия опит: X от Y." (right on the first check), 1–3 stars (never 0), and
  "Играй пак".
- **FR-011**: Sentences MUST be stored as content separate from the game logic, so the owner can add
  or edit them without changing how the game works (constitution II). Every sentence MUST be
  owner-approved and in correct standard Bulgarian.
- **FR-012**: The game is intended for grades 3–4 (constitution: Target age). Sentences have 4–8
  words, and a series SHOULD go from shorter to longer sentences.
- **FR-013**: The game MUST show the home control (feature 001) and the sound control. It MUST use
  the shared sounds (feature 004): `tap` when a card is dropped or placed, `correct` for a right
  sentence, `try-again` for a check with mistakes, `round` for the last sentence, and `series`
  for the summary.
- **FR-014**: The game MUST be listed on the portal as "Подреди изречението", with its own picture
  (feature 001, FR-007).
- **FR-015**: The game MUST NOT store anything on the device or send anything anywhere
  (constitution IV).

### Key Entities

- **Sentence entry**: one Bulgarian sentence, split into words, plus any other acceptable orders
  (depending on FR-006). It is owner-approved.
- **Board**: the empty slots and the word area for one sentence, with which card is where and
  which cards are locked.
- **Series**: 6 sentences and the summary. It lives only in memory.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child in grades 3–4 builds a sentence by dragging on a tablet or phone
  on the first attempt, without help, after seeing it done once.
- **SC-002**: A full series takes 3–7 minutes.
- **SC-003**: Every published sentence is owner-approved and has no mistakes, and it has only one
  natural word order, so a child's grammatical order with the same meaning is never marked
  wrong (FR-006).
- **SC-004**: Dragging feels immediate: the card follows the finger with no visible lag, and it
  works on phones, tablets, and desktops in current Chrome, Safari, Firefox, and Edge.
- **SC-005**: Every slot and card is readable and reachable without sideways scrolling on a
  360-pixel-wide phone.
- **SC-006**: Adding a sentence takes the owner under 2 minutes and changes no game logic.
- **SC-007**: The first published bank has at least 30 sentences.

## Assumptions

- The game is for grades 3–4. Grade-2 children may play with a parent.
- Choosing sentences with a single natural order is the hardest part of the content work. It
  favors sentences where grammar fixes the order, for example a preposition before its noun or
  an adjective before its noun.
- Dragging is the main interaction, as the owner asked. Tapping is kept as an alternative, because
  some young children and some devices find dragging hard. This matches the reason the antonym
  game uses tapping.
- Sentences are everyday, short, and complete (subject and verb), on topics such as home, school,
  animals, and nature.
- The look, controls, sounds, and summary follow the existing games and use the shared helpers
  (`assets/shared/play.js`).
- The initial bank is drafted for the owner's review, and the owner approves it before release.
