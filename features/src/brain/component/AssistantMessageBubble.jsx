"use client";

import { Check, Sliders } from "lucide-react";
import { formatToolTitle } from "./AgentActivityCard.jsx";
import { ChatAssistantMessage } from "./ChatAssistantMessage.jsx";
import {
  ChatCustomerResultCard,
  collectCustomerWrites,
  stripCustomerOpenLinks,
} from "./ChatCustomerResultCard.jsx";
import { ChatInvoiceResults } from "./ChatInvoiceResults.jsx";
import { DragAiAvatar } from "./DragAiAvatar.jsx";
import {
  ExpenseConfirmCard,
  formatConfirmSummary,
} from "./ExpenseConfirmCard.jsx";

export function AssistantMessageBubble({
  item,
  DownloadButtons,
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
        <span className="text-[13px] font-bold tracking-tight text-[rgb(var(--color-primary))]">
          DragAI
        </span>
      </div>

      {/* Executed Tool Steps (OpsAI style rows with green checkmarks) */}
      {Array.isArray(item.toolResults) && item.toolResults.length > 0 && (
        <div className="w-full space-y-2 my-1.5">
          {item.toolResults.map((tool, index) => (
            <div
              key={`${tool?.tool || "tool"}-${index}`}
              className="flex items-center justify-between rounded-xl bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] px-4 py-2.5 shadow-2xs transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                  <Sliders className="h-4 w-4" />
                </div>
                <span className="truncate text-[13.5px] font-medium text-[rgb(var(--color-text-primary))]">
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
        <ChatInvoiceResults toolResults={item.toolResults} />
        {item.streaming && (
          <span className="inline-block h-3.5 w-1.5 ml-1 translate-y-0.5 rounded-xs bg-[rgb(var(--color-primary))] animate-pulse" />
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

export default AssistantMessageBubble;

