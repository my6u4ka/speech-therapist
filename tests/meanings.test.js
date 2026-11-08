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
