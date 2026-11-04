"use client";
import { Button, Input, Select } from "@dragorbit/ui";
import { CalendarCheck } from "lucide-react";
export function MarkAttendanceDrawerView({ model }) {
  const {
    handleSubmit,
    staffOptions,
    t,
    form,
    setForm,
    statusOptions,
    isOnline,
    handleClose,
    loading,
  } = model;
  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {staffOptions.length === 0 ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800">
            {t("staff.attendance.noActiveStaff") ||
              "No active staff members found. Add or activate team members before marking attendance."}
          </div>
        ) : (
          <Select
            label={t("staff.attendance.staff") || "Staff member"}
            placeholder={t("staff.attendance.selectStaff") || "Select staff"}
            value={form.staff}
            onChange={(value) => setForm((prev) => ({ ...prev, staff: value }))}
            options={staffOptions}
            clearable={false}
            required
          />
        )}

        <Input
          type="date"
          label={t("staff.attendance.date") || "Date"}
          value={form.date}
          onChange={(value) => setForm((prev) => ({ ...prev, date: value }))}
          required
        />

        <Select
          label={t("staff.attendance.status") || "Status"}
          value={form.status}
          onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
          options={statusOptions}
          clearable={false}
        />

        <Input
          type="text"
          label={t("staff.attendance.notes") || "Notes"}
          placeholder={
            t("staff.attendance.notesPlaceholder") || "Optional note"
          }
          value={form.notes}
          onChange={(value) => setForm((prev) => ({ ...prev, notes: value }))}
        />

        <p className="text-xs text-[rgb(var(--color-text-secondary))]">
          {t("staff.attendance.formHint") ||
            "Attendance is saved for the selected date."}
        </p>
        {!isOnline && (
          <p className="text-xs text-amber-700">
            {t("staff.attendance.offlineHint") ||
              "Offline mode: attendance will be saved locally and synced when you are back online."}
          </p>
        )}
      </div>

      <div className="flex flex-shrink-0 flex-col-reverse gap-2 border-t border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={handleClose}>
          {t("common.cancel") || "Cancel"}
        </Button>
        <Button
          type="submit"
          leftIcon={CalendarCheck}
          disabled={loading || !form.staff || staffOptions.length === 0}
        >
          {t("staff.attendance.mark") || "Mark attendance"}
        </Button>
      </div>
    </form>
  );
}
