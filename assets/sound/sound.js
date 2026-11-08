// sound.js: shared sound effects, synthesized with the Web Audio API (no audio files).
// Classic script. Under Node (tests) it only exports RECIPES and LIMITS.
(function () {
  "use strict";

  // Recipes: soft waves, gentle volume, never falling in pitch (FR-002, FR-003).
  var ARPEGGIO = [
    { freq: 523, start: 0, dur: 0.12 },
    { freq: 659, start: 0.12, dur: 0.12 },
    { freq: 784, start: 0.24, dur: 0.12 },
    { freq: 1047, start: 0.36, dur: 0.35 }
  ];

  var RECIPES = {
    "tap": { wave: "sine", gain: 0.15, notes: [{ freq: 880, start: 0, dur: 0.07 }] },
    "correct": {
      wave: "triangle", gain: 0.30,
      notes: [{ freq: 784, start: 0, dur: 0.12 }, { freq: 1047, start: 0.12, dur: 0.2 }]
    },
    "try-again": {
      wave: "sine", gain: 0.15,
      notes: [{ freq: 392, start: 0, dur: 0.12 }, { freq: 392, start: 0.18, dur: 0.12 }]
    },
    "round": { wave: "triangle", gain: 0.30, notes: ARPEGGIO.slice() },
    "series": {
      wave: "triangle", gain: 0.30,
      notes: ARPEGGIO.concat([
        // Final C-major chord an octave up (C6-E6-G6), so the fanfare never falls (FR-003).
        { freq: 1047, start: 0.75, dur: 0.8 },
        { freq: 1319, start: 0.75, dur: 0.8 },
        { freq: 1568, start: 0.75, dur: 0.8 }
      ])
    }
  };

  // Maximum total length in seconds per sound (FR-002).
  var LIMITS = { "tap": 0.15, "correct": 0.5, "try-again": 0.5, "round": 1.2, "series": 2 };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { RECIPES: RECIPES, LIMITS: LIMITS };
    return;
  }

  // ---- Browser player. State lives in memory only (FR-008, FR-009). ----
  var on = true;
  var ctx = null;
  var playing = []; // { name, osc, gain }

  function unlock() {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      if (ctx && ctx.state === "suspended") {
        var p = ctx.resume();
        if (p && typeof p.catch === "function") p.catch(function () {});
      }
    } catch (e) {
      ctx = null;
    }
  }

  function stopNode(entry) {
    try { entry.osc.stop(); } catch (e) { /* already stopped */ }
    try { entry.osc.disconnect(); } catch (e) { /* ignore */ }
    try { entry.gain.disconnect(); } catch (e) { /* ignore */ }
  }

  function stopAll(onlyName) {
    var keep = [];
    playing.forEach(function (entry) {
      if (!onlyName || entry.name === onlyName) stopNode(entry);
      else keep.push(entry);
    });
    playing = keep;
  }

  function play(name) {
    try {
      if (!on || !ctx || !Object.prototype.hasOwnProperty.call(RECIPES, name)) return;
      if (ctx.state === "suspended") unlock();
      var recipe = RECIPES[name];
      if (name === "tap") stopAll("tap");
      else stopAll();
      var t0 = ctx.currentTime;
      recipe.notes.forEach(function (note) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var begin = t0 + note.start;
        var end = begin + note.dur;
        osc.type = recipe.wave;
        osc.frequency.value = note.freq;
        gain.gain.setValueAtTime(0.0001, begin);
        gain.gain.linearRampToValueAtTime(recipe.gain, begin + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        osc.connect(gain);
        gain.connect(ctx.destination);
        var entry = { name: name, osc: osc, gain: gain };
        playing.push(entry);
        osc.onended = function () {
          var i = playing.indexOf(entry);
          if (i !== -1) playing.splice(i, 1);
          try { osc.disconnect(); gain.disconnect(); } catch (e) { /* ignore */ }
        };
        osc.start(begin);
        osc.stop(end + 0.02);
      });
    } catch (e) {
      // Never throw: a failed sound must not break a game.
    }
  }

  function updateControls() {
    try {
      var buttons = document.querySelectorAll(".sound-control");
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        var img = btn.querySelector("img");
        if (img) {
          var src = img.getAttribute("src") || "";
          var folder = src.slice(0, src.lastIndexOf("/") + 1);
          img.setAttribute("src", folder + (on ? "speaker-on.svg" : "speaker-off.svg"));
        }
      });
    } catch (e) { /* ignore */ }
  }

  function isOn() { return on; }

  function setOn(value) {
    on = !!value;
    if (!on) {
      try { stopAll(); } catch (e) { /* ignore */ }
    }
    updateControls();
  }

  function toggle() { setOn(!on); }

  function wire() {
    try {
      var buttons = document.querySelectorAll(".sound-control");
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.addEventListener("click", toggle);
      });
      updateControls();
    } catch (e) { /* ignore */ }
  }

  try {
    document.addEventListener("pointerdown", unlock, { capture: true, once: true });
    document.addEventListener("keydown", unlock, { capture: true, once: true });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
    else wire();
  } catch (e) { /* unsupported browser stays silent */ }

  globalThis.GameSound = { play: play, isOn: isOn, setOn: setOn, toggle: toggle, RECIPES: RECIPES };
})();
