"use client";

import { Tooltip as SharedTooltip } from "@dragorbit/ui";
export function PanelResizeHandle({
  panelWidth,
  minWidth,
  maxWidth,
  isExpanded,
  onMouseDown,
  onTouchStart,
  onToggleMaximize,
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: interactive panel resize handle
    <SharedTooltip content={
        isExpanded
          ? "Click to restore or drag to resize"
          : "Click to maximize or drag to resize"
      }><div
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-valuenow={panelWidth}
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      aria-label="Drag to resize panel or click to maximize"

      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleMaximize();
        }
      }}
      className="group absolute -left-3 top-1/2 -translate-y-1/2 z-50 flex h-12 w-5 cursor-col-resize items-center justify-center rounded-full bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:border-[rgb(var(--color-primary))] hover:shadow-[0_4px_16px_rgba(var(--color-primary),0.2)] transition-all active:scale-95 select-none focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
    >
      <div className="h-5 w-1 rounded-full bg-[rgb(var(--color-border-secondary))] group-hover:bg-[rgb(var(--color-primary))] group-active:bg-[rgb(var(--color-primary))] transition-colors" />
    </div></SharedTooltip>
  );
}

export default PanelResizeHandle;

