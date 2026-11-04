import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeStoreSummary } from "./summary.js";

test("duplicate store snapshots do not duplicate rows or inflate totals", () => {
    const latest = { _id: "store-1", revenue: 125 };
    const rows = normalizeStoreSummary([
        { _id: "store-1", revenue: 100 },
        { _id: "store-2", revenue: 50 },
        latest,
    ]);
    assert.equal(rows.length, 2);
    assert.equal(rows[0], latest);
    assert.equal(rows.reduce((sum, row) => sum + row.revenue, 0), 175);
});
test("distinct stores sharing a name remain separate; malformed input is safe", () => {
    const rows = [{ _id: "one", storeName: "Store" }, { _id: "two", storeName: "Store" }];
    assert.deepEqual(normalizeStoreSummary(rows), rows);
    assert.deepEqual(normalizeStoreSummary(null), []);
    assert.deepEqual(normalizeStoreSummary([null, 42]), []);
});
