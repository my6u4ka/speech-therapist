# Contract: Word bank `games/synonyms/words.js`

The rules are in [data-model.md](../data-model.md). This file shows the shape and how to add a set.

## Shape

```js
// words.js: word sets for the synonym game (grades 2–4). Owner-approved content only.
globalThis.SYNONYM_SETS = [
  {
    word: "голям",
    synonyms: ["огромен", "едър", "грамаден"],
    distractors: ["малък", "висок", "тежък", "бърз", "весел", "къс", "стар"]
  }
];
```

In this example, the distractors include an opposite ("малък") and words close in topic ("висок",
"тежък"). These make the child think about meaning.

## Guarantees from `logic.js`

- `validateSet(set)` returns `null` if the set is valid, or a short English reason if not. It
  applies every rule in the data model.
- The game shows only valid sets, and it warns in the console for each invalid one.
- `node --test` fails if any set in the bank is invalid, or if the bank has fewer than 20
  sets.

## Adding a set (owner, SC-005)

1. Add one `{ word, synonyms, distractors }` object to `words.js`.
2. Run `node --test`, or open the game and check the console for warnings.
3. Play a round with the new set, then commit.
