"use client";
import { memo } from "react";
import { CheckCircle, Plus, Save } from "lucide-react";
import { Button } from "@dragorbit/ui";

export const InvoiceStickyActionsBar = ({
  t = (k) => k,
  itemsCount = 0,
  grandTotal = 0,
  onCancel,
  onSubmit,
  onRelease,
  loading = false,
  isEditMode = false,
  isDraftSaved = false,
  isDirty = true,
}) => {
  const isDraft = Boolean(isDraftSaved || isEditMode);
  const showRelease = isDraft && !isDirty;

  const isSubmitDisabled = itemsCount === 0 || loading;

  const buttonText = showRelease
    ? t("invoice.releaseInvoice") || "Release Invoice"
    : isDraft
      ? t("invoice.updateInvoice") || "Update Invoice"
      : t("invoice.createInvoiceButton") || "Create Invoice";

  const buttonIcon = showRelease ? CheckCircle : isDraft ? Save : Plus;
  const buttonVariant = showRelease ? "success" : "primary";
  const buttonAction = showRelease ? (onRelease || onSubmit) : onSubmit;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-2 sm:gap-4 text-sm text-[rgb(var(--color-text-secondary))] w-full sm:w-auto justify-between sm:justify-start">
        <span className="font-medium text-[rgb(var(--color-text-primary))]">
          {itemsCount}{" "}
          {itemsCount === 1
            ? t("invoice.item") || "item"
            : t("invoice.items") || "items"}{" "}
          {t("invoice.added") || "added"}
        </span>
        <span className="text-[rgb(var(--color-border-primary))]/60 hidden sm:inline">
          •
        </span>
        <span className="font-bold text-[rgb(var(--color-text-primary))] text-base sm:text-lg">
          {t("invoice.total") || "Total"}: ₹{Number(grandTotal).toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-initial min-w-[100px] justify-center"
          onClick={onCancel}
          disabled={loading}
        >
          {t("common.cancel") || "Cancel"}
        </Button>
        <Button
          type="button"
          variant={buttonVariant}
          size="sm"
          className="flex-1 sm:flex-initial min-w-[140px] justify-center"
          onClick={buttonAction}
          loading={loading}
          leftIcon={buttonIcon}
          disabled={isSubmitDisabled}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default memo(InvoiceStickyActionsBar);
