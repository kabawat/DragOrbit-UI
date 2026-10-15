/** One cumulative dashboard snapshot per store; later records replace earlier ones. */
export function normalizeStoreSummary(rows) {
	if (!Array.isArray(rows)) return [];
	const stores = new Map();
	const unidentified = [];
	for (const row of rows) {
		if (!row || typeof row !== "object") continue;
		const id = row.storeId ?? row._id ?? row.id;
		if (id == null || String(id) === "") unidentified.push(row);
		else stores.set(String(id), row);
	}
	return [...stores.values(), ...unidentified];
}
