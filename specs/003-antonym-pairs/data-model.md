# Data Model: Antonym Pairs Game

## Antonym pair (content, in `games/antonyms/words.js`)

| Field | Type | Required | Rules |
|---|---|---|---|
| `a` | text | yes | Bulgarian, lowercase, one word or a short phrase, at most 16 characters. |
| `b` | text | yes | The opposite of `a`. Same rules as `a`, and different from `a`. |
| `avoid` | list of text | no | Words that must not appear in the same round as this pair (research R3). Each is at most 16 characters, and none is `a` or `b`. |

Rules across the bank:
- No two pairs are the same pair in either order, so "ден–нощ" and "нощ–ден" are duplicates.
- The bank has at least 40 pairs (SC-006).
- A series of 5 rounds × 5 conflict-free pairs MUST be buildable from the bank (tested with a
  fixed seed).
- All words are correct standard Bulgarian, suit grades 2–4, and are owner-approved (FR-011,
  FR-012).

Invalid pairs are skipped by the game with a console warning, and they fail the test suite.

## Conflict (derived)

Two pairs conflict if they share a word, or if a word of one is in the other's `avoid`. Words are
compared after trimming and lowercasing. Conflicting pairs never share a round.

## Round (in memory)

| Field | Meaning |
|---|---|
| `pairs` | 5 pairs, none of them in conflict with each other |
| `left`, `right` | the two shuffled columns. Each item is `{ word, pairIndex }`. |
| `selected` | the currently selected item, or none |
| `matched` | for each pair index: the pair number 1–5 in the order made, or none |
| `triedWrong` | the words that were part of a wrong pairing in this round |
| `busy` | true while a wrong pair is being shown (input paused) |

The round is complete when all 5 pairs are matched.

## Series (in memory)

| Field | Meaning |
|---|---|
| `rounds` | up to 5 rounds from `buildSeries`, with no pair repeated |
| `index` | the current round |
| `firstTry` / `total` | pairs made with neither word in `triedWrong`, and all pairs, summed over the finished rounds |

Nothing is persisted.
