"use client";
import { memo } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button, Modal } from "@dragorbit/ui";

export const DiscardInvoiceModal = ({
  isOpen,
  onClose,
  onDiscard,
  onSaveDraft,
  isSaving = false,
  isEdit = false,
  mode = isEdit ? "edit" : "create",
  saveButtonText,
  title,
  description,
  t = (k) => k,
}) => {
  if (!isOpen) return null;

  const isEditMode = mode === "edit";

  const modalTitle =
    title ||
    (isEditMode
      ? t("invoice.discardChangesTitle") || "Discard Changes?"
      : t("invoice.discardInvoiceTitle") || "Discard Added Items?");

  const modalDescription =
    description ||
    (isEditMode
      ? t("invoice.discardChangesDescription") ||
        "You have unsaved changes in this invoice. Are you sure you want to discard them, or would you like to update the invoice?"
      : t("invoice.discardInvoiceDescription") ||
        "You have added items in this invoice. Are you sure you want to discard them, or would you like to save them as a draft?");

  const actionText =
    saveButtonText ||
    (isEditMode
      ? t("invoice.update") || t("common.update") || "Update"
      : t("invoice.saveAsDraft") || "Save as Draft");

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? () => {} : onClose}
      size="md"
      showCloseButton={false}
      bodyClassName="!p-0"
      className="!rounded-2xl !overflow-hidden shadow-2xl border border-[rgb(var(--color-border-primary))]/40"
    >
      <div className="p-6 sm:p-7 flex flex-col gap-5 w-full">
        {/* Title & Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text-primary))] leading-snug">
            {modalTitle}
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
            {modalDescription}
          </p>
        </div>

        {/* 3 Action Buttons: Cancel, Yes Discard, Save as Draft / Update */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 mt-1 border-t border-[rgb(var(--color-border-primary))]/25 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="w-full sm:w-auto min-w-[85px] justify-center"
          >
            {t("common.cancel") || "Cancel"}
          </Button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onDiscard}
            disabled={isSaving}
            leftIcon={Trash2}
            className="w-full sm:w-auto min-w-[115px] justify-center"
          >
            {t("invoice.yesDiscard") || "Yes, Discard"}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onSaveDraft}
            loading={isSaving}
            leftIcon={Save}
            className="w-full sm:w-auto min-w-[125px] justify-center font-medium"
          >
            {actionText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(DiscardInvoiceModal);
