"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");

const L = require("../games/sentences/logic.js");
require("../games/sentences/words.js");
const TYPES = globalThis.SENTENCE_TYPES;
const BANK = globalThis.SENTENCE_ENTRIES;

test("wordCount ignores punctuation", () => {
  assert.equal(L.wordCount("Колко е красиво навън!"), 4);
  assert.equal(L.wordCount("Моля, седни  на мястото си."), 5);
  assert.equal(L.wordCount("Ехо ! ... ?"), 1);
  assert.equal(L.wordCount(""), 0);
});

test("SENTENCE_TYPES has the 4 ids in order", () => {
  assert.deepEqual(TYPES.map((t) => t.id), ["statement", "question", "request", "exclamation"]);
});

test("validateEntry accepts one valid entry per type", () => {
  assert.equal(L.validateEntry({ text: "Днес е слънчево.", type: "statement" }, TYPES), null);
  assert.equal(L.validateEntry({ text: "Кога тръгваме?", type: "question" }, TYPES), null);
  assert.equal(L.validateEntry({ text: "Затвори прозореца, моля!", type: "request" }, TYPES), null);
  assert.equal(L.validateEntry({ text: "Моля, седни.", type: "request" }, TYPES), null);
  assert.equal(L.validateEntry({ text: "Колко е красиво!", type: "exclamation" }, TYPES), null);
});

test("validateEntry rejects broken entries", () => {
  const bad = (e) => assert.equal(typeof L.validateEntry(e, TYPES), "string");
  bad(null);
  bad({ text: "", type: "statement" });
  bad({ text: "   ", type: "statement" });
  bad({ type: "statement" });
  bad({ text: "днес е слънчево.", type: "statement" });
  bad({ text: "Едно две три четири пет шест седем осем девет десет единайсет дванайсет тринайсет.", type: "statement" });
  bad({ text: "А".repeat(91) + ".", type: "statement" });
  bad({ text: "Днес е слънчево.", type: "unknown" });
  bad({ text: "Днес е слънчево.", type: undefined });
});

test("validateEntry rejects a mark that does not match the type", () => {
  assert.match(L.validateEntry({ text: "Кога тръгваме.", type: "question" }, TYPES), /end/);
  assert.notEqual(L.validateEntry({ text: "Днес е слънчево?", type: "statement" }, TYPES), null);
  assert.notEqual(L.validateEntry({ text: "Колко е красиво.", type: "exclamation" }, TYPES), null);
  assert.notEqual(L.validateEntry({ text: "Седни?", type: "request" }, TYPES), null);
  assert.notEqual(L.validateEntry({ text: "Днес е слънчево", type: "statement" }, TYPES), null);
});

test("validateEntry accepts exactly 12 words", () => {
  const twelve = "Едно две три четири пет шест седем осем девет десет единайсет дванайсет.";
  assert.equal(L.wordCount(twelve), 12);
  assert.equal(L.validateEntry({ text: twelve, type: "statement" }, TYPES), null);
});

test("validateBank detects a duplicate and a type with too few entries", () => {
  const few = [
    { text: "Днес е слънчево.", type: "statement" },
    { text: " ДНЕС е слънчево. ", type: "statement" }
  ];
  const problems = L.validateBank(few, TYPES);
  assert.ok(problems.some((p) => /duplicate/.test(p)));
  assert.ok(problems.some((p) => /question/.test(p) && /at least 10/.test(p)));
});

test("validateBank reports invalid entries and non-lists", () => {
  assert.deepEqual(L.validateBank("x", TYPES), ["bank is not a list"]);
  assert.ok(L.validateBank([{ text: "Кога?!", type: "statement" }], TYPES).length > 0);
});

test("the real bank has no problems", () => {
  assert.deepEqual(L.validateBank(BANK, TYPES), []);
});

test("the real bank has at least 40 entries and 10 per type", () => {
  assert.ok(BANK.length >= 40);
  TYPES.forEach((t) => {
    assert.ok(BANK.filter((e) => e.type === t.id).length >= 10, t.id);
  });
});

test("wrappers delegate to the shared kit", () => {
  assert.equal(L.starsFor(8, 10), 3);
  assert.equal(L.summaryLine2(7, 8), "От първия опит: 7 от 8.");
  assert.equal(L.shuffle([1, 2, 3]).length, 3);
});

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

test("buildSeries gives 8 entries, 2 per type, with no repeats", () => {
  const series = L.buildSeries(BANK, 2, seeded(11));
  assert.equal(series.length, 8);
  TYPES.forEach((t) => {
    assert.equal(series.filter((e) => e.type === t.id).length, 2, t.id);
  });
  assert.equal(new Set(series.map((e) => e.text)).size, 8);
});

test("buildSeries on a small bank returns fewer and never throws", () => {
  const small = [{ text: "Днес е слънчево.", type: "statement" }];
  assert.deepEqual(L.buildSeries(small, 2, seeded(1)), small);
  assert.deepEqual(L.buildSeries([], 2, seeded(1)), []);
});

test("buildSeries with a different rng gives a different order", () => {
  const a = L.buildSeries(BANK, 2, seeded(3)).map((e) => e.text);
  const b = L.buildSeries(BANK, 2, seeded(99)).map((e) => e.text);
  assert.notDeepEqual(a, b);
});

test("buildSeries works without an rng and does not mutate the bank", () => {
  const copy = BANK.slice();
  assert.equal(L.buildSeries(BANK).length, 8);
  assert.deepEqual(BANK, copy);
});
