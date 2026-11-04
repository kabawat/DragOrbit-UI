"use client";
import { Button } from "@dragorbit/ui";
export function ViewComponentsDeleteModalPresentation({ model }) {
  const { t, customerName, onCancel, isDeleting, onConfirm } = model;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-[9999]">
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4">
          Delete Customer
        </h3>
        <p className="text-[rgb(var(--color-text-secondary))] mb-6">
          {t("modals.deleteConfirmWithName", {
            name: customerName || t("common.customer"),
          })}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isDeleting}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
