export function clampFloatingMenuPosition(x, y, width, height, margin = 8) {
	const vw = typeof window !== "undefined" ? window.innerWidth : 0;
	const vh = typeof window !== "undefined" ? window.innerHeight : 0;

	let left = x;
	let top = y;

	if (left + width + margin > vw) {
		left = x - width;
	}
	if (left < margin) {
		left = margin;
	}

	if (top + height + margin > vh) {
		top = y - height;
	}
	if (top < margin) {
		top = margin;
	}

	return { left, top };
}
