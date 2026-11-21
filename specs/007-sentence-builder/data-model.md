# Data Model: Sentence Builder Game

## Sentence entry (content, `globalThis.BUILDER_SENTENCES` in `games/builder/words.js`)

| Field | Type | Required | Rules |
|---|---|---|---|
| `text` | text | yes | One correctly written Bulgarian sentence. It starts with a capital letter and ends with `.`, `?`, or `!`, with no other punctuation. It has 4–8 words separated by single spaces, and each word has at most 14 letters. |
| `firstIsName` | boolean | no | `true` when the first word is a proper name (e.g. "Иван") and must stay capitalized on its card. The default is `false`. |

Rules across the bank:
- `text` is unique (compared after trimming and lowercasing).
- The bank has at least 30 entries (SC-007).
- Every sentence has **one natural word order** for a grade-3 child (FR-006), is in correct
  standard Bulgarian, and is approved by the owner. This is checked in the owner's review, not by
  the tests.

The game skips invalid entries and logs a console warning for each one. The tests fail on them.

## Derived values (pure, in `logic.js`)

| Name | Meaning |
|---|---|
| `target` | `tokenize(text)`: the words in the right order, without punctuation, case as written |
| card label | `displayWord(word, i, entry)`: the first word in lowercase unless `firstIsName`; the others as written |

## Board (in memory)

| Field | Meaning |
|---|---|
| `target` | the list of right words |
| `cards` | one per word: `{ id, word, label, place: "pool" \| slotIndex, locked, retry }` |
| `slots` | for each slot index, the card id it holds, or empty |
| `firstTry` | true until a check finds a mistake |
| `solved` | true once a check finds everything right |

A card is in exactly one place. A locked card never moves.

## Series (in memory)

| Field | Meaning |
|---|---|
| `entries` | 6 entries from `pickSeries`, sorted from shortest to longest |
| `index`, `firstTry`, `total` | the current sentence, and the counts for the summary |

Nothing is persisted.
