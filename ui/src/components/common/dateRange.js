export * from "@dragorbit/core/date-range";
export const DATE_RANGE_PANEL_WIDTH = 820;
export const DATE_RANGE_LIST_MIN_WIDTH = 208;

export function getDateRangeDropdownPosition(
	triggerEl,
	{ isCustomPanel = false, measuredHeight = null, viewportPadding = 12 } = {},
) {
	if (!triggerEl) return null;

	const rect = triggerEl.getBoundingClientRect();
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const padding = viewportPadding;

	const preferredWidth = isCustomPanel
		? DATE_RANGE_PANEL_WIDTH
		: Math.max(rect.width, DATE_RANGE_LIST_MIN_WIDTH);
	const width = Math.min(preferredWidth, viewportWidth - padding * 2);

	const estimatedHeight = measuredHeight ?? (isCustomPanel ? 420 : 280);

	let left = rect.left;
	if (left + width > viewportWidth - padding) {
		left = rect.right - width;
	}
	if (left < padding) {
		left = padding;
	}
	if (left + width > viewportWidth - padding) {
		left = Math.max(padding, viewportWidth - width - padding);
	}

	let top = rect.bottom + 4;
	if (top + estimatedHeight > viewportHeight - padding) {
		const aboveTop = rect.top - estimatedHeight - 4;
		top =
			aboveTop >= padding
				? aboveTop
				: Math.max(padding, viewportHeight - estimatedHeight - padding);
	}

	return { top, left, width };
}
