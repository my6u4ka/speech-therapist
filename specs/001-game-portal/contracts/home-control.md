# Contract: Home control (every game)

Required by FR-006 and User Story 2. `games/_template/index.html` already follows it.

## What a game page must include

```html
<html lang="bg">
<head>
  <link rel="stylesheet" href="../../assets/home/home.css">
</head>
<body>
  <a class="home-control" href="../../" aria-label="Начало">
    <img src="../../assets/home/home.svg" alt="">
  </a>
  <!-- game content -->
</body>
```

## Guarantees from `assets/home/home.css`

- Fixed at the **top-left** corner, the same in every game, above the game's content.
- Tap area of at least 64×64 px, with a house icon and high contrast.
- Visible at all times, including while the page scrolls.
- Works with touch, mouse, and keyboard (it is a link, so it can be reached with Tab).

## Rules for games

- The link MUST point to the portal with a relative path (`../../` from `games/<id>/`).
- A game MUST NOT hide, cover, or restyle the home control, and MUST NOT put its own controls in
  the top-left 80×80 px area.
- `404.html` includes the same control, but with **absolute** site paths
  (`/speech-therapist/`, `/speech-therapist/assets/home/...`). GitHub Pages serves `404.html`
  at whatever missing address was requested, at any folder depth, so relative paths would break
  there. This is the only page that uses absolute paths, and it only works on the published site.
