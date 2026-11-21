# Contract: Question flow, states, sounds, and texts

## Type button states

| State | Look (not color alone) | Tappable |
|---|---|---|
| `idle` | normal button with the type label | yes |
| `correct` | green with "✓" before the label; locked | no |
| `ruled-out` | muted, dashed border, small tag "не е това"; `disabled` | no |
| `locked` | dimmed, after a right answer | no |

## Flow

```text
question shown (sentence with its end mark; 4 buttons in fixed order)
tap type
  right  -> correct; lock all; feedback "Браво! " + type.reason;
            sfx(last question ? "round" : "correct"); show "Напред"
  wrong  -> ruled-out; sfx("try-again"); feedback "Опитай пак!"; firstTry = false; busy ~400 ms
"Напред" -> next question, or after the last one -> summary; sfx("series")
"Играй пак" -> new series
```

Taps are ignored while `busy` and after the question is answered.

## Texts (Bulgarian; the owner approves them, Principle II)

| When | Text |
|---|---|
| Instruction | Какво е изречението? |
| Type labels and reasons | from `SENTENCE_TYPES` (data-model.md) |
| Right answer | Браво! {reason} |
| Wrong answer | Опитай пак! |
| Ruled-out tag | не е това |
| Next button | Напред |
| Summary, line 1 | Браво! Позна вида на всички изречения! |
| Summary, line 2 | От първия опит: {firstTry} от {total}. |
| Play again | Играй пак |
