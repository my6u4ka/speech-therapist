# Quickstart: Sentence Builder Game

How to run the game and check that it meets the [spec](spec.md). Rules are in
[data-model.md](data-model.md) and [contracts/](contracts/).

## Prerequisites

- The repository checked out on `feature/007-sentence-builder`.
- Node.js 18 or newer, for the tests only.
- The local preview server (the site is served under `/speech-therapist/`).
- For a real feel of the dragging: a touch device, or Chrome DevTools device emulation with touch
  enabled.

## Automated checks

```bash
node --test
```

Expected: all suites pass, including `builder`.

## Manual validation scenarios

| # | Spec ref | Steps | Expected |
|---|---|---|---|
| 1 | US1-1, US1-8, FR-001, FR-007 | Open the game. | The instruction, N empty slots, and N cards appear in an order that is not already correct. The cards have no punctuation, and the first word is lowercase (a name keeps its capital). |
| 2 | US1-2, FR-002 | Drag a card from the pool onto a slot, with the mouse and with touch emulation. | The card follows the pointer, the slot is highlighted, the card drops, and a `tap` sound plays. The page does not scroll. |
| 3 | US1-2 | Drag a pool card onto a taken slot. | The card is placed, and the old card goes back to the pool. |
| 4 | US1-3 | Drag between two filled slots, then drag a slot card back to the pool. | The cards swap, then the card goes back to the pool. |
| 5 | Edge | Drop a card on empty space outside the slots and the pool. | It returns to where it came from. |
| 6 | US1-4, FR-003, FR-004 | Tap a pool card, tap a slot card, then use Tab and Enter. | The card goes to the first empty slot, then back to the pool. The keyboard does the same. |
| 7 | US1-5, FR-005 | Look at "Провери" with an empty slot. | It is disabled. |
| 8 | US1-6, FR-008 | Fill the slots with two words swapped, then check. | The right words lock with ✓. The two wrong ones show "опитай пак" and stay movable, `try-again` plays, and you can fix them and check again. |
| 9 | US1-7 | Solve the sentence. | The full sentence appears, written correctly, `correct` plays, and "Напред" appears. |
| 10 | Edge | Use a sentence with a repeated word. | Either copy is accepted in either place. |
| 11 | US2-1, FR-010, FR-012 | Play 6 sentences. | No sentence repeats, they go from shorter to longer, and the last one plays `round`. |
| 12 | US2-2 | Finish with one wrong check. | "Браво! Подреди всички изречения!", "От първия опит: 5 от 6.", stars, and `series` play. |
| 13 | US2-3, US2-4 | Tap "Играй пак", then the home control. | A new series starts, then the portal opens. |
| 14 | US3, FR-014 | Open the portal. | The "Подреди изречението" tile has its picture and opens the game. |
| 15 | SC-005 | Check at 360 px with an 8-word sentence, and on desktop. | Slots and cards wrap with no sideways scrolling, and the home and sound controls are clear. |
| 16 | FR-015 | DevTools → Application and Network. | Nothing is stored, and there are no outside requests. |
| 17 | FR-006, FR-011 | The owner reads every sentence. | Each sentence is correct and approved, and has only one natural word order. |
