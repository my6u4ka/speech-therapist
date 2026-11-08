# Research: Game Portal

Phase 0 decisions for [plan.md](plan.md). Each one lists the decision, its rationale, and the
alternatives considered.

## R1. Where the game list lives

- **Decision**: a plain script data file `games.js` at the root, which defines one global array
  (`window.GAMES`). The portal script reads it and renders the tiles.
- **Rationale**: it keeps content separate from code (Principle II) and makes adding a game a
  one-entry change (FR-007, SC-005). Unlike JSON loaded with `fetch`, a script file also works
  when `index.html` is opened straight from disk, so local checking needs no server. The
  existing game uses the same pattern (`questions.js`).
- **Alternatives considered**:
  - `games.json` + `fetch`: cleaner format, but it fails from `file://` and would need a local
    server for every check.
  - Tiles hand-written in `index.html`: needs no JavaScript, but mixes content into the page and
    makes each addition an HTML edit that is easier to get wrong.

## R2. How a tile opens a game

- **Decision**: each tile is a normal link (`<a href="games/<id>/">`) that wraps the picture and
  the name, and opens in the same window.
- **Rationale**: one navigation per tap, even on double taps (edge case). It works with touch,
  mouse, and keyboard; screen readers announce it as a link; and the back button keeps working.
- **Alternatives considered**: buttons with click handlers that set `location`. These need extra
  code to prevent double navigation and to stay accessible, with no gain.

## R3. A game that fails to open

- **Decision**: add a root `404.html` in Bulgarian, with a friendly message and the home control.
  GitHub Pages serves it for any missing path under the site.
- **Rationale**: it covers the "game fails to open" edge case with no code. Because Pages serves
  this page at the missing address (any depth), it uses absolute `/speech-therapist/` paths for
  its stylesheet, icon, and home link. This is the one exception to "relative URLs only" (R8).
- **Alternatives considered**: checking each game's address from the portal before navigating.
  This adds requests and complexity, and it fails from `file://`.

## R4. Picture that fails to load

- **Decision**: the name is always rendered as text below the picture, and the picture's `alt` is
  empty because the name sits next to it. If the picture fails, the script hides the broken image
  and the tile keeps its name and link.
- **Rationale**: it meets the edge case, and the tile still opens the game.
- **Alternatives considered**: a fallback picture. That is one more asset with no real benefit
  over showing the name.

## R5. Layout and tap size

- **Decision**: use a CSS grid of tiles (`repeat(auto-fill, minmax(140px, 1fr))`) with a 16 px page
  gutter. Pictures are square, and the name sits below in large text. Columns are capped so tiles
  never shrink below 140 px, and the list scrolls only vertically.
- **Rationale**: this gives 2 columns on a 360 px phone and 4–6 on desktop. Tiles stay well above
  the minimum touch size for small hands (SC-004), and there is no sideways scrolling.
- **Alternatives considered**: a fixed number of columns per breakpoint. That means more media
  queries for the same result.

## R6. Font

- **Decision**: use the system font stack (`system-ui, "Segoe UI", Roboto, "Helvetica Neue",
  Arial, sans-serif`) with `lang="bg"` on the page, and large sizes (names at 1.4 rem or more).
- **Rationale**: there is no download and no third-party request (Principle IV, SC-003), and every
  system font listed supports Cyrillic. With `lang="bg"`, fonts that have Bulgarian letter forms
  use them.
- **Alternatives considered**:
  - Google Fonts: sends visitors' requests to a third party, so it is rejected (Principle IV).
  - A self-hosted font such as a child-friendly rounded Cyrillic face: possible later if a game
    needs a specific handwriting-friendly look. It adds weight, so it is deferred to that game's
    plan.

## R7. Testing

- **Decision**: manual acceptance checks only, following [quickstart.md](quickstart.md), at 360 px
  and desktop widths in at least two browsers. There is no automated test suite for this feature.
- **Rationale**: the portal has almost no logic (render a list of links). The constitution makes
  automated tests optional and forbids requiring a server or build step for the site. A browser
  test runner would add Node tooling to a project that otherwise has none.
- **Alternatives considered**: Playwright end-to-end tests. They are worth adding once games with
  real logic exist; that is a decision for a later plan.

## R8. Publishing on GitHub Pages

- **Decision**: serve from branch `main`, folder `/` (root), with a `.nojekyll` file. Use only
  relative URLs.
- **Rationale**: this matches git flow (`main` = released) and the existing game. `.nojekyll`
  stops Jekyll from processing the site and from hiding folders that start with `_` (such as
  `games/_template/`). Relative URLs work both under `/speech-therapist/` and from disk.
- **Alternatives considered**:
  - The `/docs` folder: keeps the site apart from the Spec Kit files, but "docs" would be
    misleading as the site's home.
  - GitHub Actions deploy: needs a workflow file and adds no value without a build step.

## R9. Pictures

- **Decision**: each game provides one square cover picture of at least 512×512 px and at most
  100 KB, in WebP, SVG, or PNG, stored inside the game's folder.
- **Rationale**: it is sharp on tablets, light enough for SC-003, and keeps each game
  self-contained (Principle V).
- **Alternatives considered**: a shared images folder. That would couple games to the portal.
