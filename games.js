// games.js: the list of games shown on the portal, in display order.
// To add a game, add one entry below (see specs/001-game-portal/contracts/game-entry.md).
//
// Field rules:
// - id: lowercase Latin letters, digits, and hyphens (^[a-z0-9-]+$); unique; equals the
//   folder name under games/; never starts with "_".
// - name: Bulgarian, at most 24 characters.
// - image: a relative path inside this site (by convention in the game's folder); square;
//   at least 512x512 px; at most 100 KB; WebP, SVG, or PNG.
// - href: optional; defaults to games/<id>/; must point inside this site, with no http://,
//   https://, or //.
// - The order in the file is the order of tiles.
window.GAMES = [
  { id: "synonyms", name: "Синоними", image: "games/synonyms/cover.svg" },
  { id: "antonyms", name: "Антоними", image: "games/antonyms/cover.svg" }
];
