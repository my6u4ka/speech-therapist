# Data Model: Synonym Game

## Word set (content, in `games/synonyms/words.js`)

| Field | Type | Required | Rules |
|---|---|---|---|
| `word` | text | yes | The reference word. Bulgarian, lowercase, one word or a short phrase, at most 20 characters. Unique across the bank. |
| `synonyms` | list of text | yes | 1–4 words with the same or nearly the same meaning (spec: Assumptions). Each is at most 20 characters. |
| `distractors` | list of text | yes | Words that are not synonyms. Each is at most 20 characters. `synonyms` + `distractors` together give 8–12 candidates (FR-001). |

Rules across fields:
- All words in one set (`word`, `synonyms`, `distractors`) are distinct, compared after trimming
  and lowercasing.
- No word appears in both `synonyms` and `distractors`.
- The reference `word` does not appear among the candidates.
- The bank has at least 20 sets (SC-006).
- All words are correct standard Bulgarian, suit grades 2–4, and are owner-approved (FR-011,
  FR-012).

Invalid sets are skipped by the game with a console warning, and they fail the test suite.

## Round (in memory)

| Field | Meaning |
|---|---|
| `set` | the word set being played |
| `candidates` | the shuffled list of `synonyms` + `distractors` |
| `marked` | the candidates the child has currently marked |
| `locked` | synonyms confirmed as correct by the first check (they can no longer be unmarked) |
| `attempt` | 1 or 2 |
| `state` | `selecting` → `checked` → (`selecting` again on attempt 2) → `done` |
| `found` | how many synonyms were marked correctly by the end of the round |

The state transitions are in [contracts/round-flow.md](contracts/round-flow.md).

## Series (in memory)

| Field | Meaning |
|---|---|
| `rounds` | up to 5 word sets from `pickSeries`, with no repeats (FR-009) |
| `index` | the current round (0-based) |
| `found` / `total` | the sums of `found` and of synonym counts across the finished rounds, shown in the summary |

Nothing is persisted. Leaving the page discards the series (spec: Edge Cases).
