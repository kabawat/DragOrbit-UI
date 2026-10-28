"use client";
import { Button, Input, Select, Toggle } from "@dragorbit/ui";
import { useEffect, useRef, useState } from "react";
import { Check, Clock, LoaderCircle, Info, Wallet, Zap, SlidersHorizontal } from "lucide-react";

export function CashbookSettingsView({
	t,
	storeName,
	settings,
	setSettings,
	loading,
	saving,
	error,
	onRetry,
	onSave,
}) {
	const [revision, setRevision] = useState(0);
	const [saveStatus, setSaveStatus] = useState("idle");
	const saveRef = useRef(onSave);
	useEffect(() => { saveRef.current = onSave; }, [onSave]);
	useEffect(() => {
		if (!revision) return;
		let active = true;
		const timer = setTimeout(async () => {
			setSaveStatus("saving");
			try {
				const success = await saveRef.current({ preventDefault() {} });
				if (active) setSaveStatus(success ? "saved" : "error");
			} catch {
				if (active) setSaveStatus("error");
			}
		}, 700);
		return () => { active = false; clearTimeout(timer); };
	}, [revision]);
	const update = (key, value) => {
		setSettings((current) => ({ ...current, [key]: value }));
		setSaveStatus("pending");
		setRevision((current) => current + 1);
	};
	const busy = saving || saveStatus === "saving";
	if (loading)
		return (
			<output className="block p-6 text-sm text-[rgb(var(--color-text-secondary))]">
				{t("cashbook.settings.loading")}
			</output>
		);
	if (!settings)
		return (
			<div className="space-y-3 p-6">
				<p role="alert" className="text-sm text-red-600">
					{error}
				</p>
				<Button onClick={onRetry}>{t("cashbook.retry")}</Button>
			</div>
		);
	return (
		<div className="w-full min-w-0 space-y-6 p-4 text-sm text-[rgb(var(--color-text-primary))] sm:p-6">
			<header className="flex items-center gap-4">
				<Wallet
					className="h-12 w-12 shrink-0 rounded-2xl bg-[rgb(var(--color-primary))]/10 p-3 text-[rgb(var(--color-primary))]"
					aria-hidden
				/>
				<div>
					<h2 className="text-xl font-semibold tracking-tight">
						{t("cashbook.settings.title")}
					</h2>
					<p className="mt-1 text-xs leading-5 text-[rgb(var(--color-text-secondary))]">
						{storeName && <span className="font-medium">{storeName} · </span>}{t("cashbook.settings.subtitle")}
					</p>
				</div>
			</header>
			<form onSubmit={(event) => event.preventDefault()} className="space-y-6" aria-busy={saving}>
				<div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
				<fieldset
					disabled={busy}
					className="min-w-0 overflow-hidden rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]"
				>
					<legend className="sr-only">{t("cashbook.settings.automation")}</legend>
					<div className="flex items-center gap-3 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]/50 px-5 py-4 sm:px-6"><Zap aria-hidden="true" className="h-4 w-4 text-[rgb(var(--color-primary))]" /><h3 className="font-semibold">{t("cashbook.settings.automation")}</h3></div>
					{["autoInvoiceCashIn", "autoExpenseCashOut", "autoSalaryCashOut"].map(
						(key) => (
							<Toggle
                                className="mx-5 flex-row-reverse justify-between gap-5 border-b border-[rgb(var(--color-border-primary))] py-5 last:border-0 sm:mx-6 [&>div]:flex-1 [&_label]:font-semibold [&_p]:mt-1 [&_p]:text-xs [&_p]:leading-5 [&_button[aria-pressed=false]]:bg-[rgb(var(--color-text-secondary))]/30"
								key={key}
								label={t(`cashbook.settings.${key}`)}
								helperText={t(`cashbook.settings.${key}Hint`)}
								checked={settings[key]}
								onChange={(value) => update(key, value)}
								disabled={busy}
							/>
						),
					)}
					<div className="m-5 flex items-start gap-2.5 rounded-xl bg-[rgb(var(--color-primary))]/5 p-3.5 sm:mx-6"><Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--color-primary))]" /><p className="text-xs leading-5 text-[rgb(var(--color-text-secondary))]">{t("cashbook.settings.automationNote")}</p></div>
				</fieldset>
				<fieldset
					disabled={busy}
					className="min-w-0 overflow-hidden rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]"
				>
					<legend className="sr-only">{t("cashbook.settings.entryRules")}</legend>
					<div className="flex items-center gap-3 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]/50 px-5 py-4 sm:px-6"><SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-[rgb(var(--color-primary))]" /><h3 className="font-semibold">{t("cashbook.settings.entryRules")}</h3></div>
					<div className="mx-5 grid items-start gap-5 border-b border-[rgb(var(--color-border-primary))] py-6 sm:mx-6 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
					<Input
						type="number"
						min="0.01"
						max="100000000"
						step="0.01"
						required
						label={t("cashbook.settings.maxAmount")}
						value={settings.maxAmount}
						onChange={(value) => update("maxAmount", value)}
					/>
					<div>
						<Select
							label={t("cashbook.settings.defaultEntryType")}
							disabled={busy}
							aria-label={t("cashbook.settings.defaultEntryType")}
							value={settings.defaultEntryType}
							onChange={(value) => update("defaultEntryType", value)}
							searchable={false}
							options={["CASH_IN", "CASH_OUT"].map((value) => ({
								value,
								label: t(`cashbook.types.${value}`),
							}))}
						/>
					</div>
					</div>
					{["requireDescription", "allowBackdatedEntries"].map((key) => (
						<Toggle
                                className="mx-5 flex-row-reverse justify-between gap-5 border-b border-[rgb(var(--color-border-primary))] py-5 last:border-0 sm:mx-6 [&>div]:flex-1 [&_label]:font-semibold [&_p]:mt-1 [&_p]:text-xs [&_p]:leading-5 [&_button[aria-pressed=false]]:bg-[rgb(var(--color-text-secondary))]/30"
							key={key}
							label={t(`cashbook.settings.${key}`)}
							helperText={t(`cashbook.settings.${key}Hint`)}
							checked={settings[key]}
							onChange={(value) => update(key, value)}
							disabled={busy}
						/>
					))}
				</fieldset>
				</div>
				{error && (
					<p role="alert" className="text-sm text-red-600">
						{error}
					</p>
				)}
				<div className="flex flex-wrap items-center justify-end gap-3 border-t border-[rgb(var(--color-border-primary))] pt-4">
					<output aria-live="polite" className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
						{busy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : saveStatus === "saved" ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Clock className="h-4 w-4" aria-hidden="true" />}
						{t(`cashbook.settings.${busy ? "autoSaving" : saveStatus === "saved" ? "autoSaved" : saveStatus === "error" ? "autoSaveFailed" : saveStatus === "pending" ? "autoSavePending" : "autoSaveEnabled"}`)}
					</output>
					{saveStatus === "error" && <Button type="button" onClick={() => { setSaveStatus("pending"); setRevision((current) => current + 1); }}>{t("cashbook.retry")}</Button>}
				</div>
			</form>
		</div>
	);
}
