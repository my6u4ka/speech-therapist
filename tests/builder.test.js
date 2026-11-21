"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");

const L = require("../games/builder/logic.js");
require("../games/builder/words.js");
const BANK = globalThis.BUILDER_SENTENCES;

test("tokenize strips the end mark and splits on spaces", () => {
  assert.deepEqual(L.tokenize("Котката спи на топлия диван."), ["Котката", "спи", "на", "топлия", "диван"]);
  assert.deepEqual(L.tokenize("Кой е написал тази книга?"), ["Кой", "е", "написал", "тази", "книга"]);
  assert.deepEqual(L.tokenize("Какъв хубав ден е днес!"), ["Какъв", "хубав", "ден", "е", "днес"]);
});

test("displayWord lowercases the first word unless it is a name", () => {
  assert.equal(L.displayWord("Котката", 0, { text: "Котката спи." }), "котката");
  assert.equal(L.displayWord("Иван", 0, { text: "Иван има куче.", firstIsName: true }), "Иван");
  // A name in the middle keeps its capital.
  assert.equal(L.displayWord("Иван", 2, { text: "Днес вижда Иван." }), "Иван");
  assert.equal(L.displayWord("спи", 1, {}), "спи");
});

test("validateEntry accepts valid entries", () => {
  assert.equal(L.validateEntry({ text: "Котката спи на топлия диван." }), null);
  assert.equal(L.validateEntry({ text: "Кой е написал тази интересна книга?" }), null);
  assert.equal(L.validateEntry({ text: "Иван има малко бяло куче.", firstIsName: true }), null);
});

test("validateEntry rejects broken entries", () => {
  const bad = (e) => assert.equal(typeof L.validateEntry(e), "string");
  bad(null);
  bad({ text: "Котката, спи на топлия диван." }); // comma
  bad({ text: "Котката спи тук." }); // 3 words
  bad({ text: "Тя има едно две три четири пет шест седем." }); // 9 words
  bad({ text: "Котката спи на непрекъснатоспящия диван." }); // long word
  bad({ text: "котката спи на топлия диван." }); // lowercase start
  bad({ text: "Котката спи на топлия диван" }); // no end mark
  bad({ text: "Котката  спи на топлия диван." }); // double space
  bad({ text: "Котката спи на топлия диван.", firstIsName: "yes" });
});

test("validateBank detects duplicates and a short bank", () => {
  const problems = L.validateBank([
    { text: "Котката спи на топлия диван." },
    { text: "Котката спи на ТОПЛИЯ диван." },
    { text: "Котката спи на топлия диван." }
  ]);
  assert.ok(problems.some((p) => p.includes("duplicate")));
  assert.ok(problems.some((p) => p.includes("at least")));
});

test("the real bank has no problems", () => {
  assert.deepEqual(L.validateBank(BANK), []);
});

// Small seeded generator so the tests are repeatable.
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

test("scramble keeps the words and changes the order", () => {
  const words = ["котката", "спи", "на", "топлия", "диван"];
  for (let seed = 1; seed <= 25; seed++) {
    const out = L.scramble(words, seeded(seed));
    assert.deepEqual([...out].sort(), [...words].sort());
    assert.notDeepEqual(out, words);
  }
  // The input is not changed.
  assert.deepEqual(words, ["котката", "спи", "на", "топлия", "диван"]);
});

test("scramble works with repeated words and with identical words", () => {
  const words = ["аз", "не", "аз", "не"];
  for (let seed = 1; seed <= 25; seed++) {
    const out = L.scramble(words, seeded(seed));
    assert.deepEqual([...out].sort(), [...words].sort());
    assert.notDeepEqual(out, words);
  }
  assert.deepEqual(L.scramble(["а", "а", "а", "а"]), ["а", "а", "а", "а"]);
});

test("checkBoard marks each place", () => {
  const target = ["котката", "спи", "на", "топлия", "диван"];
  const ok = L.checkBoard(target, target.slice());
  assert.equal(ok.allRight, true);
  assert.deepEqual(ok.right, [true, true, true, true, true]);

  const some = L.checkBoard(target, ["спи", "котката", "на", "топлия", "диван"]);
  assert.equal(some.allRight, false);
  assert.deepEqual(some.right, [false, false, true, true, true]);
});

test("checkBoard accepts a repeated word in either place", () => {
  const target = ["не", "искам", "не", "мога"];
  // The two "не" cards are interchangeable.
  const res = L.checkBoard(target, ["не", "искам", "не", "мога"]);
  assert.equal(res.allRight, true);
  const swapped = L.checkBoard(["аз", "не", "аз", "не"], ["аз", "не", "аз", "не"]);
  assert.equal(swapped.allRight, true);
});
