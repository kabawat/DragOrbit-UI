export function translateLabel(t, key, fallback, params = {}) {
	const value = t?.(key, { ...params, defaultValue: fallback });
	return typeof value === "string" && value !== key ? value : fallback;
}
