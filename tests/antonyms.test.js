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

// --- Round columns (US1) ---

const ROUND = [
  { a: "ден", b: "нощ" },
  { a: "горещ", b: "студен" },
  { a: "голям", b: "малък" },
  { a: "отварям", b: "затварям" },
  { a: "рано", b: "късно" }
];

test("buildColumns makes two equal columns with every word exactly once", () => {
  for (let i = 0; i < 20; i++) {
    const { left, right } = L.buildColumns(ROUND);
    assert.equal(left.length, 5);
    assert.equal(right.length, 5);
    const words = left.concat(right).map((it) => it.word).sort();
    const expected = ROUND.flatMap((p) => [p.a, p.b]).sort();
    assert.deepEqual(words, expected);
    for (let idx = 0; idx < ROUND.length; idx++) {
      const l = left.filter((it) => it.pairIndex === idx);
      const r = right.filter((it) => it.pairIndex === idx);
      assert.equal(l.length, 1);
      assert.equal(r.length, 1);
      assert.deepEqual([l[0].word, r[0].word].sort(), [ROUND[idx].a, ROUND[idx].b].sort());
    }
  }
});

test("buildColumns uses the given rng and does not mutate the round", () => {
  const copy = JSON.stringify(ROUND);
  let n = 0;
  const rng = () => ((n++ * 0.37) % 1);
  const x = L.buildColumns(ROUND, rng);
  n = 0;
  const y = L.buildColumns(ROUND, rng);
  assert.deepEqual(x, y);
  assert.equal(JSON.stringify(ROUND), copy);
});

test("isPair is true only for the same pairIndex from opposite columns", () => {
  const { left, right } = L.buildColumns(ROUND);
  for (const x of left) {
    for (const y of right) {
      assert.equal(L.isPair(x, y), x.pairIndex === y.pairIndex);
      assert.equal(L.isPair(y, x), x.pairIndex === y.pairIndex);
    }
  }
  // Same column never pairs, even with the same pairIndex or the same item.
  assert.equal(L.isPair(left[0], left[0]), false);
  assert.equal(L.isPair(left[0], left[1]), false);
  assert.equal(L.isPair(right[0], right[1]), false);
});

test("firstTryCount counts pairs where neither word was tried wrong", () => {
  assert.equal(L.firstTryCount(ROUND, new Set()), 5);
  assert.equal(L.firstTryCount(ROUND, new Set(["ден"])), 4);
  assert.equal(L.firstTryCount(ROUND, new Set(["ден", "нощ"])), 4);
  assert.equal(L.firstTryCount(ROUND, new Set(["ден", "студен", "малък"])), 2);
  assert.equal(L.firstTryCount(ROUND, ["ден", "горещ"]), 3);
});

// --- Series (US2) ---

// Small deterministic rng (mulberry32) so the series tests are repeatable.
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function checkSeries(series) {
  const seen = new Set();
  for (const round of series) {
    assert.equal(round.length, 5);
    for (let i = 0; i < round.length; i++) {
      const key = L.normalize(round[i].a) + "|" + L.normalize(round[i].b);
      assert.ok(!seen.has(key), "pair repeats: " + key);
      seen.add(key);
      for (let j = i + 1; j < round.length; j++) {
        assert.equal(L.conflicts(round[i], round[j]), false,
          round[i].a + "-" + round[i].b + " conflicts with " + round[j].a + "-" + round[j].b);
      }
    }
  }
}

test("buildSeries builds 5 rounds of 5 conflict-free pairs from the real bank", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const series = L.buildSeries(BANK, 5, 5, seeded(seed));
    assert.equal(series.length, 5, "seed " + seed);
    checkSeries(series);
  }
});

test("buildSeries without an rng also builds a full series", () => {
  for (let i = 0; i < 20; i++) {
    const series = L.buildSeries(BANK, 5, 5);
    assert.equal(series.length, 5);
    checkSeries(series);
  }
});

test("buildSeries gives a shorter series from a small bank and never throws", () => {
  const small = BANK.slice(0, 7);
  const series = L.buildSeries(small, 5, 5, seeded(7));
  assert.ok(series.length <= 1);
  series.forEach((r) => assert.equal(r.length, 5));
  assert.deepEqual(L.buildSeries([], 5, 5, seeded(1)), []);
  assert.deepEqual(L.buildSeries(BANK.slice(0, 3), 5, 5, seeded(1)), []);
});

test("buildSeries does not mutate the bank", () => {
  const copy = JSON.stringify(BANK);
  L.buildSeries(BANK, 5, 5, seeded(3));
  assert.equal(JSON.stringify(BANK), copy);
});

test("starsFor returns 1-3 and never 0", () => {
  assert.equal(L.starsFor(25, 25), 3);
  assert.equal(L.starsFor(20, 25), 3);
  assert.equal(L.starsFor(19, 25), 2);
  assert.equal(L.starsFor(13, 25), 2);
  assert.equal(L.starsFor(12, 25), 1);
  assert.equal(L.starsFor(0, 25), 1);
  assert.equal(L.starsFor(0, 0), 1);
});

test("summaryLine2 formats the first-try line", () => {
  assert.equal(L.summaryLine2(24, 25), "От първия опит: 24 от 25.");
});
