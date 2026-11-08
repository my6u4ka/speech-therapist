// logic.js: pure rules for the antonym game. No DOM access.
// Exposed as globalThis.AntonymLogic, and as module.exports under Node (tests).
(function () {
  "use strict";

  var MAX_WORD = 16;
  var MIN_BANK = 40;

  function normalize(w) {
    return String(w).trim().toLowerCase();
  }

  function isText(w) {
    return typeof w === "string" && normalize(w).length > 0 && w.length <= MAX_WORD;
  }

  // Returns null if the pair is valid, or a short English reason.
  function validatePair(p) {
    if (!p || typeof p !== "object") return "pair is not an object";
    if (!isText(p.a)) return "a must be text of at most " + MAX_WORD + " characters";
    if (!isText(p.b)) return "b must be text of at most " + MAX_WORD + " characters";
    if (normalize(p.a) === normalize(p.b)) return "a and b must be different";
    if (p.avoid !== undefined) {
      if (!Array.isArray(p.avoid)) return "avoid must be a list";
      if (!p.avoid.every(isText)) return "each avoid word must be text of at most " + MAX_WORD + " characters";
      var own = [normalize(p.a), normalize(p.b)];
      for (var i = 0; i < p.avoid.length; i++) {
        if (own.indexOf(normalize(p.avoid[i])) !== -1) return "avoid must not contain a or b";
      }
    }
    return null;
  }

  function pairKey(p) {
    var x = normalize(p.a);
    var y = normalize(p.b);
    return x < y ? x + "|" + y : y + "|" + x;
  }

  // Returns a list of problems (empty if the bank is fine).
  function validateBank(pairs) {
    var problems = [];
    if (!Array.isArray(pairs)) return ["bank is not a list"];
    var seen = {};
    pairs.forEach(function (p, i) {
      var label = "pair " + i + (p && p.a && p.b ? " (" + p.a + "-" + p.b + ")" : "");
      var reason = validatePair(p);
      if (reason) {
        problems.push(label + ": " + reason);
        return;
      }
      var key = pairKey(p);
      if (Object.prototype.hasOwnProperty.call(seen, key)) {
        problems.push(label + ": duplicate pair (same pair in either order)");
      }
      seen[key] = true;
    });
    if (pairs.length < MIN_BANK) {
      problems.push("bank has " + pairs.length + " pairs, at least " + MIN_BANK + " are needed");
    }
    return problems;
  }

  // Two pairs conflict if they share a word, or a word of one is in the other's avoid list
  // (either direction). Conflicting pairs never share a round (research R3).
  function conflicts(p, q) {
    var pw = [normalize(p.a), normalize(p.b)];
    var qw = [normalize(q.a), normalize(q.b)];
    if (pw.some(function (w) { return qw.indexOf(w) !== -1; })) return true;
    var pa = (p.avoid || []).map(normalize);
    var qa = (q.avoid || []).map(normalize);
    return pa.some(function (w) { return qw.indexOf(w) !== -1; }) ||
      qa.some(function (w) { return pw.indexOf(w) !== -1; });
  }

  // Fisher-Yates shuffle; returns a new array.
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

  // Builds the two columns of a round (research R5). A coin flip per pair decides which word
  // goes left; then each column is shuffled on its own. Items: { word, pairIndex, side }.
  function buildColumns(roundPairs, rng) {
    rng = rng || Math.random;
    var left = [];
    var right = [];
    roundPairs.forEach(function (p, i) {
      var flip = rng() < 0.5;
      left.push({ word: flip ? p.a : p.b, pairIndex: i, side: "left" });
      right.push({ word: flip ? p.b : p.a, pairIndex: i, side: "right" });
    });
    return { left: shuffle(left, rng), right: shuffle(right, rng) };
  }

  // True only for the same pair, taken from opposite columns.
  function isPair(x, y) {
    return x.pairIndex === y.pairIndex && x.side !== y.side;
  }

  // Counts the pairs where neither word was part of a wrong pairing (FR-009).
  // triedWrong is a Set or an array of words.
  function firstTryCount(roundPairs, triedWrong) {
    var tried = {};
    Array.from(triedWrong).forEach(function (w) { tried[normalize(w)] = true; });
    return roundPairs.filter(function (p) {
      return !tried[normalize(p.a)] && !tried[normalize(p.b)];
    }).length;
  }

  // One greedy pass: fills rounds from a shuffled bank (research R4). Returns full rounds only.
  function greedySeries(pairs, rounds, perRound, rng) {
    var pool = shuffle(pairs, rng);
    var series = [];
    while (series.length < rounds) {
      var round = [];
      var rest = [];
      pool.forEach(function (p) {
        if (round.length < perRound && round.every(function (q) { return !conflicts(p, q); })) {
          round.push(p);
        } else {
          rest.push(p);
        }
      });
      if (round.length < perRound) break;
      series.push(round);
      pool = rest;
    }
    return series;
  }

  // Builds up to `rounds` rounds of `perRound` pairs. No round holds conflicting pairs and no
  // pair repeats. Retries up to 20 times and keeps the longest result.
  function buildSeries(pairs, rounds, perRound, rng) {
    if (rounds === undefined) rounds = 5;
    if (perRound === undefined) perRound = 5;
    var best = [];
    for (var attempt = 0; attempt < 20; attempt++) {
      var series = greedySeries(pairs, rounds, perRound, rng);
      if (series.length > best.length) best = series;
      if (best.length === rounds) break;
    }
    return best;
  }

  // 1-3 stars by share found; never 0 (positive feedback only).
  function starsFor(found, total) {
    if (!(total > 0)) return 1;
    var share = found / total;
    if (share >= 0.8) return 3;
    if (share >= 0.5) return 2;
    return 1;
  }

  function summaryLine2(firstTry, total) {
    return "От първия опит: " + firstTry + " от " + total + ".";
  }

  var api = {
    buildSeries: buildSeries,
    starsFor: starsFor,
    summaryLine2: summaryLine2,
    normalize: normalize,
    validatePair: validatePair,
    validateBank: validateBank,
    conflicts: conflicts,
    shuffle: shuffle,
    buildColumns: buildColumns,
    isPair: isPair,
    firstTryCount: firstTryCount
  };

  globalThis.AntonymLogic = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
