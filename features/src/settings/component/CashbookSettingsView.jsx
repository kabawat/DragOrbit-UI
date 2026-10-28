"use client";
import { Button, Input, Select, Toggle } from "@dragorbit/ui";
import { Save, Wallet } from "lucide-react";

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
	const update = (key, value) =>
		setSettings((current) => ({ ...current, [key]: value }));
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
		<div className="mx-auto max-w-3xl space-y-6 p-4 text-sm text-[rgb(var(--color-text-primary))] sm:p-6 [&_*]:shadow-none!">
			<header className="flex items-start gap-3">
				<Wallet
					className="mt-1 h-5 w-5 shrink-0 text-[rgb(var(--color-primary))]"
					aria-hidden
				/>
				<div>
					<h2 className="text-base font-semibold">
						{t("cashbook.settings.title")}
					</h2>
					<p className="mt-1 text-xs leading-5 text-[rgb(var(--color-text-secondary))]">
						{storeName} · {t("cashbook.settings.subtitle")}
					</p>
				</div>
			</header>
			<form onSubmit={onSave} className="space-y-5" aria-busy={saving}>
				<fieldset
					disabled={saving}
					className="space-y-5 rounded-xl border border-[rgb(var(--color-border-primary))] p-4"
				>
					<legend className="px-1 text-sm font-semibold">
						{t("cashbook.settings.automation")}
					</legend>
					{["autoInvoiceCashIn", "autoExpenseCashOut", "autoSalaryCashOut"].map(
						(key) => (
							<Toggle
								key={key}
								label={t(`cashbook.settings.${key}`)}
								helperText={t(`cashbook.settings.${key}Hint`)}
								checked={settings[key]}
								onChange={(value) => update(key, value)}
								disabled={saving}
							/>
						),
					)}
					<p className="text-xs leading-5 text-[rgb(var(--color-text-secondary))]">
						{t("cashbook.settings.automationNote")}
					</p>
				</fieldset>
				<fieldset
					disabled={saving}
					className="space-y-5 rounded-xl border border-[rgb(var(--color-border-primary))] p-4"
				>
					<legend className="px-1 text-sm font-semibold">
						{t("cashbook.settings.entryRules")}
					</legend>
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
							disabled={saving}
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
					{["requireDescription", "allowBackdatedEntries"].map((key) => (
						<Toggle
							key={key}
							label={t(`cashbook.settings.${key}`)}
							helperText={t(`cashbook.settings.${key}Hint`)}
							checked={settings[key]}
							onChange={(value) => update(key, value)}
							disabled={saving}
						/>
					))}
				</fieldset>
				{error && (
					<p role="alert" className="text-sm text-red-600">
						{error}
					</p>
				)}
				<div className="flex justify-end">
					<Button
						type="submit"
						leftIcon={Save}
						loading={saving}
						disabled={saving}
					>
						{t("cashbook.settings.save")}
					</Button>
				</div>
			</form>
		</div>
	);
}
