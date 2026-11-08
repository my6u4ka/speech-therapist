# Quickstart: Word Meanings Game

How to run the game and check that it meets the [spec](spec.md). The rules are in
[data-model.md](data-model.md) and [contracts/](contracts/).

## Prerequisites

- The repository checked out on `feature/005-word-meanings`.
- Node.js 18 or newer (for the tests only).
- The local preview server, which serves the site under `/speech-therapist/`.

## Automated checks

```bash
node --test
```

Expected: all suites pass (synonyms, antonyms, sound, meanings).

## Manual validation scenarios

| # | Spec ref | Steps | Expected |
|---|---|---|---|
| 1 | US1-1, FR-001, FR-002 | Open the game. | The instruction, the word, the sentence with the word highlighted (bold and underlined), and 3 explanations appear. |
| 2 | FR-001 | Reload twice. | The options appear in a different order. |
| 3 | US1-2, FR-004 | Tap the right option. | ✓ and green, all options locked, the `correct` sound, "Браво!", and "Напред" appears. |
| 4 | US1-3 | Tap a wrong option. | The option is ruled out with "не е това", the `try-again` sound plays, and the child can choose again. |
| 5 | US1-4 | Rule out both wrong options, then tap the right one. | It is accepted. |
| 6 | US1-5 | After the right answer, look at the screen. | The right meaning stays visible. |
| 7 | Edge | Double-tap a wrong option, or tap quickly. | It counts once. |
| 8 | US2-1, FR-006 | Play 8 questions. | Every word is different, even for words with two entries. |
| 9 | FR-011 | Answer the 8th question. | The `round` sound plays instead of `correct`. |
| 10 | US2-2, FR-007 | Finish with one wrong try. | "Браво! Позна значението на всички думи!", "От първия опит: 7 от 8.", and stars, with the `series` sound. |
| 11 | US2-3 | Tap "Играй пак". | A new series starts. |
| 12 | US2-4 | Tap the home control mid-series. | The portal opens. |
| 13 | US3, FR-012 | Open the portal. | The "Какво означава?" tile has a picture and opens the game. |
| 14 | SC-004 | Check at 360 px and on desktop with the longest sentence and explanation. | No sideways scrolling; everything is readable. Nothing covers the home or sound controls. |
| 15 | FR-013 | DevTools → Application and Network. | Nothing is stored, and there are no outside requests. |
| 16 | FR-009, SC-003 | The owner reads every entry. | Everything is correct, approved, suits grades 3–4, and never has two right answers. |
