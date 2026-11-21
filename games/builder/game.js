// game.js: draws the sentence builder game, handles drag, tap and keyboard moves, and checks the
// board. Rules live in logic.js, content in words.js. All text is set with textContent only.
(function () {
  "use strict";

  var L = globalThis.BuilderLogic;

  var TEXT = {
    check: "Провери",
    next: "Напред",
    right: "Браво!",
    wrong: "Почти! Премести думите с „опитай пак“.",
    tag: "опитай пак",
    summary1: "Браво! Подреди всички изречения!"
  };
  var SERIES_LENGTH = 6;
  var DRAG_THRESHOLD = 8; // px of movement before a press becomes a drag (research R1)

  var els = {
    round: document.getElementById("round"),
    progress: document.getElementById("progress"),
    slots: document.getElementById("slots"),
    pool: document.getElementById("pool"),
    full: document.getElementById("full"),
    feedback: document.getElementById("feedback"),
    action: document.getElementById("action"),
    summary: document.getElementById("summary"),
    line1: document.getElementById("summary-line1"),
    line2: document.getElementById("summary-line2"),
    stars: document.getElementById("summary-stars"),
    again: document.getElementById("again")
  };

  // Valid entries only; invalid ones are skipped with a warning (data-model.md).
  var validEntries = (globalThis.BUILDER_SENTENCES || []).filter(function (e) {
    var reason = L.validateEntry(e);
    if (reason) console.warn("Skipping invalid sentence entry '" + (e && e.text) + "': " + reason);
    return !reason;
  });

  // Sound is optional: the game works if sound.js is missing.
  function sfx(name) { if (globalThis.GameSound) globalThis.GameSound.play(name); }

  // Board state lives in memory only (data-model.md).
  // cards: { id, word, label, locked, retry }; slots[i] is a card id or null; pool is a list of ids.
  var board = null;
  // Series state lives in memory only: { entries, index, firstTry, total }.
  var series = null;

  function cardById(id) {
    return board.cards[id];
  }

  // Where a card is: "pool" or its slot index.
  function placeOf(card) {
    var i = board.slots.indexOf(card.id);
    return i === -1 ? "pool" : i;
  }

  function firstEmptySlot() {
    return board.slots.indexOf(null);
  }

  function removeFromPool(id) {
    var i = board.pool.indexOf(id);
    if (i !== -1) board.pool.splice(i, 1);
  }

  // Marks a successful move: clears retry on the moved cards, plays the sound, redraws.
  function moved(cards) {
    cards.forEach(function (c) { c.retry = false; });
    sfx("tap");
    render(cards[0].id);
  }

  function slotLocked(i) {
    var id = board.slots[i];
    return id !== null && cardById(id).locked;
  }

  // Puts a card in slot i (research R3). A card already there goes back to the pool, or swaps
  // with the dragged card when that comes from another slot. Returns true if the card moved.
  function placeInSlot(card, i) {
    if (card.locked || slotLocked(i)) return false;
    var from = placeOf(card);
    if (from === i) return false;
    var other = board.slots[i] === null ? null : cardById(board.slots[i]);
    var touched = [card];
    if (from === "pool") {
      removeFromPool(card.id);
      if (other) {
        board.pool.push(other.id);
        touched.push(other);
      }
    } else {
      board.slots[from] = null;
      if (other) {
        board.slots[from] = other.id;
        touched.push(other);
      }
    }
    board.slots[i] = card.id;
    moved(touched);
    return true;
  }

  // Sends a card from a slot back to the end of the pool.
  function returnToPool(card) {
    if (card.locked) return false;
    var from = placeOf(card);
    if (from === "pool") return false;
    board.slots[from] = null;
    board.pool.push(card.id);
    moved([card]);
    return true;
  }

  function filled() {
    return board.slots.every(function (id) { return id !== null; });
  }

  function updateAction() {
    if (board.solved) {
      els.action.textContent = TEXT.next;
      els.action.disabled = false;
    } else {
      els.action.textContent = TEXT.check;
      els.action.disabled = !filled();
    }
  }

  function makeCard(card) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card" + (card.locked ? " locked" : "") + (card.retry ? " retry" : "");
    btn.dataset.id = String(card.id);
    btn.textContent = card.label;
    var place = placeOf(card);
    btn.setAttribute("aria-label", card.label + ", " + (place === "pool" ? "в купчината" : "място " + (place + 1)));
    if (card.retry) {
      var tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = TEXT.tag;
      btn.appendChild(tag);
    }
    return btn;
  }

  // Redraws slots and pool from the state. focusId keeps keyboard focus on the moved card.
  function render(focusId) {
    els.slots.textContent = "";
    els.pool.textContent = "";
    board.slots.forEach(function (id, i) {
      var slot = document.createElement("div");
      slot.className = "slot" + (id !== null ? " filled" : "");
      slot.dataset.index = String(i);
      if (id !== null) slot.appendChild(makeCard(cardById(id)));
      els.slots.appendChild(slot);
    });
    board.pool.forEach(function (id) {
      els.pool.appendChild(makeCard(cardById(id)));
    });
    updateAction();
    if (focusId !== undefined) {
      var btn = els.round.querySelector('.card[data-id="' + focusId + '"]');
      if (btn) btn.focus();
    }
  }

  function startRound(entry) {
    var target = L.tokenize(entry.text);
    var order = L.scramble(target);
    // Card ids follow the scrambled order; the pool starts in that order too.
    var cards = order.map(function (word, i) {
      return { id: i, word: word, label: "", locked: false, retry: false };
    });
    // The label of the first target word is lowercased unless it is a name; that rule depends on
    // the word's place in the sentence, not on the card's place in the pool.
    var usedFirst = false;
    cards.forEach(function (c) {
      var index = (!usedFirst && c.word === target[0]) ? 0 : 1;
      if (index === 0) usedFirst = true;
      c.label = L.displayWord(c.word, index, entry);
    });
    board = {
      entry: entry,
      target: target,
      cards: cards,
      slots: target.map(function () { return null; }),
      pool: cards.map(function (c) { return c.id; }),
      firstTry: true,
      solved: false
    };
    els.full.hidden = true;
    els.full.textContent = "";
    els.feedback.textContent = "";
    render();
  }

  // ---- Tap, click, Enter and Space (cards are buttons; research R2) ----

  var suppressClick = false; // set after a drag so the click that follows is ignored

  els.round.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".card") : null;
    if (!btn || !board) return;
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    var card = cardById(Number(btn.dataset.id));
    if (card.locked) return;
    if (placeOf(card) === "pool") {
      var i = firstEmptySlot();
      if (i !== -1) placeInSlot(card, i);
    } else {
      returnToPool(card);
    }
  });

  // ---- Drag with Pointer Events (research R1, R3) ----

  var press = null; // { card, el, pointerId, startX, startY, dragging, target }

  // Finds the drop target under a point: { slot: index } or { pool: true } or null.
  // The dragged card has pointer-events: none, so it is never the element found.
  function targetAt(x, y) {
    var el = document.elementFromPoint(x, y);
    if (!el || !el.closest) return null;
    var slot = el.closest(".slot");
    if (slot) return { slot: Number(slot.dataset.index), el: slot };
    var pool = el.closest("#pool");
    if (pool) return { pool: true, el: pool };
    return null;
  }

  function clearOver() {
    var list = els.round.querySelectorAll(".over");
    for (var i = 0; i < list.length; i++) list[i].classList.remove("over");
  }

  function showOver(target) {
    clearOver();
    if (!target) return;
    if (target.slot !== undefined && slotLocked(target.slot)) return;
    target.el.classList.add("over");
  }

  function endPress() {
    if (press) {
      try { press.el.releasePointerCapture(press.pointerId); } catch (err) { /* already released */ }
    }
    press = null;
  }

  // Removes the drag look and inline position from the card.
  function resetCardStyle(el) {
    el.classList.remove("dragging");
    el.style.left = "";
    el.style.top = "";
    el.style.width = "";
    el.style.height = "";
    el.style.transform = "";
  }

  els.round.addEventListener("pointerdown", function (e) {
    if (!board || press) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    var el = e.target.closest ? e.target.closest(".card") : null;
    if (!el) return;
    var card = cardById(Number(el.dataset.id));
    if (card.locked) return;
    press = { card: card, el: el, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, dragging: false, target: null };
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
  });

  els.round.addEventListener("pointermove", function (e) {
    if (!press || e.pointerId !== press.pointerId) return;
    var dx = e.clientX - press.startX;
    var dy = e.clientY - press.startY;
    if (!press.dragging) {
      if (Math.hypot(dx, dy) <= DRAG_THRESHOLD) return;
      press.dragging = true;
      // Fix the card where it is, then move it with transform only.
      var rect = press.el.getBoundingClientRect();
      press.el.style.left = rect.left + "px";
      press.el.style.top = rect.top + "px";
      press.el.style.width = rect.width + "px";
      press.el.style.height = rect.height + "px";
      press.el.classList.add("dragging");
    }
    press.el.style.transform = "translate(" + dx + "px, " + dy + "px) scale(1.05)";
    press.target = targetAt(e.clientX, e.clientY);
    showOver(press.target);
  });

  els.round.addEventListener("pointerup", function (e) {
    if (!press || e.pointerId !== press.pointerId) return;
    var p = press;
    if (!p.dragging) {
      endPress(); // a short gesture is a tap: the click handler does the move
      return;
    }
    var target = targetAt(e.clientX, e.clientY);
    clearOver();
    resetCardStyle(p.el);
    endPress();
    // The click that follows a drag must not count as a tap.
    suppressClick = true;
    setTimeout(function () { suppressClick = false; }, 0);
    var done = false;
    if (target && target.slot !== undefined) done = placeInSlot(p.card, target.slot);
    else if (target && target.pool) done = returnToPool(p.card);
    if (!done) render(p.card.id); // rejected or unchanged: the card returns
  });

  els.round.addEventListener("pointercancel", function (e) {
    if (!press || e.pointerId !== press.pointerId) return;
    var p = press;
    var wasDragging = p.dragging;
    clearOver();
    resetCardStyle(p.el);
    endPress();
    if (wasDragging) {
      suppressClick = true;
      setTimeout(function () { suppressClick = false; }, 0);
      render(p.card.id);
    }
  });

  // ---- Check ----

  function check() {
    var words = board.slots.map(function (id) { return cardById(id).word; });
    var res = L.checkBoard(board.target, words);
    board.slots.forEach(function (id, i) {
      var c = cardById(id);
      if (res.right[i]) {
        c.locked = true;
        c.retry = false;
      } else {
        c.retry = true;
      }
    });
    if (res.allRight) {
      board.solved = true;
      els.full.textContent = board.entry.text;
      els.full.hidden = false;
      els.feedback.textContent = TEXT.right;
      sfx(series.index === series.entries.length - 1 ? "round" : "correct");
    } else {
      board.firstTry = false;
      els.feedback.textContent = TEXT.wrong;
      sfx("try-again");
    }
    render();
    if (board.solved) els.action.focus();
  }

  function showProgress() {
    els.progress.textContent = (series.index + 1) + " / " + series.entries.length;
  }

  function startSeries() {
    series = { entries: L.pickSeries(validEntries, SERIES_LENGTH), index: 0, firstTry: 0, total: 0 };
    if (series.entries.length === 0) return;
    els.summary.hidden = true;
    els.round.hidden = false;
    showProgress();
    startRound(series.entries[0]);
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

  function nextRound() {
    if (board.firstTry) series.firstTry++;
    series.total++;
    series.index++;
    if (series.index >= series.entries.length) {
      showSummary();
      return;
    }
    showProgress();
    startRound(series.entries[series.index]);
  }

  els.again.addEventListener("click", startSeries);

  els.action.addEventListener("click", function () {
    if (!board || els.action.disabled) return;
    if (board.solved) nextRound();
    else check();
  });

  if (validEntries.length > 0) startSeries();
})();
