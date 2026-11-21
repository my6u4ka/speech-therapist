// game.js: draws the sentence purpose game and handles taps. Rules live in logic.js, content in words.js.
// All text is set with textContent only.
(function () {
  "use strict";

  var L = globalThis.SentenceLogic;
  var TYPES = globalThis.SENTENCE_TYPES || [];

  var TEXT = {
    right: "Браво! ",
    retry: "Опитай пак!",
    tag: "не е това",
    next: "Напред"
  };
  var WRONG_DELAY_MS = 400;

  var els = {
    sentence: document.getElementById("sentence"),
    types: document.getElementById("types"),
    feedback: document.getElementById("feedback"),
    action: document.getElementById("action")
  };

  // Valid entries only; invalid ones are skipped with a warning (data-model.md).
  var validEntries = (globalThis.SENTENCE_ENTRIES || []).filter(function (e) {
    var reason = L.validateEntry(e, TYPES);
    if (reason) console.warn("Skipping invalid sentence entry '" + (e && e.text) + "': " + reason);
    return !reason;
  });

  // Sound is optional: the game works if sound.js is missing.
  function sfx(name) { if (globalThis.GameSound) globalThis.GameSound.play(name); }

  var question = null;

  function onAnswer(opt) {
    // Ignore taps while busy, after the question is answered, and on ruled-out types.
    if (question.busy || question.answered || opt.ruledOut) return;
    if (opt.type.id === question.entry.type) {
      answerRight(opt);
    } else {
      answerWrong(opt);
    }
  }

  function answerRight(opt) {
    question.answered = true;
    question.options.forEach(function (o) {
      if (o === opt) {
        o.button.className = "type correct";
      } else if (!o.ruledOut) {
        o.button.className = "type locked";
      }
      o.button.setAttribute("aria-disabled", "true");
    });
    sfx("correct");
    els.feedback.textContent = TEXT.right + opt.type.reason;
    els.action.textContent = TEXT.next;
    els.action.hidden = false;
    els.action.focus();
  }

  function answerWrong(opt) {
    opt.ruledOut = true;
    question.firstTry = false;
    question.busy = true;
    opt.button.className = "type ruled-out";
    opt.button.disabled = true;
    var tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = TEXT.tag;
    opt.button.appendChild(tag);
    sfx("try-again");
    els.feedback.textContent = TEXT.retry;
    setTimeout(function () { question.busy = false; }, WRONG_DELAY_MS);
  }

  function renderTypes(options) {
    els.types.textContent = "";
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "type";
      btn.textContent = opt.type.label;
      btn.addEventListener("click", function () { onAnswer(opt); });
      opt.button = btn;
      els.types.appendChild(btn);
    });
  }

  function showQuestion(entry) {
    question = {
      entry: entry,
      // Fixed order: same as SENTENCE_TYPES.
      options: TYPES.map(function (t) { return { type: t, ruledOut: false, button: null }; }),
      firstTry: true,
      answered: false,
      busy: false
    };
    els.sentence.textContent = entry.text;
    renderTypes(question.options);
    els.feedback.textContent = "";
    els.action.hidden = true;
  }

  function randomQuestion() {
    showQuestion(validEntries[Math.floor(Math.random() * validEntries.length)]);
  }

  els.action.addEventListener("click", function () {
    if (question && question.answered) randomQuestion();
  });

  if (validEntries.length > 0) randomQuestion();
})();
