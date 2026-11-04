"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { clampFloatingMenuPosition } from "./floatingMenuPosition";

const MENU_WIDTH = 192;

const toneClass = {
  default:
    "w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-3 transition-colors cursor-pointer focus:outline-none group",
  primary:
    "w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10 flex items-center gap-3 transition-colors cursor-pointer focus:outline-none group",
  success:
    "w-full px-4 py-2 text-left text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-3 transition-colors cursor-pointer focus:outline-none group",
  warning:
    "w-full px-4 py-2 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 flex items-center gap-3 transition-colors cursor-pointer focus:outline-none group",
  danger:
    "w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors cursor-pointer focus:outline-none group",
};

export function RowActionsMenu({
  items = [],
  mode = "dropdown",
  anchorPoint = null,
  className = "w-48",
}) {
  const menuRef = useRef(null);
  const anchorRef = useRef(null);
  const [position, setPosition] = useState({
    left: anchorPoint?.x ?? 0,
    top: anchorPoint?.y ?? 0,
  });

  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      const anchor = anchorRef.current?.parentElement?.getBoundingClientRect();
      const x =
        mode === "context"
          ? anchorPoint?.x
          : anchor
            ? anchor.right - (width || MENU_WIDTH)
            : undefined;
      const y =
        mode === "context"
          ? anchorPoint?.y
          : anchor
            ? anchor.bottom + 4
            : undefined;
      if (x == null || y == null) return;
      const next = clampFloatingMenuPosition(x, y, width || MENU_WIDTH, height);
      setPosition((previous) =>
        previous.left === next.left && previous.top === next.top
          ? previous
          : next
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, anchorPoint]);

  const menuBody = items.map((item, index) => {
    if (item.type === "separator") {
      const adjacentKey =
        items[index + 1]?.key || items[index - 1]?.key || "boundary";
      return (
        <div
          key={item.key || `sep-${adjacentKey}`}
          className="border-t border-[rgb(var(--color-border-primary))] my-1"
        />
      );
    }

    const Icon = item.icon;
    const tone = item.tone || "default";

    return (
      <button
        key={item.key || item.label}
        type="button"
        onClick={item.onClick}
        className={toneClass[tone] || toneClass.default}
      >
        {Icon ? (
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              item.iconClassName
                ? item.iconClassName
                : tone === "danger"
                  ? "text-red-500 dark:text-red-400"
                  : tone === "warning"
                    ? "text-amber-500 dark:text-amber-400"
                    : tone === "success"
                      ? "text-emerald-500 dark:text-emerald-400"
                      : tone === "primary"
                        ? "text-[rgb(var(--color-primary))]"
                        : "text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-text-primary))]"
            }`}
          />
        ) : null}
        <span>{item.label}</span>
      </button>
    );
  });

  const shellClass = `${className} bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] py-1`;

  return (
    <>
      {mode === "dropdown" ? (
        <span ref={anchorRef} hidden aria-hidden="true" />
      ) : null}
      {createPortal(
        <div
          ref={menuRef}
          data-row-context-menu
          style={{ left: position.left, top: position.top }}
          className={`fixed z-[10051] ${shellClass}`}
        >
          {menuBody}
        </div>,
        document.body
      )}
    </>
  );
}

export default RowActionsMenu;
