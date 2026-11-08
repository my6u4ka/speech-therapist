// game.js: draws the antonym game and handles taps. Rules live in logic.js, words in words.js.
// All text is set with textContent only.
(function () {
  "use strict";

  var L = globalThis.AntonymLogic;

  var TEXT = {
    right: "Да!",
    retry: "Опитай пак!",
    roundDone: "Браво! Всички двойки са свързани!",
    next: "Напред",
    summary1: "Браво! Свърза всички двойки!"
  };
  var SERIES_ROUNDS = 5;
  var PER_ROUND = 5;
  var WRONG_DELAY_MS = 900;

  var els = {
    round: document.getElementById("round"),
    progress: document.getElementById("progress"),
    summary: document.getElementById("summary"),
    line1: document.getElementById("summary-line1"),
    line2: document.getElementById("summary-line2"),
    stars: document.getElementById("summary-stars"),
    again: document.getElementById("again"),
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
  // Series state lives in memory only (FR-015).
  var series = null;

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

  function showProgress() {
    els.progress.textContent = (series.index + 1) + " / " + series.rounds.length;
  }

  function startSeries() {
    series = {
      rounds: L.buildSeries(validPairs, SERIES_ROUNDS, PER_ROUND),
      index: 0,
      firstTry: 0,
      total: 0
    };
    if (series.rounds.length === 0) return;
    els.summary.hidden = true;
    els.round.hidden = false;
    showProgress();
    startRound(series.rounds[0]);
  }

  function showSummary() {
    els.round.hidden = true;
    els.summary.hidden = false;
    els.line1.textContent = TEXT.summary1;
    els.line2.textContent = L.summaryLine2(series.firstTry, series.total);
    els.stars.textContent = "⭐".repeat(L.starsFor(series.firstTry, series.total));
    els.again.focus();
  }

  function next() {
    series.firstTry += L.firstTryCount(round.pairs, round.triedWrong);
    series.total += round.pairs.length;
    series.index++;
    if (series.index >= series.rounds.length) {
      showSummary();
      return;
    }
    showProgress();
    startRound(series.rounds[series.index]);
  }

  els.again.addEventListener("click", startSeries);

  els.action.addEventListener("click", function () {
    if (matchedCount() === round.pairs.length) next();
  });

  if (validPairs.length > 0) startSeries();
})();
