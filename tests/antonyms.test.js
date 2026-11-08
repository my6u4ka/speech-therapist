"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");

const L = require("../games/antonyms/logic.js");
require("../games/antonyms/words.js");
const BANK = globalThis.ANTONYM_PAIRS;

function valid() {
  return { a: "ден", b: "нощ", avoid: ["вечер"] };
}

test("validatePair accepts a valid pair", () => {
  assert.equal(L.validatePair(valid()), null);
  assert.equal(L.validatePair({ a: "ден", b: "нощ" }), null);
});

test("validatePair rejects a broken pair, one rule at a time", () => {
  const cases = {
    "long a": (p) => { p.a = "а".repeat(17); },
    "empty a": (p) => { p.a = "  "; },
    "long b": (p) => { p.b = "а".repeat(17); },
    "b not text": (p) => { p.b = 5; },
    "a equals b after normalizing": (p) => { p.b = " ДЕН "; },
    "avoid not a list": (p) => { p.avoid = "вечер"; },
    "long avoid word": (p) => { p.avoid = ["а".repeat(17)]; },
    "avoid not text": (p) => { p.avoid = [1]; },
    "avoid contains a": (p) => { p.avoid = ["Ден"]; },
    "avoid contains b": (p) => { p.avoid = ["нощ"]; }
  };
  for (const [name, mutate] of Object.entries(cases)) {
    const p = valid();
    mutate(p);
    assert.equal(typeof L.validatePair(p), "string", name);
  }
  assert.equal(typeof L.validatePair(null), "string");
});

test("validateBank detects a reversed duplicate and a small bank", () => {
  const problems = L.validateBank([{ a: "ден", b: "нощ" }, { a: "нощ", b: "ден" }]);
  assert.ok(problems.some((s) => s.includes("duplicate")));
  assert.ok(problems.some((s) => s.includes("at least 40")));
});

test("validateBank reports invalid pairs", () => {
  const problems = L.validateBank([{ a: "ден", b: "ден" }]);
  assert.ok(problems.some((s) => s.includes("different")));
});

test("conflicts: shared word, avoid in each direction, and no conflict", () => {
  const p = { a: "стар", b: "млад", avoid: ["нов"] };
  assert.equal(L.conflicts(p, { a: "стар", b: "нов" }), true);
  assert.equal(L.conflicts({ a: "нов", b: "износен" }, p), true);
  assert.equal(L.conflicts(p, { a: "нов", b: "износен" }), true);
  assert.equal(L.conflicts({ a: "СТАР ", b: "х" }, p), true);
  assert.equal(L.conflicts(p, { a: "ден", b: "нощ" }), false);
});

test("shuffle keeps every item and does not mutate its input", () => {
  const input = [1, 2, 3, 4, 5, 6];
  const copy = input.slice();
  const out = L.shuffle(input);
  assert.deepEqual(input, copy);
  assert.notEqual(out, input);
  assert.deepEqual(out.slice().sort(), copy);
});

test("the real word bank has no problems", () => {
  assert.deepEqual(L.validateBank(BANK), []);
});
