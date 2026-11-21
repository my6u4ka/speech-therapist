"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");

const Kit = require("../assets/shared/play.js");

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

test("shuffle keeps every item and does not mutate its input", () => {
  const input = [1, 2, 3, 4, 5, 6];
  const copy = input.slice();
  const out = Kit.shuffle(input, seeded(7));
  assert.deepEqual(input, copy);
  assert.notEqual(out, input);
  assert.deepEqual(out.slice().sort(), copy);
});

test("shuffle is deterministic with a fixed rng", () => {
  const input = ["a", "b", "c", "d", "e", "f", "g"];
  assert.deepEqual(Kit.shuffle(input, seeded(42)), Kit.shuffle(input, seeded(42)));
});

test("shuffle works without an rng", () => {
  assert.equal(Kit.shuffle([1, 2, 3]).length, 3);
});

test("starsFor at the boundaries", () => {
  assert.equal(Kit.starsFor(0, 10), 1);
  assert.equal(Kit.starsFor(5, 10), 2);
  assert.equal(Kit.starsFor(8, 10), 3);
  assert.equal(Kit.starsFor(10, 10), 3);
  assert.equal(Kit.starsFor(0, 0), 1);
});

test("starsFor never returns 0", () => {
  for (const [f, t] of [[0, 1], [0, 8], [0, 0], [1, -1], [0, NaN], [0, undefined]]) {
    assert.ok(Kit.starsFor(f, t) >= 1);
  }
});

test("firstTryLine builds the summary line", () => {
  assert.equal(Kit.firstTryLine(7, 8), "От първия опит: 7 от 8.");
});
