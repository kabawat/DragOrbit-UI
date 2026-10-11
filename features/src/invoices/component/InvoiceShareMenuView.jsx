"use client";
import { Copy, Download, Mail, MessageCircle, Send } from "lucide-react";
import { AddActionButton } from "@dragorbit/ui";
export function InvoiceShareMenuPresentation({ model }) {
  const {
    className,
    menuRef,
    setIsOpen,
    t,
    buttonClassName,
    isOpen,
    showDownload,
    onDownloadPDF,
    handleDownload,
    handleWhatsApp,
    handleEmail,
    handleCopyLink,
  } = model;
  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <AddActionButton
        onClick={() => setIsOpen((open) => !open)}
        Icon={Send}
        label={t("common.send")}
        size="sm"
        title={t("common.send")}
        className={buttonClassName}
      />
      {isOpen ? (
        <div className="absolute right-0 top-full mt-1 w-48 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-50">
          {showDownload && onDownloadPDF ? (
            <>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                {t("invoice.downloadPDF")}
              </button>
              <div className="my-1 border-t border-[rgb(var(--color-border-primary))]" />
            </>
          ) : null}
          <button
            type="button"
            className="w-full px-3 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
            {t("common.whatsapp")}
          </button>
          <button
            type="button"
            className="w-full px-3 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
            onClick={handleEmail}
          >
            <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            {t("common.email")}
          </button>
          <div className="my-1 border-t border-[rgb(var(--color-border-primary))]" />
          <button
            type="button"
            className="w-full px-3 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
            onClick={handleCopyLink}
          >
            <Copy className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            {t("common.copyLink")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
