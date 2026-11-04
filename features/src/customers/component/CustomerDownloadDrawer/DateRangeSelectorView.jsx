"use client";
import { DateRangeFilter } from "@dragorbit/ui";
export function CustomerDownloadDrawerDateRangeSelectorPresentation({ model }) {
  const { label, t, startDate, endDate, onChange } = model;
  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
        {label || t("customers.selectTimePeriod")}
      </label>
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
      />
    </div>
  );
}
