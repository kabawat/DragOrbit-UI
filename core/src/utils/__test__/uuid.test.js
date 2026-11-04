import test from "node:test";
import assert from "node:assert/strict";
import { generateUUID } from "../uuid.util.js";

test("generateUUID returns a valid UUID v4 format", () => {
  const uuid = generateUUID();
  assert.equal(typeof uuid, "string");
  assert.match(
    uuid,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );
});

test("generateUUID generates unique identifiers", () => {
  const set = new Set();
  for (let i = 0; i < 100; i++) {
    set.add(generateUUID());
  }
  assert.equal(set.size, 100);
});

