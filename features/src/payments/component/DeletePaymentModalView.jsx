"use client";
import { Button } from "@dragorbit/ui";
export function DeletePaymentModalPresentation({ model }) {
  const { t, paymentToDelete, formatCurrency, onClose, onConfirmDelete } =
    model;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999]">
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg p-6 max-w-md w-full mx-4 mt-20">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4">
          {t("payments.deletePayment", { defaultValue: "Delete Payment" })}
        </h3>
        <p className="text-[rgb(var(--color-text-secondary))] mb-6">
          {t("payments.deletePaymentConfirmation", {
            defaultValue:
              "Are you sure you want to delete this payment? This action cannot be undone.",
          })}
        </p>
        {paymentToDelete && (
          <div className="bg-[rgb(var(--color-bg-secondary))] p-4 rounded-lg mb-6">
            <p className="font-medium text-[rgb(var(--color-text-primary))]">
              {t("payments.payment", { defaultValue: "Payment" })}:
              {paymentToDelete.paymentNumber}
            </p>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {t("payments.amount", { defaultValue: "Amount" })}:
              {formatCurrency(
                paymentToDelete.totalAmount || paymentToDelete.amount,
              )}
            </p>
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button variant="danger" onClick={onConfirmDelete}>
            {t("payments.deletePayment", { defaultValue: "Delete Payment" })}
          </Button>
        </div>
      </div>
    </div>
  );
}
