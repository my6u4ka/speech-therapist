# Research: Sentence Builder Game

Phase 0 decisions for [plan.md](plan.md). Each one lists the decision, its rationale, and the
alternatives considered.

## R1. How to implement dragging

- **Decision**: use Pointer Events on each card.
  1. On `pointerdown`, record the start point and call `setPointerCapture`. Nothing moves yet.
  2. Once the pointer has moved more than 8 px, it is a drag:
     - the card gets the class `dragging` and moves with `transform: translate(...)`;
     - while it moves, the slot or pool under the pointer is found with
       `document.elementFromPoint`, ignoring the dragged card (`pointer-events: none` while
       dragging), and that target is highlighted.
  3. On `pointerup`, the card drops onto that target (R3). If there is none, it returns.
  4. If the pointer moved 8 px or less, the gesture is a **tap** (R2).
  5. `pointercancel` returns the card.

  Cards get `touch-action: none`, so dragging never scrolls the page. The page still scrolls when
  the child touches outside the cards.
- **Rationale**:
  - one code path covers touch, mouse, and pen (FR-002, SC-004);
  - moving only `transform` keeps dragging smooth;
  - the movement threshold separates a tap from a drag on the same element (FR-003).
- **Alternatives considered**:
  - The HTML5 drag-and-drop API (`draggable`): it does not work on touch screens in Safari or
    Chrome for Android, so it fails the main target.
  - SortableJS or a similar library: about 40 KB and an external dependency, against Principle
    III's default of plain JavaScript.
  - Touch events plus mouse events: two code paths for the same thing.

## R2. Tap and keyboard

- **Decision**:
  - Cards are `<button>` elements, so the keyboard (Tab, Enter, Space) and screen readers work for
    free.
  - A tap or click on a card in the **pool** moves it to the first empty slot.
  - A tap on a card in a **slot**, if it is not locked, moves it back to the end of the pool.
  - Each card's `aria-label` says its word and where it is, e.g. "котката, място 2".
- **Rationale**: FR-003 and FR-004. A button's click event fires for taps, mouse clicks, Enter,
  and Space, so the "tap" path is a single handler. A gesture that turns into a drag suppresses
  that click.

## R3. Drop rules

- **Decision**:

  | From → To | Result |
  |---|---|
  | pool → empty slot | the card is placed |
  | pool → taken slot | the card is placed, and the slot's card goes back to the pool |
  | slot → empty slot | the card moves |
  | slot → taken slot | the two cards swap |
  | slot → pool | the card goes back to the pool |
  | anything → locked slot or a locked card | rejected; the card returns |
  | dropped elsewhere | the card returns |

- **Rationale**: this follows the spec's acceptance scenarios US1-2 and US1-3 and its edge cases.
  The pool → taken slot rule implements "swap" in the only sensible way, because the pool has no
  position to swap into.

## R4. Content format and display form

- **Decision**:
  - Each entry is `{ text, firstIsName? }`, where `text` is the correctly written sentence, e.g.
    "Котката спи на топлия диван.".
  - `tokenize(text)` splits on spaces and strips punctuation, which gives the target word list.
  - `displayWord(word, index, entry)` lowercases the first word unless `firstIsName` is true
    (FR-007). Words inside the sentence keep their capitals, so names stay capitalized.
- **Rationale**: the owner writes the sentence once, as it should be written. The game derives
  everything else from it, and the correctly written sentence is what the child sees after
  solving (US1-7).

## R5. Validation

- **Decision**: `validateEntry` checks the following:
  - `text` starts with a capital letter and ends with one of `.`, `?`, or `!`;
  - there is no other punctuation inside, such as commas, quotes, dashes, or colons (spec edge
    case);
  - it has 4–8 words (FR-012), and each word is at most 14 letters long, so it fits a card on a
    360 px phone;
  - `firstIsName`, if present, is a boolean.

  `validateBank` checks that the texts are unique and that there are at least 30 of them
  (SC-007).

  A test can't check that a sentence has only one natural order, so the owner's review does
  (FR-006).

## R6. Scramble and check

- **Decision**:
  - `scramble(words, rng)` shuffles with `PlayKit.shuffle` and reshuffles until the order differs
    from the target, up to 20 tries (FR-001). If every word is the same, it returns the list as
    it is, but validation prevents that case.
  - `checkBoard(target, slots)` returns `{ right: [bool per slot], allRight }` by comparing each
    slot's word with `target[i]` as plain strings. A repeated word therefore counts as right in
    either of its places (spec edge case).
- **Rationale**: this is simple, testable, and matches FR-006 and FR-008.

## R7. Series

- **Decision**: `pickSeries(entries, 6, rng)` shuffles, takes 6, and then sorts them by word count
  from shortest to longest. Entries with the same word count keep their random order (FR-010,
  FR-012). Words in a series never repeat.

## R8. Flow and sounds

- **Decision**:
  - **Every successful drop or tap-move** plays `tap`.
  - **"Провери"** is disabled until every slot is filled.
    - When everything is right, all cards lock and get ✓, and the correctly written sentence is
      shown below the slots. The game plays `correct`, or `round` for the last sentence. The
      button becomes "Напред".
    - Otherwise, the right cards lock with ✓. The wrong ones get the `retry` look (a dashed
      border and the tag "опитай пак") and stay movable. The game plays `try-again`, and the
      sentence no longer counts as a first try. A card loses its `retry` look as soon as it is
      moved.
  - **The summary** plays `series`. It shows "Браво! Подреди всички изречения!", the first-try
    line, and the stars.
- **Rationale**: FR-005, FR-008, FR-010, FR-013.

## R9. Layout

- **Decision**:
  - The instruction is at the top, followed by the `#slots` area: a flex-wrap row of slots, each
    at least 80 px wide and 56 px tall, with a dashed outline when empty.
  - The `#pool` area sits below, as a flex-wrap row of cards with at least 48 px height, a font
    of at least 1.3 rem, and generous padding.
  - Below that come the full sentence (after solving), the feedback line (`aria-live`), and the
    main button ("Провери" or "Напред").
  - The progress "n / 6" is in the flow at the top.
- **Rationale**: on a 360 px phone, eight words wrap onto 2–3 lines without sideways scrolling
  (SC-005), and the targets are big enough for fingers.

## R10. Initial bank

- **Decision**: draft at least 30 sentences for grades 3–4, with 4–8 words, no commas, and a mix of
  statements, questions, and exclamations. Prefer orders that grammar fixes, such as
  preposition + noun, adjective + noun, and a question word first. Avoid:
  - free adverbials of time or place that could move, e.g. "вчера" or "в парка";
  - subject–verb–object sentences whose reversed order is just as natural.

  The owner approves the bank before release, with special attention to FR-006.
