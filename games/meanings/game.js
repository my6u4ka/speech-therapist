// game.js: draws the word meanings game and handles taps. Rules live in logic.js, words in words.js.
// All text is set with textContent only.
(function () {
  "use strict";

  var L = globalThis.MeaningLogic;

  var TEXT = {
    right: "Браво!",
    retry: "Опитай пак!",
    tag: "не е това",
    next: "Напред",
    summary1: "Браво! Позна значението на всички думи!"
  };
  var SERIES_LENGTH = 8;
  var WRONG_DELAY_MS = 400;

  var els = {
    round: document.getElementById("round"),
    progress: document.getElementById("progress"),
    summary: document.getElementById("summary"),
    line1: document.getElementById("summary-line1"),
    line2: document.getElementById("summary-line2"),
    stars: document.getElementById("summary-stars"),
    again: document.getElementById("again"),
    word: document.getElementById("word"),
    sentence: document.getElementById("sentence"),
    options: document.getElementById("options"),
    feedback: document.getElementById("feedback"),
    action: document.getElementById("action")
  };

  // Valid entries only; invalid ones are skipped with a warning (data-model.md).
  var validEntries = (globalThis.MEANING_ENTRIES || []).filter(function (e) {
    var reason = L.validateEntry(e);
    if (reason) console.warn("Skipping invalid meaning entry '" + (e && e.word) + "': " + reason);
    return !reason;
  });

  // Sound is optional: the game works if sound.js is missing.
  function sfx(name) { if (globalThis.GameSound) globalThis.GameSound.play(name); }

  var question = null;
  // Series state lives in memory only (FR-013).
  var series = null;

  function renderSentence(entry) {
    var parts = L.parseSentence(entry.sentence);
    els.sentence.textContent = "";
    els.sentence.appendChild(document.createTextNode(parts.before));
    var mark = document.createElement("mark");
    mark.textContent = parts.word;
    els.sentence.appendChild(mark);
    els.sentence.appendChild(document.createTextNode(parts.after));
  }

  function onAnswer(opt) {
    // Ignore taps while busy, after the question is answered, and on ruled-out options.
    if (question.busy || question.answered || opt.ruledOut) return;
    if (opt.isRight) {
      answerRight(opt);
    } else {
      answerWrong(opt);
    }
  }

  function answerRight(opt) {
    question.answered = true;
    question.options.forEach(function (o) {
      if (o === opt) {
        o.button.className = "option correct";
      } else if (!o.ruledOut) {
        o.button.className = "option locked";
      }
      o.button.setAttribute("aria-disabled", "true");
    });
    sfx(series.index === series.entries.length - 1 ? "round" : "correct");
    els.feedback.textContent = TEXT.right;
    els.action.textContent = TEXT.next;
    els.action.hidden = false;
    els.action.focus();
  }

  function answerWrong(opt) {
    opt.ruledOut = true;
    question.firstTry = false;
    question.busy = true;
    opt.button.className = "option ruled-out";
    opt.button.disabled = true;
    var tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = TEXT.tag;
    opt.button.appendChild(tag);
    sfx("try-again");
    els.feedback.textContent = TEXT.retry;
    setTimeout(function () { question.busy = false; }, WRONG_DELAY_MS);
  }

  function renderOptions(options) {
    els.options.textContent = "";
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.textContent = opt.text;
      btn.addEventListener("click", function () { onAnswer(opt); });
      opt.button = btn;
      opt.ruledOut = false;
      els.options.appendChild(btn);
    });
  }

  function showQuestion(entry) {
    question = {
      entry: entry,
      options: L.buildOptions(entry),
      firstTry: true,
      answered: false,
      busy: false
    };
    els.word.textContent = entry.word;
    renderSentence(entry);
    renderOptions(question.options);
    els.feedback.textContent = "";
    els.action.hidden = true;
  }

  function showProgress() {
    els.progress.textContent = (series.index + 1) + " / " + series.entries.length;
  }

  function startSeries() {
    series = {
      entries: L.pickSeries(validEntries, SERIES_LENGTH),
      index: 0,
      firstTry: 0,
      total: 0
    };
    if (series.entries.length === 0) return;
    els.summary.hidden = true;
    els.round.hidden = false;
    showProgress();
    showQuestion(series.entries[0]);
  }

  function showSummary() {
    els.round.hidden = true;
    els.summary.hidden = false;
    sfx("series");
    els.line1.textContent = TEXT.summary1;
    els.line2.textContent = L.summaryLine2(series.firstTry, series.total);
    els.stars.textContent = "⭐".repeat(L.starsFor(series.firstTry, series.total));
    els.again.focus();
  }

  function next() {
    if (question.firstTry) series.firstTry++;
    series.total++;
    series.index++;
    if (series.index >= series.entries.length) {
      showSummary();
      return;
    }
    showProgress();
    showQuestion(series.entries[series.index]);
  }

  els.again.addEventListener("click", startSeries);

  els.action.addEventListener("click", function () {
    if (question && question.answered) next();
  });

  if (validEntries.length > 0) startSeries();
})();
