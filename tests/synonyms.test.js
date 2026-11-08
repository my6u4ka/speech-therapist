"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");

const L = require("../games/synonyms/logic.js");
require("../games/synonyms/words.js");
const BANK = globalThis.SYNONYM_SETS;

function valid() {
  return {
    word: "голям",
    synonyms: ["огромен", "едър"],
    distractors: ["малък", "висок", "тежък", "бърз", "весел", "къс"]
  };
}

test("validateSet accepts a valid set", () => {
  assert.equal(L.validateSet(valid()), null);
});

test("validateSet rejects a broken set, one rule at a time", () => {
  const cases = {
    "long word": (s) => { s.word = "а".repeat(21); },
    "no synonyms": (s) => { s.synonyms = []; },
    "five synonyms": (s) => { s.synonyms = ["а1", "а2", "а3", "а4", "а5"]; },
    "long synonym": (s) => { s.synonyms[0] = "а".repeat(21); },
    "distractors not a list": (s) => { s.distractors = "x"; },
    "long distractor": (s) => { s.distractors[0] = "а".repeat(21); },
    "too few candidates": (s) => { s.distractors = s.distractors.slice(0, 5); },
    "too many candidates": (s) => { s.distractors = s.distractors.concat(["д1", "д2", "д3", "д4", "д5"]); },
    "duplicate after trim and lowercase": (s) => { s.distractors[0] = " ЕДЪР "; },
    "word in both lists": (s) => { s.distractors[0] = "огромен"; },
    "reference among candidates": (s) => { s.distractors[0] = "голям"; }
  };
  for (const [name, mutate] of Object.entries(cases)) {
    const s = valid();
    mutate(s);
    assert.equal(typeof L.validateSet(s), "string", name);
  }
});

test("validateBank reports duplicate reference words", () => {
  const problems = L.validateBank([valid(), valid()]);
  assert.ok(problems.length > 0);
});

test("shuffle keeps every word and does not mutate its input", () => {
  const input = ["а", "б", "в", "г", "д"];
  const copy = input.slice();
  const out = L.shuffle(input);
  assert.deepEqual(input, copy);
  assert.deepEqual(out.slice().sort(), copy.slice().sort());
  assert.notEqual(out, input);
});

test("every set in the word bank is valid", () => {
  assert.ok(BANK.length >= 20, "bank has at least 20 sets");
  for (const set of BANK) assert.equal(L.validateSet(set), null, set.word);
  assert.deepEqual(L.validateBank(BANK), []);
});

// --- checkRound, instructionText, missingText (T006) ---

function roundSet() {
  return {
    word: "голям",
    synonyms: ["огромен", "едър", "грамаден"],
    distractors: ["малък", "висок", "тежък", "бърз", "весел", "къс"]
  };
}

test("checkRound attempt 1: wrong mark and a missing synonym", () => {
  const r = L.checkRound(roundSet(), ["огромен", "малък"], 1);
  assert.equal(r.statuses["огромен"], "correct");
  assert.equal(r.statuses["малък"], "wrong");
  assert.ok(!Object.values(r.statuses).includes("missed"));
  assert.equal(r.missingCount, 2);
  assert.equal(r.done, false);
});

test("checkRound attempt 1: perfect is done", () => {
  const r = L.checkRound(roundSet(), ["огромен", "едър", "грамаден"], 1);
  assert.equal(r.done, true);
  assert.equal(r.missingCount, 0);
  assert.equal(r.found, 3);
});

test("checkRound attempt 1: only wrong marks is not done", () => {
  const r = L.checkRound(roundSet(), ["малък", "висок"], 1);
  assert.equal(r.done, false);
  assert.equal(r.found, 0);
  assert.equal(r.missingCount, 3);
});

test("checkRound attempt 1: all synonyms plus a wrong mark is not done", () => {
  const r = L.checkRound(roundSet(), ["огромен", "едър", "грамаден", "малък"], 1);
  assert.equal(r.missingCount, 0);
  assert.equal(r.done, false);
});

test("checkRound attempt 2: missed synonyms are revealed and the round is done", () => {
  const r = L.checkRound(roundSet(), ["огромен", "малък"], 2);
  assert.equal(r.statuses["едър"], "missed");
  assert.equal(r.statuses["грамаден"], "missed");
  assert.equal(r.statuses["малък"], "wrong");
  assert.equal(r.statuses["бърз"], "neutral");
  assert.equal(r.done, true);
});

test("checkRound counts found as the number of correct statuses", () => {
  const r = L.checkRound(roundSet(), ["огромен", "едър", "малък"], 2);
  const correct = Object.values(r.statuses).filter((s) => s === "correct").length;
  assert.equal(r.found, correct);
  assert.equal(r.found, 2);
});

test("instructionText uses the right Bulgarian form", () => {
  assert.equal(L.instructionText(1), "Намери 1 дума с близко значение");
  assert.equal(L.instructionText(3), "Намери 3 думи с близко значение");
});

test("missingText uses the right Bulgarian form", () => {
  assert.equal(L.missingText(1), "Почти! Остава още 1 дума.");
  assert.equal(L.missingText(2), "Почти! Остават още 2 думи.");
});
