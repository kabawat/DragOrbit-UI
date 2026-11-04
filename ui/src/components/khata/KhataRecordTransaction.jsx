"use client";
import { useId, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "../button/Button";
import Input from "../input/Input";
import Select from "../select/Select";

const PAYMENT_MODES = [
	["CASH", "cash"],
	["UPI", "upi"],
	["BANK_TRANSFER", "bankTransfer"],
];
const NOTE_PRESETS = [
	{ id: "creditSale", suffix: "CreditSale", directions: ["OUT"] },
	{ id: "paymentReceived", suffix: "PaymentReceived", directions: ["IN"] },
	{ id: "advance", suffix: "Advance", directions: ["IN", "OUT"] },
	{ id: "openingBalance", suffix: "OpeningBalance", directions: ["IN", "OUT"] },
	{ id: "settlement", suffix: "Settlement", directions: ["IN", "OUT"] },
	{ id: "adjustment", suffix: "Adjustment", directions: ["IN", "OUT"] },
];

/** Presentation shared by web and desktop; callers retain ledger/payment semantics. */
export function KhataRecordTransaction({
	t,
	customerId,
	disabled = false,
	loading = false,
	error = null,
	onYouGave,
	onYouGot,
	onClearError,
	autoFocusAmount = false,
	footer = null,
	hideHeader = false,
	variant = "card",
	className = "",
}) {
	const id = useId();
	const saving = useRef(false);
	const [amount, setAmount] = useState("");
	const [direction, setDirection] = useState("IN");
	const [paymentMode, setPaymentMode] = useState("CASH");
	const [notes, setNotes] = useState("");
	const [presetId, setPresetId] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const busy = loading || submitting;
	const isDisabled = disabled || !customerId || busy;
	const value = Number(amount);
	const canSubmit = Number.isFinite(value) && value > 0 && !isDisabled;
	const presets = NOTE_PRESETS.filter((preset) =>
		preset.directions.includes(direction),
	);
	const changeDirection = (next) => {
		setDirection(next);
		if (presetId) {
			setPresetId("");
			setNotes("");
		}
		onClearError?.();
	};
	const selectPreset = (next) => {
		const preset = presets.find((item) => item.id === next);
		setPresetId(preset?.id ?? "");
		if (preset) setNotes(t(`khata.noteDetail${preset.suffix}`));
		else if (presetId) setNotes("");
	};
	const submit = async (event) => {
		event.preventDefault();
		if (!canSubmit || saving.current) return;
		const record = direction === "IN" ? onYouGot : onYouGave;
		if (typeof record !== "function") return;
		saving.current = true;
		setSubmitting(true);
		onClearError?.();
		try {
			await record({ amount: value, paymentMode, notes });
			setAmount("");
			setNotes("");
			setPresetId("");
		} catch {
			// Keep the form intact; the caller exposes the API error through props.
		} finally {
			saving.current = false;
			setSubmitting(false);
		}
	};
	return (
		<div
			className={`${variant === "card" ? "rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] overflow-hidden" : ""} ${className}`}
		>
			{!hideHeader && (
				<div className="border-b border-[rgb(var(--color-border-primary))] px-5 py-4">
					<h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
						{t("khata.recordTransaction")}
					</h3>
					<p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
						{t("khata.recordTransactionHint")}
					</p>
				</div>
			)}
			<div className={variant === "card" ? "space-y-5 p-5" : "space-y-5"}>
				<form onSubmit={submit} className="space-y-5" aria-busy={busy}>
					<Input
						id={`${id}-amount`}
						label={t("khata.amount")}
						type="number"
						min="0.01"
						step="0.01"
						value={amount}
						onChange={setAmount}
						disabled={isDisabled}
						autoFocus={autoFocusAmount}
						placeholder="0.00"
						leftIcon={() => <span aria-hidden="true">₹</span>}
						className="h-auto py-3 text-2xl font-semibold tabular-nums"
						required
					/>
					<fieldset disabled={isDisabled}>
						<legend className="mb-2 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
							{t("khata.transactionType")}
						</legend>
						<div className="grid grid-cols-2 gap-2">
							{[
								["IN", "cashIn", ArrowDownLeft],
								["OUT", "cashOut", ArrowUpRight],
							].map(([type, label, Icon]) => (
								<label
									key={type}
									className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[rgb(var(--color-primary))] ${direction === type ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 text-[rgb(var(--color-primary))]" : "border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-secondary))]"}`}
								>
									<input
										className="sr-only"
										type="radio"
										name={`${id}-direction`}
										value={type}
										checked={direction === type}
										onChange={() => changeDirection(type)}
									/>
									<Icon className="h-4 w-4" aria-hidden />
									{t(`khata.${label}`)}
								</label>
							))}
						</div>
						<p className="mt-2 text-xs text-[rgb(var(--color-text-tertiary))]">
							{t(
								direction === "IN"
									? "khata.cashInLedgerHint"
									: "khata.cashOutLedgerHint",
							)}
						</p>
					</fieldset>
					<Select
						label={t("khata.paymentMode")}
						value={paymentMode}
						onChange={setPaymentMode}
						options={PAYMENT_MODES.map(([value, key]) => ({
							value,
							label: t(`khata.${key}`),
						}))}
						disabled={isDisabled}
						searchable={false}
					/>
					<Select
						label={t("khata.notes")}
						value={presetId}
						onChange={selectPreset}
						options={presets.map((preset) => ({
							value: preset.id,
							label: t(`khata.notePreset${preset.suffix}`),
						}))}
						placeholder={t("khata.notePresetPlaceholder")}
						disabled={isDisabled}
						clearable
					/>
					<div>
						<textarea
							id={`${id}-notes`}
							aria-label={t("khata.notesPlaceholder")}
							value={notes}
							onChange={(event) => {
								setNotes(event.target.value);
								setPresetId("");
							}}
							rows={3}
							disabled={isDisabled}
							placeholder={t("khata.notesPlaceholder")}
							className="w-full resize-y rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-3 py-2 text-sm text-[rgb(var(--color-text-primary))] focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))]"
						/>
					</div>
					{error && (
						<p role="alert" className="text-sm text-red-600">
							{error}
						</p>
					)}
					<Button type="submit" fullWidth loading={busy} disabled={!canSubmit}>
						{t("khata.recordShort")} ·
						{t(direction === "IN" ? "khata.cashIn" : "khata.cashOut")}
					</Button>
				</form>
				{footer && (
					<div className="border-t border-[rgb(var(--color-border-primary))] pt-4">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
