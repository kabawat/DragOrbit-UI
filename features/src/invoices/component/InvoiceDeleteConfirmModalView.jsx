"use client";
import { AlertTriangle } from "lucide-react";
export function InvoiceDeleteConfirmModalPresentation({ model }) {
  const { invoiceNumber, Button, onClose, loading, handleConfirmDelete } =
    model;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999]">
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg p-6 max-w-md w-full mx-4 mt-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-[rgb(var(--color-danger))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-[rgb(var(--color-danger))]" />
          </div>
          <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            Delete Invoice
          </h3>
          <p className="text-[rgb(var(--color-text-secondary))] mb-6">
            {invoiceNumber ? (
              <>
                Are you sure you want to delete invoice{" "}
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                  "{invoiceNumber}"
                </span>
                ? This action cannot be undone.
              </>
            ) : (
              "Are you sure you want to delete this invoice? This action cannot be undone."
            )}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={loading}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
