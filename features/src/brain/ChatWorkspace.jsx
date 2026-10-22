"use client";

import {
  ArrowUpRight,
  ChevronDown,
  FileText,
  IndianRupee,
  MessageSquare,
  Package,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AiLottieIcon } from "./AiLottieIcon.jsx";
import styles from "./chat-panel.module.css";

function HistoryGroup({
  label,
  items,
  activeId,
  onSelect,
  defaultOpen = true,
}) {
  const hasActive = items?.some((item) => item.id === activeId);
  const [isOpen, setIsOpen] = useState(defaultOpen || hasActive);

  useEffect(() => {
    if (hasActive) {
      setIsOpen(true);
    }
  }, [hasActive]);

  if (!items?.length) return null;

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group/header mb-1 flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-left transition-colors hover:bg-[rgb(var(--color-bg-tertiary))]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-[rgb(var(--color-text-secondary))] transition-transform duration-200 ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--color-text-secondary))] group-hover/header:text-[rgb(var(--color-text-primary))] transition-colors">
            {label}
          </span>
        </div>
        <span className="rounded-full bg-[rgb(var(--color-text-primary)/0.06)] px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--color-text-secondary))]">
          {items.length}
        </span>
      </button>
      {isOpen && (
        <ul className="space-y-0.5 pl-1.5">
          {items.map((session) => {
            const active = session.id === activeId;
            return (
              <li key={session.id}>
                <button
                  className={`group relative flex w-full cursor-pointer items-center rounded-xl px-2.5 py-2 text-left text-[13px] leading-5 transition-colors duration-150 ${
                    active
                      ? "ai-chat-accent bg-[rgb(var(--color-primary))]/15 font-medium"
                      : "text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))]"
                  }`}
                  onClick={() => onSelect(session)}
                  style={
                    active ? { color: "rgb(var(--color-primary))" } : undefined
                  }
                  title={session.title}
                  type="button"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {session.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const QUICK_PROMPTS = [
  {
    key: "revenue",
    icon: IndianRupee,
    titleKey: "voice.quick.revenueTitle",
    hintKey: "voice.quick.revenueHint",
    promptKey: "voice.quick.revenuePrompt",
  },
  {
    key: "dues",
    icon: Users,
    titleKey: "voice.quick.duesTitle",
    hintKey: "voice.quick.duesHint",
    promptKey: "voice.quick.duesPrompt",
  },
  {
    key: "stock",
    icon: Package,
    titleKey: "voice.quick.stockTitle",
    hintKey: "voice.quick.stockHint",
    promptKey: "voice.quick.stockPrompt",
  },
  {
    key: "invoice",
    icon: FileText,
    titleKey: "voice.quick.invoiceTitle",
    hintKey: "voice.quick.invoiceHint",
    promptKey: "voice.quick.invoicePrompt",
  },
];

/**
 * One responsive workspace; columns follow the panel width, including while resizing.
 */
export function ChatWorkspace({
  t = (key) => key,
  greeting,
  storeName: _storeName,
  storeGst: _storeGst,
  historyGrouped = { today: [], yesterday: [], week: [], older: [] },
  historyLoading = false,
  historyError = null,
  historyHasMore = false,
  historyLoadingMore = false,
  onLoadMoreHistory = null,
  activeSessionId,
  onNewChat,
  onSelectSession,
  hasThread,
  emptyHint,
  children,
  composer,
  aiStatus: _aiStatus,
  onQuickPrompt,
}) {
  const hasHistory =
    (historyGrouped?.today?.length || 0) > 0 ||
    (historyGrouped?.yesterday?.length || 0) > 0 ||
    (historyGrouped?.week?.length || 0) > 0 ||
    (historyGrouped?.older?.length || 0) > 0;

  const totalSessions =
    (historyGrouped?.today?.length || 0) +
    (historyGrouped?.yesterday?.length || 0) +
    (historyGrouped?.week?.length || 0) +
    (historyGrouped?.older?.length || 0);

  return (
    <div className={styles.workspace}>
      {/* Left: history */}
      <aside
        className={`${styles.history} min-h-0 flex-col border-r border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]`}
      >
        <div className="shrink-0 p-3 pb-3 border-b border-[rgb(var(--color-border-primary))]/60">
          <button
            className="ai-chat-on-primary group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary))]/90 px-3 py-2.5 text-[13px] font-semibold shadow-sm shadow-[rgb(var(--color-primary))]/20 transition-all duration-200 hover:shadow-md hover:from-[rgb(var(--color-primary))]/95 hover:to-[rgb(var(--color-primary))] active:scale-[0.98]"
            onClick={onNewChat}
            style={{ color: "#fff" }}
            type="button"
          >
            <Plus
              className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
              strokeWidth={2.5}
            />
            <span>{t("voice.newChat")}</span>
          </button>
        </div>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2.5 py-3">
          {historyLoading && !hasHistory ? (
            <div className="flex flex-col items-center justify-center px-3 py-10 text-center">
              <span className="mb-2 h-4 w-4 animate-spin rounded-full border-2 border-[rgb(var(--color-primary))] border-t-transparent" />
              <p className="text-[12px] text-[rgb(var(--color-text-secondary))]">
                {t("voice.history.loading")}
              </p>
            </div>
          ) : historyError && !hasHistory ? (
            <div className="flex flex-col items-center justify-center px-3 py-10 text-center">
              <p className="text-[12px] leading-5 text-[rgb(var(--color-danger))]">
                {t("voice.history.loadFailed")}
              </p>
            </div>
          ) : (
            <>
              <HistoryGroup
                activeId={activeSessionId}
                items={historyGrouped?.today}
                label={t("voice.history.today")}
                onSelect={onSelectSession}
                defaultOpen={true}
              />
              <HistoryGroup
                activeId={activeSessionId}
                items={historyGrouped?.yesterday}
                label={t("voice.history.yesterday")}
                onSelect={onSelectSession}
                defaultOpen={true}
              />
              <HistoryGroup
                activeId={activeSessionId}
                items={historyGrouped?.week}
                label={t("voice.history.week")}
                onSelect={onSelectSession}
                defaultOpen={true}
              />
              <HistoryGroup
                activeId={activeSessionId}
                items={historyGrouped?.older}
                label={t("voice.history.older")}
                onSelect={onSelectSession}
                defaultOpen={false}
              />
              {historyHasMore && (
                <div className="pt-2 pb-1 px-1">
                  <button
                    type="button"
                    disabled={historyLoadingMore}
                    onClick={onLoadMoreHistory}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[rgb(var(--color-border-primary))]/80 bg-[rgb(var(--color-bg-primary))] py-2 text-[12px] font-medium text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] hover:text-[rgb(var(--color-text-primary))] transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {historyLoadingMore ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-[rgb(var(--color-primary))] border-t-transparent" />
                        <span>
                          {t("voice.history.loadingMore", "Loading...")}
                        </span>
                      </>
                    ) : (
                      <span>
                        {t("voice.history.loadMore", "Load older chats")}
                      </span>
                    )}
                  </button>
                </div>
              )}
              {!hasHistory && (
                <div className="flex flex-col items-center justify-center px-3 py-10 text-center">
                  <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-secondary))]">
                    <MessageSquare className="h-4 w-4 opacity-60" />
                  </div>
                  <p className="text-[12px] leading-relaxed text-[rgb(var(--color-text-secondary))]">
                    {t("voice.history.empty")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        {hasHistory && (
          <div className="shrink-0 border-t border-[rgb(var(--color-border-primary))]/50 px-3.5 py-2.5">
            <p className="text-[11px] font-medium text-[rgb(var(--color-text-secondary))]">
              {totalSessions}{" "}
              {totalSessions === 1 ? "conversation" : "conversations"}
            </p>
          </div>
        )}
      </aside>

      {/* Center: chat */}
      <section className="flex min-h-0 min-w-0 flex-col bg-[rgb(var(--color-bg-primary))]">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {!hasThread ? (
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-1 pb-6 pt-6 sm:pt-8 text-center">
              {/* AI Robot Avatar with ambient glow */}
              <div className="relative mb-4 flex items-center justify-center">
                <div
                  className="absolute -inset-2 rounded-full opacity-35 blur-xl transition-all"
                  style={{
                    background:
                      "radial-gradient(circle, rgb(var(--color-primary)) 0%, transparent 70%)",
                  }}
                />
                <div
                  className="ai-chat-on-primary relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[rgb(var(--color-primary))] via-[rgb(var(--color-primary))]/95 to-[rgb(var(--color-primary))]/80 shadow-lg shadow-[rgb(var(--color-primary))]/20 ring-4 ring-[rgb(var(--color-primary))]/10 transition-transform duration-300 hover:scale-105"
                  style={{ color: "#fff" }}
                >
                  <AiLottieIcon size={38} className="h-9 w-9" />
                </div>
              </div>

              {/* AI Badge Pill */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] px-3 py-1 text-[11.5px] font-medium text-[rgb(var(--color-text-secondary))] shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-[rgb(var(--color-primary))]" />
                <span>{t("voice.title")}</span>
              </div>

              {/* Welcome Greeting */}
              <h3 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text-primary))] sm:text-3xl">
                {greeting}
              </h3>
              <p className="mt-2.5 max-w-lg text-[14px] leading-relaxed text-[rgb(var(--color-text-secondary))]">
                {t("voice.welcomeHint")}
              </p>
              {emptyHint && emptyHint !== t("voice.welcomeHint") && (
                <p className="mt-1.5 max-w-md text-[12.5px] leading-5 text-[rgb(var(--color-text-secondary))]">
                  {emptyHint}
                </p>
              )}

              <div className={`${styles.prompts} mt-6 grid w-full gap-3`}>
                {QUICK_PROMPTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      className="group flex cursor-pointer items-start gap-3.5 rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] px-4 py-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[rgb(var(--color-primary))]/45 hover:bg-[rgb(var(--color-bg-tertiary))]"
                      key={item.key}
                      onClick={() => onQuickPrompt(t(item.promptKey))}
                      type="button"
                    >
                      <span
                        className="ai-chat-accent mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 transition-colors group-hover:bg-[rgb(var(--color-primary))]/20"
                        style={{ color: "rgb(var(--color-primary))" }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1 pt-0.5">
                        <span className="block text-[14px] font-semibold text-[rgb(var(--color-text-primary))]">
                          {t(item.titleKey)}
                        </span>
                        <span className="mt-1 block text-[12.5px] leading-4 text-[rgb(var(--color-text-secondary))]">
                          {t(item.hintKey)}
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[rgb(var(--color-text-secondary))] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl space-y-3.5">
              {children}
            </div>
          )}
        </div>
        <div className="shrink-0 border-t border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-4 py-3.5">
          <div className="mx-auto w-full max-w-3xl">{composer}</div>
        </div>
      </section>
    </div>
  );
}

export default ChatWorkspace;
