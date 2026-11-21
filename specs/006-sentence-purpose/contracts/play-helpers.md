# Contract: Shared play helpers (`assets/shared/play.js`)

A classic script that sets `globalThis.PlayKit`. Under Node it also sets `module.exports` to the
same object. It is pure, with no DOM access and no state.

## API

| Function | Behavior |
|---|---|
| `shuffle(list, rng = Math.random)` | Fisher–Yates shuffle. Returns a new array and never mutates `list`. |
| `starsFor(found, total)` | Returns 3 when `found/total` is at least 0.8, 2 when it is at least 0.5, and 1 otherwise. Returns 1 when `total` is 0 or invalid. Never returns 0. |
| `firstTryLine(x, y)` | Returns `"От първия опит: " + x + " от " + y + "."`. |

The behavior is identical to the copies the games had before this feature. Their existing tests
prove it.

## How a game uses it

**In the browser**, the game page loads the shared helpers before its own scripts:

```html
<script defer src="../../assets/shared/play.js"></script>  <!-- before the game's own scripts -->
```

**In the game's `logic.js`**, which works in both the browser and Node:

```js
var Kit = globalThis.PlayKit ||
  (typeof require === "function" ? require("../../assets/shared/play.js") : null);
```

The game then exports its usual names as thin wrappers:

| Game exports | Wraps |
|---|---|
| `shuffle(list, rng)` | `Kit.shuffle(list, rng)` |
| `starsFor(found, total)` | `Kit.starsFor(found, total)` |
| `summaryLine2(x, y)`, where it exists | `Kit.firstTryLine(x, y)` |

`game.js` files and the existing tests do not change.

## Migration rule

After the migration, every existing test suite MUST pass unchanged, and every game MUST behave
exactly as before. A spot check of one series per game in the browser confirms it.
