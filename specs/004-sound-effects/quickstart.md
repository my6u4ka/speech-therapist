# Quickstart: Sound Effects

How to run the feature and prove it meets the [spec](spec.md). The API and placement are in
[contracts/](contracts/), and the recipes are in [data-model.md](data-model.md).

## Prerequisites

- The repository checked out on `feature/004-sound-effects`.
- Node.js 18 or newer, for the tests.
- The local preview server (site under `/speech-therapist/`), plus speakers or headphones.

## Automated checks

```bash
node --test
```

Expected: all tests pass, covering the synonym, antonym, and sound recipe tests. This includes
the length limits, the quieter `try-again`, the "never falling" rule, and `checkSound`.

## Manual validation scenarios

| # | Spec ref | Steps | Expected |
|---|---|---|---|
| 1 | US2-1, FR-006 | Open each game. | A speaker control is at the top-right, at the same place in both games, and does not overlap the home control or the progress indicator. |
| 2 | US1-1 | Tap words in each game. | A soft tick on every mark, unmark, or select. The first tap after load may be silent. |
| 3 | US1-2 | Make a correct pair (Антоними). In Синоними, mark only synonyms but not all of them, then check. | A bright rising chime. |
| 4 | US1-3, FR-003 | Make a wrong pair, or check a wrong mark. | A soft "bum-bum", quieter than the chime, played once. Nothing harsh or sad. |
| 5 | US1-4 | Complete a round in each game. | A cheerful rising arpeggio. |
| 6 | US1-5 | Finish a series. | A short fanfare when the summary appears. |
| 7 | US1-6, FR-005 | Tap words very quickly. | Ticks do not pile up into noise. |
| 8 | US2-2, FR-007, SC-003 | Tap the control during a sound. | Silence at once, and the icon shows the crossed speaker. |
| 9 | US2-3 | Tap again, then make a move. | Sound returns, and the icon shows the speaker. |
| 10 | US2-4/5, FR-008/009 | Turn sound off, go home, and open a game again. | Sound is on again. DevTools → Application shows nothing stored. |
| 11 | FR-011, SC-005 | Mute the device, or block audio in site settings, and play a round of each game. | Everything works, with no errors in the console. |
| 12 | FR-013 | Use the portal and the 404 page. | No sound. |
| 13 | SC-004 | DevTools → Network. | The `assets/sound/` files together are 30 KB or less, and there are no outside requests. |
| 14 | Regression | Run the main quickstart scenarios of features 002 and 003. | They still pass, and the progress indicator is still visible. |
