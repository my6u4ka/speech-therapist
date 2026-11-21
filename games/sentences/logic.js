// logic.js: pure rules for the sentence purpose game. No DOM access.
// Exposed as globalThis.SentenceLogic, and as module.exports under Node (tests).
(function () {
  "use strict";

  var Kit = globalThis.PlayKit || (typeof require === "function" ? require("../../assets/shared/play.js") : null);

  var MAX_WORDS = 12;
  var MAX_CHARS = 90;
  var MIN_PER_TYPE = 10;

  function normalize(s) {
    return String(s).trim().toLowerCase();
  }

  // Counts words, ignoring punctuation (tokens without a letter or digit).
  function wordCount(s) {
    return String(s).split(/\s+/).filter(function (t) {
      return /[\p{L}\p{N}]/u.test(t);
    }).length;
  }

  function findType(types, id) {
    for (var i = 0; i < types.length; i++) {
      if (types[i].id === id) return types[i];
    }
    return null;
  }

  // Returns null if the entry is valid, or a short English reason.
  function validateEntry(entry, types) {
    if (!entry || typeof entry !== "object") return "entry is not an object";
    if (typeof entry.text !== "string" || entry.text.trim().length === 0) return "text must be non-empty text";
    var text = entry.text.trim();
    if (!/^\p{Lu}/u.test(text)) return "text must start with a capital letter";
    if (wordCount(text) > MAX_WORDS) return "text must have at most " + MAX_WORDS + " words";
    if (text.length > MAX_CHARS) return "text must have at most " + MAX_CHARS + " characters";
    var type = findType(types || [], entry.type);
    if (!type) return "type must be one of the known type ids";
    var mark = text.charAt(text.length - 1);
    if (type.marks.indexOf(mark) === -1) {
      return "text must end with a mark allowed for type '" + type.id + "' (" + type.marks.join(" ") + ")";
    }
    return null;
  }

  // Returns a list of problems (empty if the bank is fine).
  function validateBank(entries, types) {
    var problems = [];
    if (!Array.isArray(entries)) return ["bank is not a list"];
    var seen = {};
    var counts = {};
    (types || []).forEach(function (t) { counts[t.id] = 0; });
    entries.forEach(function (e, i) {
      var label = "entry " + i + (e && e.text ? " (" + e.text + ")" : "");
      var reason = validateEntry(e, types);
      if (reason) {
        problems.push(label + ": " + reason);
        return;
      }
      var key = normalize(e.text);
      if (Object.prototype.hasOwnProperty.call(seen, key)) {
        problems.push(label + ": duplicate text");
      }
      seen[key] = true;
      counts[e.type]++;
    });
    (types || []).forEach(function (t) {
      if (counts[t.id] < MIN_PER_TYPE) {
        problems.push("type '" + t.id + "' has " + counts[t.id] + " entries, at least " + MIN_PER_TYPE + " are needed");
      }
    });
    return problems;
  }

  // Builds a series: groups by type, shuffles each group, takes up to perType from each, then
  // shuffles the result (research R4). Never repeats an entry; shorter if a type is short.
  function buildSeries(entries, perType, rng) {
    if (perType === undefined) perType = 2;
    var groups = {};
    var order = [];
    entries.forEach(function (e) {
      if (!Object.prototype.hasOwnProperty.call(groups, e.type)) {
        groups[e.type] = [];
        order.push(e.type);
      }
      groups[e.type].push(e);
    });
    var picked = [];
    order.forEach(function (id) {
      picked = picked.concat(shuffle(groups[id], rng).slice(0, perType));
    });
    return shuffle(picked, rng);
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
    wordCount: wordCount,
    validateEntry: validateEntry,
    validateBank: validateBank,
    buildSeries: buildSeries,
    shuffle: shuffle,
    starsFor: starsFor,
    summaryLine2: summaryLine2
  };

  globalThis.SentenceLogic = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
