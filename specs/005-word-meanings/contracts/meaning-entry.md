# Contract: Word bank `games/meanings/words.js`

The rules are in [data-model.md](../data-model.md).

## Shape

```js
// words.js: word meanings for grades 3–4. Owner-approved content only.
globalThis.MEANING_ENTRIES = [
  {
    word: "просторен",
    sentence: "Новата ни класна стая е светла и [просторна].",
    right: "голям, с много място",
    wrong: ["тъмен и тесен", "много висок"]
  },
  {
    word: "коса",
    sentence: "Дядо окачи [косата] в бараката след косенето.",
    right: "сечиво за косене на трева",
    wrong: ["космите на главата", "дълга дървена пръчка"]
  }
];
```

In the second entry the other meaning of "коса" (hair) is one of the wrong explanations. This is
allowed and useful: the sentence decides which meaning is right.

## Guarantees from `logic.js`

- `validateEntry(e)` returns `null` if the entry is valid, or a short English reason if not.
- `validateBank(entries)` returns the list of problems. This covers invalid entries, duplicate
  word+right pairs, fewer than 32 entries, and fewer than 8 distinct words.
- `parseSentence(s)` returns `{ before, word, after }`, or `null` if `s` doesn't have exactly one
  `[...]`.
- `pickSeries(entries, 8, rng)` returns up to 8 entries, with no word repeated.
- `node --test` fails if the bank is invalid.

## Adding an entry (owner, SC-005)

1. Add `{ word, sentence, right, wrong: [ , ] }` and mark the word in the sentence with `[ ]`.
2. Run `node --test`.
3. Play a question with the new entry, then commit.
