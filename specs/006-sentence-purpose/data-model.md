# Data Model: Sentence Purpose Game

## Sentence type (content, `globalThis.SENTENCE_TYPES` in `games/sentences/words.js`)

The list is fixed and ordered. Its order is the button order (FR-001, FR-002).

| `id` | `label` | `reason` | `marks` |
|---|---|---|---|
| `statement` | съобщително | Съобщава нещо. | `.` |
| `question` | въпросително | Пита за нещо. | `?` |
| `request` | подбудително | Подканва някого да направи нещо. | `!` `.` |
| `exclamation` | възклицателно | Изразява силно чувство. | `!` |

The owner may edit `label` and `reason`, which are Bulgarian. The `id` values and `marks` are
fixed.

## Sentence entry (content, `globalThis.SENTENCE_ENTRIES`)

| Field | Type | Required | Rules |
|---|---|---|---|
| `text` | text | yes | One Bulgarian sentence. It starts with a capital letter, has at most 12 words and at most 90 characters, and ends with a mark allowed for its type. |
| `type` | id | yes | One of `statement`, `question`, `request`, `exclamation`. |

Rules across the bank:
- `text` is unique after trimming and lowercasing.
- Each type has at least 10 entries (SC-006).
- Every sentence has exactly one clear type for a grade-3 reader, is correct standard Bulgarian,
  and is approved by the owner (FR-010). The owner's review checks this; tests can't.

Invalid entries are skipped by the game with a console warning, and they fail the tests.

## Question (in memory)

| Field | Meaning |
|---|---|
| `entry` | the sentence being asked |
| `ruledOut` | type ids already chosen wrongly |
| `firstTry` | true until a wrong type is chosen |
| `answered` | true once the right type is chosen |
| `busy` | true for about 400 ms after a wrong choice |

## Series (in memory)

| Field | Meaning |
|---|---|
| `entries` | from `buildSeries`: 2 per type (or fewer if a type is short), shuffled |
| `index` | the current question |
| `firstTry` / `total` | for the summary |

## Shared helpers (`assets/shared/play.js`)

These are pure and stateless; see [contracts/play-helpers.md](contracts/play-helpers.md).
