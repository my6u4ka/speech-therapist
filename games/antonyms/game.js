// game.js: draws the antonym game and handles taps. Rules live in logic.js, words in words.js.
// All text is set with textContent only.
(function () {
  "use strict";

  var L = globalThis.AntonymLogic;

  var TEXT = {
    right: "Да!",
    retry: "Опитай пак!",
    roundDone: "Браво! Всички двойки са свързани!",
    next: "Напред"
  };
  var PER_ROUND = 5;
  var WRONG_DELAY_MS = 900;

  var els = {
    round: document.getElementById("round"),
    left: document.getElementById("left"),
    right: document.getElementById("right"),
    columns: document.querySelector(".columns"),
    feedback: document.getElementById("feedback"),
    action: document.getElementById("action")
  };

  // Valid pairs only; invalid ones are skipped with a warning (data-model.md).
  var validPairs = (globalThis.ANTONYM_PAIRS || []).filter(function (p) {
    var reason = L.validatePair(p);
    if (reason) console.warn("Skipping invalid antonym pair '" + (p && p.a) + "-" + (p && p.b) + "': " + reason);
    return !reason;
  });

  var round = null;

  // Temporary (US1): one round from conflict-free pairs, taken greedily from a shuffled bank.
  function pickRoundPairs() {
    var picked = [];
    L.shuffle(validPairs).forEach(function (p) {
      if (picked.length >= PER_ROUND) return;
      if (picked.every(function (q) { return !L.conflicts(p, q); })) picked.push(p);
    });
    return picked;
  }

  function setState(item, cls, extra) {
    var btn = item.button;
    btn.className = "word" + (cls ? " " + cls : "") + (extra ? " " + extra : "");
    btn.setAttribute("aria-pressed", cls === "selected" ? "true" : "false");
  }

  function idle(item) {
    setState(item, "", "");
  }

  function select(item) {
    round.selected = item;
    setState(item, "selected");
  }

  function unselect() {
    if (round.selected) idle(round.selected);
    round.selected = null;
  }

  function matchedCount() {
    return round.matched.filter(function (n) { return n; }).length;
  }

  function onTap(item) {
    // Ignore all taps while a wrong pair is shown, and taps on locked words.
    if (round.busy || round.matched[item.pairIndex]) return;

    var sel = round.selected;
    if (!sel) {
      select(item);
      return;
    }
    if (sel === item) {
      unselect();
      return;
    }
    if (sel.side === item.side) {
      idle(sel);
      select(item);
      return;
    }
    evaluate(sel, item);
  }

  function evaluate(x, y) {
    round.selected = null;
    if (L.isPair(x, y)) {
      var n = matchedCount() + 1;
      round.matched[x.pairIndex] = n;
      [x, y].forEach(function (it) {
        setState(it, "matched", "pair-" + n);
        it.button.dataset.n = String(n);
      });
      if (n === round.pairs.length) {
        completeRound();
      } else {
        els.feedback.textContent = TEXT.right;
      }
      return;
    }
    round.busy = true;
    round.triedWrong.add(x.word);
    round.triedWrong.add(y.word);
    setState(x, "wrong");
    setState(y, "wrong");
    els.feedback.textContent = TEXT.retry;
    setTimeout(function () {
      idle(x);
      idle(y);
      round.busy = false;
    }, WRONG_DELAY_MS);
  }

  function completeRound() {
    els.feedback.textContent = TEXT.roundDone;
    els.columns.classList.add("celebrate");
    els.action.textContent = TEXT.next;
    els.action.hidden = false;
    els.action.focus();
  }

  function renderColumn(container, items) {
    container.textContent = "";
    items.forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "word";
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = item.word;
      btn.addEventListener("click", function () { onTap(item); });
      item.button = btn;
      container.appendChild(btn);
    });
  }

  function startRound(pairs) {
    var cols = L.buildColumns(pairs);
    round = {
      pairs: pairs,
      left: cols.left,
      right: cols.right,
      selected: null,
      matched: [],
      triedWrong: new Set(),
      busy: false
    };
    els.feedback.textContent = "";
    els.columns.classList.remove("celebrate");
    els.action.hidden = true;
    renderColumn(els.left, round.left);
    renderColumn(els.right, round.right);
  }

  els.action.addEventListener("click", function () {
    if (matchedCount() === round.pairs.length) startRound(pickRoundPairs());
  });

  if (validPairs.length > 0) startRound(pickRoundPairs());
})();
