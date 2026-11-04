"use client";

import { ArrowUp, Mic, MicOff, Sliders } from "lucide-react";
import { ChatSlashMenu } from "./ChatSlashMenu.jsx";

export function ChatComposer({
  variant = "docked",
  draftText,
  onChangeDraft,
  onKeyDown,
  onSend,
  canSend,
  isSending,
  isConfirming,
  isListening,
  isSupported,
  storeId,
  onMicrophoneClick,
  inputRef,
  showSlashMenu,
  slashMatches,
  slashIndex,
  onHoverSlash,
  onSelectSlash,
  hasThread,
  onQuickPrompt,
  isPermissionError,
  t = (key) => key,
}) {
  const isBusy = isSending || isConfirming || !storeId;

  if (variant === "center") {
    return (
      <div className="w-full rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4 shadow-sm transition-all focus-within:border-[rgb(var(--color-primary))] focus-within:ring-2 focus-within:ring-[rgb(var(--color-primary))]/20">
        <textarea
          aria-autocomplete="list"
          aria-label={t("voice.message")}
          className="w-full resize-none !border-none !outline-none !shadow-none bg-transparent p-1 text-[14px] leading-relaxed text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:!border-none focus:!outline-none focus:!ring-0 min-h-[64px]"
          style={{ outline: "none", border: "none", boxShadow: "none" }}
          disabled={isBusy}
          onChange={(e) => onChangeDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about today's sales, stock levels, customer khata, or draft an invoice..."
          rows={2}
          value={draftText}
        />
        <div className="mt-3 flex items-center justify-between border-t border-[rgb(var(--color-border-secondary))] pt-2.5">
          <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-[rgb(var(--color-text-tertiary))] select-none">
            <Sliders className="h-3.5 w-3.5" />
            <span>Type / for quick actions</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label={
                isListening
                  ? t("voice.stopListening")
                  : t("voice.startListening")
              }
              className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "text-[rgb(var(--color-text-tertiary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))]"
              }`}
              disabled={!isSupported || isBusy}
              onClick={onMicrophoneClick}
              type="button"
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
            <button
              aria-label={t("voice.send")}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[rgb(var(--color-primary))] text-white hover:opacity-90 transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 shadow-xs"
              disabled={!canSend}
              onClick={onSend}
              type="button"
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isPermissionError && (
        <p className="mb-2 text-center text-[11px] leading-4 text-[rgb(var(--color-danger))]">
          {t("voice.permissionHelp")}
        </p>
      )}
      {showSlashMenu && (
        <ChatSlashMenu
          activeIndex={slashIndex}
          items={slashMatches}
          onHover={onHoverSlash}
          onSelect={onSelectSlash}
          t={t}
        />
      )}
      {!hasThread && !showSlashMenu && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {[
            {
              label: t("voice.quick.chipRevenue"),
              prompt: t("voice.quick.revenuePrompt"),
            },
            {
              label: t("voice.quick.chipDues"),
              prompt: t("voice.quick.duesPrompt"),
            },
            {
              label: t("voice.quick.chipStock"),
              prompt: t("voice.quick.stockPrompt"),
            },
            {
              label: t("voice.quick.chipInvoice"),
              prompt: t("voice.quick.invoicePrompt"),
            },
          ].map((chip) => (
            <button
              className="cursor-pointer rounded-full border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] px-2.5 py-1 text-[11px] font-medium text-[rgb(var(--color-text-primary))] transition-colors hover:border-[rgb(var(--color-primary))]/45 hover:bg-[rgb(var(--color-bg-tertiary))]"
              key={chip.label}
              onClick={() => onQuickPrompt?.(chip.prompt)}
              type="button"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2 rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-3.5 py-2 shadow-xs transition-all focus-within:border-[rgb(var(--color-primary))] focus-within:ring-2 focus-within:ring-[rgb(var(--color-primary))]/20">
        <button
          aria-label={
            isListening ? t("voice.stopListening") : t("voice.startListening")
          }
          className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all ${
            isListening
              ? "bg-rose-500 text-white animate-pulse"
              : "text-[rgb(var(--color-text-tertiary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))]"
          }`}
          disabled={!isSupported || isBusy}
          onClick={onMicrophoneClick}
          type="button"
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>
        <textarea
          aria-autocomplete="list"
          aria-label={t("voice.message")}
          className="max-h-28 min-h-8 w-full resize-none !border-none !outline-none !shadow-none bg-transparent px-1 py-1.5 text-[13.5px] leading-5 text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:!border-none focus:!outline-none focus:!ring-0"
          style={{ outline: "none", border: "none", boxShadow: "none" }}
          disabled={isBusy}
          onChange={(e) => onChangeDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything... (/ for commands)"
          ref={inputRef}
          rows={1}
          value={draftText}
        />
        <button
          aria-label={t("voice.send")}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[rgb(var(--color-primary))] hover:opacity-90 text-white shadow-xs transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          disabled={!canSend}
          onClick={onSend}
          type="button"
        >
          <ArrowUp className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
      <p className="mt-1.5 px-1 text-center text-[10px] text-[rgb(var(--color-text-tertiary))]">
        {t("voice.sendHint")} · {t("voice.shortcut")}
      </p>
    </>
  );
}

export default ChatComposer;

