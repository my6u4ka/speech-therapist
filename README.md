# Игри с думи (Word Games)

Small web games that help children in grades 1–4 with written expression and with growing their
passive and active vocabulary. The games and their content are in Bulgarian.

**Live site:** https://my6u4ka.github.io/speech-therapist/

## What is here

- `index.html`: the portal. Every game appears as a tile with a large picture and its name.
- `games.js`: the list of games shown on the portal.
- `games/<id>/`: one folder per game. Games are independent of each other.
- `games/_template/`: a starter for a new game, with the home control already in place.
- `assets/`: portal styles and script, plus the shared home control.
- `404.html`: a friendly "game not found" page.

The site is plain HTML, CSS, and JavaScript. It has no build step, no server, no external
requests, and stores no data about the child.

## Games

| Game | Folder | For | What the child does |
|---|---|---|---|
| Синоними | `games/synonyms/` | grades 2–4 | Marks every word that means nearly the same as the reference word; 5 rounds per series. Word bank: `games/synonyms/words.js`. |
| Антоними | `games/antonyms/` | grades 2–4 | Connects words from two columns into pairs with opposite meanings; 5 pairs per round, 5 rounds per series. Word bank: `games/antonyms/words.js`. |
| Какво означава? | `games/meanings/` | grades 3–4 | Reads a word in a short sentence and chooses its meaning from 3 explanations; 8 words per series. Word bank: `games/meanings/words.js`. |

## Run locally

Open `index.html` in a browser. No server or build step is needed.

## Tests

```bash
node --test
```

This runs the unit tests in `tests/` (game rules and word-bank structure), using only Node's built-in
test runner. Node.js 18 or newer is needed for the tests only, never for the site.

`404.html` uses absolute `/speech-therapist/` paths, so it only works on the published site.

## Add a game

1. Copy `games/_template/` to `games/<id>/` and build the game there.
2. Put a square cover picture in `games/<id>/` (at least 512×512 px, at most 100 KB).
3. Add one entry to `games.js`.

Field rules: [specs/001-game-portal/contracts/game-entry.md](specs/001-game-portal/contracts/game-entry.md).
Every game must keep the home control:
[contracts/home-control.md](specs/001-game-portal/contracts/home-control.md).

## Sounds

`assets/sound/` holds the shared sound effects (`tap`, `correct`, `try-again`, `round`, `series`).
They are synthesized in the browser with the Web Audio API, so there are no audio files and no
licenses. Sound is on whenever a game page opens, and the speaker button at the top right turns it
off for that page; nothing is stored. A sound is never sad or punishing, and the tests in
`tests/sound.test.js` enforce this.

To add sound to a game:
1. Include `assets/sound/sound.css` and `assets/sound/sound.js`, and add the speaker button.
2. Call `GameSound.play(name)` through a guarded helper.

Details: [specs/004-sound-effects/contracts/](specs/004-sound-effects/contracts/).

## How the project is developed

- **Spec-driven development** with [GitHub Spec Kit](https://github.com/github/spec-kit). Each
  feature goes through `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` →
  `/speckit-implement` → `/speckit-converge`, and its documents live in `specs/NNN-name/`.
- **Constitution:** the project's non-negotiable rules are in
  [.specify/memory/constitution.md](.specify/memory/constitution.md).
- **Git flow:** `main` is the published site, served by GitHub Pages; `develop` is the integration
  branch. New work goes on `feature/NNN-name`, `release/X.Y.Z`, or `hotfix/X.Y.Z`, and every
  merge uses `--no-ff`.
