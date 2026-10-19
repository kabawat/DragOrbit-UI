"use client";
import { NumberedTable } from "@dragorbit/ui";
import { MoreVertical } from "lucide-react";
export function PaymentTableHeaderView({ model }) {
  const { t } = model;
  return (
    <div className="bg-gradient-to-r from-[rgb(var(--color-bg-tertiary))] to-[rgb(var(--color-bg-secondary))] border-b border-[rgb(var(--color-border-primary))] sticky top-0 z-20">
      <NumberedTable className="w-full min-w-[1000px] table-fixed">
        <thead>
          <tr>
            <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
              {t("payments.payment", { defaultValue: "Payment" })}
            </th>
            <th className="w-[14.28%] px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
              {t("payments.supplier", { defaultValue: "Supplier" })}
            </th>
            <th className="w-[14.28%] px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
              {t("common.date", { defaultValue: "Date" })}
            </th>
            <th className="w-[14.28%] px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
              {t("payments.amount", { defaultValue: "Amount" })}
            </th>
            <th className="w-[14.28%] px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
              {t("payments.type", { defaultValue: "Type" })}
            </th>
            <th className="w-[14.28%] px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
              {t("payments.method", { defaultValue: "Method" })}
            </th>
            <th className="w-[14.28%] px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
              {t("common.status", { defaultValue: "Status" })}
            </th>
            <th className="w-32 px-6 py-4 text-center text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
              <MoreVertical className="w-4 h-4 mx-auto" />
            </th>
          </tr>
        </thead>
      </NumberedTable>
    </div>
  );
}
