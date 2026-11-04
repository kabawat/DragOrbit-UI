"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "../button/Button";
import { Modal } from "../modal/Modal";

export default function ConfirmDialog({
  isOpen = true,
  onClose,
  onConfirm,
  busy = false,
  title = "Confirm",
  description,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  busyLabel = "Please wait…",
  icon: Icon = AlertTriangle,
  variant = "danger",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!busy) onClose?.();
      }}
      closeOnOverlayClick={!busy}
      closeOnEscape={!busy}
      title={title}
      className="w-full max-w-md"
      footer={
        <>
          <Button variant="secondary" disabled={busy} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={variant} loading={busy} onClick={onConfirm}>
            {busy ? busyLabel : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-warning))]/15 flex items-center justify-center shrink-0">
            <Icon
              className="h-5 w-5 text-[rgb(var(--color-warning))]"
              aria-hidden
            />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
