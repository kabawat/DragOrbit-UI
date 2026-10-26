"use client";

import { useState } from "react";

export function formatConfirmSummary(pending, t) {
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

export function ExpenseConfirmCard({
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

export default ExpenseConfirmCard;

