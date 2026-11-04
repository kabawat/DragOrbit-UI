const aliases = {
	esc: "escape",
	return: "enter",
	up: "arrowup",
	down: "arrowdown",
	left: "arrowleft",
	right: "arrowright",
	cmd: "meta",
	option: "alt",
};

export function matchesHotkey(event, combo, isMac = false) {
	if (
		!event?.key ||
		event.isComposing ||
		event.repeat ||
		event.defaultPrevented
	)
		return false;
	const parts = combo
		.toLowerCase()
		.split("+")
		.map((part) => aliases[part.trim()] || part.trim());
	const key = parts.pop();
	const modifiers = new Set(parts);
	const explicitMeta = modifiers.has("meta");
	if (
		Boolean(event.ctrlKey || (isMac && !explicitMeta && event.metaKey)) !==
			modifiers.has("ctrl") ||
		Boolean(event.altKey) !== modifiers.has("alt") ||
		Boolean(event.shiftKey) !== modifiers.has("shift") ||
		Boolean(event.metaKey && (!isMac || explicitMeta)) !== explicitMeta
	)
		return false;
	const pressed = event.key.toLowerCase();
	// Option/Alt can produce a symbol rather than the physical letter on macOS.
	const physical = /^Key[A-Z]$/.test(event.code || "")
		? event.code.slice(3).toLowerCase()
		: /^Digit[0-9]$/.test(event.code || "")
			? event.code.slice(5)
			: { Backslash: "\\", Comma: ",", Slash: "/" }[event.code];
	if (
		pressed !== key &&
		!((event.ctrlKey || event.metaKey || event.altKey) && physical === key)
	)
		return false;
	const target = event.target;
	const editable =
		target?.isContentEditable ||
		target?.closest?.(
			'input, textarea, select, [contenteditable="true"], [role="textbox"], [role="combobox"]',
		);
	if (editable && key !== "escape") {
		// Preserve text entry and word deletion, while allowing Save/Checkout/Search commands.
		if (key === "delete" || key === "backspace") return false;
		if (
			!event.ctrlKey &&
			!event.metaKey &&
			!event.altKey &&
			!/^f\d+$/.test(key)
		)
			return false;
	}
	return true;
}
