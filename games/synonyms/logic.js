// logic.js: pure rules for the synonym game. No DOM access.
// Exposed as globalThis.SynonymLogic, and as module.exports under Node (tests).
(function () {
  "use strict";

  var MAX_WORD = 20;

  function normalize(w) {
    return String(w).trim().toLowerCase();
  }

  function isText(w) {
    return typeof w === "string" && normalize(w).length > 0 && w.length <= MAX_WORD;
  }

  // Returns null if the set is valid, or a short English reason.
  function validateSet(set) {
    if (!set || typeof set !== "object") return "set is not an object";
    if (!isText(set.word)) return "word must be text of at most " + MAX_WORD + " characters";
    if (!Array.isArray(set.synonyms)) return "synonyms must be a list";
    if (set.synonyms.length < 1 || set.synonyms.length > 4) return "synonyms must have 1-4 words";
    if (!set.synonyms.every(isText)) return "each synonym must be text of at most " + MAX_WORD + " characters";
    if (!Array.isArray(set.distractors)) return "distractors must be a list";
    if (!set.distractors.every(isText)) return "each distractor must be text of at most " + MAX_WORD + " characters";
    var total = set.synonyms.length + set.distractors.length;
    if (total < 8 || total > 12) return "synonyms + distractors must give 8-12 candidates (got " + total + ")";

    var all = [set.word].concat(set.synonyms, set.distractors).map(normalize);
    var seen = {};
    for (var i = 0; i < all.length; i++) {
      if (Object.prototype.hasOwnProperty.call(seen, all[i])) return "duplicate word: " + all[i];
      seen[all[i]] = true;
    }
    return null;
  }

  // Returns a list of problems (empty if the bank is fine).
  function validateBank(sets) {
    var problems = [];
    if (!Array.isArray(sets)) return ["bank is not a list"];
    var words = {};
    sets.forEach(function (set, i) {
      var reason = validateSet(set);
      var label = "set " + i + (set && set.word ? " (" + set.word + ")" : "");
      if (reason) problems.push(label + ": " + reason);
      if (set && typeof set.word === "string") {
        var key = normalize(set.word);
        if (Object.prototype.hasOwnProperty.call(words, key)) {
          problems.push(label + ": reference word is not unique");
        }
        words[key] = true;
      }
    });
    return problems;
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

  // Checks the marked words. statuses maps each candidate word to
  // "correct" | "wrong" | "missed" | "neutral". "missed" only appears on the final check
  // (attempt 2). done is true on attempt 2, or when nothing is wrong and nothing is missing.
  function checkRound(set, marked, attempt) {
    var isMarked = {};
    marked.forEach(function (w) { isMarked[w] = true; });
    var statuses = {};
    var missingCount = 0;
    var found = 0;
    var hasWrong = false;
    set.synonyms.forEach(function (w) {
      if (isMarked[w]) {
        statuses[w] = "correct";
        found++;
      } else {
        missingCount++;
        statuses[w] = attempt === 2 ? "missed" : "neutral";
      }
    });
    set.distractors.forEach(function (w) {
      if (isMarked[w]) {
        statuses[w] = "wrong";
        hasWrong = true;
      } else {
        statuses[w] = "neutral";
      }
    });
    var done = attempt === 2 || (!hasWrong && missingCount === 0);
    return { statuses: statuses, missingCount: missingCount, done: done, found: found };
  }

  // Bulgarian agreement: 1 дума / N думи.
  function instructionText(n) {
    return n === 1
      ? "Намери 1 дума с близко значение"
      : "Намери " + n + " думи с близко значение";
  }

  function missingText(n) {
    return n === 1
      ? "Почти! Остава още 1 дума."
      : "Почти! Остават още " + n + " думи.";
  }

  // Picks up to count distinct sets, in random order (all of them if there are fewer).
  function pickSeries(sets, count, rng) {
    if (count === undefined) count = 5;
    return shuffle(sets, rng).slice(0, count);
  }

  // 1-3 stars by share found; never 0 (positive feedback only).
  function starsFor(found, total) {
    if (!(total > 0)) return 1;
    var share = found / total;
    if (share >= 0.8) return 3;
    if (share >= 0.5) return 2;
    return 1;
  }

  // Which sound to play after a check: "round" when the round ended, "try-again" when a mark
  // is wrong, otherwise "correct". perfect is accepted for future use and ignored.
  function checkSound(result, perfect) {
    if (result.done) return "round";
    var hasWrong = Object.keys(result.statuses).some(function (w) {
      return result.statuses[w] === "wrong";
    });
    return hasWrong ? "try-again" : "correct";
  }

  var api = {
    normalize: normalize,
    validateSet: validateSet,
    validateBank: validateBank,
    shuffle: shuffle,
    checkRound: checkRound,
    instructionText: instructionText,
    missingText: missingText,
    pickSeries: pickSeries,
    starsFor: starsFor,
    checkSound: checkSound
  };

  globalThis.SynonymLogic = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
