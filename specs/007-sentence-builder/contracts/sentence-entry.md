# Contract: Word bank `games/builder/words.js`

The rules are in [data-model.md](../data-model.md).

## Shape

```js
// words.js: sentences to arrange, for grades 3–4. Owner-approved content only.
globalThis.BUILDER_SENTENCES = [
  { text: "Котката спи на топлия диван." },
  { text: "Кой е написал тази интересна книга?" },
  { text: "Иван има малко бяло куче.", firstIsName: true }
];
```

## Guarantees from `logic.js`

- `tokenize(text)` returns the words without punctuation. For example,
  `"Котката спи на топлия диван."` gives `["Котката", "спи", "на", "топлия", "диван"]`.
- `displayWord(word, index, entry)` returns the card label. The first word is lowercased unless
  `entry.firstIsName` is true; every other word is returned as written.
- `validateEntry(entry)` returns `null` if the entry is valid, or a short reason in English.
  `validateBank(entries)` returns the list of problems.
- `scramble(words, rng)` returns a shuffled copy. It differs from `words` whenever that is
  possible.
- `checkBoard(target, slotWords)` returns `{ right: boolean[], allRight }` by exact string
  comparison per position.
- `pickSeries(entries, 6, rng)` returns up to 6 entries, sorted by word count, with no repeats.
- `node --test` fails if the bank is invalid.

## Adding a sentence (owner, SC-006)

1. Add `{ text: "..." }`, written exactly as it should look, with a capital letter, an end mark,
   and no commas. Add `firstIsName: true` if the sentence starts with a name.
2. Make sure there is only one natural word order.
3. Run `node --test`, play the sentence once, then commit.
