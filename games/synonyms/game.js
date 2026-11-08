// game.js: draws the synonym game and handles taps. Rules live in logic.js, words in words.js.
// All text is set with textContent only.
(function () {
  "use strict";

  var L = globalThis.SynonymLogic;

  var TEXT = {
    check: "Провери",
    next: "Напред",
    retry: "Опитай пак!",
    perfect: "Браво! Намери всички!",
    revealed: "Ето всички думи с близко значение.",
    missedTag: "и тази",
    again: "Играй пак"
  };
  var SERIES_LENGTH = 5;
  var WRONG_DELAY_MS = 1000;

  var els = {
    round: document.getElementById("round"),
    progress: document.getElementById("progress"),
    summary: document.getElementById("summary"),
    summaryText: document.getElementById("summary-text"),
    summaryStars: document.getElementById("summary-stars"),
    again: document.getElementById("again"),
    reference: document.getElementById("reference"),
    instruction: document.getElementById("instruction"),
    candidates: document.getElementById("candidates"),
    feedback: document.getElementById("feedback"),
    action: document.getElementById("action")
  };

  // Valid sets only; invalid ones are skipped with a warning (data-model.md).
  var validSets = (globalThis.SYNONYM_SETS || []).filter(function (set) {
    var reason = L.validateSet(set);
    if (reason) console.warn("Skipping invalid word set '" + (set && set.word) + "': " + reason);
    return !reason;
  });

  // Sound is optional: the game works if sound.js is missing.
  function sfx(name) { if (globalThis.GameSound) globalThis.GameSound.play(name); }

  var round = null;
  // Series state lives in memory only (FR-015).
  var series = null;

  function setLabel(btn, word, tag) {
    btn.textContent = word;
    if (tag) {
      var span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      btn.appendChild(span);
    }
  }

  function newlyMarkedCount() {
    var n = 0;
    round.marked.forEach(function (w) { if (!round.locked.has(w)) n++; });
    return n;
  }

  function updateAction() {
    if (round.state === "done") {
      els.action.textContent = TEXT.next;
      els.action.disabled = false;
    } else {
      els.action.textContent = TEXT.check;
      // Needs at least one newly marked word (FR-004); also off while wrong marks are shown.
      els.action.disabled = round.state !== "selecting" || newlyMarkedCount() === 0;
    }
  }

  function setBtnState(word, cls) {
    var btn = round.buttons[word];
    btn.className = "candidate" + (cls ? " " + cls : "");
    btn.setAttribute("aria-pressed", cls === "marked" || cls === "correct" ? "true" : "false");
    if (cls === "correct" || cls === "missed") btn.classList.add("locked");
    setLabel(btn, word, cls === "missed" ? TEXT.missedTag : null);
  }

  function toggle(word) {
    if (round.state !== "selecting" || round.locked.has(word)) return;
    if (round.marked.has(word)) {
      round.marked.delete(word);
      setBtnState(word, "");
    } else {
      round.marked.add(word);
      setBtnState(word, "marked");
    }
    sfx("tap");
    updateAction();
  }

  function startRound(set) {
    var words = L.shuffle(set.synonyms.concat(set.distractors));
    round = {
      set: set,
      marked: new Set(),
      locked: new Set(),
      attempt: 1,
      state: "selecting",
      found: 0,
      buttons: {}
    };
    els.reference.textContent = set.word;
    els.reference.classList.remove("celebrate");
    els.instruction.textContent = L.instructionText(set.synonyms.length);
    els.feedback.textContent = "";
    els.candidates.textContent = "";
    words.forEach(function (word) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "candidate";
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = word;
      btn.addEventListener("click", function () { toggle(word); });
      round.buttons[word] = btn;
      els.candidates.appendChild(btn);
    });
    updateAction();
  }

  function applyStatuses(statuses) {
    Object.keys(statuses).forEach(function (word) {
      var s = statuses[word];
      if (s === "correct") {
        round.locked.add(word);
        setBtnState(word, "correct");
      } else if (s === "wrong") {
        setBtnState(word, "wrong");
      } else if (s === "missed") {
        setBtnState(word, "missed");
      }
    });
  }

  function finishRound(res) {
    round.state = "done";
    round.found = res.found;
    updateAction();
  }

  function check() {
    if (round.state !== "selecting" || els.action.disabled) return;
    var res = L.checkRound(round.set, Array.from(round.marked), round.attempt);
    applyStatuses(res.statuses);
    // Exactly one sound per check (FR-004); the delayed round end below plays none.
    sfx(L.checkSound(res, res.done && res.missingCount === 0));

    if (res.done) {
      var perfect = res.missingCount === 0 && res.found === round.set.synonyms.length &&
        !Object.keys(res.statuses).some(function (w) { return res.statuses[w] === "wrong"; });
      els.feedback.textContent = perfect ? TEXT.perfect : TEXT.revealed;
      if (perfect) {
        els.reference.classList.add("celebrate");
        // Decorative star (R9). startRound resets the heading's text, which removes it.
        var star = document.createElement("span");
        star.className = "star";
        star.setAttribute("aria-hidden", "true");
        star.textContent = "⭐";
        els.reference.appendChild(star);
      }
      finishRound(res);
      return;
    }

    // First check with mistakes: show wrong marks briefly, then clear them.
    round.state = "feedback";
    els.feedback.textContent = TEXT.retry;
    updateAction();
    setTimeout(function () {
      Object.keys(res.statuses).forEach(function (word) {
        if (res.statuses[word] === "wrong") {
          round.marked.delete(word);
          setBtnState(word, "");
        }
      });
      if (res.missingCount === 0) {
        // All synonyms already found; only wrong marks were cleared. Nothing is left to
        // find, so a second try would force another wrong mark: end the round here. Not
        // celebrated as perfect, so marking every word is not rewarded.
        els.feedback.textContent = TEXT.revealed;
        finishRound(res);
        return;
      }
      els.feedback.textContent = L.missingText(res.missingCount);
      round.attempt = 2;
      round.state = "selecting";
      updateAction();
    }, WRONG_DELAY_MS);
  }

  function showProgress() {
    els.progress.textContent = (series.index + 1) + " / " + series.rounds.length;
  }

  function startSeries() {
    series = { rounds: L.pickSeries(validSets, SERIES_LENGTH), index: 0, found: 0, total: 0 };
    els.summary.hidden = true;
    els.round.hidden = false;
    showProgress();
    startRound(series.rounds[0]);
  }

  function showSummary() {
    els.round.hidden = true;
    els.summary.hidden = false;
    sfx("series");
    els.summaryText.textContent = "Браво! Намери " + series.found + " от " + series.total + " думи.";
    els.summaryStars.textContent = "⭐".repeat(L.starsFor(series.found, series.total));
    els.again.textContent = TEXT.again;
    els.again.focus();
  }

  function next() {
    series.found += round.found;
    series.total += round.set.synonyms.length;
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
    if (round.state === "done") next();
    else check();
  });

  if (validSets.length > 0) startSeries();
})();
