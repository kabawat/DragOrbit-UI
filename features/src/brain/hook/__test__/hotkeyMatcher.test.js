import assert from "node:assert/strict";
import test from "node:test";
import { matchesHotkey } from "../hotkeyMatcher.js";

const event = (overrides = {}) => ({
	key: "n",
	code: "KeyN",
	ctrlKey: false,
	metaKey: false,
	altKey: false,
	shiftKey: false,
	target: { closest: () => null },
	...overrides,
});
const input = { closest: () => ({ tagName: "INPUT" }) };

test("new entry shortcuts preserve typing and use exact modifiers", () => {
	assert.equal(matchesHotkey(event({ altKey: true }), "alt+n"), true);
	assert.equal(matchesHotkey(event({ shiftKey: true }), "shift+n"), true);
	assert.equal(
		matchesHotkey(event({ shiftKey: true, target: input }), "shift+n"),
		false,
	);
	assert.equal(
		matchesHotkey(event({ altKey: true, shiftKey: true }), "alt+n"),
		false,
	);
});
test("save and checkout remain available while entering a form", () => {
	assert.equal(
		matchesHotkey(
			event({ key: "Enter", code: "Enter", ctrlKey: true, target: input }),
			"ctrl+enter",
		),
		true,
	);
	assert.equal(
		matchesHotkey(
			event({ key: "s", code: "KeyS", ctrlKey: true, target: input }),
			"ctrl+s",
		),
		true,
	);
	assert.equal(
		matchesHotkey(event({ key: "F1", code: "F1", target: input }), "f1"),
		true,
	);
});
test("search and delete do not replace normal text editing", () => {
	assert.equal(
		matchesHotkey(event({ key: "/", code: "Slash", target: input }), "/"),
		false,
	);
	assert.equal(
		matchesHotkey(
			event({ key: "Delete", code: "Delete", ctrlKey: true, target: input }),
			"ctrl+delete",
		),
		false,
	);
	assert.equal(
		matchesHotkey(
			event({ key: "Delete", code: "Delete", ctrlKey: true }),
			"ctrl+delete",
		),
		true,
	);
	assert.equal(
		matchesHotkey(
			event({
				key: "f",
				code: "KeyF",
				altKey: true,
				shiftKey: true,
				target: input,
			}),
			"alt+shift+f",
		),
		true,
	);
});
test("Mac Command and Option-generated symbols match documented keys", () => {
	assert.equal(
		matchesHotkey(
			event({ key: "s", code: "KeyS", metaKey: true }),
			"ctrl+s",
			true,
		),
		true,
	);
	assert.equal(
		matchesHotkey(
			event({ key: "s", code: "KeyS", metaKey: true }),
			"ctrl+s",
			false,
		),
		false,
	);
	assert.equal(
		matchesHotkey(
			event({ key: "s", code: "KeyS", metaKey: true }),
			"meta+s",
			true,
		),
		true,
	);
	assert.equal(
		matchesHotkey(
			event({ key: "©", code: "KeyC", altKey: true }),
			"alt+c",
			true,
		),
		true,
	);
});
test("Escape/help/navigation aliases work with punctuation and input focus", () => {
	assert.equal(
		matchesHotkey(
			event({ key: "Escape", code: "Escape", target: input }),
			"esc",
		),
		true,
	);
	assert.equal(
		matchesHotkey(
			event({ key: "?", code: "Slash", shiftKey: true }),
			"shift+?",
		),
		true,
	);
	assert.equal(
		matchesHotkey(
			event({ key: "ArrowLeft", code: "ArrowLeft", altKey: true }),
			"alt+left",
		),
		true,
	);
});
test("handled events, key repeat, and IME composition never execute twice", () => {
	for (const flag of ["defaultPrevented", "repeat", "isComposing"]) {
		assert.equal(
			matchesHotkey(event({ altKey: true, [flag]: true }), "alt+n"),
			false,
		);
	}
});
