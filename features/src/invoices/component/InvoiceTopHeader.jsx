"use client";
import { memo } from "react";
import { ArrowLeft, Plus } from "lucide-react";

export const InvoiceTopHeader = ({
  t = (k) => k,
  onBack,
  onCreateNew,
  isEditMode = false,
  showCreateNew = isEditMode,
}) => {
  return (
    <div className="mb-3 sm:mb-4 flex-shrink-0 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center space-x-2 px-3 py-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">
          {t("invoice.backToInvoices") ||
            t("common.backTo", { item: t("common.invoices") }) ||
            "Back to Invoices"}
        </span>
      </button>

      {showCreateNew && (
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10 hover:bg-[rgb(var(--color-primary))]/20 rounded-lg transition-colors border border-[rgb(var(--color-primary))]/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("invoice.createNewInvoice") || "Create New"}</span>
        </button>
      )}
    </div>
  );
};

export default memo(InvoiceTopHeader);
