"use client";

import { DataTable } from "@dragorbit/ui/table";
import { Button, EmptyState } from "@dragorbit/ui";
import {
	CalendarCheck,
	ChevronLeft,
	ChevronRight,
	ClipboardList,
	Loader2,
	UserCheck,
} from "lucide-react";
export function StaffAttendanceTabView({ model }) {
	const {
		t,
		monthLabel,
		handleOpenMarkDrawer,
		storeId,
		setViewMonth,
		shiftMonth,
		formatMonthInput,
		records,
		ATTENDANCE_STATUSES,
		AttendanceStatusBadge,
		summary,
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
							<ClipboardList className="h-4 w-4" />
						</div>
						<div>
							<h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
								{t("staff.attendance.recordsTitle") || "Monthly records"}
							</h3>
							<p className="text-xs text-[rgb(var(--color-text-secondary))]">
								{monthLabel}
							</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
						<Button
							type="button"
							leftIcon={CalendarCheck}
							onClick={handleOpenMarkDrawer}
							disabled={!storeId}
							className="w-full sm:w-auto"
						>
							{t("staff.attendance.mark") || "Mark attendance"}
						</Button>

						<button
							type="button"
							onClick={() => setViewMonth((prev) => shiftMonth(prev, -1))}
							className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
							aria-label={
								t("staff.attendance.previousMonth") || "Previous month"
							}
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => setViewMonth(formatMonthInput())}
							className="rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-text-primary))] transition-colors hover:bg-[rgb(var(--color-bg-tertiary))]"
						>
							{t("staff.attendance.thisMonth") || "This month"}
						</button>
						<button
							type="button"
							onClick={() => setViewMonth((prev) => shiftMonth(prev, 1))}
							className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
							aria-label={t("staff.attendance.nextMonth") || "Next month"}
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>

				{records.length > 0 && (
					<div className="flex flex-wrap gap-2 border-b border-[rgb(var(--color-border-primary)/0.3)] bg-[rgb(var(--color-bg-secondary)/0.35)] px-4 py-3 sm:px-5">
						{ATTENDANCE_STATUSES.map((status) => (
							<div
								key={status}
								className="inline-flex items-center gap-2 rounded-lg border border-[rgb(var(--color-border-primary)/0.35)] bg-[rgb(var(--color-bg-primary))] px-3 py-1.5"
							>
								<AttendanceStatusBadge
									status={status}
									label={t(
										`staff.attendance.statuses.${status}`,
										status.replace("_", " "),
									)}
								/>
								<span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
									{summary[status]}
								</span>
							</div>
						))}
					</div>
				)}

				{loading && records.length === 0 ? (
					<div className="flex items-center justify-center gap-2 py-14 text-sm text-[rgb(var(--color-text-secondary))]">
						<Loader2 size={16} className="animate-spin" />
						{t("staff.attendance.loading") || "Loading attendance..."}
					</div>
				) : records.length === 0 ? (
					<EmptyState
						size="sm"
						className="border-0 bg-transparent py-10"
						icon={UserCheck}
						title={t("staff.attendance.emptyTitle") || "No attendance yet"}
						description={
							t("staff.attendance.empty") ||
							"No attendance records for this month."
						}
						actionButton={{
							label: t("staff.attendance.mark") || "Mark attendance",
							onClick: handleOpenMarkDrawer,
							icon: CalendarCheck,
						}}
					/>
				) : (
					<div className="overflow-x-auto">
						<DataTable className="min-w-0" caption="Staff attendance">
							<thead className="bg-[rgb(var(--color-bg-secondary)/0.55)] text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
								<tr>
									<th className="px-4 py-3 font-medium sm:px-5">
										{t("staff.attendance.staff") || "Staff member"}
									</th>
									<th className="px-4 py-3 font-medium sm:px-5">
										{t("staff.attendance.date") || "Date"}
									</th>
									<th className="px-4 py-3 font-medium sm:px-5">
										{t("staff.attendance.status") || "Status"}
									</th>
									<th className="hidden px-4 py-3 font-medium md:table-cell sm:px-5">
										{t("staff.attendance.notes") || "Notes"}
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
									const status = record.status || "PRESENT";
									return (
										<tr
											key={record.localId || record.id || record.serverId}
											className="transition-colors hover:bg-[rgb(var(--color-bg-secondary)/0.35)]"
										>
											<td className="px-4 py-3.5 font-medium text-[rgb(var(--color-text-primary))] sm:px-5">
												{staff?.name || record.staff}
											</td>
											<td className="px-4 py-3.5 text-[rgb(var(--color-text-secondary))] sm:px-5">
												{formatDateShort(record.dateKey || record.date)}
											</td>
											<td className="px-4 py-3.5 sm:px-5">
												<AttendanceStatusBadge
													status={status}
													label={t(
														`staff.attendance.statuses.${status}`,
														status.replace("_", " "),
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
						</DataTable>
					</div>
				)}
			</section>
		</div>
	);
}
