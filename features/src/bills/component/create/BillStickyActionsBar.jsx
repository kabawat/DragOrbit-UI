"use client";
import { memo } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@dragorbit/ui";

export const BillStickyActionsBar = ({
  t = (k) => k,
  itemsCount = 0,
  totalUnits = 0,
  grandTotal = 0,
  onCancel,
  onSubmit,
  loading = false,
  isEditMode = false,
  disabled = false,
}) => {
  const isSubmitDisabled = itemsCount === 0 || loading || disabled;

  const buttonText = isEditMode
    ? t("bills.updateBill") || "Update Bill"
    : t("bills.createBill") || "Create Bill";

  const buttonIcon = isEditMode ? Save : Plus;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-2 sm:gap-4 text-sm text-[rgb(var(--color-text-secondary))] w-full sm:w-auto justify-between sm:justify-start">
        <span className="font-medium text-[rgb(var(--color-text-primary))]">
          {itemsCount}{" "}
          {itemsCount === 1
            ? t("common.item") || "item"
            : t("common.items") || "items"}{" "}
          ({totalUnits}{" "}
          {totalUnits === 1
            ? t("common.unit") || "unit"
            : t("common.units") || "units"})
        </span>
        <span className="text-[rgb(var(--color-border-primary))]/60 hidden sm:inline">
          •
        </span>
        <span className="font-bold text-[rgb(var(--color-text-primary))] text-base sm:text-lg">
          {t("common.total") || "Total"}: ₹{Number(grandTotal).toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {onCancel && (
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
        )}
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="flex-1 sm:flex-initial min-w-[140px] justify-center"
          onClick={onSubmit}
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

export default memo(BillStickyActionsBar);
