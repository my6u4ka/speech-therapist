# Contract: Sound control (every game)

Required by FR-006. Every game page includes the following.

```html
<head>
  <link rel="stylesheet" href="../../assets/sound/sound.css">
  <script defer src="../../assets/sound/sound.js"></script>  <!-- before the game's own scripts -->
</head>
<body>
  <a class="home-control" ...>...</a>
  <button class="sound-control" type="button" aria-pressed="true" aria-label="Звук">
    <img src="../../assets/sound/speaker-on.svg" alt="">
  </button>
```

## Guarantees from `sound.css` and `sound.js`

- **Position**: fixed at the **top-right**, 8 px from the top and right edges, above the game content.
- **Size and look**: 64×64 px, with the same rounded, high-contrast style as the home control.
- **States**: on shows `speaker-on.svg` with `aria-pressed="true"`; off shows `speaker-off.svg` (a
  speaker with an ✕) with `aria-pressed="false"`.
- **Keyboard**: it works with Tab, Enter, and Space, and has a visible `:focus-visible` outline.

## Rules for games

- Games MUST NOT put their own content in the top-right 80×80 px area. The progress indicator
  moves into the page flow (research R6).
- The image `src` paths are relative (`../../assets/sound/...`) from `games/<id>/`.
