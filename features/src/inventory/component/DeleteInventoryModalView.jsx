"use client";
import { Package } from "lucide-react";
import { Button } from "@dragorbit/ui";
export function DeleteInventoryModalPresentation({ model }) {
  const { inventoryToDelete, onClose, isDeleting, handleConfirmDelete } = model;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-[rgb(var(--color-border-primary))]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            Delete Stock
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-6">
            Are you sure you want to delete "{inventoryToDelete?.name}"? This
            action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
