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
  userName = "Vikram Jangid",
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
  emptyHint: _emptyHint,
  children,
  composer,
  centerComposer,
  aiStatus: _aiStatus,
  onQuickPrompt,
  showHistory = false,
  setShowHistory = () => {},
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
      {/* Slide-over history when toggled */}
      {showHistory && (
        <div className="absolute inset-0 z-30 flex bg-black/20 backdrop-blur-[1px]">
          <aside className="flex w-72 flex-col bg-white dark:bg-[#121626] border-r border-slate-200 dark:border-slate-800 shadow-xl h-full animate-[drawerSlideIn_0.2s_ease-out]">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Chat History
              </span>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-xs text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                Close
              </button>
            </div>
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <button
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-[13px] font-semibold transition-all shadow-xs"
                onClick={() => {
                  onNewChat?.();
                  setShowHistory(false);
                }}
                type="button"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                <span>{t("voice.newChat")}</span>
              </button>
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2.5 py-3">
              <HistoryGroup
                activeId={activeSessionId}
                items={historyGrouped?.today}
                label={t("voice.history.today")}
                onSelect={(s) => {
                  onSelectSession(s);
                  setShowHistory(false);
                }}
                defaultOpen={true}
              />
              <HistoryGroup
                activeId={activeSessionId}
                items={historyGrouped?.yesterday}
                label={t("voice.history.yesterday")}
                onSelect={(s) => {
                  onSelectSession(s);
                  setShowHistory(false);
                }}
                defaultOpen={true}
              />
              <HistoryGroup
                activeId={activeSessionId}
                items={historyGrouped?.week}
                label={t("voice.history.week")}
                onSelect={(s) => {
                  onSelectSession(s);
                  setShowHistory(false);
                }}
                defaultOpen={true}
              />
              <HistoryGroup
                activeId={activeSessionId}
                items={historyGrouped?.older}
                label={t("voice.history.older")}
                onSelect={(s) => {
                  onSelectSession(s);
                  setShowHistory(false);
                }}
                defaultOpen={false}
              />
            </div>
          </aside>
          <div
            className="flex-1"
            onClick={() => setShowHistory(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Main Content Area */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {!hasThread ? (
            <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center pt-8 pb-10 text-center space-y-6">
              {/* Centered Sparkle Icon (Screenshot 2 style) */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
                <Sparkles className="h-6 w-6 stroke-[2.2]" />
              </div>

              {/* Heading & Subtitle */}
              <div className="space-y-1.5">
                <h3 className="text-[20px] font-bold tracking-tight text-slate-900">
                  Hi, {userName || "Vikram Jangid"} 👋 How can OpsAI help you?
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-500 max-w-md mx-auto">
                  Ready to help you with anything from finding a bug to solving issues. Let&apos;s get started!
                </p>
              </div>

              {/* Big Centered Composer Card (Screenshot 2) */}
              <div className="w-full text-left">
                {centerComposer || composer}
              </div>

              {/* Prompt Suggestions Header */}
              <div className="flex w-full items-center justify-between px-1 text-[12px] text-slate-400">
                <span className="italic">Try one of these:</span>
                <button
                  type="button"
                  onClick={() => onQuickPrompt?.("Show today's sales and profit")}
                  className="flex items-center gap-1 text-indigo-600 hover:underline font-medium cursor-pointer"
                >
                  <span>Browse all prompts</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* 2x2 Grid of Prompt Cards (Screenshot 2 exact style) */}
              <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <button
                  onClick={() => onQuickPrompt?.("Show today's sales and profit")}
                  type="button"
                  className="group flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-500">
                      <FileText className="h-4 w-4" />
                      <span className="text-[13px] font-semibold text-slate-800">
                        Investigate logs
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-[11.5px] text-slate-500 leading-snug">
                    Identify error logs impacting service performance
                  </span>
                </button>

                <button
                  onClick={() => onQuickPrompt?.("Check low stock and inventory alerts")}
                  type="button"
                  className="group flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-500">
                      <Package className="h-4 w-4" />
                      <span className="text-[13px] font-semibold text-slate-800">
                        Find slow endpoint
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-[11.5px] text-slate-500 leading-snug">
                    Show me list of endpoints which has high latency
                  </span>
                </button>

                <button
                  onClick={() => onQuickPrompt?.("Show customer dues and credit ledger")}
                  type="button"
                  className="group flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-500">
                      <Users className="h-4 w-4" />
                      <span className="text-[13px] font-semibold text-slate-800">
                        Build a dashboard
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-[11.5px] text-slate-500 leading-snug">
                    Create dashboard for key Kubernetes metrics
                  </span>
                </button>

                <button
                  onClick={() => onQuickPrompt?.("Draft a sales invoice or bill")}
                  type="button"
                  className="group flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-500">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-[13px] font-semibold text-slate-800">
                        Create an alert
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-[11.5px] text-slate-500 leading-snug">
                    Create alert to monitor Kubernetes cluster health
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-2xl space-y-3.5 pt-2">
              {children}
            </div>
          )}
        </div>

        {/* Docked bottom composer only when conversation is active */}
        {hasThread && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
            <div className="mx-auto w-full max-w-2xl">{composer}</div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ChatWorkspace;
