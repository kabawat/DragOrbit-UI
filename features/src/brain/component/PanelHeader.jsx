"use client";

import { Tooltip as SharedTooltip } from "@dragorbit/ui";
import { ArrowLeft, Maximize2, Minimize2, RotateCcw, X } from "lucide-react";

export function PanelHeader({
  onClose,
  hasThread,
  onNewChat,
  isExpanded,
  onToggleMaximize,
  t = (key) => key,
}) {
  return (
    <header className="flex shrink-0 select-none items-center justify-between border-b border-[rgb(var(--color-border-primary))] px-4 py-3 bg-[rgb(var(--color-bg-primary))]">
      <SharedTooltip content={"Back / Close"}><button aria-label={"Back / Close"}
        onClick={onClose}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors"

        type="button"
      >
        <ArrowLeft className="h-4 w-4 stroke-[2]" />
      </button></SharedTooltip>

      <div className="flex shrink-0 items-center gap-1">
        {hasThread && (
          <SharedTooltip content={t("voice.clear")}><button
            aria-label={t("voice.clear")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[rgb(var(--color-text-tertiary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors"
            onClick={onNewChat}

            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button></SharedTooltip>
        )}
        <SharedTooltip content={isExpanded ? "Restore to drawer" : "Maximize to full screen"}><button
          aria-label={
            isExpanded ? "Restore to drawer" : "Maximize to full screen"
          }
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[rgb(var(--color-text-tertiary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors"
          onClick={onToggleMaximize}

          type="button"
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button></SharedTooltip>
        <button
          aria-label={t("common.close")}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[rgb(var(--color-text-tertiary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4 stroke-[2]" />
        </button>
      </div>
    </header>
  );
}

export default PanelHeader;
