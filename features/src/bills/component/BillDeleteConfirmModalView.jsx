"use client";
import { Button, Modal } from "@dragorbit/ui";
export function BillDeleteConfirmModalPresentation({ model }) {
  const {
    isOpen,
    onClose,
    t,
    billToDelete,
    formatCurrency,
    isDeleting,
    onConfirm,
  } = model;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("bills.deleteBill")}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-[rgb(var(--color-text-secondary))]">
          {t("bills.deleteConfirmMessage")}
        </p>
        {billToDelete && (
          <div className="bg-[rgb(var(--color-bg-secondary))] p-4 rounded-lg border border-[rgb(var(--color-border-primary))]">
            <p className="font-medium text-[rgb(var(--color-text-primary))]">
              {t("bills.bill")}: {billToDelete.billNumber}
            </p>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {t("bills.amount")}: {formatCurrency(billToDelete.totalAmount)}
            </p>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isDeleting ? t("common.deleting") : t("bills.deleteBill")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
