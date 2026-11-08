# Data Model: Game Portal

## Game entry

One game the portal can open (spec: Key Entities). All entries live in order in `games.js`; the
order in the file is the order of tiles on the portal.

| Field | Type | Required | Rules |
|---|---|---|---|
| `id` | text | yes | Lowercase Latin letters, digits, and hyphens (`^[a-z0-9-]+$`). Unique. Equals the game's folder name under `games/`. Never starts with `_`, which is reserved for `games/_template/`. |
| `name` | text | yes | Bulgarian, correctly spelled, owner-approved (Principle II). Short enough to fit the tile: at most 24 characters. Shown as text on the tile. |
| `image` | relative path | yes | The cover picture, inside the game's folder, e.g. `games/<id>/cover.webp`. Square, at least 512×512 px, at most 100 KB, WebP/SVG/PNG (research R9). |
| `href` | relative path | no | Where the tile opens. Defaults to `games/<id>/`. Must point inside this site (FR-009); absolute URLs (`http://`, `https://`, `//`) are not allowed. |

Relationships: none. Each entry stands alone, and removing one never affects another
(Principle V).

State: none. Entries are static; the portal stores nothing (FR-008).

Validation: the portal script skips (does not render) an entry that breaks a rule and reports
it in the browser console, so one bad entry cannot break the page. The owner reviews entries
when adding them; see the [game-entry contract](contracts/game-entry.md).
