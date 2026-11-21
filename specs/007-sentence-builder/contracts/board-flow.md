# Contract: Board, moves, drag, check, sounds and texts

## Areas

- `#slots`: one slot per word, in order. An empty slot has a dashed outline. A slot under a
  dragged card is highlighted.
- `#pool`: the cards that are not placed, in scrambled order. It is also a drop target.

## Card states

| State | Look (never color alone) | Movable |
|---|---|---|
| `idle` (pool or slot) | a large rounded card | yes |
| `dragging` | lifted (shadow, slightly larger), follows the pointer | (being moved) |
| `locked` | green with "✓"; a check found it right | no |
| `retry` | dashed border with a small "опитай пак" tag; a check found it wrong. Cleared as soon as the card moves. | yes |

## Moves (drag or tap; see research R1–R3)

| Gesture | From → To | Result |
|---|---|---|
| drag | pool → empty slot | placed |
| drag | pool → taken slot | placed; the old card goes back to the pool |
| drag | slot → empty slot | moved |
| drag | slot → taken slot | swapped |
| drag | slot → pool | back to the pool |
| drag | → locked slot, or dropped outside | rejected; the card returns |
| tap / Enter / Space | pool card | goes to the first empty slot |
| tap / Enter / Space | slot card (not locked) | goes back to the end of the pool |

Every successful move plays `sfx("tap")`. A gesture counts as a drag after more than 8 px of
movement; a shorter gesture counts as a tap.

## Check

```text
"Провери" enabled only when every slot holds a card
tap "Провери":
  all right   -> every card locked; show the full sentence (as written in text);
                 sfx(last sentence ? "round" : "correct"); feedback "Браво!"; button -> "Напред"
  some wrong  -> right cards locked; wrong cards get retry; sfx("try-again");
                 feedback "Почти! Премести думите с „опитай пак“."; firstTry = false
"Напред" -> next sentence; after the last one -> summary; sfx("series")
"Играй пак" -> new series
```

## Texts (Bulgarian; the owner approves them, Principle II)

| When | Text |
|---|---|
| Instruction | Подреди думите в изречение |
| Check button | Провери |
| All right | Браво! |
| Some wrong | Почти! Премести думите с „опитай пак“. |
| Retry tag | опитай пак |
| Next button | Напред |
| Summary, line 1 | Браво! Подреди всички изречения! |
| Summary, line 2 | От първия опит: {firstTry} от {total}. |
| Play again | Играй пак |
