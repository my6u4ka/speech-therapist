# Feature Specification: Sound Effects

**Feature Branch**: `feature/004-sound-effects`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "We also need to add some sounds: for a click, success, failure, and so
on."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hear feedback while playing (Priority: P1)

While playing "Синоними" or "Антоними", the child hears short, friendly sounds for the main
moments:
- a soft tap when marking or selecting a word;
- a bright chime for a correct answer;
- a gentle, neutral "try again" sound for a wrong answer, never a buzzer or a sad tone;
- a short cheerful tune when a round is complete;
- a slightly longer celebration at the end of a series.

**Why this priority**: sound makes the feedback immediate and fun, especially for children who are
still slow readers and may not read the feedback text.

**Independent Test**: play one round of each game with sound on, and check that each moment plays
its own sound and that none of them sounds harsh or sad.

**Acceptance Scenarios**:

1. **Given** sound is on, **When** the child marks, unmarks, or selects a word, **Then** a short soft
   tap is heard.
2. **Given** sound is on, **When** an answer or pair is correct, **Then** a bright, positive chime is
   heard.
3. **Given** sound is on, **When** an answer or pair is wrong, **Then** a gentle, neutral "try again"
   sound is heard. It is quieter than the correct chime and is not a buzzer, a falling "sad"
   tone, or a laugh.
4. **Given** sound is on, **When** a round is complete, **Then** a short cheerful tune is heard. A
   perfect round in "Синоними" gets the same tune.
5. **Given** sound is on, **When** the series summary appears, **Then** a celebration sound is heard,
   the same however many stars were earned.
6. **Given** several sounds are triggered quickly (fast tapping), **When** they play, **Then** they
   do not pile up into noise: a new tap sound replaces the previous one.

---

### User Story 2 - Turn sound on and off (Priority: P2)

A parent or child can turn all game sounds on or off with one clearly visible control, in the
same place in every game.

**Why this priority**: sound is not always wanted (a quiet room, a sibling studying, a parent on a
call). Without a control, the only way to silence the game is the device volume.

**Independent Test**: in each game, toggle the sound control and check that sounds stop and start,
and that the control's icon shows the current state.

**Acceptance Scenarios**:

1. **Given** any game is open, **When** the child looks at the screen, **Then** a sound control
   (speaker icon) is visible in the same place in every game and does not cover the home control.
2. **Given** sound is on, **When** the control is tapped, **Then** all sounds stop at once and the
   icon shows a crossed-out speaker.
3. **Given** sound is off, **When** the control is tapped, **Then** sounds play again, and the icon
   shows a speaker.
4. **Given** the game is opened, **When** the child has not touched the control, **Then** sound is
   on.
5. **Given** the sound was turned off, **When** the child goes to the portal and opens a game again
   (the same one or another), **Then** sound is on again. Nothing is stored, so each game page
   starts with sound on.

---

### Edge Cases

- **The device is muted, or its volume is 0**: the game works normally; there are no visual
  differences or error messages.
- **The browser blocks sound until the first tap** (common on phones): no sound is attempted before
  the child's first tap, and no error is shown. The first tap's own sound may be silent.
- **The browser cannot play sound at all**: the game works normally and silently, and the sound
  control still toggles without errors.
- **Sounds during the wrong-answer pause**: the "try again" sound plays once, not once per word.
- **The child leaves mid-sound** (home control): the sound stops with the page and does not block
  navigation.
- **Accessibility**: sounds never replace the visual feedback. Every sound has a visual
  counterpart, and the text feedback is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Both existing games ("Синоними", "Антоними") MUST play sounds for these moments:
  - **tap**: marking, unmarking, or selecting a word;
  - **correct**: a correct mark (synonyms, check) or a correct pair (antonyms);
  - **try again**: a wrong mark or wrong pair;
  - **round complete**;
  - **series complete**: when the summary appears.
- **FR-002**: Every sound MUST be short (tap under 0.15 s, correct and try-again under 0.5 s, round
  under 1.2 s, series under 2 s) and friendly.
- **FR-003**: The "try again" sound MUST be gentle and neutral: quieter than "correct", with no
  buzzer, falling "sad" melody, or laughter (constitution I). This refines the earlier rule "no
  sad sounds" in features 002 and 003 (FR-006). Those features had no sound at all; with this
  feature, positive and neutral sounds are allowed, and sad or punishing sounds remain
  forbidden.
- **FR-004**: When "Синоними" checks several words at once, the game MUST play one sound for the
  whole check. It plays "correct" if any marked word was right and nothing was wrong, "try again"
  if anything was wrong, and "round complete" if the round ended. It MUST NOT play one sound per
  word.
- **FR-005**: Rapid taps MUST NOT stack sounds: a new tap sound replaces one that is still playing.
- **FR-006**: Each game MUST show a sound on/off control with a speaker icon (crossed out when
  off), in the same place in every game, at least 64×64 px, and away from the home control's
  top-left area.
- **FR-007**: Turning sound off MUST silence all game sounds immediately.
- **FR-008**: Sound MUST be on by default every time a game page opens (US2-4).
- **FR-009**: The sound setting MUST NOT be stored anywhere. It lasts only while the game page is
  open, and it resets to "on" when a game page is opened again (US2-5; constitution IV, and FR-015
  of features 002 and 003, are unchanged).
- **FR-010**: Sounds MUST work with no extra download from outside the site and no third-party
  service (constitution III, IV). The sound files or sound definitions are part of this site.
- **FR-011**: Sound MUST be an addition only. All existing visual and text feedback stays as it
  is, and the games remain fully playable without sound.
- **FR-012**: Any sound recordings used MUST be free to use and share, and their license MUST be
  recorded in the repository.
- **FR-013**: The portal itself plays no sounds, because a tap there opens the game at once.

### Key Entities

- **Sound effect**: one named sound (`tap`, `correct`, `try-again`, `round`, `series`) with its
  character, its length, and its relative loudness.
- **Sound setting**: on or off, held in memory for the open game page only (FR-009).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a trial with the owner's children, each child can tell from the sound alone
  whether a pair or check was right, without reading the text.
- **SC-002**: No child or parent describes any sound as scary, sad, or annoying after a full series.
- **SC-003**: Turning sound off takes one tap and silences the game within 0.1 s.
- **SC-004**: Adding sounds increases each game's page weight by no more than 30 KB, and the game
  still opens in under 2 s on an ordinary mobile connection.
- **SC-005**: With the device muted or sound unsupported, 100% of the quickstart scenarios of
  features 002 and 003 still pass.

## Assumptions

- The sounds are simple tones and chimes, not voices or music. Spoken words (e.g. reading words
  aloud) are out of scope and would be a separate feature.
- The two existing games get sounds in this feature, and future games will use the same sound
  set, so this sound set is shared code used by at least two games (constitution V).
- Because the setting is not remembered, a parent who wants silence turns sound off in each game,
  or uses the device volume. The owner accepted this to keep "store nothing".
- The volume follows the device volume. There is no in-game volume slider, only on/off.
- No sound plays on the portal or the 404 page.
