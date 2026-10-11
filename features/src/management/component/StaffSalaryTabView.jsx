"use client";
import { Button, EmptyState } from "@dragorbit/ui";
import {
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Loader2,
  Wallet,
} from "lucide-react";
export function StaffSalaryTabView({ model }) {
  const {
    t,
    monthLabel,
    onOpenRecordDrawer,
    storeId,
    setViewMonth,
    shiftMonth,
    formatMonthInput,
    records,
    formatAmount,
    summary,
    PAYMENT_MODES,
    PaymentModeBadge,
    loading,
    activeStaff,
    getStaffId,
    formatDateShort,
  } = model;
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[rgb(var(--color-border-primary)/0.45)] bg-[rgb(var(--color-bg-primary))] overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[rgb(var(--color-border-primary)/0.35)] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))]">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                {t("staff.salary.recordsTitle") || "Monthly payments"}
              </h3>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {monthLabel}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              leftIcon={IndianRupee}
              onClick={() => onOpenRecordDrawer?.()}
              disabled={!storeId}
              className="w-full sm:w-auto"
            >
              {t("staff.salary.record") || "Record salary"}
            </Button>

            <button
              type="button"
              onClick={() => setViewMonth((prev) => shiftMonth(prev, -1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
              aria-label={t("staff.salary.previousMonth") || "Previous month"}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMonth(formatMonthInput())}
              className="rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-text-primary))] transition-colors hover:bg-[rgb(var(--color-bg-tertiary))]"
            >
              {t("staff.salary.thisMonth") || "This month"}
            </button>
            <button
              type="button"
              onClick={() => setViewMonth((prev) => shiftMonth(prev, 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
              aria-label={t("staff.salary.nextMonth") || "Next month"}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {records.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-[rgb(var(--color-border-primary)/0.3)] bg-[rgb(var(--color-bg-secondary)/0.35)] px-4 py-3 sm:px-5">
            <div className="inline-flex items-center gap-2 rounded-lg border border-[rgb(var(--color-border-primary)/0.35)] bg-[rgb(var(--color-bg-primary))] px-3 py-1.5">
              <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
                {t("staff.salary.totalAmount") || "Total paid"}
              </span>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                {formatAmount(summary.totals.amount)}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-[rgb(var(--color-border-primary)/0.35)] bg-[rgb(var(--color-bg-primary))] px-3 py-1.5">
              <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
                {t("staff.salary.totalPayments") || "Payments"}
              </span>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                {summary.totals.count}
              </span>
            </div>
            {PAYMENT_MODES.filter((mode) => summary.byMode[mode] > 0).map(
              (mode) => (
                <div
                  key={mode}
                  className="inline-flex items-center gap-2 rounded-lg border border-[rgb(var(--color-border-primary)/0.35)] bg-[rgb(var(--color-bg-primary))] px-3 py-1.5"
                >
                  <PaymentModeBadge
                    mode={mode}
                    label={t(
                      `staff.salary.paymentModes.${mode}`,
                      mode.replace("_", " "),
                    )}
                  />
                  <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                    {summary.byMode[mode]}
                  </span>
                </div>
              ),
            )}
          </div>
        )}

        {loading && records.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-[rgb(var(--color-text-secondary))]">
            <Loader2 size={16} className="animate-spin" />
            {t("staff.salary.loading") || "Loading salary payments..."}
          </div>
        ) : records.length === 0 ? (
          <EmptyState
            size="sm"
            className="border-0 bg-transparent py-10"
            icon={Wallet}
            title={t("staff.salary.emptyTitle") || "No salary payments yet"}
            description={
              t("staff.salary.empty") ||
              "No salary payments recorded for this month."
            }
            actionButton={{
              label: t("staff.salary.record") || "Record salary",
              onClick: () => onOpenRecordDrawer?.(),
              icon: IndianRupee,
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[rgb(var(--color-bg-secondary)/0.55)] text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
                <tr>
                  <th className="px-4 py-3 font-medium sm:px-5">
                    {t("staff.salary.staff") || "Staff member"}
                  </th>
                  <th className="px-4 py-3 font-medium sm:px-5">
                    {t("staff.salary.period") || "Pay period"}
                  </th>
                  <th className="px-4 py-3 font-medium sm:px-5">
                    {t("staff.salary.amount") || "Amount"}
                  </th>
                  <th className="px-4 py-3 font-medium sm:px-5">
                    {t("staff.salary.paymentMode") || "Payment mode"}
                  </th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell sm:px-5">
                    {t("staff.salary.notes") || "Notes"}
                  </th>
                  <th className="px-4 py-3 font-medium sm:px-5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border-primary)/0.3)]">
                {records.map((record) => {
                  const staff = activeStaff.find((s) => {
                    const staffId = getStaffId(s);
                    return (
                      staffId === record.staff || staffId === record.staffId
                    );
                  });
                  const mode = record.paymentMode || "CASH";
                  return (
                    <tr
                      key={record.localId || record.id || record.serverId}
                      className="transition-colors hover:bg-[rgb(var(--color-bg-secondary)/0.35)]"
                    >
                      <td className="px-4 py-3.5 font-medium text-[rgb(var(--color-text-primary))] sm:px-5">
                        {staff?.name || record.staff}
                      </td>
                      <td className="px-4 py-3.5 text-[rgb(var(--color-text-secondary))] sm:px-5">
                        {formatDateShort(record.periodStart)}
                        {record.periodEnd
                          ? ` – ${formatDateShort(record.periodEnd)}`
                          : ""}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[rgb(var(--color-text-primary))] sm:px-5">
                        {formatAmount(record.amount)}
                      </td>
                      <td className="px-4 py-3.5 sm:px-5">
                        <PaymentModeBadge
                          mode={mode}
                          label={t(
                            `staff.salary.paymentModes.${mode}`,
                            mode.replace("_", " "),
                          )}
                        />
                      </td>
                      <td className="hidden px-4 py-3.5 text-[rgb(var(--color-text-secondary))] md:table-cell sm:px-5">
                        {record.notes || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right sm:px-5">
                        {record.syncStatus === "pending" && (
                          <span className="text-xs font-medium text-amber-600">
                            {t("staff.pendingSync") || "Pending sync"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
