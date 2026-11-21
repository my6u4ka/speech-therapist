# Quickstart: Sentence Purpose Game

How to run the game and check that it meets the [spec](spec.md). The rules are in
[data-model.md](data-model.md) and [contracts/](contracts/).

## Prerequisites

- The repository checked out on `feature/006-sentence-purpose`.
- Node.js 18 or newer, for the tests only.
- The local preview server, which serves the site under `/speech-therapist/`.

## Automated checks

```bash
node --test
```

Expected: every suite passes, both the existing suites (synonyms, antonyms, meanings, and sound,
all unchanged) and the new ones (play and sentences).

## Manual validation scenarios

| # | Spec ref | Steps | Expected |
|---|---|---|---|
| 1 | US1-1, US1-4, FR-001–FR-003 | Open the game. | The instruction, the sentence with its end mark, and 4 buttons appear in the order съобщително, въпросително, подбудително, възклицателно. |
| 2 | US1-2, FR-004, FR-005 | Tap the right type. | ✓ and green appear, the buttons lock, "Браво! {reason}" is shown, the `correct` sound plays, and "Напред" appears. |
| 3 | US1-3 | Tap a wrong type. | The button is ruled out with "не е това", the `try-again` sound plays, and the child can choose again. |
| 4 | Edge | Double-tap a wrong type. | It counts once. |
| 5 | US2-1, US2-2, FR-007 | Play 8 questions. | No sentence repeats, and each type appears exactly 2 times. |
| 6 | FR-012 | Answer the 8th question. | The `round` sound plays instead of `correct`. |
| 7 | US2-3, FR-008 | Finish with one wrong try. | "Браво! Позна вида на всички изречения!", "От първия опит: 7 от 8.", stars, and the `series` sound. |
| 8 | US2-4 | Tap "Играй пак". | A new series starts. |
| 9 | US2-5 | Tap the home control mid-series. | The portal opens. |
| 10 | US3, FR-013 | Open the portal. | The "Какво е изречението?" tile has its picture and opens the game. |
| 11 | SC-004 | Check at 360 px and on desktop with the longest sentence. | No sideways scrolling, everything is readable, and the home and sound controls are clear. |
| 12 | FR-014 | DevTools → Application and Network. | Nothing is stored and there are no outside requests. |
| 13 | Migration | Play one series of Синоними, Антоними, and Какво означава?. | Each behaves exactly as before: stars, summary lines, and shuffling. There are no console errors. |
| 14 | FR-010, SC-003 | The owner reads every sentence. | Each is correct, approved, suits grades 3–4, and has exactly one clear type. |
