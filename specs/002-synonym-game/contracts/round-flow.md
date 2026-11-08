# Contract: Round flow, check results, and on-screen texts

## `checkRound(set, marked, attempt)` (pure, in `logic.js`)

Input:
- `set`: a valid word set;
- `marked`: the words currently marked;
- `attempt`: 1 or 2.

Output: `{ statuses, missingCount, done, found }`.
- `statuses`: one status per candidate:
  - `correct`: a marked synonym;
  - `wrong`: a marked distractor;
  - `missed`: an unmarked synonym (on the final check only);
  - `neutral`: anything else.
- `missingCount`: the number of synonyms that are not marked.
- `done`: `true` if `attempt` is 2, or if there are no `wrong` statuses and `missingCount` is 0.
- `found`: the number of `correct` statuses.

## States

```text
selecting(attempt 1) --Провери--> checked
  checked, done  -> show result (celebrate if perfect) -> "Напред"
  checked, !done, missingCount > 0 -> lock correct; clear wrong after ~1 s; show missing line
                                      -> selecting(attempt 2)
  checked, !done, missingCount = 0 -> (all synonyms found, only wrong marks) lock correct;
                                      clear wrong after ~1 s; "Ето всички думи с близко
                                      значение." (no celebration) -> "Напред"
selecting(attempt 2) --Провери--> done: show correct / wrong / missed -> "Напред"
                                  (celebrate if every synonym is marked and nothing is wrong)
last round "Напред" -> summary -> "Играй пак" (new series) or home control
```

- "Провери" is disabled while nothing new is marked. On attempt 2, the locked correct marks don't
  count, so the child must mark at least one more word (FR-004).
- Locked words cannot be tapped (FR-007).

## Texts (Bulgarian; owner approves, Principle II)

| When | Text |
|---|---|
| Instruction, n = 1 | Намери 1 дума с близко значение |
| Instruction, n ≥ 2 | Намери {n} думи с близко значение |
| Check button | Провери |
| After check 1, mistakes, 1 missing | Почти! Остава още 1 дума. |
| After check 1, mistakes, n ≥ 2 missing | Почти! Остават още {n} думи. |
| Perfect round (every synonym marked, nothing wrong) | Браво! Намери всички! |
| Round ends after check 2, or after check 1 with only wrong marks | Ето всички думи с близко значение. |
| Next button | Напред |
| Summary | Браво! Намери {found} от {total} думи. |
| Play again | Играй пак |
| Missed word label | и тази |
| Wrong word hint (shown once) | Опитай пак! |
