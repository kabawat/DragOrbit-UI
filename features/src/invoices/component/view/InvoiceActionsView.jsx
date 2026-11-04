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
  Plus,
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
  onDeleteInvoice,
  onPrintInvoice,
  onDownloadPDF,
  onPrintAndSave,
  onCreateNewInvoice,
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
      <div className="bg-white dark:bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]/60 relative">
        {/* Actions / Summary Header */}
        <div className="p-5 border-b border-[rgb(var(--color-border-primary))]/30">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-tight">
              Invoice Summary
            </h3>
          </div>
        </div>

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
        <div className="px-5 pb-5 space-y-3">
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

        {/* Action Buttons Section at Bottom */}
        <div className="p-5 border-t border-[rgb(var(--color-border-primary))]/30 flex flex-col gap-2.5 relative z-30">
          {/* Main Action Buttons Row: Print & Save */}
          <div className="flex items-center gap-2.5 w-full">
            {(onPrintAndSave || onPrintInvoice) && (
              <Button
                variant="primary"
                className={`${onCreateNewInvoice ? "flex-1 min-w-[130px]" : "w-full"} h-9 font-bold text-xs uppercase px-3 shadow-none`}
                onClick={onPrintAndSave || onPrintInvoice}
                leftIcon={Printer}
                size="sm"
              >
                {t("invoice.printAndSave", { defaultValue: "Print & Save" })}
              </Button>
            )}

            {onCreateNewInvoice && (
              <Button
                variant="outline"
                className="flex-1 min-w-[140px] h-9 font-bold text-xs uppercase px-3"
                onClick={onCreateNewInvoice}
                leftIcon={Plus}
                size="sm"
              >
                {t("invoice.createNewInvoice", { defaultValue: "Create New Invoice" })}
              </Button>
            )}
          </div>

          {/* Draft Actions: Edit, Delete & Release */}
          {isDraft && (onEditInvoice || onReleaseInvoice || onDeleteInvoice) && (
            <div className="flex flex-wrap items-center gap-2 w-full pt-0.5">
              {onEditInvoice && (
                <Button
                  variant="outline"
                  className="flex-1 min-w-[80px] h-8 font-bold text-xs uppercase px-2.5"
                  onClick={onEditInvoice}
                  leftIcon={Edit}
                  size="sm"
                >
                  {t("common.edit", { defaultValue: "Edit" })}
                </Button>
              )}
              {onDeleteInvoice && (
                <Button
                  variant="outline"
                  className="h-8 text-rose-600 border-rose-600/20 hover:bg-rose-600/5 font-bold text-xs uppercase px-2.5"
                  onClick={onDeleteInvoice}
                  leftIcon={Trash2}
                  size="sm"
                >
                  {t("common.delete", { defaultValue: "Delete" })}
                </Button>
              )}
              {onReleaseInvoice && (
                <Button
                  variant="primary"
                  className="flex-1 min-w-[90px] h-8 font-bold text-xs uppercase px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={onReleaseInvoice}
                  leftIcon={CheckCircle2}
                  size="sm"
                >
                  {t("common.release", { defaultValue: "Release" })}
                </Button>
              )}
            </div>
          )}

          {/* Secondary Actions: Pay Status, Cancel, Credit Note */}
          {!isDraft && (!isPaid || !isCancelled) && (
            <div className="flex flex-wrap items-center gap-2 w-full pt-0.5">
              {!isCancelled && !isPaid && onUpdatePaymentStatus && (
                <Button
                  variant="outline"
                  className="flex-1 min-w-[110px] h-8 font-bold text-xs uppercase px-2"
                  onClick={onUpdatePaymentStatus}
                  leftIcon={CreditCard}
                  size="sm"
                >
                  {t("invoice.payStatus", { defaultValue: "Pay Status" })}
                </Button>
              )}

              {!isCancelled && onCancelInvoice && (
                <Button
                  variant="outline"
                  className="h-8 text-rose-600 border-rose-600/20 hover:bg-rose-600/5 font-bold text-xs uppercase px-2.5"
                  onClick={onCancelInvoice}
                  leftIcon={XCircle}
                  size="sm"
                >
                  {t("common.cancel", { defaultValue: "Cancel" })}
                </Button>
              )}

              {!isCancelled && onIssueCreditNote && (
                <Button
                  variant="outline"
                  className="h-8 text-amber-600 border-amber-600/20 hover:bg-amber-600/5 font-bold text-xs uppercase px-2.5"
                  onClick={onIssueCreditNote}
                  leftIcon={RotateCcw}
                  size="sm"
                >
                  {t("invoice.creditNote", { defaultValue: "Credit Note" })}
                </Button>
              )}
            </div>
          )}

          {/* Extra host action slots (e.g. POS quick payment buttons, sharing menu) */}
          {extraActions && (
            <div className="w-full pt-1">
              {extraActions}
            </div>
          )}
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
