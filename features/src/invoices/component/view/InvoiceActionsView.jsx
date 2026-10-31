"use client";

import { Button } from "@dragorbit/ui";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Edit,
  FileCheck,
  FileText,
  Printer,
  Receipt,
  RotateCcw,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";

function defaultFormatCurrency(val) {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function defaultFormatDate(date) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(date);
  }
}

function defaultFormatDateTime(date) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(date);
  }
}

export function InvoiceActionsView({
  invoiceData,
  onEditInvoice,
  onReleaseInvoice,
  onPrintInvoice,
  onDownloadPDF,
  onUpdatePaymentStatus,
  onCancelInvoice,
  onIssueCreditNote,
  extraActions,
  formatCurrency = defaultFormatCurrency,
  formatDate = defaultFormatDate,
  formatDateTime = defaultFormatDateTime,
  t = (k, def) => (typeof def === "object" ? def?.defaultValue || k : def || k),
}) {
  if (!invoiceData) return null;

  const isDraft =
    invoiceData.invoiceStatus === "DRAFT" || invoiceData.status === "DRAFT";
  const isPaid = invoiceData.paymentStatus === "PAID";
  const isCancelled =
    invoiceData.invoiceStatus === "CANCELLED" || invoiceData.status === "CANCELLED";

  const totalAmount = invoiceData.totalAmount || 0;
  const dueAmount = invoiceData.dueAmount ?? (isPaid ? 0 : totalAmount);
  const paidAmount =
    invoiceData.paidAmount ?? (isPaid ? totalAmount : Math.max(0, totalAmount - dueAmount));
  const gstAmount =
    invoiceData.gst?.amount ??
    invoiceData.gstAmount ??
    invoiceData.gst?.breakdown?.total ??
    0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]/60 overflow-hidden">
        {/* Actions Header */}
        <div className="p-5 border-b border-[rgb(var(--color-border-primary))]/30">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-tight">
              Invoice Actions
            </h3>
          </div>
        </div>

        {/* Primary Action Buttons Row */}
        <div className="p-5 flex flex-wrap items-center gap-2 border-b border-[rgb(var(--color-border-primary))]/20">
          {isDraft ? (
            <>
              {onEditInvoice && (
                <Button
                  variant="outline"
                  className="flex-1 min-w-[100px] h-9 font-bold text-xs uppercase px-3"
                  onClick={onEditInvoice}
                  leftIcon={Edit}
                  size="sm"
                >
                  Edit
                </Button>
              )}
              {onReleaseInvoice && (
                <Button
                  variant="primary"
                  className="flex-1 min-w-[110px] h-9 font-bold text-xs uppercase px-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={onReleaseInvoice}
                  leftIcon={CheckCircle2}
                  size="sm"
                >
                  Release
                </Button>
              )}
            </>
          ) : (
            <>
              {onPrintInvoice && (
                <Button
                  variant="primary"
                  className="flex-1 min-w-[90px] h-9 font-bold text-xs uppercase px-3"
                  onClick={onPrintInvoice}
                  leftIcon={Printer}
                  size="sm"
                >
                  Print
                </Button>
              )}

              {onDownloadPDF && (
                <Button
                  variant="outline"
                  className="flex-1 min-w-[90px] h-9 font-bold text-xs uppercase px-3"
                  onClick={() => onDownloadPDF(invoiceData)}
                  leftIcon={Download}
                  size="sm"
                >
                  PDF
                </Button>
              )}

              {!isCancelled && !isPaid && onUpdatePaymentStatus && (
                <Button
                  variant="outline"
                  className="flex-1 min-w-[130px] h-9 font-bold text-xs uppercase px-3"
                  onClick={onUpdatePaymentStatus}
                  leftIcon={CreditCard}
                  size="sm"
                >
                  Pay Status
                </Button>
              )}

              {!isCancelled && onCancelInvoice && (
                <Button
                  variant="outline"
                  className="h-9 text-rose-600 border-rose-600/20 hover:bg-rose-600/5 font-bold text-xs uppercase px-3"
                  onClick={onCancelInvoice}
                  leftIcon={XCircle}
                  size="sm"
                >
                  Cancel
                </Button>
              )}

              {!isCancelled && onIssueCreditNote && (
                <Button
                  variant="outline"
                  className="h-9 text-amber-600 border-amber-600/20 hover:bg-amber-600/5 font-bold text-xs uppercase px-3"
                  onClick={onIssueCreditNote}
                  leftIcon={RotateCcw}
                  size="sm"
                >
                  Credit Note
                </Button>
              )}
            </>
          )}
        </div>

        {/* Extra host action slots (e.g. POS quick payment buttons, sharing menu) */}
        {extraActions && (
          <div className="px-5 py-3 border-b border-[rgb(var(--color-border-primary))]/20 bg-[rgb(var(--color-bg-secondary))]/5 flex flex-wrap gap-2">
            {extraActions}
          </div>
        )}

        {/* Financial Summary Card */}
        <div className="p-5">
          <div className="space-y-4">
            <div>
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))] mb-1">
                {isPaid ? "Payment Status" : "Total Outstanding"}
              </p>
              {isPaid ? (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                    Fully Paid
                  </h2>
                  <span className="p-1 bg-emerald-500/10 text-emerald-600 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                </div>
              ) : (
                <h2 className="text-2xl font-black text-[rgb(var(--color-text-primary))] tracking-tight">
                  {formatCurrency(dueAmount)}
                </h2>
              )}
            </div>

            <div className="pt-4 border-t border-[rgb(var(--color-border-primary))]/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[0.625rem] font-bold uppercase text-[rgb(var(--color-text-tertiary))] mb-0.5">
                  Invoice Total
                </p>
                <p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              <div>
                <p className="text-[0.625rem] font-bold uppercase text-[rgb(var(--color-text-tertiary))] mb-0.5">
                  Tax (GST)
                </p>
                <p className="text-sm font-bold text-[rgb(var(--color-primary))]">
                  {formatCurrency(gstAmount)}
                </p>
              </div>

              <div>
                <p className="text-[0.625rem] font-bold uppercase text-[rgb(var(--color-text-tertiary))] mb-0.5">
                  Paid Amount
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(paidAmount)}
                </p>
              </div>

              <div>
                <p className="text-[0.625rem] font-bold uppercase text-[rgb(var(--color-text-tertiary))] mb-0.5">
                  Payment Mode
                </p>
                <p className="text-sm font-bold text-[rgb(var(--color-text-primary))] uppercase">
                  {invoiceData.paymentMode || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps & Audit Info */}
        <div className="p-5 pt-0 space-y-3">
          <div className="pt-3 border-t border-[rgb(var(--color-border-primary))]/30 space-y-1.5">
            <div className="flex justify-between text-[0.625rem] text-[rgb(var(--color-text-tertiary))]">
              <span className="font-bold uppercase">Created</span>
              <span className="font-medium">{formatDate(invoiceData.createdAt)}</span>
            </div>
            {invoiceData.releasedAt && (
              <div className="flex justify-between text-[0.625rem] text-[rgb(var(--color-text-tertiary))]">
                <span className="font-bold uppercase">Released</span>
                <span className="font-medium">{formatDateTime(invoiceData.releasedAt)}</span>
              </div>
            )}
            <div className="flex justify-between text-[0.625rem] text-[rgb(var(--color-text-tertiary))]">
              <span className="font-bold uppercase">Updated</span>
              <span className="font-medium">{formatDateTime(invoiceData.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log / Note section */}
      <div className="p-5 bg-sky-500/5 dark:bg-sky-500/10 rounded-2xl border border-sky-500/10 flex items-start gap-3">
        <div className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-[0.6875rem] leading-relaxed text-sky-800 dark:text-sky-200 font-medium">
          Audit & Compliance: This invoice is a legally registered document. Any revisions, releases, or payments are recorded in the system audit trail.
        </p>
      </div>
    </div>
  );
}

export default InvoiceActionsView;
