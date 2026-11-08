"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");

const { RECIPES, LIMITS } = require("../assets/sound/sound.js");

function length(recipe) {
  return Math.max(...recipe.notes.map((n) => n.start + n.dur));
}

test("recipe names are exactly the five sounds", () => {
  assert.deepEqual(Object.keys(RECIPES).sort(), ["correct", "round", "series", "tap", "try-again"]);
});

test("every recipe is soft: sine or triangle, gain in (0, 0.3], freq 200-2000", () => {
  for (const [name, r] of Object.entries(RECIPES)) {
    assert.ok(r.wave === "sine" || r.wave === "triangle", name + " wave");
    assert.ok(r.gain > 0 && r.gain <= 0.3, name + " gain");
    assert.ok(r.notes.length > 0, name + " has notes");
    for (const n of r.notes) {
      assert.ok(n.freq >= 200 && n.freq <= 2000, name + " freq " + n.freq);
      assert.ok(n.start >= 0 && n.dur > 0, name + " timing");
    }
  }
});

test("each recipe is shorter than its limit", () => {
  for (const [name, r] of Object.entries(RECIPES)) {
    assert.ok(name in LIMITS, name + " has a limit");
    assert.ok(length(r) < LIMITS[name], name + " length " + length(r));
  }
});

test("try-again is quieter than correct", () => {
  assert.ok(RECIPES["try-again"].gain < RECIPES["correct"].gain);
});

test("never falling: no melody note is lower than the one before it", () => {
  for (const [name, r] of Object.entries(RECIPES)) {
    const notes = r.notes.slice().sort((a, b) => a.start - b.start);
    for (let i = 0; i < notes.length; i++) {
      let prev = null;
      for (let j = 0; j < i; j++) {
        if (notes[j].start < notes[i].start && (!prev || notes[j].start > prev.start)) prev = notes[j];
      }
      if (!prev) continue;
      // Notes of one chord (same start) are exempt only among themselves: every note,
      // including each chord note, must be at least as high as the last earlier note.
      assert.ok(notes[i].freq >= prev.freq, name + " falls at " + notes[i].start);
    }
  }
});
