# Research: Sound Effects

Phase 0 decisions for [plan.md](plan.md). Each one lists the decision, its rationale, and the
alternatives considered.

## R1. Where the sounds come from

- **Decision**: synthesize every sound in the browser with the Web Audio API. Each sound is a short
  sequence of notes, and each note has an oscillator with a soft attack and release envelope.
- **Rationale**:
  - no files to find, license, download, or store, so FR-010 and FR-012 are met by construction;
  - it weighs about 3 KB instead of tens of KB of audio (SC-004);
  - it starts instantly, with no loading delay;
  - pitch and loudness are numbers, so tests can verify the "gentle, not sad" rules (FR-003).
- **Alternatives considered**:
  - CC0 sound files, e.g. from freesound.org: each one must be chosen, downloaded, licensed, and
    recorded, they add 5–20 KB each, and tests cannot check how they sound.
  - Recording our own sounds: more work, and the same weight issue.

  Files remain possible later if the synthesized sounds turn out to be too plain.

## R2. Sound design (the recipes)

Notes use triangle or sine waves for softness. Every note gets a 10 ms attack and an exponential
release, so there are no clicks.

| Name | Notes (Hz) and length | Peak gain | Character |
|---|---|---|---|
| `tap` | one sine note at 880 Hz, 0.07 s | 0.15 | soft "tick" |
| `correct` | triangle notes at 784 (G5) and 1047 (C6), 0.12 s and 0.2 s | 0.30 | bright rising two-note chime |
| `try-again` | sine notes at 392 (G4) and 392 (G4), 0.12 s each with a 0.06 s gap | 0.15 | soft, neutral "bum-bum", same pitch, never falling |
| `round` | triangle notes at 523, 659, 784, 1047 (C5, E5, G5, C6), 0.12 s each, the last 0.35 s | 0.30 | cheerful rising arpeggio |
| `series` | the `round` arpeggio, then a 0.8 s C-major chord one octave up (1047, 1319, 1568) | 0.30 | short fanfare that ends high |

- **Rationale**:
  - the lengths stay within the FR-002 limits (tap under 0.15 s, correct and try-again under 0.5 s,
    round under 1.2 s, series under 2 s);
  - `try-again` is quieter than `correct`, and its pitch never falls (FR-003);
  - everything is in C major, so the sounds feel like one friendly family.
- **Testable rules**, enforced by `tests/sound.test.js`:
  - every recipe has a total length within its FR-002 limit;
  - the peak gain of `try-again` is lower than that of `correct`;
  - no recipe has a note lower in pitch than the note before it ("never falling"), which covers
    all sounds;
  - all peak gains are at most 0.3 (soft).

## R3. Browser autoplay rules

- **Decision**: create the `AudioContext` lazily, inside the first `pointerdown` or `keydown` on the
  page, and resume it there if it is suspended. `play()` before that is a silent no-op. If
  `AudioContext` is missing or throws, the module stays silent forever, with no errors.
- **Rationale**: mobile browsers block audio until a user gesture. The spec edge case allows the
  very first tap to be silent, and FR-011 says the game stays playable.

## R4. Overlap and rapid taps

- **Decision**: each `play(name)` stops any `tap` that is still sounding before it starts. A new
  `correct`, `try-again`, `round`, or `series` sound stops whatever is still playing. All playing
  nodes are tracked so `setOn(false)` can stop them at once (FR-007, SC-003).
- **Rationale**: it meets FR-005, and the feedback always matches the latest action.

## R5. Integration and fault tolerance

- **Decision**: each game calls `globalThis.GameSound && GameSound.play("...")` through a tiny local
  helper `sfx(name)` in `game.js`. If `sound.js` fails to load, the games behave exactly as they do
  today.
- **Rationale**: FR-011, and the independence of each game (Principle V).

## R6. The sound control

- **Decision**: a `<button class="sound-control" aria-pressed="true" aria-label="Звук">` holding an
  `<img>` that switches between `speaker-on.svg` and `speaker-off.svg`. It is fixed at the
  top-right (8 px from the edges) and is 64×64 px, matching the home control's style. `sound.js`
  wires up every `.sound-control` on the page.
- **Rationale**: FR-006. The top-right corner mirrors the home control, so both are easy to find.
  `aria-pressed` announces the state.
- **Consequence**: both games currently place the progress indicator ("n / 5") absolutely at the
  top-right. It moves into the page flow, centered just above the reference word or instruction.

## R7. What triggers which sound

- **Decision**:
  - **Синоними**:
    - marking or unmarking a word: `tap`;
    - after "Провери": one sound chosen by the pure function `checkSound(result, perfect)` in
      `logic.js`:
      - the round ended: `round`;
      - otherwise, any `wrong` status: `try-again`;
      - otherwise: `correct`;
    - the summary: `series`.
  - **Антоними**:
    - selecting, unselecting, or moving the selection: `tap`;
    - a correct pair: `correct`, but the last pair of a round plays `round` instead;
    - a wrong pair: `try-again`, played once;
    - the summary: `series`.
  - The "Напред" and "Играй пак" buttons play no sound, which avoids clutter.
- **Rationale**: FR-001 and FR-004 (one sound per check), FR-005, and the edge case "the try again
  sound plays once".
