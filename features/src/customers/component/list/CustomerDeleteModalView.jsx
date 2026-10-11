"use client";
import { Button } from "@dragorbit/ui";
export function ListCustomerDeleteModalPresentation({ model }) {
  const { t, customerToDelete, handleClose, isDeleting, handleConfirm } = model;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4">
          {t("customers.deleteCustomer") || "Delete Customer"}
        </h3>
        <p className="text-[rgb(var(--color-text-secondary))] mb-6">
          Are you sure you want to delete <b>{customerToDelete?.name}</b> ? This
          action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            {t("common.cancel")}
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={isDeleting}>
            {t("common.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
