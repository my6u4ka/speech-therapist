# Contract: Pairing flow, states, and on-screen texts

## Word button states

| State | Look (not color alone) | Tappable |
|---|---|---|
| `idle` | normal button | yes |
| `selected` | thick outline and "●" before the word; `aria-pressed="true"` | yes (tap again to unselect) |
| `wrong` | muted, short shake; about 0.9 s | no (input paused) |
| `matched` | pair color and "✓ n" (n = 1–5, the same on both words); locked | no |

## Flow

```text
idle --tap--> selected(X)
selected(X) --tap X--> idle
selected(X) --tap Y in same column--> selected(Y)
selected(X) --tap Y in other column-->
    isPair(X,Y)  -> both matched(n = next number) ; if all 5 matched -> round complete
    !isPair(X,Y) -> both wrong ("Опитай пак!"), busy ~0.9 s -> both idle; remember X,Y in triedWrong
round complete -> "Браво!" (+ celebrate) -> "Напред"
last round "Напред" -> summary -> "Играй пак" (new series) or home control
```

## Texts (Bulgarian; owner approves, Principle II)

| When | Text |
|---|---|
| Instruction | Свържи думите с противоположно значение |
| Wrong pair | Опитай пак! |
| Correct pair | Да! |
| Round complete | Браво! Всички двойки са свързани! |
| Next button | Напред |
| Summary, line 1 | Браво! Свърза всички двойки! |
| Summary, line 2 | От първия опит: {firstTry} от {total}. |
| Play again | Играй пак |
