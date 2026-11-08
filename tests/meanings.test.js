"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");

const L = require("../games/meanings/logic.js");
require("../games/meanings/words.js");
const BANK = globalThis.MEANING_ENTRIES;

function valid() {
  return {
    word: "коса",
    sentence: "Дядо наточи [косата] преди косене.",
    right: "сечиво за косене на трева",
    wrong: ["космите на главата", "голяма дървена лопата"]
  };
}

test("parseSentence splits a sentence with one bracketed part", () => {
  assert.deepEqual(L.parseSentence("Баба коси с [косата] днес."), {
    before: "Баба коси с ",
    word: "косата",
    after: " днес."
  });
});

test("parseSentence returns null for zero, two or empty parts", () => {
  assert.equal(L.parseSentence("Няма отбелязана дума."), null);
  assert.equal(L.parseSentence("Две [думи] са [отбелязани]."), null);
  assert.equal(L.parseSentence("Празно [] място."), null);
  assert.equal(L.parseSentence("Празно [  ] място."), null);
  assert.equal(L.parseSentence("Обърнато ]дума[ тук."), null);
  assert.equal(L.parseSentence(5), null);
});

test("wordCount ignores brackets and punctuation", () => {
  assert.equal(L.wordCount("Един [два] три."), 3);
  assert.equal(L.wordCount("Да, ето – това!"), 3);
  assert.equal(L.wordCount("  "), 0);
});

test("validateEntry accepts a valid entry", () => {
  assert.equal(L.validateEntry(valid()), null);
});

test("validateEntry rejects a broken entry, one rule at a time", () => {
  const cases = {
    "not an object": null,
    "empty word": (e) => { e.word = "  "; },
    "long word": (e) => { e.word = "а".repeat(21); },
    "no bracket": (e) => { e.sentence = "Дядо наточи косата."; },
    "two brackets": (e) => { e.sentence = "Дядо [наточи] [косата]."; },
    "empty brackets": (e) => { e.sentence = "Дядо наточи [] косата."; },
    "too many words": (e) => { e.sentence = "[Дума] " + "дума ".repeat(12).trim() + "."; },
    "too many characters": (e) => { e.sentence = "[" + "а".repeat(91) + "]."; },
    "no end mark": (e) => { e.sentence = "Дядо наточи [косата]"; },
    "empty right": (e) => { e.right = ""; },
    "right too many words": (e) => { e.right = "едно две три четири пет шест седем осем девет"; },
    "right too long": (e) => { e.right = "а".repeat(61); },
    "wrong not a list": (e) => { e.wrong = "космите"; },
    "wrong has one item": (e) => { e.wrong = ["космите на главата"]; },
    "wrong has three items": (e) => { e.wrong = ["а", "б", "в"]; },
    "wrong item too long": (e) => { e.wrong[1] = "а".repeat(61); },
    "wrong item not text": (e) => { e.wrong[0] = 5; },
    "right equals wrong": (e) => { e.wrong[0] = " СЕЧИВО за косене на трева "; },
    "wrong items equal": (e) => { e.wrong[1] = e.wrong[0]; }
  };
  assert.equal(L.validateEntry(null) !== null, true);
  for (const [name, mutate] of Object.entries(cases)) {
    if (mutate === null) continue;
    const e = valid();
    mutate(e);
    assert.notEqual(L.validateEntry(e), null, "should reject: " + name);
  }
});

test("validateBank detects a duplicate word and right pair", () => {
  const a = valid();
  const b = valid();
  b.sentence = "Друго изречение с [косата].";
  const problems = L.validateBank([a, b]);
  assert.ok(problems.some((p) => p.includes("duplicate")));
});

test("validateBank reports a small bank and too few distinct words", () => {
  const problems = L.validateBank([valid()]);
  assert.ok(problems.some((p) => p.includes("at least 32")));
  assert.ok(problems.some((p) => p.includes("distinct words")));
});

test("shuffle keeps every item and does not mutate its input", () => {
  const input = [1, 2, 3, 4, 5, 6];
  const copy = input.slice();
  const out = L.shuffle(input);
  assert.deepEqual(input, copy);
  assert.deepEqual(out.slice().sort(), copy);
  assert.notEqual(out, input);
});

test("the real word bank has no problems", () => {
  assert.deepEqual(L.validateBank(BANK), []);
});

test("buildOptions returns 3 options, exactly one right, each explanation once", () => {
  const e = valid();
  const opts = L.buildOptions(e);
  assert.equal(opts.length, 3);
  assert.equal(opts.filter((o) => o.isRight).length, 1);
  assert.equal(opts.find((o) => o.isRight).text, e.right);
  assert.deepEqual(
    opts.map((o) => o.text).sort(),
    [e.right, ...e.wrong].sort()
  );
  const seeded = L.buildOptions(e, () => 0.3);
  assert.equal(seeded.length, 3);
});

// Small deterministic generator for tests (mulberry32).
function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test("pickSeries returns 8 entries with no repeated word", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const series = L.pickSeries(BANK, 8, seeded(seed));
    assert.equal(series.length, 8);
    const words = series.map((e) => L.normalize(e.word));
    assert.equal(new Set(words).size, 8);
  }
});

test("pickSeries shortens to the number of distinct words", () => {
  const bank = [];
  for (const w of ["а", "б", "в"]) {
    for (let i = 0; i < 2; i++) {
      bank.push({ word: w, sentence: "[" + w + "].", right: "r" + i, wrong: ["x", "y"] });
    }
  }
  const series = L.pickSeries(bank, 8, seeded(7));
  assert.equal(series.length, 3);
});

test("starsFor returns 1-3 and never 0", () => {
  assert.equal(L.starsFor(8, 8), 3);
  assert.equal(L.starsFor(7, 8), 3);
  assert.equal(L.starsFor(4, 8), 2);
  assert.equal(L.starsFor(3, 8), 1);
  assert.equal(L.starsFor(0, 8), 1);
  assert.equal(L.starsFor(0, 0), 1);
});

test("summaryLine2 formats the first-try count", () => {
  assert.equal(L.summaryLine2(7, 8), "От първия опит: 7 от 8.");
});
