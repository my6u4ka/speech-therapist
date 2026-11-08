# Contract: Question flow, states, sounds, and texts

## Option button states

| State | Look (not color alone) | Tappable |
|---|---|---|
| `idle` | normal full-width button | yes |
| `correct` | green with "✓" before the text; locked | no |
| `ruled-out` | muted, dashed border, small tag "не е това"; `disabled` | no |
| `locked` | after a right answer, the other options are dimmed | no |

## Flow

```text
question shown -> tap option
  right  -> correct; lock all; sfx(index is last ? "round" : "correct"); feedback "Браво!"; show "Напред"
  wrong  -> ruled-out; sfx("try-again"); feedback "Опитай пак!"; firstTry = false; busy ~400 ms
            (if only the right option is left, the child taps it -> right)
"Напред" -> next question, or after the last one -> summary; sfx("series")
"Играй пак" -> new series
```

Taps while `busy` or after `answered` are ignored.

## Texts (Bulgarian; the owner approves them, Principle II)

| When | Text |
|---|---|
| Instruction | Какво означава думата? |
| Right answer | Браво! |
| Wrong answer | Опитай пак! |
| Ruled-out tag | не е това |
| Next button | Напред |
| Summary, line 1 | Браво! Позна значението на всички думи! |
| Summary, line 2 | От първия опит: {firstTry} от {total}. |
| Play again | Играй пак |
