"use client";
import { Button, Input, Select } from "@dragorbit/ui";
import { IndianRupee } from "lucide-react";
export function RecordSalaryDrawerView({ model }) {
  const {
    handleSubmit,
    showConfirm,
    t,
    submitSalary,
    setShowConfirm,
    staffOptions,
    form,
    setForm,
    paymentModeOptions,
    isOnline,
    handleClose,
    loading,
  } = model;
  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {showConfirm && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800">
            <p className="mb-3">
              {t("staff.salary.noAttendanceConfirm") ||
                "No attendance found for this pay period. Confirm to record salary anyway."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => submitSalary(true)}
              >
                {t("staff.salary.confirmPay") || "Confirm and pay"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setShowConfirm(false)}
              >
                {t("common.cancel") || "Cancel"}
              </Button>
            </div>
          </div>
        )}

        {staffOptions.length === 0 ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800">
            {t("staff.salary.noActiveStaff") ||
              "No active staff members found. Add or activate team members before recording salary."}
          </div>
        ) : (
          <Select
            label={t("staff.salary.staff") || "Staff member"}
            placeholder={t("staff.attendance.selectStaff") || "Select staff"}
            value={form.staff}
            onChange={(value) => setForm((prev) => ({ ...prev, staff: value }))}
            options={staffOptions}
            clearable={false}
            required
          />
        )}

        <Input
          type="number"
          label={t("staff.salary.amount") || "Amount"}
          value={form.amount}
          onChange={(value) => setForm((prev) => ({ ...prev, amount: value }))}
          min="0"
          step="0.01"
          required
        />

        <Input
          type="month"
          label={t("staff.salary.period") || "Pay period"}
          value={form.periodMonth}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, periodMonth: value }))
          }
          required
        />

        <Select
          label={t("staff.salary.paymentMode") || "Payment mode"}
          value={form.paymentMode}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, paymentMode: value }))
          }
          options={paymentModeOptions}
          clearable={false}
        />

        <Input
          type="text"
          label={t("staff.salary.notes") || "Notes"}
          placeholder={t("staff.salary.notesPlaceholder") || "Optional note"}
          value={form.notes}
          onChange={(value) => setForm((prev) => ({ ...prev, notes: value }))}
        />

        <p className="text-xs text-[rgb(var(--color-text-secondary))]">
          {t("staff.salary.formHint") ||
            "Salary is recorded for the selected pay period."}
        </p>
        {!isOnline && (
          <p className="text-xs text-amber-700">
            {t("staff.salary.offlineHint") ||
              "Offline mode: salary will be saved locally and synced when you are back online."}
          </p>
        )}
      </div>

      <div className="flex flex-shrink-0 flex-col-reverse gap-2 border-t border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={handleClose}>
          {t("common.cancel") || "Cancel"}
        </Button>
        <Button
          type="submit"
          leftIcon={IndianRupee}
          disabled={
            loading || !form.staff || !form.amount || staffOptions.length === 0
          }
        >
          {t("staff.salary.record") || "Record salary"}
        </Button>
      </div>
    </form>
  );
}
