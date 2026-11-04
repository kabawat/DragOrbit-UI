"use client";
import { Calendar } from "lucide-react";
export function CustomerDownloadDrawerDateRangePreviewPresentation({ model }) {
  const { t, dateRange } = model;
  return (
    <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
        <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide">
          {t("customers.dateRange")}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
            {t("customers.from")}
          </div>
          <div className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            {dateRange.start}
          </div>
        </div>
        <div className="space-y-1 border-l border-[rgb(var(--color-border-primary))] pl-4">
          <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
            {t("customers.to")}
          </div>
          <div className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            {dateRange.end}
          </div>
        </div>
      </div>
    </div>
  );
}
