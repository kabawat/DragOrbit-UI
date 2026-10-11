"use client";
import { ChevronDown, Upload, Users, Wallet } from "lucide-react";
import { Button } from "@dragorbit/ui";
export function CustomerImportMenuPresentation({ model }) {
  const {
    className,
    menuRef,
    setIsOpen,
    t,
    isOpen,
    handleSelect,
    onOpeningBalance,
    onBulkUpload,
  } = model;
  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 h-9"
      >
        <Upload className="w-4 h-4" />
        <span>{t("customers.importMenu", "Import")}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-50">
          <button
            type="button"
            onClick={() => handleSelect(onOpeningBalance)}
            className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
            {t("customers.importOpeningBalance", "Import Opening Balance")}
          </button>
          <button
            type="button"
            onClick={() => handleSelect(onBulkUpload)}
            className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] cursor-pointer"
          >
            <Users className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
            {t("customers.bulkUpload", "Bulk Upload")}
          </button>
        </div>
      )}
    </div>
  );
}
