// play.js: pure helpers shared by the games. No DOM access, no state.
// Exposed as globalThis.PlayKit, and as module.exports under Node (tests).
// See specs/006-sentence-purpose/contracts/play-helpers.md.
(function () {
  "use strict";

  // Fisher-Yates shuffle; returns a new array and never mutates the input.
  function shuffle(list, rng) {
    rng = rng || Math.random;
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  // 1-3 stars by share found; never 0 (positive feedback only).
  function starsFor(found, total) {
    if (!(total > 0)) return 1;
    var share = found / total;
    if (share >= 0.8) return 3;
    if (share >= 0.5) return 2;
    return 1;
  }

  function firstTryLine(x, y) {
    return "От първия опит: " + x + " от " + y + ".";
  }

  var api = { shuffle: shuffle, starsFor: starsFor, firstTryLine: firstTryLine };

  globalThis.PlayKit = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
