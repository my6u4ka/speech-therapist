# Data Model: Sound Effects

## Sound recipe (data, in `assets/sound/sound.js` as `GameSound.RECIPES`)

| Field | Type | Rules |
|---|---|---|
| name (key) | `tap` \| `correct` \| `try-again` \| `round` \| `series` | exactly these 5 (FR-001) |
| `wave` | `sine` \| `triangle` | soft waveforms only |
| `gain` | number | peak gain, 0 < gain ≤ 0.3. `try-again` < `correct` (FR-003). |
| `notes` | list of `{ freq, start, dur }` | `freq` in Hz (200–2000); `start` and `dur` in seconds; `start` ≥ 0, `dur` > 0. Notes that start at the same time form a chord. |

Derived rules (tested):
- **Total length**: `max(start + dur)` must stay within the FR-002 limit: `tap` < 0.15 s; `correct`
  and `try-again` < 0.5 s; `round` < 1.2 s; `series` < 2 s.
- **Never falling**: ordered by `start`, a note's `freq` is never lower than the previous note's
  (FR-003). Notes in the same chord are exempt from this rule among themselves.

## Sound setting (memory only)

| Field | Meaning |
|---|---|
| `on` | `true` when the page loads (FR-008); toggled by the control; never stored (FR-009) |

## Player state (memory only)

| Field | Meaning |
|---|---|
| `ctx` | the `AudioContext`, created on the first user gesture, or `null` if unsupported |
| `playing` | the nodes currently sounding, so they can be stopped (R4) |
