"use client";

import {
  ArrowUpRight,
  ChevronDown,
  FileText,
  IndianRupee,
  MessageSquare,
  Package,
  Plus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AiLottieIcon } from "./AiLottieIcon.jsx";
import { DragBizzLogoIcon } from "./DragBizzLogoIcon.jsx";
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
        className="brain-history-header group/header mb-1 flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-left transition-colors hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"
              }`}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover/header:text-slate-800 transition-colors">
            {label}
          </span>
        </div>
        <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
          {items.length}
        </span>
      </button>
      {isOpen && (
        <ul className="space-y-0.5 pl-1">
          {items.map((session) => {
            const active = session.id === activeId;
            return (
              <li key={session.id}>
                <button
                  className={`brain-history-item group relative flex w-full cursor-pointer items-center rounded-xl px-2.5 py-2 text-left text-[13px] leading-5 transition-all duration-150 ${active
                      ? "active bg-[#eaf4fb] dark:bg-[#187CC5]/20 text-[#187CC5] dark:text-[#38bdf8] font-semibold border border-[#187CC5]/30 shadow-2xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  onClick={() => onSelect(session)}
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
  userName = "",
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
  isExpanded = false,
  showHistory,
}) {
  const shouldShowHistory = showHistory !== undefined ? showHistory : isExpanded;

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
    <div className="flex h-full w-full min-h-0 flex-1 overflow-hidden">
      {/* Left History Sidebar (Visible when >= 50% screen width or maximized) */}
      {shouldShowHistory && (
        <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50/70 h-full animate-[chatFadeUp_0.2s_ease-out]">
          <div className="shrink-0 p-3.5 border-b border-slate-200">
            <button
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#187CC5] hover:bg-[#13649f] text-white px-3 py-2.5 text-[13px] font-semibold transition-all shadow-xs"
              onClick={onNewChat}
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
            {!hasHistory && !historyLoading && (
              <div className="flex flex-col items-center justify-center py-10 px-3 text-center">
                <MessageSquare className="h-6 w-6 text-slate-300 mb-2" />
                <p className="text-[12px] font-medium text-slate-500">No chat history yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Your conversations will show up here</p>
              </div>
            )}
          </div>
          {hasHistory && (
            <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 px-3.5 py-2.5 bg-white/70 dark:bg-slate-900/70">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {totalSessions} {totalSessions === 1 ? "conversation" : "conversations"}
              </p>
            </div>
          )}
        </aside>
      )}

      {/* Main Content Area */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white dark:bg-slate-950 h-full">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {!hasThread ? (
            <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center pt-8 pb-10 text-center space-y-6">
              {/* Centered DragBizz Logo Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4fb] dark:bg-[#187CC5]/20 text-[#187CC5] dark:text-[#38bdf8] border border-[#187CC5]/25 shadow-xs">
                <DragBizzLogoIcon className="h-6 w-6" color="currentColor" />
              </div>

              {/* Heading & Subtitle */}
              <div className="space-y-1.5">
                <h3 className="brain-greeting-heading text-[20px] font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Hi, {userName || t("voice.userFallback", "Store Owner")} 👋 How can DragAI help you?
                </h3>
                <p className="brain-greeting-sub text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Ready to help you analyze sales, manage inventory, track khata and grow your business!
                </p>
              </div>

              {/* Big Centered Composer Card */}
              <div className="w-full text-left">
                {centerComposer || composer}
              </div>

              {/* Prompt Suggestions Header */}
              <div className="flex w-full items-center justify-between px-1 text-[12px] text-slate-400">
                <span className="italic">Try one of these:</span>
                <button
                  type="button"
                  onClick={() => onQuickPrompt?.("Show today's sales and profit")}
                  className="flex items-center gap-1 text-[#187CC5] hover:underline font-medium cursor-pointer"
                >
                  <span>Browse all prompts</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* 2x2 Grid of Prompt Cards */}
              <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <button
                  onClick={() => onQuickPrompt?.("Show today's sales and profit")}
                  type="button"
                  className="brain-prompt-card group flex flex-col items-start gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3.5 shadow-2xs hover:border-[#187CC5] hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <IndianRupee className="h-4 w-4" />
                      <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                        Today&apos;s sales & profit
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#187CC5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug">
                    Check today&apos;s revenue, profit margin, and top selling products
                  </span>
                </button>

                <button
                  onClick={() => onQuickPrompt?.("Check low stock and inventory alerts")}
                  type="button"
                  className="brain-prompt-card group flex flex-col items-start gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3.5 shadow-2xs hover:border-[#187CC5] hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Package className="h-4 w-4" />
                      <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                        Stock & low inventory
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#187CC5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug">
                    Find products with low stock, zero inventory, or reorder alerts
                  </span>
                </button>

                <button
                  onClick={() => onQuickPrompt?.("Show customer dues and credit ledger")}
                  type="button"
                  className="brain-prompt-card group flex flex-col items-start gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3.5 shadow-2xs hover:border-[#187CC5] hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-[#187CC5] dark:text-[#38bdf8]">
                      <Users className="h-4 w-4" />
                      <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                        Customer khata & dues
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#187CC5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug">
                    Check outstanding credit balances, pending dues & ledger summary
                  </span>
                </button>

                <button
                  onClick={() => onQuickPrompt?.("Draft a sales invoice or bill")}
                  type="button"
                  className="brain-prompt-card group flex flex-col items-start gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3.5 shadow-2xs hover:border-[#187CC5] hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-[#187CC5] dark:text-[#38bdf8]">
                      <DragBizzLogoIcon className="h-4 w-4" color="currentColor" />
                      <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                        Draft an invoice or bill
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#187CC5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug">
                    Create a quick sales invoice, GST bill, or customer receipt
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
          <div className="brain-docked-composer-wrap shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3">
            <div className="mx-auto w-full max-w-2xl">{composer}</div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ChatWorkspace;
