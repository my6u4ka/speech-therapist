# Quickstart: Antonym Pairs Game

How to run the game and prove it meets the [spec](spec.md). Rules and formats are in
[data-model.md](data-model.md) and [contracts/](contracts/).

## Prerequisites

- The repository checked out on `feature/003-antonym-pairs`.
- Node.js 18 or newer (tests only).
- The local preview server from feature 001 (site under `/speech-therapist/`), or double-click
  `games/antonyms/index.html`.

## Automated checks

```bash
node --test
```

Expected: all tests pass for both games (synonyms and antonyms), including the check that a 5×5
series can be built from the antonym bank.

## Manual validation scenarios

| # | Spec ref | Steps | Expected |
|---|---|---|---|
| 1 | US1-1, FR-001, FR-004 | Open the game. | The instruction appears with two columns of 5 words and nothing selected. |
| 2 | FR-002 | Reload twice. | The order of both columns and the side of each word change. |
| 3 | US1-2, FR-003 | Tap a word, tap it again, then tap another word in the same column. | Selected ("●" and outline) → unselected → the selection moves. |
| 4 | US1-3, FR-006 | Select a word, then tap its opposite. | Both are locked with the same color and "✓ 1". |
| 5 | US1-4, FR-005 | Select a word, then tap a wrong word in the other column. | Both show "Опитай пак!" briefly, then go back to normal; there is no penalty. |
| 6 | FR-003 | Tap a word on the right first, then its opposite on the left. | The pair is made (either order works). |
| 7 | US1-5 | Complete all 5 pairs. | "Браво! Всички двойки са свързани!" and "Напред" appear. |
| 8 | US1-6 | Look at the matched pairs in grayscale. | Pairs can be told apart by their numbers. |
| 9 | Edge | Tap a matched word. | Nothing happens. |
| 10 | Edge | Make a wrong pair and immediately tap other words. | Input is ignored until the wrong pair resets. |
| 11 | US2-1, FR-008 | Play 5 rounds. | No pair repeats, and no round shows a word with two possible opposites. |
| 12 | US2-2, FR-009 | Finish round 5 with one wrong try. | The summary shows "Браво! Свърза всички двойки!" and "От първия опит: 24 от 25." with stars. |
| 13 | US2-3 | Tap "Играй пак". | A new series starts. |
| 14 | US2-4, FR-013 | Tap the home control mid-round. | The portal opens. |
| 15 | US3, FR-014 | Open the portal. | The "Антоними" tile has its picture and opens the game. |
| 16 | Edge, SC-004 | Check at 360 px and on desktop with the longest words. | Two columns side by side, no sideways scrolling, and every word readable. |
| 17 | FR-015 | DevTools → Application and Network. | Nothing is stored, and there are no outside requests. |
| 18 | FR-011, SC-003 | The owner reads every pair in `words.js`. | All pairs are correct, approved, and suit grades 2–4. |

Scenario 18 is the owner's approval and is required before the release.
