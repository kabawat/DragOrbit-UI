"use client";

import { IconButton } from "@dragorbit/ui";

import {
  ArrowLeft,
  ArrowUp,
  Check,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  RotateCcw,
  Sliders,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AiChatPresentation } from "./AiChatPresentation.jsx";
import { AiLottieIcon } from "./AiLottieIcon.jsx";
import ChatAssistantMessage from "./ChatAssistantMessage.jsx";
import ChatCustomerResultCard, {
  collectCustomerWrites,
  stripCustomerOpenLinks,
} from "./ChatCustomerResultCard.jsx";
import ChatSlashMenu from "./ChatSlashMenu.jsx";
import ChatWorkspace from "./ChatWorkspace.jsx";
import DragBizzLogoIcon from "./DragBizzLogoIcon.jsx";
import "./brain.css";
import { titleFromUserText } from "./chatHistory.js";
import { useHotkeys } from "./useHotkeys.js";
import { VOICE_CAPTURE_ERRORS } from "./useVoiceCapture.js";
import { matchSlashCommands } from "./voiceSlashCommands.js";

// Tool-call trace ("search_customer: done") is a debug aid — dev/test only.

function greetingForLocale(locale, name, t) {
  const hour = new Date().getHours();
  const who = name ? `, ${name}` : "";
  if (locale === "hi" || locale === "hi-en") {
    if (hour < 12) return `${t("voice.greet.morning")}${who}`;
    if (hour < 17) return `${t("voice.greet.afternoon")}${who}`;
    return `${t("voice.greet.evening")}${who}`;
  }
  if (hour < 12) return `${t("voice.greet.morning")}${who}`;
  if (hour < 17) return `${t("voice.greet.afternoon")}${who}`;
  return `${t("voice.greet.evening")}${who}`;
}

const TOOL_TITLE_MAP = {
  // Sales & Invoices
  today_sale: "Fetching today's sales & revenue records…",
  sales_summary: "Fetching sales summary & performance…",
  list_invoices: "Fetching sales & invoice records…",
  get_invoice_detail: "Fetching invoice details…",
  sales_pareto: "Calculating sales Pareto & profit analysis…",
  dead_stock: "Analyzing slow-moving & dead stock…",
  sales_order_summary: "Fetching sales orders summary…",
  list_sales_orders: "Fetching sales order records…",
  get_sales_order_detail: "Fetching sales order details…",
  create_invoice_draft: "Preparing invoice draft…",
  release_invoice: "Finalizing and releasing invoice…",

  // Inventory & Stock
  stock_summary: "Checking current stock & inventory levels…",
  search_product: "Searching product catalog…",
  list_products: "Fetching product details & catalog…",
  get_product_detail: "Fetching product details…",
  low_stock_alerts: "Checking low stock alerts…",
  stock_movement: "Checking stock movement history…",
  category_list: "Fetching product categories…",
  add_stock: "Preparing stock update…",
  create_product: "Preparing product details…",
  update_product: "Updating product details…",

  // Customers & Khata
  customer_summary: "Fetching customer accounts & dues…",
  search_customer: "Searching customer directory…",
  list_customer_accounts: "Fetching customer account details…",
  get_customer_ledger: "Preparing customer ledger & statement…",
  customer_dossier: "Compiling customer profile & history…",
  overdue_customers: "Checking overdue customer balances…",
  payment_reminders: "Checking payment reminders…",
  customer_stats: "Analyzing customer statistics…",
  create_customer: "Preparing customer details…",
  ledger_debit: "Preparing customer debit entry…",
  ledger_credit: "Preparing customer payment credit…",

  // Suppliers & Procurement
  supplier_summary: "Checking supplier and purchase records…",
  search_supplier: "Searching supplier directory…",
  list_suppliers: "Fetching supplier list…",
  get_supplier_detail: "Fetching supplier details…",
  purchase_order_summary: "Checking purchase order summary…",
  list_purchase_orders: "Fetching purchase order records…",
  get_purchase_order_detail: "Fetching purchase order details…",
  supplier_bills: "Checking supplier bills & dues…",
  create_supplier: "Preparing supplier details…",
  create_purchase_order: "Preparing purchase order…",

  // Expenses & Finance
  expense_summary: "Fetching expense records…",
  list_expenses: "Fetching expense records…",
  cashbook_summary: "Checking cashbook & cashflow records…",
  gst_summary: "Calculating GST & tax summary…",
  create_expense: "Preparing expense details…",
  update_expense: "Updating expense details…",

  // General & Analytics
  store_brief: "Fetching store overview & performance…",
  detailed_analytics: "Compiling store analytics & metrics…",
  list_staff: "Fetching staff directory…",
  export_report: "Preparing report export…",
};

function formatToolTitle(toolName) {
  if (!toolName) return "Querying store database…";
  if (TOOL_TITLE_MAP[toolName]) return TOOL_TITLE_MAP[toolName];
  return `Processing ${String(toolName).replace(/_/g, " ")}…`;
}

export function DragAiAvatar({ isThinking = false, size = "md" }) {
  const isSm = size === "sm";
  return (
    <div
      className={`relative flex ${
        isSm ? "h-6 w-6" : "h-7 w-7"
      } shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#187CC5] via-[#208ddb] to-[#4bb2f9] text-white shadow-[0_2px_8px_rgba(24,124,197,0.35)] ring-2 ring-[#187CC5]/25 select-none`}
    >
      <DragBizzLogoIcon
        color="white"
        className={`${isSm ? "h-3.5 w-3.5" : "h-4 w-4"} drop-shadow-xs ${
          isThinking ? "animate-pulse" : ""
        }`}
      />
    </div>
  );
}

function AgentActivityCard({ activeTool, progress, isConfirming }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let statusText = "Thinking…";
  let isDataOp = false;

  if (isConfirming) {
    statusText = "Executing approved action and updating store…";
    isDataOp = true;
  } else if (progress?.label) {
    statusText = progress.label;
    isDataOp = progress.stage === "tool_executing";
  } else if (activeTool) {
    statusText = formatToolTitle(activeTool);
    isDataOp = true;
  } else if (elapsed >= 1) {
    statusText = "Understanding your request…";
    isDataOp = false;
  }

  return (
    <div className="flex animate-[chatFadeUp_0.25s_ease-out_both] flex-col items-start gap-2.5 w-full my-2">
      <div className="flex items-center gap-2 select-none">
        <DragAiAvatar isThinking={true} />
        <span className="text-[13px] font-bold tracking-tight text-[#187CC5]">
          DragAI
        </span>
        <span className="text-[11px] font-medium text-slate-400 ml-0.5">
          {elapsed}s
        </span>
      </div>

      <div className="w-full">
        <div className="brain-tool-card flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-2xs transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eaf4fb] dark:bg-[#187CC5]/20 text-[#187CC5] dark:text-[#38bdf8]">
              {isDataOp ? (
                <Sliders className="h-4 w-4" />
              ) : (
                <DragBizzLogoIcon className="h-4 w-4" color="currentColor" />
              )}
            </div>
            <span className="truncate text-[13.5px] font-medium text-slate-800 dark:text-slate-100">
              {statusText}
            </span>
          </div>
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <span className="h-5 w-5 rounded-full border-2 border-[#187CC5] border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatConfirmSummary(pending, t) {
  const summary = pending?.summary || {};
  const parts = [];

  if (
    pending?.type === "create_expense" ||
    summary.action === "create_expense"
  ) {
    const amount = summary.amount ?? summary.total;
    if (
      typeof amount === "number" ||
      (typeof amount === "string" && amount.trim())
    ) {
      parts.push(`₹${amount}`);
    }
    if (summary.title) {
      parts.push(String(summary.title));
    }
    if (summary.categoryLabel) {
      parts.push(String(summary.categoryLabel));
    } else if (summary.category) {
      parts.push(String(summary.category));
    }
    return parts.length > 0
      ? parts.join(" · ")
      : t("voice.confirm.expense") || "Expense";
  }

  if (
    pending?.type === "create_purchase_order" ||
    summary.action === "create_purchase_order"
  ) {
    if (summary.supplierName) {
      parts.push(String(summary.supplierName));
    }
    if (summary.itemCount) {
      parts.push(`${summary.itemCount} items`);
    }
    if (summary.totalQuantity) {
      parts.push(`${summary.totalQuantity} qty`);
    }
    return parts.length > 0 ? parts.join(" · ") : "Purchase Order";
  }

  if (pending?.type === "add_stock" || summary.action === "add_stock") {
    if (summary.productName || summary.title) {
      parts.push(String(summary.productName || summary.title));
    }
    if (summary.quantity) {
      parts.push(`+${summary.quantity}`);
    }
    return parts.length > 0
      ? parts.join(" · ")
      : t("voice.confirm.promptStock") || "Add stock";
  }

  if (
    summary.action === "payment" ||
    pending?.type === "ledger_credit" ||
    pending?.type === "record_customer_payment"
  ) {
    parts.push(t("voice.credit.label") || "Payment");
    const amount = summary.amount ?? summary.total;
    if (
      typeof amount === "number" ||
      (typeof amount === "string" && amount.trim())
    ) {
      parts.push(`₹${amount}`);
    }
    if (summary.customerName) {
      parts.push(String(summary.customerName));
    }
    return parts.length > 0 ? parts.join(" · ") : "Payment";
  }

  if (summary.action === "debit" || pending?.type === "ledger_debit") {
    parts.push(t("voice.debit.label") || "Debit");
    const amount = summary.amount ?? summary.total;
    if (
      typeof amount === "number" ||
      (typeof amount === "string" && amount.trim())
    ) {
      parts.push(`₹${amount}`);
    }
    if (summary.customerName) {
      parts.push(String(summary.customerName));
    }
    return parts.length > 0 ? parts.join(" · ") : "Debit";
  }

  if (typeof summary.total === "number") {
    parts.push(`₹${summary.total}`);
  }
  if (summary.invoiceNumber) {
    parts.push(String(summary.invoiceNumber));
  }
  return parts.length > 0
    ? parts.join(" · ")
    : t("voice.confirm.defaultSummary");
}

function ExpenseConfirmCard({
  pending,
  t,
  isConfirming,
  isSending,
  confirmPending,
  rejectPending,
}) {
  const initialStatus = pending?.summary?.status || "PAID";
  const [status, setStatus] = useState(initialStatus);

  if (pending?.status === "CANCELLED") {
    return (
      <div className="mt-3 space-y-1.5 border-t border-[rgb(var(--color-border-primary))]/50 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[rgb(var(--color-text-secondary))] line-through">
            {formatConfirmSummary(pending, t)}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/25">
            Canceled
          </span>
        </div>
        <p className="text-[11px] text-[rgb(var(--color-text-secondary))]">
          Expense record cancel ho gaya hai. Aap nayi details de sakte hain.
        </p>
      </div>
    );
  }

  const promptLabel =
    pending?.summary?.prompt ||
    t("voice.confirm.promptExpense") ||
    "Record this expense";

  return (
    <div className="mt-3 space-y-2.5 border-t border-[rgb(var(--color-border-primary))]/50 pt-3">
      <div className="flex items-center justify-between pb-1.5 border-b border-[rgb(var(--color-border-primary))]/40">
        <span className="text-[11px] font-medium text-[rgb(var(--color-text-secondary))]">
          Status:
        </span>
        <div className="inline-flex rounded-lg bg-[rgb(var(--color-bg-primary))] p-0.5 border border-[rgb(var(--color-border-primary))]/80 text-[11px]">
          {[
            {
              id: "PENDING",
              label: "Pending",
              activeBg: "bg-amber-500 text-white",
            },
            {
              id: "PAID",
              label: "Paid",
              activeBg: "bg-emerald-600 text-white",
            },
            {
              id: "OVERDUE",
              label: "Overdue",
              activeBg: "bg-rose-600 text-white",
            },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={isConfirming || isSending}
              onClick={() => setStatus(opt.id)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${status === opt.id
                ? `${opt.activeBg} shadow-xs`
                : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[12px] leading-4 text-[rgb(var(--color-text-secondary))]">
        {promptLabel}
        {": "}
        <span className="font-medium text-[rgb(var(--color-text-primary))]">
          {formatConfirmSummary(pending, t)}
        </span>
      </p>

      <div className="flex gap-2">
        <button
          className="ai-chat-on-primary cursor-pointer rounded-lg bg-[rgb(var(--color-primary))] px-3 py-1.5 text-[12px] font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isConfirming || isSending}
          onClick={() => confirmPending(pending, { status })}
          style={{ color: "#fff" }}
          type="button"
        >
          {t("voice.confirm.approve")}
        </button>
        <button
          className="cursor-pointer rounded-lg border border-[rgb(var(--color-border-primary))] px-3 py-1.5 text-[12px] font-medium text-[rgb(var(--color-text-primary))] transition-colors hover:bg-[rgb(var(--color-bg-primary))] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isConfirming || isSending}
          onClick={() => rejectPending(pending)}
          type="button"
        >
          {t("voice.confirm.reject")}
        </button>
      </div>
    </div>
  );
}

function AssistantMessageBubble({
  item,
  DownloadButtons,
  showToolTrace: _showToolTrace,
  storeId,
  t,
  isSending,
  isConfirming,
  confirmPending,
  rejectPending,
}) {
  const customerWrites = collectCustomerWrites(item.toolResults);
  const assistantText =
    customerWrites.length > 0
      ? stripCustomerOpenLinks(item.content)
      : item.content;

  return (
    <div className="flex animate-[chatFadeUp_0.25s_ease-out_both] flex-col items-start gap-2 w-full my-2">
      {/* Brand Header */}
      <div className="flex items-center gap-2 select-none">
        <DragAiAvatar />
        <span className="text-[13px] font-bold tracking-tight text-[#187CC5]">
          DragAI
        </span>
      </div>

      {/* Executed Tool Steps (OpsAI style rows with green checkmarks) */}
      {Array.isArray(item.toolResults) && item.toolResults.length > 0 && (
        <div className="w-full space-y-2 my-1.5">
          {item.toolResults.map((tool, index) => (
            <div
              key={`${tool?.tool || "tool"}-${index}`}
              className="brain-tool-card flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-2xs transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eaf4fb] dark:bg-[#187CC5]/20 text-[#187CC5] dark:text-[#38bdf8]">
                  <Sliders className="h-4 w-4" />
                </div>
                <span className="truncate text-[13.5px] font-medium text-slate-800 dark:text-slate-100">
                  {formatToolTitle(tool?.tool)}
                </span>
              </div>
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clean response layout */}
      <div className="w-full text-[13.5px] leading-relaxed text-[rgb(var(--color-text-primary))]">
        <ChatAssistantMessage message={assistantText} />
        {item.streaming && (
          <span className="inline-block h-3.5 w-1.5 ml-1 translate-y-0.5 rounded-xs bg-[#187CC5] animate-pulse" />
        )}
        <ChatCustomerResultCard toolResults={item.toolResults} />
        <DownloadButtons storeId={storeId} toolResults={item.toolResults} />
        {item.pendingConfirmation &&
          (() => {
            const pending = item.pendingConfirmation;
            const actionType = pending?.type || pending?.summary?.action;

            if (actionType === "create_expense") {
              return (
                <ExpenseConfirmCard
                  pending={pending}
                  t={t}
                  isConfirming={isConfirming}
                  isSending={isSending}
                  confirmPending={confirmPending}
                  rejectPending={rejectPending}
                />
              );
            }

            if (pending?.status === "CANCELLED") {
              return (
                <div className="mt-3 space-y-1.5 border-t border-[rgb(var(--color-border-primary))]/50 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[rgb(var(--color-text-secondary))] line-through">
                      {formatConfirmSummary(pending, t)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/25">
                      Canceled
                    </span>
                  </div>
                </div>
              );
            }

            const promptLabel =
              pending?.summary?.prompt ||
              (actionType === "add_stock"
                ? t("voice.confirm.promptStock") || "Add stock"
                : actionType === "create_purchase_order"
                  ? "Create purchase order"
                  : actionType === "ledger_credit" ||
                    actionType === "payment" ||
                    actionType === "record_customer_payment"
                    ? t("voice.confirm.promptCredit") ||
                    "Record customer payment"
                    : actionType === "ledger_debit" || actionType === "debit"
                      ? t("voice.confirm.promptDebit") ||
                      "Record customer debit"
                      : t("voice.confirm.promptInvoice") ||
                      t("voice.confirm.prompt"));

            return (
              <div className="mt-3 space-y-2 border-t border-[rgb(var(--color-border-primary))]/50 pt-3">
                <p className="text-[12px] leading-4 text-[rgb(var(--color-text-secondary))]">
                  {promptLabel}
                  {": "}
                  <span className="font-medium text-[rgb(var(--color-text-primary))]">
                    {formatConfirmSummary(pending, t)}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    className="ai-chat-on-primary cursor-pointer rounded-lg bg-[rgb(var(--color-primary))] px-3 py-1.5 text-[12px] font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isConfirming || isSending}
                    onClick={() => confirmPending(pending)}
                    style={{ color: "#fff" }}
                    type="button"
                  >
                    {t("voice.confirm.approve")}
                  </button>
                  <button
                    className="cursor-pointer rounded-lg border border-[rgb(var(--color-border-primary))] px-3 py-1.5 text-[12px] font-medium text-[rgb(var(--color-text-primary))] transition-colors hover:bg-[rgb(var(--color-bg-primary))] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isConfirming || isSending}
                    onClick={() => rejectPending(pending)}
                    type="button"
                  >
                    {t("voice.confirm.reject")}
                  </button>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
}

const NoDownloads = () => null;

const MIN_PANEL_WIDTH = 480;

function getSidebarRightBoundary() {
  if (typeof window === "undefined") return 256;
  try {
    const aside = document.querySelector(
      'aside[aria-label*="sidebar" i], aside.relative, aside'
    );
    if (aside) {
      const rect = aside.getBoundingClientRect();
      if (rect.left < 50 && rect.right > 0 && rect.right < window.innerWidth * 0.45) {
        return Math.round(rect.right);
      }
    }
  } catch (_e) {
    // fallback below
  }
  return window.innerWidth > 1024 ? 256 : 0;
}

function getMaxPanelWidth() {
  if (typeof window === "undefined") return 980;
  const sidebarRight = getSidebarRightBoundary();
  return Math.max(window.innerWidth - sidebarRight, MIN_PANEL_WIDTH);
}

function getDefaultPanelWidth() {
  if (typeof window === "undefined") return MIN_PANEL_WIDTH;
  return Math.min(MIN_PANEL_WIDTH, window.innerWidth);
}

const BrainPanel = ({
  t = (key) => key,
  locale = "en",
  selectedStore,
  user,
  chat = {},
  history = {},
  voice = {},
  LinkComponent,
  DownloadButtons = NoDownloads,
  showToolTrace = false,
  triggerButton = null,
  customTrigger = null,
  triggerClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [panelWidth, setPanelWidth] = useState(MIN_PANEL_WIDTH);
  const [maxPanelWidth, setMaxPanelWidth] = useState(1200);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef(null);
  const dragStartRef = useRef({ startX: 0, startWidth: MIN_PANEL_WIDTH, hasDragged: false });
  const [draftText, setDraftText] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [portalReady, setPortalReady] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionCreatedAtRef = useRef(Date.now());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        const maxW = getMaxPanelWidth();
        setMaxPanelWidth(maxW);
        setPanelWidth((curr) => Math.min(Math.max(curr, MIN_PANEL_WIDTH), maxW));
      };
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasAnimatedIn(false);
      setPanelWidth(getDefaultPanelWidth());
      setIsExpanded(false);
      setMaxPanelWidth(getMaxPanelWidth());
      const timer = setTimeout(() => {
        setHasAnimatedIn(true);
      }, 350);
      return () => clearTimeout(timer);
    }
    setHasAnimatedIn(false);
  }, [isOpen]);

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    abortListening,
    resetTranscript,
  } = voice;

  const {
    messages,
    isSending,
    isConfirming,
    activeTool,
    progress,
    chatError,
    sendChat,
    confirmPending,
    rejectPending,
    resetChat,
    loadChat,
    storeId,
    sessionId,
  } = chat;

  const {
    grouped,
    loading: historyLoading,
    error: historyError,
    refresh: refreshHistory,
    getSession,
    optimisticTouch,
    hasMore: historyHasMore,
    loadingMore: historyLoadingMore,
    loadMore: historyLoadMore,
  } = history;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    setActiveSessionId(sessionId);
  }, [sessionId]);

  // Optimistic sidebar row after first user message; server persists on reply.
  useEffect(() => {
    if (!storeId || !activeSessionId || messages.length === 0) return;
    if (isSending || isConfirming) return;
    const firstUser = messages.find(
      (item) => item?.role === "user" && typeof item.content === "string"
    );
    if (!firstUser?.content) return;
    optimisticTouch({
      id: activeSessionId,
      title: titleFromUserText(firstUser.content),
      createdAt: sessionCreatedAtRef.current,
    });
  }, [
    messages,
    storeId,
    activeSessionId,
    optimisticTouch,
    isSending,
    isConfirming,
  ]);

  // After an active user turn finishes (assistant reply completed), refresh list from server
  const wasSendingRef = useRef(false);
  useEffect(() => {
    if (isSending || isConfirming) {
      wasSendingRef.current = true;
      return;
    }
    if (wasSendingRef.current) {
      wasSendingRef.current = false;
      if (storeId) {
        void refreshHistory();
      }
    }
  }, [isSending, isConfirming, storeId, refreshHistory]);

  useEffect(() => {
    if (!isListening && !interimTranscript) return;
    const live = [transcript, interimTranscript]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (live) setDraftText(live);
  }, [transcript, interimTranscript, isListening]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Scroll when streamed messages or request status change.
  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages, isSending, isConfirming, chatError]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Refocus the composer after changing window mode.
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen, isExpanded]);

  const closePanel = useCallback(() => {
    abortListening();
    setIsExpanded(false);
    setIsOpen(false);
  }, [abortListening]);

  const openPanel = useCallback(() => {
    setIsExpanded(false);
    setPanelWidth(getDefaultPanelWidth());
    setMaxPanelWidth(getMaxPanelWidth());
    setIsOpen(true);
  }, []);

  const expandPanel = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapsePanel = useCallback(() => {
    setIsExpanded(false);
    setPanelWidth(getDefaultPanelWidth());
  }, []);

  const toggleMaximize = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (!next) {
        setPanelWidth(getDefaultPanelWidth());
      }
      return next;
    });
  }, []);

  const handlePillMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const currentWidth = panelRef.current?.offsetWidth || panelWidth;
    const maxAllowed = getMaxPanelWidth();
    setMaxPanelWidth(maxAllowed);
    dragStartRef.current = { startX, startWidth: currentWidth, hasDragged: false };
    setIsDragging(true);

    const onMouseMove = (moveEvent) => {
      const delta = dragStartRef.current.startX - moveEvent.clientX;
      if (Math.abs(delta) > 3) {
        dragStartRef.current.hasDragged = true;
        if (isExpanded) {
          setIsExpanded(false);
        }
      }
      const newWidth = Math.min(
        Math.max(dragStartRef.current.startWidth + delta, MIN_PANEL_WIDTH),
        maxAllowed
      );
      setPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setIsDragging(false);
      if (!dragStartRef.current.hasDragged) {
        toggleMaximize();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [panelWidth, isExpanded, toggleMaximize]);

  const handlePillTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    if (!touch) return;
    const startX = touch.clientX;
    const currentWidth = panelRef.current?.offsetWidth || panelWidth;
    const maxAllowed = getMaxPanelWidth();
    setMaxPanelWidth(maxAllowed);
    dragStartRef.current = { startX, startWidth: currentWidth, hasDragged: false };
    setIsDragging(true);

    const onTouchMove = (moveEvent) => {
      const moveTouch = moveEvent.touches[0];
      if (!moveTouch) return;
      const delta = dragStartRef.current.startX - moveTouch.clientX;
      if (Math.abs(delta) > 3) {
        dragStartRef.current.hasDragged = true;
        if (isExpanded) {
          setIsExpanded(false);
        }
      }
      const newWidth = Math.min(
        Math.max(dragStartRef.current.startWidth + delta, MIN_PANEL_WIDTH),
        maxAllowed
      );
      setPanelWidth(newWidth);
    };

    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      setIsDragging(false);
      if (!dragStartRef.current.hasDragged) {
        toggleMaximize();
      }
    };

    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
  }, [panelWidth, isExpanded, toggleMaximize]);

  const togglePanel = useCallback(() => {
    setIsOpen((current) => {
      if (current) {
        abortListening();
        setIsExpanded(false);
        return false;
      }
      setIsExpanded(false);
      setPanelWidth(getDefaultPanelWidth());
      setMaxPanelWidth(getMaxPanelWidth());
      return true;
    });
  }, [abortListening]);

  useHotkeys({
    "alt+v": (event) => {
      event.preventDefault();
      togglePanel();
    },
    escape: (event) => {
      if (!isOpen) return;
      event.preventDefault();
      if (isExpanded) {
        collapsePanel();
        return;
      }
      closePanel();
    },
  });

  useEffect(() => {
    return () => abortListening();
  }, [abortListening]);

  const handleMicrophoneClick = async () => {
    if (isListening) {
      const finalText = stopListening();
      if (finalText) {
        setDraftText(finalText);
        await sendChat(finalText);
        setDraftText("");
        resetTranscript();
      }
      return;
    }

    await startListening();
  };

  const handleSend = async () => {
    const text = draftText.trim();
    if (!text || isSending || !storeId) return;
    if (isListening) stopListening();
    setDraftText("");
    resetTranscript();
    await sendChat(text);
  };

  const handleQuickPrompt = useCallback(
    async (prompt) => {
      const text = typeof prompt === "string" ? prompt.trim() : "";
      if (!text || isSending || isConfirming || !storeId) return;
      if (isListening) stopListening();
      setDraftText("");
      resetTranscript();
      await sendChat(text);
    },
    [
      isSending,
      isConfirming,
      storeId,
      isListening,
      stopListening,
      resetTranscript,
      sendChat,
    ]
  );

  const slashMatches = useMemo(
    () => matchSlashCommands(draftText),
    [draftText]
  );
  const showSlashMenu = slashMatches.length > 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Each new draft resets the keyboard menu selection.
  useEffect(() => {
    setSlashIndex(0);
  }, [draftText]);

  const applySlashCommand = useCallback(
    (item) => {
      if (!item) return;
      const prompt = t(item.promptKey);
      if (typeof prompt === "string" && prompt.endsWith(" ")) {
        setDraftText(prompt);
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }
      void handleQuickPrompt(prompt);
    },
    [t, handleQuickPrompt]
  );

  const handleDraftKeyDown = (event) => {
    if (showSlashMenu) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSlashIndex((current) =>
          current + 1 >= slashMatches.length ? 0 : current + 1
        );
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSlashIndex((current) =>
          current - 1 < 0 ? slashMatches.length - 1 : current - 1
        );
        return;
      }
      if (event.key === "Tab" || (event.key === "Enter" && !event.shiftKey)) {
        event.preventDefault();
        applySlashCommand(slashMatches[slashIndex] || slashMatches[0]);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setDraftText("");
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    resetTranscript();
    resetChat();
    setDraftText("");
    sessionCreatedAtRef.current = Date.now();
  };

  const handleNewChat = () => {
    handleReset();
    void refreshHistory();
  };

  const handleSelectSession = async (session) => {
    if (!session?.id) return;
    if (session.id === activeSessionId) return;
    setDraftText("");
    const result = await getSession(session.id);
    if (!result?.success || !result.session) {
      return;
    }
    loadChat({
      sessionId: result.session.id,
      messages: result.session.messages || [],
    });
    sessionCreatedAtRef.current = result.session.createdAt || Date.now();
  };

  const canSend =
    Boolean(draftText.trim()) &&
    Boolean(storeId) &&
    !isSending &&
    !isConfirming;
  const isPermissionError =
    error?.code === VOICE_CAPTURE_ERRORS.PERMISSION_DENIED;
  const hasThread =
    messages.length > 0 || isSending || isConfirming || Boolean(chatError);

  const emptyHint = !storeId
    ? t("voice.status.noStore")
    : !isSupported
      ? t("voice.status.typeOnly")
      : t("voice.emptyHint");

  const userFirst = (user?.firstName || user?.first_name || "").trim();
  const userLast = (user?.lastName || user?.last_name || "").trim();
  const combinedUserName = [userFirst, userLast].filter(Boolean).join(" ");
  const userName =
    combinedUserName ||
    user?.name ||
    user?.fullName ||
    user?.displayName ||
    userFirst ||
    "";

  const greeting = greetingForLocale(locale, userName, t);

  const storeName =
    selectedStore?.storeName || selectedStore?.name || t("voice.storeFallback");
  const storeGst = selectedStore?.gst || selectedStore?.gstNumber || "";

  const aiStatus = isListening
    ? t("voice.status.listening")
    : isConfirming
      ? t("voice.status.confirming")
      : isSending
        ? t("voice.status.thinking")
        : t("voice.status.waiting");

  const headerStatus = isListening
    ? t("voice.status.listening")
    : isSending || isConfirming
      ? t("voice.status.thinking")
      : t("voice.subtitle");

  const messageList = (
    <>
      {messages.map((item) =>
        item.role === "user" ? (
          <div
            className="flex animate-[chatFadeUp_0.25s_ease-out_both] flex-col items-end gap-1.5 my-2"
            key={item.id}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase select-none">
              <User className="h-3 w-3" />
              <span>{userName || t("voice.userFallback", "STORE OWNER")}</span>
            </div>
            <div className="brain-user-bubble max-w-[85%] rounded-2xl rounded-tr-xs bg-[#eaf4fb] dark:bg-[#187CC5]/20 border border-[#187CC5]/25 dark:border-[#187CC5]/40 text-slate-800 dark:text-slate-100 px-4 py-2.5 text-[13.5px] font-medium leading-relaxed shadow-2xs">
              <span className="block whitespace-pre-wrap text-slate-800 dark:text-slate-100">{item.content}</span>
            </div>
          </div>
        ) : (
          <AssistantMessageBubble
            DownloadButtons={DownloadButtons}
            showToolTrace={showToolTrace}
            confirmPending={confirmPending}
            isConfirming={isConfirming}
            isSending={isSending}
            item={item}
            key={item.id}
            rejectPending={rejectPending}
            storeId={storeId}
            t={t}
          />
        )
      )}

      {(() => {
        const lastMessage = messages[messages.length - 1];
        const isStreamingLast =
          lastMessage?.role === "assistant" && Boolean(lastMessage?.streaming);

        if (!(isSending || isConfirming) || isStreamingLast) {
          return null;
        }

        return (
          <AgentActivityCard
            activeTool={activeTool}
            progress={progress}
            isConfirming={isConfirming}
          />
        );
      })()}

      {chatError && (
        <div className="flex justify-start items-start gap-2.5">
          <div className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl bg-[rgb(var(--color-danger))]/10 border border-[rgb(var(--color-danger))]/20 p-1 shadow-2xs">
            <DragBizzLogoIcon
              className="h-4 w-4"
              color="rgb(var(--color-danger))"
            />
          </div>
          <div className="rounded-2xl rounded-tl-sm border border-[rgb(var(--color-danger))]/25 bg-[rgb(var(--color-danger))]/8 px-3.5 py-2.5 text-[13px] leading-5 text-[rgb(var(--color-danger))] shadow-2xs">
            {chatError.code === "STORE_REQUIRED"
              ? t("voice.status.noStore")
              : chatError.message || t("voice.errors.ai_failed")}
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </>
  );

  const composer = (
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
          onHover={setSlashIndex}
          onSelect={applySlashCommand}
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
              onClick={() => handleQuickPrompt(chip.prompt)}
              type="button"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
      <div className="brain-docked-composer-box flex items-end gap-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 shadow-xs transition-all focus-within:border-[#187CC5] focus-within:ring-4 focus-within:ring-[#187CC5]/10">
        <button
          aria-label={
            isListening ? t("voice.stopListening") : t("voice.startListening")
          }
          className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all ${isListening
            ? "bg-rose-500 text-white animate-pulse"
            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          disabled={!isSupported || isSending || isConfirming || !storeId}
          onClick={handleMicrophoneClick}
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
          className="max-h-28 min-h-8 w-full resize-none !border-none !outline-none !shadow-none bg-transparent px-1 py-1.5 text-[13.5px] leading-5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:!border-none focus:!outline-none focus:!ring-0"
          style={{ outline: "none", border: "none", boxShadow: "none" }}
          disabled={isSending || isConfirming || !storeId}
          onChange={(event) => setDraftText(event.target.value)}
          onKeyDown={handleDraftKeyDown}
          placeholder="Ask anything... (/ for commands)"
          ref={inputRef}
          rows={1}
          value={draftText}
        />
        <button
          aria-label={t("voice.send")}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#187CC5] hover:bg-[#13649f] text-white shadow-xs transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          disabled={!canSend}
          onClick={handleSend}
          type="button"
        >
          <ArrowUp className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
      <p className="mt-1.5 px-1 text-center text-[10px] text-slate-400">
        {t("voice.sendHint")} · {t("voice.shortcut")}
      </p>
    </>
  );

  const centerComposer = (
    <div className="brain-composer-card w-full rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all focus-within:border-[#187CC5] focus-within:ring-4 focus-within:ring-[#187CC5]/10">
      <textarea
        aria-autocomplete="list"
        aria-label={t("voice.message")}
        className="w-full resize-none !border-none !outline-none !shadow-none bg-transparent p-1 text-[14px] leading-relaxed text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:!border-none focus:!outline-none focus:!ring-0 min-h-[64px]"
        style={{ outline: "none", border: "none", boxShadow: "none" }}
        disabled={isSending || isConfirming || !storeId}
        onChange={(event) => setDraftText(event.target.value)}
        onKeyDown={handleDraftKeyDown}
        placeholder="Ask anything about today's sales, stock levels, customer khata, or draft an invoice..."
        rows={2}
        value={draftText}
      />
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5">
        <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-400 select-none">
          <Sliders className="h-3.5 w-3.5 text-slate-400" />
          <span>Type / for quick actions</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label={
              isListening ? t("voice.stopListening") : t("voice.startListening")
            }
            className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all ${isListening
              ? "bg-rose-500 text-white animate-pulse"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
            disabled={!isSupported || isSending || isConfirming || !storeId}
            onClick={handleMicrophoneClick}
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
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#187CC5] text-white hover:bg-[#13649f] transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 shadow-xs"
            disabled={!canSend}
            onClick={handleSend}
            type="button"
          >
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );

  const headerActions = (
    <div className="flex shrink-0 items-center gap-1">
      {hasThread && (
        <button
          aria-label={t("voice.clear")}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          onClick={handleNewChat}
          title={t("voice.clear")}
          type="button"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        aria-label={isExpanded ? "Restore to drawer" : "Maximize to full screen"}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        onClick={toggleMaximize}
        title={isExpanded ? "Restore to drawer" : "Maximize to full screen"}
        type="button"
      >
        {isExpanded ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </button>
      <button
        aria-label={t("common.close")}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        onClick={closePanel}
        type="button"
      >
        <X className="h-4 w-4 stroke-[2]" />
      </button>
    </div>
  );

  const chatPanel = (
    <>
      <div
        className="fixed inset-0 z-[399] bg-black/[0.04] transition-opacity duration-300"
        onClick={closePanel}
        aria-hidden="true"
      />
      {isDragging && (
        <div className="fixed inset-0 z-[500] cursor-col-resize select-none" />
      )}
      <section
        ref={panelRef}
        aria-label={t("voice.title")}
        aria-modal="true"
        role="dialog"
        className={`brain-panel no-print fixed top-0 right-0 bottom-0 z-[400] flex flex-col h-full bg-white border-l border-slate-200 shadow-[-16px_0_40px_rgba(0,0,0,0.08)] ${
          isDragging
            ? "transition-none select-none"
            : `transition-[width] duration-200 ease-out ${!hasAnimatedIn ? "animate-[drawerSlideIn_0.28s_cubic-bezier(0.16,1,0.3,1)]" : ""}`
        }`}
        style={{
          width: isExpanded ? `${maxPanelWidth}px` : `${panelWidth}px`,
          maxWidth: `${maxPanelWidth}px`,
          minWidth: `${Math.min(MIN_PANEL_WIDTH, typeof window !== "undefined" ? window.innerWidth : MIN_PANEL_WIDTH)}px`,
        }}
      >
        {/* Left Border Draggable Pill Handle */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Drag to resize panel or click to maximize"
          title={isExpanded ? "Click to restore or drag to resize" : "Click to maximize or drag to resize"}
          onMouseDown={handlePillMouseDown}
          onTouchStart={handlePillTouchStart}
          className="brain-pill-handle group absolute -left-3 top-1/2 -translate-y-1/2 z-50 flex h-12 w-5 cursor-col-resize items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:border-[#187CC5] hover:shadow-[0_4px_16px_rgba(24,124,197,0.2)] transition-all active:scale-95 select-none"
        >
          <div className="h-5 w-1 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-[#187CC5] group-active:bg-[#187CC5] transition-colors" />
        </div>

        <header className="flex shrink-0 select-none items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-950">
          <button
            onClick={closePanel}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Back / Close"
            type="button"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2]" />
          </button>
          {headerActions}
        </header>
        <ChatWorkspace
          isExpanded={isExpanded}
          showHistory={
            isExpanded ||
            (typeof window !== "undefined" &&
              panelWidth >= window.innerWidth * 0.5)
          }
          activeSessionId={activeSessionId}
          aiStatus={aiStatus}
          centerComposer={centerComposer}
          composer={composer}
          emptyHint={emptyHint}
          greeting={greeting}
          hasThread={hasThread}
          historyError={historyError}
          historyGrouped={grouped}
          historyHasMore={historyHasMore}
          historyLoading={historyLoading}
          historyLoadingMore={historyLoadingMore}
          onLoadMoreHistory={historyLoadMore}
          onNewChat={handleNewChat}
          onQuickPrompt={handleQuickPrompt}
          onSelectSession={handleSelectSession}
          storeGst={storeGst}
          storeName={storeName}
          t={t}
          userName={userName}
        >
          {messageList}
        </ChatWorkspace>
      </section>
    </>
  );

  return (
    <AiChatPresentation t={t} LinkComponent={LinkComponent}>
      {(() => {
        const trigger = triggerButton || customTrigger;
        if (trigger) {
          return typeof trigger === "function" ? (
            trigger({
              isOpen,
              setIsOpen,
              openPanel,
              closePanel,
              togglePanel,
            })
          ) : (
            <button
              aria-expanded={isOpen}
              aria-haspopup="dialog"
              className={`no-print bg-[rgb(var(--color-text-primary)/0.06)] border border-[rgb(var(--color-border-primary)/0.6)] ${triggerClassName}`}
              onClick={isOpen ? closePanel : openPanel}
              type="button"
            >
              {trigger}
            </button>
          );
        }
        return (
          <IconButton
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className={`no-print bg-[rgb(var(--color-text-primary)/0.06)] border border-[rgb(var(--color-border-primary)/0.6)] ${triggerClassName}`}
            icon={AiLottieIcon}
            iconClassName="h-5 w-5"
            onClick={isOpen ? closePanel : openPanel}
            title={`${t("voice.open")} — ${t("voice.shortcut")}`}
          />
        );
      })()}
      {portalReady && isOpen && createPortal(chatPanel, document.body)}
    </AiChatPresentation>
  );
};

export { resizePanel } from "./useFloatingPanel.js";
export { BrainPanel };
export default BrainPanel;
