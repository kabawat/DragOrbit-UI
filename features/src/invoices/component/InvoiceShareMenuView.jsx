"use client";
import { Copy, Download, Mail, MessageCircle, Send } from "lucide-react";

export function InvoiceShareMenuPresentation({ model }) {
  const {
    className = "",
    menuRef,
    setIsOpen,
    t = (k, def) =>
      typeof def === "object" ? def?.defaultValue || k : def || k,
    buttonClassName = "",
    dropdownClassName = "",
    isOpen,
    showDownload,
    onDownloadPDF,
    handleDownload,
    handleWhatsApp,
    handleEmail,
    handleCopyLink,
    align = "left",
  } = model;

  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div
      className={`relative ${className ? className : "inline-block"} ${isOpen ? "z-50" : ""}`}
      ref={menuRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-primary))] hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] text-xs font-semibold transition-colors duration-200 cursor-pointer shadow-none ${buttonClassName}`}
        title={
          typeof t === "function"
            ? t("common.send", { defaultValue: "Send" })
            : "Send"
        }
      >
        <Send className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" />
        <span>
          {typeof t === "function"
            ? t("common.send", { defaultValue: "Send" }) || "Send"
            : "Send"}
        </span>
      </button>

      {isOpen ? (
        <div
          className={`absolute ${alignClass} top-full mt-1.5 w-48 sm:w-52 bg-[rgb(var(--color-bg-primary))] rounded-xl shadow-xl border border-[rgb(var(--color-border-primary))] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${dropdownClassName}`}
        >
          {showDownload && onDownloadPDF ? (
            <>
              <button
                type="button"
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2.5 cursor-pointer transition-colors duration-150"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 text-[rgb(var(--color-text-secondary))] shrink-0" />
                <span>
                  {typeof t === "function"
                    ? t("invoice.downloadPDF", {
                        defaultValue: "Download PDF",
                      }) || "Download PDF"
                    : "Download PDF"}
                </span>
              </button>
              <div className="my-1 border-t border-[rgb(var(--color-border-primary))]/30" />
            </>
          ) : null}

          <button
            type="button"
            className="w-full px-3.5 py-2 text-left text-xs font-medium text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2.5 cursor-pointer transition-colors duration-150"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {typeof t === "function"
                ? t("common.whatsapp", { defaultValue: "WhatsApp" }) ||
                  "WhatsApp"
                : "WhatsApp"}
            </span>
          </button>

          <button
            type="button"
            className="w-full px-3.5 py-2 text-left text-xs font-medium text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2.5 cursor-pointer transition-colors duration-150"
            onClick={handleEmail}
          >
            <Mail className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              {typeof t === "function"
                ? t("common.email", { defaultValue: "Email" }) || "Email"
                : "Email"}
            </span>
          </button>

          <div className="my-1 border-t border-[rgb(var(--color-border-primary))]/30" />

          <button
            type="button"
            className="w-full px-3.5 py-2 text-left text-xs font-medium text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2.5 cursor-pointer transition-colors duration-150"
            onClick={handleCopyLink}
          >
            <Copy className="w-4 h-4 text-purple-500 shrink-0" />
            <span>
              {typeof t === "function"
                ? t("common.copyLink", { defaultValue: "Copy Link" }) ||
                  "Copy Link"
                : "Copy Link"}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
