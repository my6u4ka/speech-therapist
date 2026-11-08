# Quickstart: Synonym Game

How to run the game and prove it meets the [spec](spec.md). Formats and rules are in
[data-model.md](data-model.md) and [contracts/](contracts/).

## Prerequisites

- The repository checked out on `feature/002-synonym-game`.
- Node.js 18 or newer (for the tests only).
- A browser. For a Pages-like check, use the local preview server from feature 001 (site under
  `/speech-therapist/`); for quick checks, double-click `games/synonyms/index.html`.

## Automated checks

```bash
node --test tests/
```

Expected: every test passes, covering the logic rules, the structural check of each word set, and
a bank of at least 20 sets.

## Manual validation scenarios

| # | Spec ref | Steps | Expected |
|---|---|---|---|
| 1 | US1-1, FR-001, FR-008 | Open the game. | The reference word, the instruction "Намери N думи…" with correct grammar, and 8–12 unmarked candidates appear. |
| 2 | FR-002 | Reload twice. | The candidates are in a different order. |
| 3 | US1-2, FR-003 | Tap a word twice. | Marked (✓ and thick border), then unmarked; the state is clear in grayscale too (DevTools → Rendering → emulate achromatopsia). |
| 4 | US1-3, FR-004 | Look at "Провери" with nothing marked. | It is disabled. |
| 5 | US1-4, FR-005 | Mark 1 synonym and 1 distractor, then check. | The synonym turns correct and locked, the distractor shows "Опитай пак!" and is cleared, and the line "Остава(т) още N…" appears. No missed word is revealed. |
| 6 | US1-6, FR-007 | Then mark another word and check again. | The round ends; correct, wrong, and missed ("и тази", ★) are all shown; "Напред" appears. |
| 7 | US1-5 | Mark exactly all synonyms and check. | The round ends at once with a celebration, and there is no second try. |
| 8 | US2-1, FR-009 | Play 5 rounds. | Each reference word is different. |
| 9 | US2-2 | Finish round 5. | The summary says "Браво! Намери X от Y думи." with stars; there is no "failed" wording. |
| 10 | US2-3 | Tap "Играй пак". | A new series starts in a new order. |
| 11 | US2-4, FR-013 | Tap the home control mid-round. | The portal opens. |
| 12 | US3, FR-014 | Open the portal. | The "Синоними" tile has its picture and opens the game. |
| 13 | Edge | Mark every candidate and check. | It works; the synonyms are correct and the rest are gently cleared. |
| 14 | Edge, SC-004 | Check at 360 px and on desktop; include the longest word in the bank. | No sideways scrolling; every button is fully readable and tappable. |
| 15 | FR-015 | DevTools → Application and Network. | Nothing is stored, and there are no requests outside the site. |
| 16 | FR-011, SC-003 | Owner reads every set in `words.js`. | All words are correct, approved, and suit grades 2–4. |

All scenarios must pass in two browsers before the feature merges into `develop`. Scenario 16 is
the owner's approval and is required before the release.
