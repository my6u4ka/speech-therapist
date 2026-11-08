# Contract: `GameSound` (assets/sound/sound.js)

A classic script that sets `globalThis.GameSound`. Under Node (tests), `module.exports` exposes
`{ RECIPES, LIMITS }` without touching any browser APIs.

## API

| Member | Behavior |
|---|---|
| `GameSound.play(name)` | Plays one of `tap`, `correct`, `try-again`, `round`, or `series`. It does nothing if the sound is off, if audio is not unlocked yet, if audio is unsupported, or if the name is unknown. It never throws. It handles overlap per research R4. |
| `GameSound.isOn()` | Returns `true` or `false`. It is `true` on page load. |
| `GameSound.setOn(bool)` | Sets the state, stops all sounds immediately when turning off, and updates every `.sound-control` on the page (icon and `aria-pressed`). |
| `GameSound.toggle()` | `setOn(!isOn())`. |
| `GameSound.RECIPES` | The recipe data (see data-model.md). Read-only by convention. |

On load, `sound.js`:
- adds a one-time unlock listener (`pointerdown`/`keydown`, capture) that creates and resumes the
  `AudioContext`;
- wires a click handler on every `.sound-control` that calls `toggle()`.

## How games call it

Each game's `game.js` defines:

```js
function sfx(name) { if (globalThis.GameSound) globalThis.GameSound.play(name); }
```

| Game | Moment | Call |
|---|---|---|
| Синоними | a word is marked or unmarked | `sfx("tap")` |
| Синоними | after "Провери" | `sfx(SynonymLogic.checkSound(result, perfect))`, exactly one call |
| Синоними | the summary is shown | `sfx("series")` |
| Антоними | a word is selected, unselected, or the selection moves | `sfx("tap")` |
| Антоними | a correct pair, not the last one in the round | `sfx("correct")` |
| Антоними | the last pair of a round | `sfx("round")` instead of `correct` |
| Антоними | a wrong pair | `sfx("try-again")`, once |
| Антоними | the summary is shown | `sfx("series")` |

## `SynonymLogic.checkSound(result, perfect)` (pure)

- `result.done` is true: returns `"round"`.
- otherwise, any status in `result.statuses` is `"wrong"`: returns `"try-again"`.
- otherwise: returns `"correct"`.

`perfect` is accepted for future use (e.g. a special perfect sound) and is ignored for now.
