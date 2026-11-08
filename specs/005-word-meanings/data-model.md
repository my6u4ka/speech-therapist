# Data Model: Word Meanings Game

## Meaning entry (content, in `games/meanings/words.js`)

| Field | Type | Required | Rules |
|---|---|---|---|
| `word` | text | yes | The headword. Bulgarian, lowercase, at most 20 characters. |
| `sentence` | text | yes | Exactly one `[...]` part, holding the word or an inflected form of it. At most 12 words and at most 90 characters, counted without the brackets. Ends with `.`, `!` or `?`. |
| `right` | text | yes | The meaning of the word as used in the sentence. At most 8 words and at most 60 characters. |
| `wrong` | list of 2 texts | yes | Plausible but wrong meanings, each with the same limits as `right`. |

Rules within an entry and across the bank:
- `right` and both `wrong` items are distinct, compared after trimming and lowercasing.
- The same `word` may appear in several entries, one per meaning, but no two entries may have the
  same `word` and the same `right`.
- The bank has at least 32 entries (SC-006), and at least 8 distinct words, so that a full series
  is possible.
- All text is correct standard Bulgarian, suits grades 3–4, and is owner-approved (FR-009,
  FR-010).

Invalid entries are skipped by the game with a console warning, and they fail the tests.

## Question (in memory)

| Field | Meaning |
|---|---|
| `entry` | the entry being asked |
| `options` | the 3 explanations, shuffled, each `{ text, isRight }` |
| `ruledOut` | the options already chosen wrongly |
| `firstTry` | true until a wrong option is chosen |
| `answered` | true once the right option is chosen |
| `busy` | true for about 400 ms after a wrong choice |

## Series (in memory)

| Field | Meaning |
|---|---|
| `entries` | up to 8 entries from `pickSeries`, each with a different word |
| `index` | the current question |
| `firstTry` / `total` | the number of questions right on the first try, and the number of questions played |

Nothing is persisted.
