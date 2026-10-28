import { useEffect, useLayoutEffect, useRef } from "react";
import { matchesHotkey } from "./hotkeyMatcher.js";

export const useHotkeys = (keyMap, inputs = []) => {
	const handlersRef = useRef(keyMap);
	useLayoutEffect(() => {
		handlersRef.current = keyMap;
	});

	useEffect(() => {
		const handleKeyDown = (event) => {
			const isMac =
				typeof navigator !== "undefined" &&
				/Mac|iPhone|iPad/.test(navigator.platform);
			for (const [combo, handler] of Object.entries(
				handlersRef.current || {},
			)) {
				if (
					typeof handler === "function" &&
					matchesHotkey(event, combo, isMac)
				) {
					event.preventDefault();
					handler(event);
					break;
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown, true);
		return () => window.removeEventListener("keydown", handleKeyDown, true);
		// biome-ignore lint/correctness/useExhaustiveDependencies: Callers provide optional registration dependencies; callbacks stay current via the ref.
	}, inputs);
};
export default useHotkeys;
