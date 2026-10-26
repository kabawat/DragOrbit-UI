import { useEffect, useLayoutEffect, useRef } from "react";

// On Mac, Cmd (metaKey) acts as Ctrl for app shortcuts
const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform);

// Modifier bit masks
const MODIFIERS = {
  ctrl: 1,
  alt: 2,
  shift: 4,
  meta: 8,
};

// Map for special keys
const ALIASES = {
  esc: "escape",
  return: "enter",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
};

// Active modifier detection — on Mac, Cmd (meta) is treated as Ctrl
const getActiveModifiers = (event) => {
  let modifiers = 0;
  if (event.ctrlKey || (isMac && event.metaKey)) modifiers |= MODIFIERS.ctrl;
  if (event.altKey) modifiers |= MODIFIERS.alt;
  if (event.shiftKey) modifiers |= MODIFIERS.shift;
  return modifiers;
};

// Helper to parse key string like "ctrl+s" into detailed object
const parseKeyCombo = (comboStr) => {
  const parts = comboStr.toLowerCase().split("+");
  let modifiers = 0;
  let key = "";

  parts.forEach((part) => {
    if (MODIFIERS[part]) {
      modifiers |= MODIFIERS[part];
    } else {
      key = ALIASES[part] || part;
    }
  });

  return { modifiers, key };
};

export const useHotkeys = (keyMap, inputs = []) => {
  const handlersRef = useRef(keyMap);
  useLayoutEffect(() => {
    handlersRef.current = keyMap;
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!event || !event.key) return; // Safeguard against missing event data

      const tagName = event.target?.tagName?.toLowerCase() || "";
      const pressedKeyStr = event.key.toLowerCase();

      if (
        (tagName === "input" ||
          tagName === "textarea" ||
          event.target?.isContentEditable) &&
        pressedKeyStr !== "escape"
      ) {
        return;
      }

      const activeModifiers = getActiveModifiers(event);
      const pressedKey = pressedKeyStr;

      // Loop through all defined hotkeys
      Object.entries(handlersRef.current || {}).forEach(([combo, handler]) => {
        const { modifiers, key } = parseKeyCombo(combo);

        // Check if both Key and Modifiers match
        if (key === pressedKey && modifiers === activeModifiers) {
          handler(event);
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: dynamic inputs array passed by caller
  }, inputs);
};

export default useHotkeys;
