# Contract: Game entry in `games.js`

The portal's only input. Field rules are in [data-model.md](../data-model.md).

## Shape

```js
// games.js: the list of games shown on the portal, in display order.
window.GAMES = [
  {
    id: "example-game",                  // = folder games/example-game/
    name: "Име на играта",               // Bulgarian, at most 24 characters
    image: "games/example-game/cover.webp"
    // href: "games/example-game/"       // optional; this is the default
  }
];
```

## Guarantees the portal gives

- Every valid entry becomes exactly one tile, in file order, showing only the picture and name.
- A tile is a link to `href` (or `games/<id>/`), opened in the same window.
- An invalid entry is skipped with a console warning; the other tiles still render.
- An empty list is valid. The portal then shows only its title, but it is never released like
  that (spec: Assumptions).

## Adding a game (owner checklist, SC-005)

1. Copy `games/_template/` to `games/<id>/` and build the game there.
2. Put the cover picture in `games/<id>/`.
3. Add one entry to `games.js` in the position you want.
4. Open the portal and check the new tile per [quickstart.md](../quickstart.md).
