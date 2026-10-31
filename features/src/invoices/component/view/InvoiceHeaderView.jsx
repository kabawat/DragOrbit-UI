"use client";

import { CheckCircle2, Clock, FileText, Globe, MapPin, Receipt, Tag } from "lucide-react";
import { Badge } from "@dragorbit/ui";

function formatDefaultDate(date) {
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

export function InvoiceHeaderView({
  invoiceData,
  formatDate = formatDefaultDate,
  getStatusColor,
  getPaymentStatusColor,
}) {
  if (!invoiceData) return null;

  const invoiceNumber = invoiceData.invoiceNumber || "N/A";
  const docTypeLabel =
    invoiceData.docType ||
    invoiceData.invoiceType ||
    "Tax Invoice";
  const issueDate = invoiceData.releasedAt || invoiceData.createdAt;

  const status = invoiceData.invoiceStatus || invoiceData.status || "DRAFT";
  const paymentStatus = invoiceData.paymentStatus || "UNPAID";

  const defaultStatusClass =
    status === "RELEASED"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
      : status === "CANCELLED"
      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";

  const defaultPaymentStatusClass =
    paymentStatus === "PAID"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
      : paymentStatus === "PARTIAL" || paymentStatus === "PARTIALLY_PAID"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";

  return (
    <div className="px-6 py-5 border-b border-[rgb(var(--color-border-primary))]/30">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Left: Document info */}
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-[rgb(var(--color-primary))]/10 rounded-xl hidden sm:flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6 text-[rgb(var(--color-primary))]" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[0.625rem] uppercase tracking-[0.25em] font-bold text-[rgb(var(--color-text-tertiary))]">
                {docTypeLabel}
              </span>
              {invoiceData.orderSource && (
                <span className="inline-flex items-center gap-1 text-[0.625rem] font-semibold px-2 py-0.5 rounded-full bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] border border-[rgb(var(--color-border-primary))]/40">
                  <Globe className="w-2.5 h-2.5" />
                  {invoiceData.orderSource}
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-black text-[rgb(var(--color-text-primary))] tracking-tight">
              #{invoiceNumber}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[rgb(var(--color-text-secondary))] pt-0.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))]" />
                Issued: {formatDate(issueDate)}
              </span>

              {invoiceData.placeOfSupply && (
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))]" />
                  POS: {invoiceData.placeOfSupply}
                </span>
              )}

              {invoiceData.paymentMode && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))]" />
                  Mode: {invoiceData.paymentMode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Badges */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <Badge
            size="sm"
            className={`${
              getStatusColor ? getStatusColor(status) : defaultStatusClass
            } font-bold text-xs px-2.5 py-1 uppercase tracking-wider rounded-lg`}
          >
            {status}
          </Badge>

          <Badge
            size="sm"
            className={`${
              getPaymentStatusColor
                ? getPaymentStatusColor(paymentStatus)
                : defaultPaymentStatusClass
            } font-bold text-xs px-2.5 py-1 uppercase tracking-wider rounded-lg`}
          >
            {paymentStatus.replace("_", " ")}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default InvoiceHeaderView;
