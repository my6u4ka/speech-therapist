# Contract: Content file `games/sentences/words.js`

The rules are in [data-model.md](../data-model.md).

## Shape

```js
// words.js: sentence types and sentences for grades 3–4. Owner-approved content only.
globalThis.SENTENCE_TYPES = [
  { id: "statement",   label: "съобщително",   reason: "Съобщава нещо.",                    marks: ["."] },
  { id: "question",    label: "въпросително",  reason: "Пита за нещо.",                     marks: ["?"] },
  { id: "request",     label: "подбудително",  reason: "Подканва някого да направи нещо.",  marks: ["!", "."] },
  { id: "exclamation", label: "възклицателно", reason: "Изразява силно чувство.",           marks: ["!"] }
];

globalThis.SENTENCE_ENTRIES = [
  { text: "Днес отиваме на излет в планината.", type: "statement" },
  { text: "Кога започва първият час?",          type: "question" },
  { text: "Затвори прозореца, моля!",            type: "request" },
  { text: "Колко е красиво навън!",              type: "exclamation" }
];
```

## Guarantees from `logic.js`

- `validateEntry(entry, types)` returns `null` or a short English reason, applying every rule in
  the data model, including the end mark that matches the type.
- `validateBank(entries, types)` returns a list of problems: invalid entries, duplicate texts, and
  any type with fewer than 10 entries.
- `buildSeries(entries, 2, rng)` returns up to 8 entries, at most 2 per type, with no repeats, in
  shuffled order.
- `node --test` fails if the bank is invalid.

## Adding a sentence (owner, SC-005)

1. Add `{ text, type }` with the correct end mark.
2. Run `node --test`.
3. Play a series, then commit.
