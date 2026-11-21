// logic.js: pure rules for the sentence builder game. No DOM access.
// Exposed as globalThis.BuilderLogic, and as module.exports under Node (tests).
(function () {
  "use strict";

  var Kit = globalThis.PlayKit || (typeof require === "function" ? require("../../assets/shared/play.js") : null);

  var MIN_WORDS = 4;
  var MAX_WORDS = 8;
  var MAX_WORD_LETTERS = 14;
  var MIN_BANK = 30;

  function normalize(s) {
    return String(s).trim().toLowerCase();
  }

  // Splits on single spaces and strips the end mark; returns the words in order.
  function tokenize(text) {
    return String(text).replace(/[.?!]+$/, "").split(" ").filter(function (w) {
      return w.length > 0;
    });
  }

  // Card label: the first word is lowercased unless it is a name; others stay as written.
  function displayWord(word, index, entry) {
    if (index !== 0 || (entry && entry.firstIsName === true)) return word;
    return word.charAt(0).toLowerCase() + word.slice(1);
  }

  // Returns null if the entry is valid, or a short English reason.
  function validateEntry(entry) {
    if (!entry || typeof entry !== "object") return "entry is not an object";
    if (typeof entry.text !== "string" || entry.text.length === 0) return "text must be non-empty text";
    var text = entry.text;
    if (!/^\p{Lu}/u.test(text)) return "text must start with a capital letter";
    if (!/[.?!]$/.test(text)) return "text must end with a period, question mark or exclamation mark";
    var body = text.slice(0, -1);
    if (/[^\p{L}\p{N} ]/u.test(body)) return "text must have no punctuation except the end mark";
    if (/^ | $|  /.test(body)) return "words must be separated by single spaces";
    var words = tokenize(text);
    if (words.length < MIN_WORDS || words.length > MAX_WORDS) {
      return "text must have " + MIN_WORDS + "-" + MAX_WORDS + " words";
    }
    for (var i = 0; i < words.length; i++) {
      if (words[i].length > MAX_WORD_LETTERS) return "word '" + words[i] + "' has more than " + MAX_WORD_LETTERS + " letters";
    }
    if (entry.firstIsName !== undefined && typeof entry.firstIsName !== "boolean") {
      return "firstIsName must be true or false";
    }
    return null;
  }

  // Returns a list of problems (empty if the bank is fine).
  function validateBank(entries) {
    var problems = [];
    if (!Array.isArray(entries)) return ["bank is not a list"];
    var seen = {};
    entries.forEach(function (e, i) {
      var label = "entry " + i + (e && e.text ? " (" + e.text + ")" : "");
      var reason = validateEntry(e);
      if (reason) {
        problems.push(label + ": " + reason);
        return;
      }
      var key = normalize(e.text);
      if (Object.prototype.hasOwnProperty.call(seen, key)) problems.push(label + ": duplicate text");
      seen[key] = true;
    });
    if (entries.length < MIN_BANK) {
      problems.push("bank has " + entries.length + " entries, at least " + MIN_BANK + " are needed");
    }
    return problems;
  }

  // Fisher-Yates shuffle; returns a new array (shared kit).
  function shuffle(list, rng) {
    return Kit.shuffle(list, rng);
  }

  // 1-3 stars by share found; never 0 (positive feedback only).
  function starsFor(found, total) {
    return Kit.starsFor(found, total);
  }

  function summaryLine2(firstTry, total) {
    return Kit.firstTryLine(firstTry, total);
  }

  var api = {
    normalize: normalize,
    tokenize: tokenize,
    displayWord: displayWord,
    validateEntry: validateEntry,
    validateBank: validateBank,
    shuffle: shuffle,
    starsFor: starsFor,
    summaryLine2: summaryLine2
  };

  globalThis.BuilderLogic = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
