"use client";

import { IconButton } from "@dragorbit/ui";

import {
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  RotateCcw,
  Send,
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
import styles from "./chat-panel.module.css";
import "./brain.css";
import { titleFromUserText } from "./chatHistory.js";
import useFloatingPanel from "./useFloatingPanel.js";
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
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                status === opt.id
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
  showToolTrace,
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
    <div className="flex animate-[chatFadeUp_0.3s_ease-out_both] justify-start">
      <div className="max-w-[94%] rounded-2xl rounded-bl-md border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] px-3.5 py-3">
        <ChatAssistantMessage message={assistantText} />
        <ChatCustomerResultCard toolResults={item.toolResults} />
        <DownloadButtons storeId={storeId} toolResults={item.toolResults} />
        {showToolTrace &&
          Array.isArray(item.toolResults) &&
          item.toolResults.length > 0 && (
            <ul className="mt-2 space-y-1 border-t border-[rgb(var(--color-border-primary))]/50 pt-2">
              {item.toolResults.map((tool, index) => (
                <li
                  className="text-[11px] leading-4 text-[rgb(var(--color-text-secondary))]"
                  key={`${tool?.tool || "tool"}-${index}`}
                >
                  <span className="font-medium text-[rgb(var(--color-text-primary))]">
                    {tool?.tool || t("voice.tool")}
                  </span>
                  {": "}
                  {tool?.success
                    ? t("voice.toolSuccess")
                    : t("voice.toolFailed")}
                </li>
              ))}
            </ul>
          )}
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
  const {
    style: panelStyle,
    ready: panelReady,
    interacting,
    dragHandlers,
    resizeHandles,
  } = useFloatingPanel({ isOpen, isExpanded });
  const [draftText, setDraftText] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [portalReady, setPortalReady] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionCreatedAtRef = useRef(Date.now());

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

  // After a completed turn, refresh list from server (source of truth).
  useEffect(() => {
    if (!storeId || isSending || isConfirming) return;
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last?.role !== "assistant" || last?.streaming) return;
    void refreshHistory();
  }, [messages, storeId, isSending, isConfirming, refreshHistory]);

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
    setIsOpen(true);
  }, []);

  const expandPanel = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapsePanel = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((current) => {
      if (current) {
        abortListening();
        setIsExpanded(false);
        return false;
      }
      setIsExpanded(false);
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

  const userName =
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : null) ||
    user?.name ||
    user?.fullName ||
    user?.firstName ||
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
            className="flex animate-[chatFadeUp_0.3s_ease-out_both] justify-end"
            key={item.id}
          >
            <div
              className="ai-chat-on-primary max-w-[85%] rounded-2xl rounded-br-md bg-[rgb(var(--color-primary))] px-3.5 py-2.5 text-[13px] leading-5"
              style={{ color: "#fff" }}
            >
              <span className="block whitespace-pre-wrap">{item.content}</span>
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

      {(isSending || isConfirming) && (
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-md border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] px-3.5 py-2.5 text-[13px] text-[rgb(var(--color-text-secondary))]">
            {isConfirming
              ? t("voice.status.confirming")
              : t("voice.status.thinking")}
          </div>
        </div>
      )}

      {chatError && (
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-md border border-[rgb(var(--color-danger))]/25 bg-[rgb(var(--color-danger))]/8 px-3.5 py-2.5 text-[13px] leading-5 text-[rgb(var(--color-danger))]">
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
      <div className="flex items-end gap-1.5 rounded-[22px] border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] p-1.5 transition-[border-color] focus-within:border-[rgb(var(--color-primary))]/55">
        <button
          aria-label={
            isListening ? t("voice.stopListening") : t("voice.startListening")
          }
          className={`mb-0.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]/40 disabled:cursor-not-allowed disabled:opacity-40 ${
            isListening
              ? "ai-chat-on-primary bg-[rgb(var(--color-danger))]"
              : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))]"
          }`}
          disabled={!isSupported || isSending || isConfirming || !storeId}
          onClick={handleMicrophoneClick}
          style={isListening ? { color: "#fff" } : undefined}
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
          className="max-h-28 min-h-9 w-full resize-none !border-0 bg-transparent px-1 py-2 text-[13px] leading-5 text-[rgb(var(--color-text-primary))] !shadow-none outline-none ring-0 placeholder:text-[rgb(var(--color-text-secondary))] focus:!border-0 focus:!shadow-none focus:outline-none focus:ring-0"
          disabled={isSending || isConfirming || !storeId}
          onChange={(event) => setDraftText(event.target.value)}
          onKeyDown={handleDraftKeyDown}
          placeholder={t("voice.messagePlaceholder")}
          ref={inputRef}
          rows={1}
          value={draftText}
        />
        <button
          aria-label={t("voice.send")}
          className="ai-chat-on-primary mb-0.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[rgb(var(--color-primary))] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]/40 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!canSend}
          onClick={handleSend}
          style={{ color: "#fff" }}
          type="button"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1.5 px-1 text-center text-[10px] text-[rgb(var(--color-text-secondary))]">
        {t("voice.sendHint")} · {t("voice.shortcut")}
      </p>
    </>
  );

  const headerActions = (
    <div className="flex shrink-0 items-center gap-1">
      {hasThread && (
        <button
          aria-label={t("voice.clear")}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]"
          onClick={handleNewChat}
          title={t("voice.clear")}
          type="button"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
      {isExpanded ? (
        <button
          aria-label={t("voice.collapse")}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]"
          onClick={collapsePanel}
          title={t("voice.collapse")}
          type="button"
        >
          <Minimize2 className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button
          aria-label={t("voice.expand")}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]"
          onClick={expandPanel}
          title={t("voice.expand")}
          type="button"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        aria-label={t("common.close")}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]"
        onClick={closePanel}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  const chatPanel = (
    <section
      aria-label={t("voice.title")}
      aria-modal="false"
      role="dialog"
      style={panelStyle}
      data-interacting={interacting}
      className={`${styles.panel} brain-panel no-print fixed z-[400] flex flex-col overflow-hidden rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]`}
    >
      <header
        {...dragHandlers}
        className={`flex shrink-0 touch-none select-none items-center justify-between gap-2 border-b border-[rgb(var(--color-border-primary))] px-3 py-3 ${isExpanded ? "" : "cursor-grab active:cursor-grabbing"}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <AiLottieIcon size={22} className="h-5 w-5 shrink-0" />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              {t("voice.title")}
            </h2>
            <p className="truncate text-[11px] text-[rgb(var(--color-text-secondary))]">
              {headerStatus}
            </p>
          </div>
        </div>
        {headerActions}
      </header>
      <ChatWorkspace
        activeSessionId={activeSessionId}
        aiStatus={aiStatus}
        composer={composer}
        emptyHint={emptyHint}
        greeting={greeting}
        hasThread={hasThread}
        historyError={historyError}
        historyGrouped={grouped}
        historyLoading={historyLoading}
        onNewChat={handleNewChat}
        onQuickPrompt={handleQuickPrompt}
        onSelectSession={handleSelectSession}
        storeGst={storeGst}
        storeName={storeName}
        t={t}
      >
        {messageList}
      </ChatWorkspace>
      {!isExpanded &&
        resizeHandles.map(({ direction, handlers }) => (
          <button
            key={direction}
            {...handlers}
            type="button"
            aria-label={`Resize chat ${direction}. Use arrow keys to adjust.`}
            title="Drag to resize · Arrow keys to adjust"
            data-direction={direction}
            className={styles.resizeHandle}
          />
        ))}
    </section>
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
              className={`no-print ${triggerClassName}`}
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
            className={`no-print ${triggerClassName}`}
            icon={AiLottieIcon}
            iconClassName="h-5 w-5"
            onClick={isOpen ? closePanel : openPanel}
            title={`${t("voice.open")} — ${t("voice.shortcut")}`}
          />
        );
      })()}
      {portalReady &&
        isOpen &&
        panelReady &&
        createPortal(chatPanel, document.body)}
    </AiChatPresentation>
  );
};

export { resizePanel } from "./useFloatingPanel.js";
export { BrainPanel };
export default BrainPanel;
