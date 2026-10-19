"use client";
import { FileText, Plus } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";

/** Shared presentation; hosts supply data and platform-bound list adapters. */
export function InvoicesScreen({
  t,
  invoices,
  isLoading,
  error,
  InvoiceListHeader,
  InvoiceListContent,
  onCreate,
}) {
  return (
    <div className="overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <InvoiceListHeader />

        <div className="px-5">
          {error && !(isLoading) && invoices.length === 0 && <EmptyState fullHeight type="error" title={t("common.error")} description={typeof error === "string" ? error : error.message} />}

          {/* Loading State */}
          {isLoading && invoices.length === 0 && !error && <PageLoader />}

          {/* Empty State */}
          {!isLoading && invoices.length === 0 && !error && (
            <EmptyState
                fullHeight
              className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
              title={t("common.noResults") || "No Invoices Found"}
              description={
                error
                  ? `${t("common.error")}: ${error}`
                  : t("invoice.emptyDescription") ||
                    "You haven't created any invoices yet. Start by creating your first one!"
              }
              icon={FileText}
              type={error ? "error" : "empty"}
              actionButton={{
                label: t("invoice.createInvoice"),
                icon: Plus,
                onClick: onCreate,
              }}
            />
          )}

          {/* Invoices List */}
          {invoices.length > 0 && <InvoiceListContent />}
        </div>
      </div>
    </div>
  );
}
export default InvoicesScreen;
