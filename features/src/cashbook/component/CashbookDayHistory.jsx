"use client";
import { generateUUID } from "@dragorbit/core/utils/uuid.util";
import { Button, Input, Modal, StatCard, Textarea } from "@dragorbit/ui";
import {
	AlertCircle,
	ArrowDownLeft,
	ArrowUpRight,
	CheckCircle2,
	History,
	Wallet,
	WalletCards,
} from "lucide-react";
import { useId, useRef, useState } from "react";

const money = (value) =>
	`₹${(Number(value) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const time = (value) =>
	value
		? new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
		: "—";

export default function CashbookDayHistory({
	t,
	days = [],
	ledgerVersion,
	onReconcile,
	canEdit,
	loading,
	error,
	pendingSync,
	toolbar,
}) {
	const id = useId();
	const [dialog, setDialog] = useState(null);
	const [amount, setAmount] = useState("");
	const [reason, setReason] = useState("");
	const [saving, setSaving] = useState(false);
	const [actionError, setActionError] = useState("");
	const [conflict, setConflict] = useState(false);
	const savingRef = useRef(false);
	const open = (action, day) => {
		setDialog({
			action,
			day,
			expectedVersion: ledgerVersion,
			idempotencyKey: generateUUID(),
		});
		setAmount("");
		setReason("");
		setActionError("");
		setConflict(false);
	};
	const difference =
		Math.round(
			(Number(amount) - Number(dialog?.day?.closingBalance || 0)) * 100,
		) / 100;
	const validAmount =
		amount !== "" &&
		Number.isFinite(Number(amount)) &&
		Number(amount) >= 0 &&
		Number(amount) <= 100000000;
	const submit = async (event) => {
		event.preventDefault();
		if (savingRef.current || !validAmount || conflict) return;
		savingRef.current = true;
		setSaving(true);
		setActionError("");
		try {
			await onReconcile({
				date: dialog.day.date,
				actualCash: Number(amount),
				reason: reason.trim(),
				expectedVersion: dialog.expectedVersion,
				idempotencyKey: dialog.idempotencyKey,
			});
			setDialog(null);
		} catch (err) {
			setActionError(err.message || t("cashbook.saveFailed"));
			setConflict(err.code === "VERSION_CONFLICT");
		} finally {
			savingRef.current = false;
			setSaving(false);
		}
	};
	const day = days[0];
	return (
		<section className="min-w-0 space-y-4" aria-label={t("cashbook.day.title")}>
			<div className="flex flex-wrap items-center justify-end gap-4">
				{toolbar?.(
					canEdit &&
						onReconcile &&
						days[0] &&
						days[0].status !== "CLOSED" &&
						Number.isSafeInteger(ledgerVersion) ? (
						<Button
							size="sm"
							variant="outline"
							className="min-h-10 rounded-lg border!"
							disabled={loading || error}
							onClick={() => open("reconcile", days[0])}
						>
							{t("cashbook.reconciliation.title")}
						</Button>
					) : null,
					day && !error ? (
						<Button
							size="sm"
							variant="outline"
							leftIcon={History}
							className="min-h-10 rounded-lg border!"
							disabled={loading}
							onClick={() => open("history", day)}
						>
							{t("cashbook.day.history")}
						</Button>
					) : null,
				)}
			</div>
			{pendingSync && (
				<output className="block text-amber-700">
					{t("cashbook.reconciliation.pendingHint")}
				</output>
			)}
			{error ? (
				<p role="alert">{t("cashbook.loadFailed")}</p>
			) : (
				<div
					className="grid grid-cols-1 items-stretch gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4"
					aria-busy={loading}
				>
					{[
						[
							"openingBalance",
							"opening",
							Wallet,
							"bg-slate-500/10 text-slate-500",
						],
						[
							"totalCashIn",
							"cashIn",
							ArrowDownLeft,
							"bg-emerald-500/10 text-emerald-600",
						],
						[
							"totalCashOut",
							"cashOut",
							ArrowUpRight,
							"bg-rose-500/10 text-rose-600",
						],
						[
							"closingBalance",
							"closing",
							WalletCards,
							"bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]",
						],
					].map(([key, label, Icon, iconColor]) => (
						<StatCard
							key={key}
							loading={loading}
							density="compact"
							data={{
								title: t(`cashbook.day.${label}`),
								logo: Icon,
								iconColor,
								iconTone: "custom",
								value: day ? money(day[key]) : "—",
							}}
							className={
								key === "closingBalance"
									? "border-[rgb(var(--color-primary))]/30 bg-[rgb(var(--color-primary))]/5!"
									: ""
							}
						/>
					))}
				</div>
			)}
			<Modal
				isOpen={Boolean(dialog)}
				onClose={() => {
					if (!saving) setDialog(null);
				}}
				title={t(
					dialog?.action === "history"
						? "cashbook.day.history"
						: "cashbook.reconciliation.title",
				)}
				size="md"
				closeOnOverlayClick={!saving}
				closeOnEscape={!saving}
				bodyClassName="p-4 sm:p-6"
				footer={
					dialog?.action === "history" ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setDialog(null)}
						>
							{t("common.close", "Close")}
						</Button>
					) : (
						<div className="flex w-full items-center justify-end gap-3">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setDialog(null)}
								disabled={saving}
							>
								{t("common.cancel", "Cancel")}
							</Button>
							{conflict && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									disabled={loading || !Number.isSafeInteger(ledgerVersion)}
									onClick={() => {
										const refreshed = days.find(
											(day) => day.date === dialog.day.date,
										);
										if (refreshed) open("reconcile", refreshed);
									}}
								>
									{t("cashbook.refresh", "Refresh")}
								</Button>
							)}
							<Button
								type="submit"
								form={`${id}-reconcile-cash-form`}
								variant="primary"
								size="sm"
								loading={saving}
								disabled={
									saving ||
									conflict ||
									!validAmount ||
									(difference !== 0 && !reason.trim())
								}
							>
								{t("cashbook.day.confirm", "Confirm")}
							</Button>
						</div>
					)
				}
			>
				{dialog?.action === "history" ? (
					<div className="space-y-4 text-sm">
						<div className="flex items-center justify-between rounded-xl bg-[rgb(var(--color-bg-secondary))] p-3.5 border border-[rgb(var(--color-border-primary))]">
							<div>
								<p className="text-xs text-[rgb(var(--color-text-secondary))]">
									{t("cashbook.day.date")}
								</p>
								<p className="font-semibold">{dialog.day.date}</p>
							</div>
							<div className="text-right">
								<p className="text-xs text-[rgb(var(--color-text-secondary))]">
									{t("cashbook.day.closing")}
								</p>
								<p className="font-semibold text-emerald-600">
									{money(dialog.day.closingBalance)}
								</p>
							</div>
						</div>
						{!dialog.day.audit?.length && (
							<p className="text-center py-6 text-sm text-[rgb(var(--color-text-secondary))]">
								{t("cashbook.day.noHistory")}
							</p>
						)}
						<div className="max-h-72 space-y-3 overflow-y-auto pr-1">
							{(dialog.day.audit || []).map((item, index) => (
								<div
									key={item._id || `${item.at}-${index}`}
									className="rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-3 space-y-1.5"
								>
									<div className="flex items-center justify-between">
										<span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
											{t(`cashbook.day.audit.${item.action}`, item.action)}
										</span>
										<span className="text-xs text-[rgb(var(--color-text-secondary))]">
											{time(item.at)}
										</span>
									</div>
									{item.actor && (
										<p className="text-xs text-[rgb(var(--color-text-secondary))]">
											{t("cashbook.day.by")}:{" "}
											<span className="text-[rgb(var(--color-text-primary))]">
												{String(item.actor)}
											</span>
										</p>
									)}
									{item.reason && (
										<p className="text-xs text-[rgb(var(--color-text-secondary))] italic">
											"{item.reason}"
										</p>
									)}
									{item.expectedClosingBalance !== undefined && (
										<div className="grid grid-cols-3 gap-2 pt-1 border-t border-[rgb(var(--color-border-primary))]/50 text-xs">
											<div>
												<span className="text-[rgb(var(--color-text-secondary))]">
													{t("cashbook.day.expected")}:
												</span>
												<p className="font-medium">
													{money(item.expectedClosingBalance)}
												</p>
											</div>
											<div>
												<span className="text-[rgb(var(--color-text-secondary))]">
													{t("cashbook.day.actual")}:
												</span>
												<p className="font-medium">
													{money(item.actualClosingBalance)}
												</p>
											</div>
											<div>
												<span className="text-[rgb(var(--color-text-secondary))]">
													{t("cashbook.day.difference")}:
												</span>
												<p
													className={`font-medium ${item.cashDifference === 0 ? "text-emerald-600" : item.cashDifference < 0 ? "text-rose-600" : "text-amber-600"}`}
												>
													{money(item.cashDifference)}
												</p>
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				) : (
					<form
						id={`${id}-reconcile-cash-form`}
						onSubmit={submit}
						className="space-y-4"
					>
						<div className="rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]/60 p-3.5 space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-[rgb(var(--color-text-secondary))]">
									{t("cashbook.day.date")}:
								</span>
								<span className="font-semibold text-[rgb(var(--color-text-primary))]">
									{dialog?.day?.date}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-[rgb(var(--color-text-secondary))]">
									{t("cashbook.day.expected")}:
								</span>
								<span className="font-bold text-base text-[rgb(var(--color-primary))]">
									{money(dialog?.day?.closingBalance)}
								</span>
							</div>
							<p className="text-xs text-[rgb(var(--color-text-secondary))] pt-2 border-t border-[rgb(var(--color-border-primary))]/50 leading-relaxed">
								{t("cashbook.reconciliation.adjustmentHint")}
							</p>
						</div>

						<Input
							id={`${id}-reconcile-actual-amount`}
							label={t("cashbook.day.actual")}
							type="number"
							min="0"
							max="100000000"
							step="0.01"
							required
							value={amount}
							onChange={setAmount}
							disabled={saving}
							placeholder="0.00"
							leftIcon={() => (
								<span
									className="text-sm font-semibold text-[rgb(var(--color-text-secondary))]"
									aria-hidden
								>
									₹
								</span>
							)}
							size="md"
							autoFocus
						/>

						{amount !== "" && (
							<div
								className={`flex items-center gap-2.5 rounded-xl p-3 text-xs font-medium ${
									difference === 0
										? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40"
										: difference < 0
											? "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/40"
											: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40"
								}`}
							>
								{difference === 0 ? (
									<>
										<CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
										<span>
											{t(
												"cashbook.reconciliation.exactMatch",
												"Count matches expected cash (₹0.00 difference)",
											)}
										</span>
									</>
								) : (
									<>
										<AlertCircle className="h-4 w-4 shrink-0 text-current" />
										<span>
											{difference < 0
												? `${t("cashbook.day.difference")}: ${money(difference)} (${t("cashbook.reconciliation.shortageReasonRequired", "Shortage — Reason required")})`
												: `${t("cashbook.day.difference")}: +${money(difference)} (${t("cashbook.reconciliation.excessReasonRequired", "Excess — Reason required")})`}
										</span>
									</>
								)}
							</div>
						)}

						<Textarea
							id={`${id}-reconcile-reason`}
							label={t("cashbook.day.reason")}
							value={reason}
							onChange={setReason}
							required={difference !== 0}
							maxLength={2000}
							rows={3}
							disabled={saving}
							placeholder={
								difference !== 0
									? t(
											"cashbook.reconciliation.reasonPlaceholder",
											"Explain the difference...",
										)
									: t(
											"cashbook.day.optionalReason",
											"Optional notes or reason...",
										)
							}
							className="resize-none"
						/>

						{actionError && (
							<div
								className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
								role="alert"
							>
								<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
								<div className="flex-1 font-medium leading-relaxed">
									{actionError}
								</div>
							</div>
						)}
					</form>
				)}
			</Modal>
		</section>
	);
}
