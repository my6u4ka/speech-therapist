# Contract: Word bank `games/antonyms/words.js`

The rules are in [data-model.md](../data-model.md).

## Shape

```js
// words.js: antonym pairs for grades 2–4. Owner-approved content only.
globalThis.ANTONYM_PAIRS = [
  { a: "ден", b: "нощ" },
  { a: "голям", b: "малък", avoid: ["огромен", "мъничък", "дребен"] },
  { a: "стар", b: "млад", avoid: ["нов"] },
  { a: "отварям", b: "затварям" }
];
```

## Guarantees from `logic.js`

- `validatePair(p)` returns `null` if the pair is valid, or a short English reason if not.
- `validateBank(pairs)` returns a list of problems: invalid pairs, duplicate pairs in either order,
  and a bank smaller than 40.
- `conflicts(p, q)` is `true` when the two pairs share a word or one pair's `avoid` list hits the
  other (in either direction).
- `buildSeries(pairs, 5, 5, rng)` returns up to 5 rounds of 5 pairs. No round contains a
  conflicting pair, and no pair repeats in the series.
- `node --test` fails if the bank is invalid, or if a full series of 5×5 cannot be built from it.

## Adding a pair (owner, SC-005)

1. Add `{ a, b }` to `words.js`. If either word has a close synonym or a second opposite elsewhere
   in the bank, list those words in `avoid`.
2. Run `node --test`.
3. Play a round, then commit.
