"use client";
import {
  Card,
  CardBody,
  Badge,
  Button,
  TableSkeleton,
} from "@dragorbit/ui";
import {
  ArrowLeft,
  Download,
  Receipt,
  FileText,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CreditCard,
  AlertCircle,
} from "lucide-react";

export function BillingHistoryScreen({ model }) {
  const {
    t,
    isLoading,
    isDownloading,
    invoices = [],
    onDownload,
    onBack,
    onRefresh,
    error,
    ManagementShortcuts,
    moment,
  } = model;

  const formatDate = (date) => {
    if (!date) return "-";
    if (moment) return moment(date).format("MMM D, YYYY");
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(date);
    }
  };

  const formatAmount = (amount, currency = "INR") => {
    const num = Number(amount || 0);
    const symbol = currency === "INR" ? "₹" : currency || "₹";
    return `${symbol}${num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const getPaymentStatusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "SUCCESS" || s === "CAPTURED") {
      return (
        <Badge variant="success" className="px-2.5 py-0.5 text-xs font-medium">
          <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />
          {t?.("subscription.billingHistory.statusPaid") || "Paid"}
        </Badge>
      );
    }
    if (s === "PENDING") {
      return (
        <Badge variant="warning" className="px-2.5 py-0.5 text-xs font-medium">
          <Clock className="w-3 h-3 mr-1 inline-block" />
          {t?.("subscription.billingHistory.statusPending") || "Pending"}
        </Badge>
      );
    }
    return (
      <Badge variant="danger" className="px-2.5 py-0.5 text-xs font-medium">
        <AlertTriangle className="w-3 h-3 mr-1 inline-block" />
        {status || t?.("subscription.billingHistory.statusFailed") || "Failed"}
      </Badge>
    );
  };

  const getInvoicePdfBadge = (invoiceData) => {
    const status = invoiceData?.status?.toUpperCase();
    if (status === "DONE" || invoiceData?.hasDownload) {
      return (
        <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {t?.("subscription.billingHistory.invoiceReady") || "Ready"}
        </span>
      );
    }
    if (status === "PROCESSING" || status === "PENDING") {
      return (
        <span className="inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
          <Clock className="w-3 h-3 mr-1 animate-pulse" />
          {t?.("subscription.billingHistory.invoiceProcessing") || "Generating..."}
        </span>
      );
    }
    if (status === "FAILED") {
      return (
        <span className="inline-flex items-center text-xs font-medium text-rose-500">
          <AlertCircle className="w-3 h-3 mr-1" />
          {t?.("subscription.billingHistory.invoiceFailed") || "Failed"}
        </span>
      );
    }
    return (
      <span className="text-xs text-[rgb(var(--color-text-tertiary))]">
        -
      </span>
    );
  };

  return (
    <div className="flex-1 p-5">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 space-y-6">
            {/* Header Card */}
            <Card className="bg-[rgb(var(--color-bg-primary))] border-[rgb(var(--color-border-primary))] overflow-hidden">
              <CardBody className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onBack}
                      className="p-2 h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      aria-label="Back to Subscription"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                        {t?.("subscription.billingHistory.title") ||
                          "Billing History & Invoices"}
                      </h3>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-0.5">
                        {t?.("subscription.billingHistory.description") ||
                          "Review past payments, subscription renewals, and download tax invoices."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 text-xs font-medium rounded-xl"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                      />
                      <span>Refresh</span>
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="text-xs"
                >
                  {t?.("subscription.billingHistory.retry") || "Retry"}
                </Button>
              </div>
            )}

            {/* Main Content Card */}
            <Card className="bg-[rgb(var(--color-bg-primary))] border-[rgb(var(--color-border-primary))] overflow-hidden">
              {isLoading ? (
                <div className="p-6">
                  <TableSkeleton />
                </div>
              ) : !invoices || invoices.length === 0 ? (
                <CardBody className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-[rgb(var(--color-primary))]/10 rounded-full flex items-center justify-center mb-5">
                    <Receipt className="w-10 h-10 text-[rgb(var(--color-primary))]" />
                  </div>
                  <h4 className="text-xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                    {t?.("subscription.billingHistory.noInvoicesTitle") ||
                      "No Invoices Found"}
                  </h4>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] max-w-md mx-auto mb-6">
                    {t?.("subscription.billingHistory.noInvoicesDescription") ||
                      "You do not have any subscription payment receipts or invoices yet. When you upgrade or renew, they will appear here."}
                  </p>
                  <Button variant="primary" onClick={onBack} size="sm">
                    {t?.("subscription.billingHistory.backToSubscription") ||
                      "Back to Subscription"}
                  </Button>
                </CardBody>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] text-xs font-semibold uppercase tracking-wider border-b border-[rgb(var(--color-border-primary))]">
                        <tr>
                          <th className="py-3.5 px-5">
                            {t?.("subscription.billingHistory.invoiceNumber") ||
                              "Invoice / Order"}
                          </th>
                          <th className="py-3.5 px-5">
                            {t?.("subscription.billingHistory.date") || "Date"}
                          </th>
                          <th className="py-3.5 px-5">
                            {t?.("subscription.billingHistory.plan") || "Plan"}
                          </th>
                          <th className="py-3.5 px-5">
                            {t?.("subscription.billingHistory.amount") ||
                              "Amount"}
                          </th>
                          <th className="py-3.5 px-5">
                            {t?.("subscription.billingHistory.paymentStatus") ||
                              "Status"}
                          </th>
                          <th className="py-3.5 px-5">
                            {t?.("subscription.billingHistory.invoiceStatus") ||
                              "Invoice PDF"}
                          </th>
                          <th className="py-3.5 px-5 text-right">
                            {t?.("subscription.billingHistory.actions") ||
                              "Action"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgb(var(--color-border-primary))]">
                        {invoices.map((inv) => {
                          const isCurDownloading =
                            isDownloading === inv.invoiceId;
                          const invoiceNumber =
                            inv.receipt ||
                            `INV-${String(inv.invoiceId || "").slice(-6).toUpperCase()}`;

                          return (
                            <tr
                              key={inv.invoiceId || inv.orderId}
                              className="hover:bg-[rgb(var(--color-bg-secondary))]/50 transition-colors"
                            >
                              <td className="py-4 px-5">
                                <div className="font-medium text-[rgb(var(--color-text-primary))] flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" />
                                  <span>{invoiceNumber}</span>
                                </div>
                                {inv.orderId && (
                                  <p className="text-xs text-[rgb(var(--color-text-tertiary))] font-mono mt-0.5">
                                    {inv.orderId}
                                  </p>
                                )}
                              </td>
                              <td className="py-4 px-5 text-[rgb(var(--color-text-secondary))] whitespace-nowrap">
                                {formatDate(inv.paidAt || inv.createdAt)}
                              </td>
                              <td className="py-4 px-5 text-[rgb(var(--color-text-primary))]">
                                <span className="font-medium">
                                  {inv.months
                                    ? `${inv.months} ${inv.months === 1 ? "Month" : "Months"}`
                                    : inv.billingCycle || "Subscription"}
                                </span>
                              </td>
                              <td className="py-4 px-5 font-semibold text-[rgb(var(--color-text-primary))] whitespace-nowrap">
                                {formatAmount(
                                  inv.finalAmount ?? inv.baseAmount,
                                  inv.currency,
                                )}
                              </td>
                              <td className="py-4 px-5 whitespace-nowrap">
                                {getPaymentStatusBadge(inv.status)}
                              </td>
                              <td className="py-4 px-5 whitespace-nowrap">
                                {getInvoicePdfBadge(inv.invoice)}
                              </td>
                              <td className="py-4 px-5 text-right whitespace-nowrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isCurDownloading}
                                  onClick={() => onDownload(inv)}
                                  className="inline-flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5"
                                >
                                  {isCurDownloading ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>
                                        {t?.(
                                          "subscription.billingHistory.downloading",
                                        ) || "Downloading..."}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Download className="w-3.5 h-3.5" />
                                      <span>
                                        {t?.(
                                          "subscription.billingHistory.downloadPdf",
                                        ) || "Download PDF"}
                                      </span>
                                    </>
                                  )}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden divide-y divide-[rgb(var(--color-border-primary))]">
                    {invoices.map((inv) => {
                      const isCurDownloading =
                        isDownloading === inv.invoiceId;
                      const invoiceNumber =
                        inv.receipt ||
                        `INV-${String(inv.invoiceId || "").slice(-6).toUpperCase()}`;

                      return (
                        <div key={inv.invoiceId || inv.orderId} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold text-sm text-[rgb(var(--color-text-primary))] flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                                <span>{invoiceNumber}</span>
                              </div>
                              <p className="text-xs text-[rgb(var(--color-text-tertiary))] font-mono mt-0.5">
                                {inv.orderId}
                              </p>
                            </div>
                            <div>{getPaymentStatusBadge(inv.status)}</div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[rgb(var(--color-border-primary))]/50">
                            <div>
                              <span className="text-[rgb(var(--color-text-tertiary))]">
                                {t?.("subscription.billingHistory.date") ||
                                  "Date"}
                                :
                              </span>
                              <p className="font-medium text-[rgb(var(--color-text-secondary))] mt-0.5">
                                {formatDate(inv.paidAt || inv.createdAt)}
                              </p>
                            </div>
                            <div>
                              <span className="text-[rgb(var(--color-text-tertiary))]">
                                {t?.("subscription.billingHistory.amount") ||
                                  "Amount"}
                                :
                              </span>
                              <p className="font-bold text-sm text-[rgb(var(--color-text-primary))] mt-0.5">
                                {formatAmount(
                                  inv.finalAmount ?? inv.baseAmount,
                                  inv.currency,
                                )}
                              </p>
                            </div>
                            <div>
                              <span className="text-[rgb(var(--color-text-tertiary))]">
                                {t?.("subscription.billingHistory.plan") ||
                                  "Plan"}
                                :
                              </span>
                              <p className="font-medium text-[rgb(var(--color-text-secondary))] mt-0.5">
                                {inv.months
                                  ? `${inv.months} Month(s)`
                                  : inv.billingCycle || "Plan"}
                              </p>
                            </div>
                            <div>
                              <span className="text-[rgb(var(--color-text-tertiary))]">
                                {t?.("subscription.billingHistory.invoiceStatus") ||
                                  "Invoice"}
                                :
                              </span>
                              <div className="mt-0.5">
                                {getInvoicePdfBadge(inv.invoice)}
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isCurDownloading}
                            onClick={() => onDownload(inv)}
                            className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-xl"
                          >
                            {isCurDownloading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>
                                  {t?.(
                                    "subscription.billingHistory.downloading",
                                  ) || "Downloading..."}
                                </span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                <span>
                                  {t?.(
                                    "subscription.billingHistory.downloadPdf",
                                  ) || "Download PDF"}
                                </span>
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Right column shortcuts */}
          {ManagementShortcuts && <ManagementShortcuts />}
        </div>
      </div>
    </div>
  );
}

