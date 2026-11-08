// logic.js: pure rules for the word meanings game. No DOM access.
// Exposed as globalThis.MeaningLogic, and as module.exports under Node (tests).
(function () {
  "use strict";

  var MAX_WORD = 20;
  var MAX_SENTENCE_WORDS = 12;
  var MAX_SENTENCE_CHARS = 90;
  var MAX_EXPL_WORDS = 8;
  var MAX_EXPL_CHARS = 60;
  var MIN_BANK = 32;
  var MIN_DISTINCT_WORDS = 8;

  function normalize(s) {
    return String(s).trim().toLowerCase();
  }

  function isNonEmptyText(s) {
    return typeof s === "string" && s.trim().length > 0;
  }

  // Splits a sentence with exactly one non-empty [...] part into { before, word, after }.
  // Returns null for zero parts, several parts, or an empty part.
  function parseSentence(s) {
    if (typeof s !== "string") return null;
    var opens = s.split("[").length - 1;
    var closes = s.split("]").length - 1;
    if (opens !== 1 || closes !== 1) return null;
    var a = s.indexOf("[");
    var b = s.indexOf("]");
    if (b < a) return null;
    var word = s.slice(a + 1, b);
    if (word.trim().length === 0) return null;
    return { before: s.slice(0, a), word: word, after: s.slice(b + 1) };
  }

  // Counts words, ignoring brackets and punctuation (tokens without a letter or digit).
  function wordCount(s) {
    return String(s).replace(/[\[\]]/g, "").split(/\s+/).filter(function (t) {
      return /[\p{L}\p{N}]/u.test(t);
    }).length;
  }

  function withoutBrackets(s) {
    return s.replace(/[\[\]]/g, "");
  }

  function explanationProblem(text, label) {
    if (!isNonEmptyText(text)) return label + " must be text";
    if (wordCount(text) > MAX_EXPL_WORDS) return label + " must have at most " + MAX_EXPL_WORDS + " words";
    if (text.length > MAX_EXPL_CHARS) return label + " must have at most " + MAX_EXPL_CHARS + " characters";
    return null;
  }

  // Returns null if the entry is valid, or a short English reason.
  function validateEntry(e) {
    if (!e || typeof e !== "object") return "entry is not an object";
    if (!isNonEmptyText(e.word) || e.word.length > MAX_WORD) {
      return "word must be text of at most " + MAX_WORD + " characters";
    }
    if (!isNonEmptyText(e.sentence)) return "sentence must be text";
    if (!parseSentence(e.sentence)) return "sentence must have exactly one [...] part";
    if (wordCount(e.sentence) > MAX_SENTENCE_WORDS) {
      return "sentence must have at most " + MAX_SENTENCE_WORDS + " words";
    }
    if (withoutBrackets(e.sentence).length > MAX_SENTENCE_CHARS) {
      return "sentence must have at most " + MAX_SENTENCE_CHARS + " characters";
    }
    if (!/[.!?]$/.test(e.sentence.trim())) return "sentence must end with '.', '!' or '?'";
    var reason = explanationProblem(e.right, "right");
    if (reason) return reason;
    if (!Array.isArray(e.wrong) || e.wrong.length !== 2) return "wrong must be a list of exactly 2";
    for (var i = 0; i < 2; i++) {
      reason = explanationProblem(e.wrong[i], "wrong[" + i + "]");
      if (reason) return reason;
    }
    var all = [normalize(e.right), normalize(e.wrong[0]), normalize(e.wrong[1])];
    if (all[0] === all[1] || all[0] === all[2] || all[1] === all[2]) {
      return "right and wrong explanations must be distinct";
    }
    return null;
  }

  // Returns a list of problems (empty if the bank is fine).
  function validateBank(entries) {
    var problems = [];
    if (!Array.isArray(entries)) return ["bank is not a list"];
    var seen = {};
    var words = {};
    entries.forEach(function (e, i) {
      var label = "entry " + i + (e && e.word ? " (" + e.word + ")" : "");
      var reason = validateEntry(e);
      if (reason) {
        problems.push(label + ": " + reason);
        return;
      }
      var key = normalize(e.word) + "|" + normalize(e.right);
      if (Object.prototype.hasOwnProperty.call(seen, key)) {
        problems.push(label + ": duplicate word and right explanation");
      }
      seen[key] = true;
      words[normalize(e.word)] = true;
    });
    if (entries.length < MIN_BANK) {
      problems.push("bank has " + entries.length + " entries, at least " + MIN_BANK + " are needed");
    }
    if (Object.keys(words).length < MIN_DISTINCT_WORDS) {
      problems.push("bank has " + Object.keys(words).length + " distinct words, at least " +
        MIN_DISTINCT_WORDS + " are needed");
    }
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

  // The 3 explanations of an entry in random order: [{ text, isRight }].
  function buildOptions(entry, rng) {
    var items = [
      { text: entry.right, isRight: true },
      { text: entry.wrong[0], isRight: false },
      { text: entry.wrong[1], isRight: false }
    ];
    return shuffle(items, rng);
  }

  // Picks up to `count` entries from a shuffled bank, taking an entry only if its word is not
  // used yet (research R4). Shorter than `count` if the bank has fewer distinct words.
  function pickSeries(entries, count, rng) {
    var used = {};
    var series = [];
    var pool = shuffle(entries, rng);
    for (var i = 0; i < pool.length && series.length < count; i++) {
      var key = normalize(pool[i].word);
      if (Object.prototype.hasOwnProperty.call(used, key)) continue;
      used[key] = true;
      series.push(pool[i]);
    }
    return series;
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
    normalize: normalize,
    parseSentence: parseSentence,
    wordCount: wordCount,
    validateEntry: validateEntry,
    validateBank: validateBank,
    shuffle: shuffle,
    buildOptions: buildOptions,
    pickSeries: pickSeries,
    starsFor: starsFor,
    summaryLine2: summaryLine2
  };

  globalThis.MeaningLogic = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
