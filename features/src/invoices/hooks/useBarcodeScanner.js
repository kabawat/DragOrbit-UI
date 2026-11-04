import { useEffect, useRef } from "react";

const SCAN_GAP_MS = 100;
const MAX_SCAN_DURATION_MS = 2000;
const MIN_CODE_LENGTH = 3;

const isEditableElement = (el) => {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
};

const stripTrailingCharsFromActiveInput = (count) => {
  const el = document.activeElement;
  if (!isEditableElement(el) || !("value" in el) || count <= 0) return;

  const current = el.value ?? "";
  if (current.length < count) return;

  const next = current.slice(0, -count);
  const prototype =
    el.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  descriptor?.set?.call(el, next);
  el.dispatchEvent(new Event("input", { bubbles: true }));
};

const resetScanState = (refs) => {
  refs.bufferRef.current = "";
  refs.isScanSequenceRef.current = false;
  refs.firstKeyTimeRef.current = 0;
  refs.lastKeyTimeRef.current = 0;
};

export function useBarcodeScanner({ onScan, enabled = true }) {
  const bufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);
  const firstKeyTimeRef = useRef(0);
  const isScanSequenceRef = useRef(false);
  const onScanRef = useRef(onScan);
  const enabledRef = useRef(enabled);

  onScanRef.current = onScan;
  enabledRef.current = enabled;

  useEffect(() => {
    const refs = {
      bufferRef,
      isScanSequenceRef,
      firstKeyTimeRef,
      lastKeyTimeRef,
    };

    const handleKeyDown = (e) => {
      if (!enabledRef.current) return;

      if (
        document.activeElement?.closest?.(
          '[data-ignore-barcode-scanner="true"]'
        )
      ) {
        resetScanState(refs);
        return;
      }

      if (e.key === "Enter") {
        const code = bufferRef.current.trim();
        const isScan =
          isScanSequenceRef.current &&
          code.length >= MIN_CODE_LENGTH &&
          Date.now() - firstKeyTimeRef.current <= MAX_SCAN_DURATION_MS;

        resetScanState(refs);

        if (isScan) {
          e.preventDefault();
          e.stopImmediatePropagation();
          onScanRef.current?.(code);
        }
        return;
      }

      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;

      const now = Date.now();
      const gap = lastKeyTimeRef.current
        ? now - lastKeyTimeRef.current
        : Infinity;

      if (gap > SCAN_GAP_MS) {
        bufferRef.current = e.key;
        firstKeyTimeRef.current = now;
        isScanSequenceRef.current = false;
      } else {
        const prevLen = bufferRef.current.length;
        bufferRef.current += e.key;

        if (bufferRef.current.length >= 2) {
          if (!isScanSequenceRef.current && prevLen === 1) {
            stripTrailingCharsFromActiveInput(1);
          }
          isScanSequenceRef.current = true;
        }
      }

      lastKeyTimeRef.current = now;

      if (isScanSequenceRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);
}

export default useBarcodeScanner;
