"use client";
import { Tooltip as SharedTooltip } from "@dragorbit/ui";
import { Copy, Edit2, Plus, QrCode, Trash2, Wallet } from "lucide-react";
export function UpiListView({ model }) {
  const {
    upiIds,
    t,
    onEditUpi,
    onDeleteUpi,
    getStoreNames,
    handleCopyUpi,
    copiedUpiId,
    setQrModalItem,
    onAddUpi,
    UpiQrModal,
    qrModalItem,
  } = model;
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {upiIds.map((item) => {
          const id = item.id;
          return (
            <div
              key={id}
              className="relative flex h-full flex-col rounded-lg border border-[rgb(var(--color-border-primary))]/70 bg-[rgb(var(--color-bg-primary))]/20 p-4"
            >
              {/* Card Header - Icon + Label + Action Buttons (like Store card) */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))]/10">
                    <Wallet className="h-4 w-4 text-[rgb(var(--color-primary))]" />
                  </div>
                  {item.label && (
                    <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))] truncate">
                      {item.label}
                    </span>
                  )}
                  {item.isDefault && (
                    <span className="text-[0.625rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex-shrink-0">
                      {t("settings.upi.defaultBadge")}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <SharedTooltip content={t("settings.upi.edit")}><button aria-label={t("settings.upi.edit")}
                    type="button"
                    onClick={() => onEditUpi?.(item)}
                    className="w-8 h-8 flex items-center justify-center bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors cursor-pointer"

                  >
                    <Edit2 className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                  </button></SharedTooltip>
                  <SharedTooltip content={t("settings.upi.delete")}><button aria-label={t("settings.upi.delete")}
                    type="button"
                    onClick={() => onDeleteUpi?.(item)}
                    className="w-8 h-8 flex items-center justify-center bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors cursor-pointer"

                  >
                    <Trash2 className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                  </button></SharedTooltip>
                </div>
              </div>

              {/* UPI ID - prominent like Store name */}
              <h3 className="mb-2 break-all text-base font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
                {item.upiId}
              </h3>

              {/* Accessible by stores - like GST, PAN (bold label + value) */}
              <div className="mb-3 space-y-1">
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  <span className="font-medium text-[rgb(var(--color-text-primary))]">
                    {t(
                      "settings.upi.accessibleByStores",
                      "Accessible by stores",
                    )}
                    :
                  </span>
                  {getStoreNames(item.storeIds)}
                </p>
              </div>

              {/* Divider + Action buttons (like Manage UPI & Public Catalog) */}
              <div className="mt-auto space-y-2 border-t border-[rgb(var(--color-border-primary))]/40 pt-3">
                <button
                  type="button"
                  onClick={() => handleCopyUpi(item.upiId, id)}
                  className={`w-full px-3 py-2 rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    copiedUpiId === id
                      ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/15"
                      : "bg-[rgb(var(--color-bg-secondary))] border-[rgb(var(--color-border-primary))]/50 hover:bg-[rgb(var(--color-bg-tertiary))]"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      copiedUpiId === id
                        ? "text-green-600 dark:text-green-400"
                        : "text-[rgb(var(--color-text-primary))]"
                    }`}
                  >
                    {copiedUpiId === id
                      ? t("settings.upi.copied", "Copied")
                      : t("settings.upi.copy")}
                  </span>
                  <Copy
                    className={`w-4 h-4 ${
                      copiedUpiId === id
                        ? "text-green-600 dark:text-green-400"
                        : "text-[rgb(var(--color-text-secondary))]"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setQrModalItem(item)}
                  className="w-full bg-[rgb(var(--color-primary))]/5 px-3 py-2 rounded-lg border border-[rgb(var(--color-primary))]/10 hover:bg-[rgb(var(--color-primary))]/10 transition-all flex items-center justify-between gap-2 overflow-hidden group cursor-pointer"
                >
                  <div className="flex flex-col items-start truncate text-left">
                    <span className="text-[0.625rem] uppercase tracking-wider font-bold text-[rgb(var(--color-primary))] mb-0.5">
                      {t("settings.upi.upiQrCode")}
                    </span>
                    <span className="text-xs text-[rgb(var(--color-primary))] truncate">
                      {item.upiId}
                    </span>
                  </div>
                  <div className="flex-shrink-0 p-1.5 bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] rounded-md group-hover:bg-[rgb(var(--color-primary))] group-hover:text-white transition-all">
                    <QrCode className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New UPI Card - dashed border like Create New Store */}
        <button
          type="button"
          onClick={onAddUpi}
          className="relative flex min-h-[190px] h-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[rgb(var(--color-border-primary))]/70 bg-[rgb(var(--color-bg-primary))]/20 p-4 transition-colors hover:border-[rgb(var(--color-primary))]/60 hover:bg-[rgb(var(--color-primary))]/5"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10">
            <Plus className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-1">
            {t("settings.upi.addNewUpi")}
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] text-center max-w-[220px]">
            {t("settings.upi.addAnotherUpi", "Add another UPI ID")}
          </p>
        </button>
      </div>

      <UpiQrModal
        isOpen={!!qrModalItem}
        onClose={() => setQrModalItem(null)}
        upiId={qrModalItem?.upiId}
        label={qrModalItem?.label}
      />
    </>
  );
}
