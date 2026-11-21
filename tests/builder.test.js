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
